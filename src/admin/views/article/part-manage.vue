<template>
  <div>
    <Tabs>
      <TabPane v-for="(tab, key) in tabs" :label="tab.label" :key="key">
        <Row :gutter="30">
          <Col
            span="6"
            v-for="(card, cardKey) in tab.card"
            :key="cardKey + card.label"
          >
            <Card style="text-align:center;padding:20px 0;">
              <Avatar
                :icon="card.icon"
                :style="{ backgroundColor: card.bgColor }"
              ></Avatar>
              <h1>{{ card.num }}</h1>
              <span class="help-text">{{ card.label }}</span>
            </Card>
          </Col>
        </Row>
      </TabPane>
    </Tabs>
    <Card :ref="access.ref">
      <p slot="title">{{ access.title }}</p>
      <div :ref="access.chart.ref" style="height:500px;"></div>
    </Card>
    <Card :ref="article.ref">
      <p slot="title">{{ article.title }}</p>
      <div :ref="article.chart.ref" style="height:500px;"></div>
    </Card>
    <Card :ref="read.ref">
      <p slot="title">{{ read.title }}</p>
      <div :ref="read.chart.ref" style="height:500px;"></div>
    </Card>
  </div>
</template>

<script>
import { ARTICLE_PART_MAP, GET_DATE_LIST } from "@/utils/util";
import { GET_ARTICLE_STATS, GET_ACCESS_STATS } from "@/api/stats.js";

export default {
  data() {
    let tabs = {};
    for (const key in ARTICLE_PART_MAP) {
      tabs[key] = {
        label: ARTICLE_PART_MAP[key],
        card: {
          accessNum: {
            label: "分区访问量",
            icon: "md-locate",
            bgColor: "orange",
            num: 0
          },
          articleNum: {
            label: "分区博客数量",
            icon: "ios-bookmark",
            bgColor: "green",
            num: 0
          },
          peopleNum: {
            label: "分区访问人数",
            icon: "md-people",
            bgColor: "skyblue",
            num: 0
          },
          readNum: {
            label: "分区阅读量",
            icon: "ios-flame",
            bgColor: "red",
            num: 0
          }
        }
      };
    }
    return {
      tabs,
      access: {
        ref: "access-card",
        title: "近日各分区博客访问量",
        chart: {
          title: "近日各分区访问量趋势图",
          ref: "access-chart"
        }
      },
      article: {
        ref: "article-card",
        title: "近日各分区博客投稿情况",
        chart: {
          title: "近日各分区博客投稿趋势图",
          ref: "article-chart"
        }
      },
      read: {
        ref: "article-num-card",
        title: "近日各分区阅读量",
        chart: {
          title: "近日各分区阅读量趋势图",
          ref: "article-num-chart"
        }
      }
    };
  },
  created() {
    this.getCardData();
  },
  mounted() {
    setTimeout(() => {
      this.drawAccessChart();
      this.drawArticleChart();
      this.drawArticleNumChart();
    }, 500);
  },
  methods: {
    async getCardData() {
      // {part:16,readNum:0,count:0}
      let { data } = await GET_ARTICLE_STATS({ isGroupByPart: true });
      data.map(({ part, readNum, count }) => {
        this.tabs[part].card.readNum.num = readNum;
        this.tabs[part].card.articleNum.num = count;
      });
      //{value:16,count:0}
      let accessData = await GET_ACCESS_STATS({ isGroupByAccessValue: true });
      accessData.data.map(({ value, count, peopleNum }) => {
        // eslint-disable-next-line no-prototype-builtins
        if (this.tabs.hasOwnProperty(value)) {
          this.tabs[value].card.accessNum.num = count;
          this.tabs[value].card.peopleNum.num = peopleNum;
        }
      });
    },
    // 近日各分区博客访问量
    async drawAccessChart() {
      let now = new Date();
      let { data } = await GET_ACCESS_STATS({
        isGroupByAccessTime: true,
        isGroupByAccessType: false,
        isGroupByAccessValue: true,
        accessTimeStart: now.before(14),
        accessTimeEnd: now,
        dateFormat: "%m-%d"
      });
      let dataSource = [];
      let dateList = GET_DATE_LIST(now, 15, "m-d");
      dataSource.push(["分区", ...dateList]);
      dataSource.push(
        ...Object.keys(ARTICLE_PART_MAP).map(part => {
          let result = [ARTICLE_PART_MAP[part]];
          result.push(
            ...dateList.map(date => {
              for (const item of data) {
                if (item.value == part && item.time == date) {
                  return item.count;
                }
              }
              return 0;
            })
          );
          return result;
        })
      );
      console.log(dataSource);
      let option = {
        title: {
          title: this.access.chart.title
        },
        // legend: {},
        tooltip: {
          trigger: "axis",
          showContent: false
        },
        dataset: {
          source: dataSource
        },
        xAxis: { type: "category" },
        yAxis: { gridIndex: 0 },
        grid: { top: "30%" },
        series: (() => {
          let res = [];
          for (let i = 0; i < dataSource[0].length - 1; i++) {
            res.push({ type: "line", smooth: true, seriesLayoutBy: "row" });
          }
          return res;
        })()
      };
      this.$echarts.drawChart(this.$refs[this.access.chart.ref], option);
    },
    // 近日各分区博客投稿量
    async drawArticleChart() {
      // 图例,分区
      let legendData = Object.values(ARTICLE_PART_MAP);
      let now = new Date();
      // 横坐标,时间
      let xData = GET_DATE_LIST(now, 15, "m-d");
      let startTime = new Date().setDate(now.getDate() - 14);
      let { data } = await GET_ARTICLE_STATS({
        isGroupByPart: true,
        isGroupByPublishTime: true,
        publishTimeStart: new Date(startTime),
        publishTimeEnd: now
      });
      let series = legendData.map(legend => {
        return {
          name: legend,
          type: "line",
          stack: "总量",
          areaStyle: {},
          data: data
            .filter(({ part }) => {
              return part == legend;
            })
            .map(a => a.count)
        };
      });
      let option = {
        title: {
          title: this.article.chart.title
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {
          data: legendData
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: xData
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series
      };
      this.$echarts.drawChart(this.$refs[this.article.chart.ref], option);
    },
    // 近日各分区博客阅读量
    async drawArticleNumChart() {
      // 图例,分区
      let legendData = Object.values(ARTICLE_PART_MAP);
      let now = new Date();
      // 横坐标,时间
      let xData = GET_DATE_LIST(now, 15, "m-d");
      let startTime = new Date().setDate(now.getDate() - 14);
      let { data } = await GET_ARTICLE_STATS({
        isGroupByPart: true,
        isGroupByPublishTime: true,
        publishTimeStart: new Date(startTime),
        publishTimeEnd: now
      });
      let series = legendData.map(legend => {
        return {
          name: legend,
          type: "line",
          stack: "总量",
          areaStyle: {},
          data: data
            .filter(({ part }) => {
              return part == legend;
            })
            .map(a => a.readNum)
        };
      });
      let option = {
        title: {
          title: this.read.chart.title
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {
          data: legendData
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: xData
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series
      };
      this.$echarts.drawChart(this.$refs[this.read.chart.ref], option);
    }
  }
};
</script>

<style lang="scss" scoped></style>
