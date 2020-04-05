<template>
  <div ref="dashboard" class="dashboard">
    <Row :gutter="20">
      <Col v-for="(card, key) in cardData" span="8" :key="key">
        <Card style="margin:0;">
          <p slot="title">
            <Icon :color="card.color" :type="card.icon" size="20"></Icon>
            {{ card.label }}
          </p>
          <p slot="extra">
            <Tag :color="card.color">{{ card.tag }}</Tag>
          </p>
          <h1>{{ card.num }}</h1>
          <Divider></Divider>
          总{{ card.label }}
        </Card>
      </Col>
    </Row>
    <Row :gutter="20">
      <Col v-for="(item, key) in linkData" span="4" :key="key">
        <Card @click.native="handlerClickCard(item.to)">
          <div style="text-align:center;cursor:pointer;">
            <Icon :type="item.icon" size="35" :color="item.color"></Icon>
            <p style="margin-top:10px;">
              {{ item.label }}
            </p>
          </div>
        </Card>
      </Col>
    </Row>
    <!-- 访问量图表 -->
    <Card :ref="access.ref">
      <Row type="flex" justify="space-between" slot="title">
        <Col span="4">
          <Icon color="green" type="ios-stats" size="20"></Icon>
          访问量
        </Col>
        <Col span="8">
          <span style="display:inline-block; padding-right:8px;">选择日期</span>
          <DatePicker
            type="daterange"
            @on-change="accessTimeChange"
            split-panels
            style="width:300px;"
            v-model="access.timeRange"
            clearable
        /></Col>
      </Row>
      <Row>
        <Col span="24">
          <div :ref="access.lineChart.ref" style="height:500px;"></div>
        </Col>
      </Row>
    </Card>
    <!-- 各分区博客数量占比图 -->
    <Card :ref="part.ref">
      <Row type="flex" justify="space-between" slot="title">
        <Col span="4">
          <Icon color="green" type="ios-bookmark" size="20"></Icon>
          博客数量
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <div :ref="part.circleChart.ref" style="height:500px;"></div>
        </Col>
      </Row>
    </Card>
  </div>
</template>

<script>
import {
  ACCESS_TYPE_MAP,
  ARTICLE_PART_MAP,
  GET_DATE_LIST
} from "@/utils/util.js";
import {
  GET_ARTICLE_STATS,
  GET_USER_STATS,
  GET_ACCESS_STATS
} from "@/api/stats.js";
export default {
  name: "dashboard",
  data() {
    return {
      cardData: {
        accessNum: {
          color: "green",
          tag: "日",
          icon: "ios-eye",
          label: "访问量",
          num: 0
        },
        peopleNum: {
          color: "red",
          icon: "md-people",
          tag: "月",
          label: "用户数",
          num: 0
        },
        articleNum: {
          color: "blue",
          icon: "ios-bookmark",
          tag: "年",
          label: "博客数",
          num: 0
        }
      },
      linkData: [
        {
          color: "magenta",
          tag: "日",
          icon: "md-people",
          to: "/user/user-manage",
          label: "用户"
        },
        {
          color: "cyan",
          tag: "日",
          icon: "ios-stats",
          to: "/stats",
          label: "数据"
        },
        {
          color: "green",
          tag: "日",
          icon: "ios-bookmark",
          to: "/article/article-manage",
          label: "文章"
        },
        {
          color: "orange",
          tag: "日",
          icon: "md-chatboxes",
          to: "/action/article-toplist",
          label: "互动"
        },
        {
          color: "purple",
          tag: "日",
          icon: "md-clipboard",
          to: "/article/part-manage",
          label: "分区"
        },
        {
          color: "red",
          tag: "日",
          icon: "md-checkbox-outline",
          label: "审核"
        }
      ],
      // 访问量
      access: {
        ref: "access-card",
        timeRange: [],
        lineChart: {
          ref: "access-line-chart",
          title: "近日网站访问量变化趋势图"
        }
      },
      // 分区
      part: {
        ref: "part-card",
        circleChart: {
          ref: "part-circle-chart",
          title: "各分区博客数量占比图"
        }
      }
    };
  },
  created() {
    let start = new Date();
    this.access.timeRange[0] = start.before(14);
    this.access.timeRange[1] = start;
    this.getCardData();
  },
  mounted() {
    setTimeout(() => {
      this.drawAccessLineChart();
      this.drawPartCircleChart();
    }, 500);
  },
  methods: {
    async getCardData() {
      let articleStats = await GET_ARTICLE_STATS({ isGroupByPart: false });
      this.cardData.articleNum.num = articleStats.data[0].count;
      let userStats = await GET_USER_STATS({ isGroupBySex: false });
      this.cardData.peopleNum.num = userStats.data[0].count;
      let accessStats = await GET_ACCESS_STATS({ isGroupByAccessType: true });
      accessStats.data.map(({ type, count }) => {
        if (ACCESS_TYPE_MAP[type] == "首页") {
          this.cardData.accessNum.num = count;
        }
      });
    },
    // 绘制首页访问量柱状图
    async drawAccessLineChart() {
      let xData = [],
        _1day = 24 * 60 * 60 * 1000,
        yData = [],
        start = this.access.timeRange[0],
        end = this.access.timeRange[1],
        dayNum = (end.getTime() - start.getTime()) / _1day;

      xData = GET_DATE_LIST(end, dayNum, "m-d");
      let { data } = await GET_ACCESS_STATS({
        isGroupByAccessTime: true,
        isGroupByAccessType: false,
        isGroupByAccessValue: false,
        dateFormat: "%m-%d"
      });
      yData = xData.map(t => {
        for (const item of data) {
          if (item.time == t) {
            return item.count;
          }
        }
        return 0;
      });
      let options = {
        title: {
          text: this.access.lineChart.title
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: [
          {
            type: "category",
            data: xData,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "首页",
            type: "bar",
            barWidth: "60%",
            data: yData,
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  { offset: 0, color: "cyan" },
                  { offset: 1, color: "#00AE5B" }
                ])
              }
            }
          }
        ]
      };
      this.$echarts.drawChart(this.$refs[this.access.lineChart.ref], options);
    },
    // 绘制分区博客占比图
    async drawPartCircleChart() {
      let keys = Object.keys(ARTICLE_PART_MAP);
      let { data } = await GET_ARTICLE_STATS({ isGroupByPart: true });
      data = data.map(({ part, count }) => {
        return {
          name: ARTICLE_PART_MAP[part],
          value: count
        };
      });
      let legendData = keys.map(key => {
        return ARTICLE_PART_MAP[key];
      });
      let option = {
        title: {
          text: this.part.circleChart.title,
          subtext: "",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          left: "center",
          top: "bottom",
          data: legendData
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              type: ["pie", "funnel"]
            },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: "半径模式",
            type: "pie",
            radius: [20, 110],
            center: ["25%", "50%"],
            roseType: "radius",
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true
              }
            },
            data
          },
          {
            name: "面积模式",
            type: "pie",
            radius: [30, 110],
            center: ["75%", "50%"],
            roseType: "area",
            data
          }
        ]
      };
      this.$echarts.drawChart(this.$refs[this.part.circleChart.ref], option);
    },
    accessTimeChange() {
      this.drawAccessLineChart();
    },
    handlerClickCard(to) {
      this.$emit("update-menu", to);
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 0;
  width: 100%;
}
</style>
