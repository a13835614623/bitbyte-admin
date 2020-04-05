<template>
  <div>
    <Card style="margin:0;">
      <h2 style="margin-bottom:12px;">博客排行榜</h2>
      <Tabs type="card" @on-click="handlerTabClick" v-model="activeTabName">
        <TabPane
          v-for="(tab, key) in tabs"
          :label="tab.label"
          :name="key"
          :icon="tab.icon"
          :key="key"
        >
        </TabPane>
      </Tabs>
      <Row type="flex" justify="space-between">
        <Col>
          <span>选择分区：</span>
          <RadioGroup v-model="activePart" @on-change="handlePartChange">
            <Radio label="">全部分区</Radio>
            <Radio
              v-for="(part, key) in ARTICLE_PART_MAP"
              :key="key"
              :label="key"
            >
              {{ part }}
            </Radio>
          </RadioGroup>
        </Col>
        <Col>
          <Select
            @on-change="handleSelectChange"
            v-model="activeTimeRange"
            style="width:200px"
          >
            <Option
              v-for="(item, key) in timeRangeList"
              :value="item.timeRange"
              :key="key"
              >{{ item.label }}</Option
            >
          </Select>
        </Col>
      </Row>
      <Alert style="margin-top:12px;" show-icon>
        此排行榜为&nbsp;{{ timeRangeQuery[0] }}&nbsp;到&nbsp;{{
          timeRangeQuery[1]
        }}&nbsp;投稿的博客排行榜
      </Alert>
      <div class="top-list">
        <!-- 博客排行榜 -->
        <div v-if="actionArticleMap[activeTabName][0]">
          <div
            v-for="(item, index) in actionArticleMap[activeTabName]"
            :key="item.id"
          >
            <Row type="flex" justify="space-between" style="margin:24px 0;">
              <Col span="20">
                <Avatar
                  size="50"
                  shape="square"
                  style="background-color:skyblue;"
                  ><h1>{{ index + 1 }}</h1></Avatar
                >
                <div
                  style="display:inline-block;vertical-align:bottom;margin-left:12px;"
                >
                  <!-- 标题 -->
                  <h3 style="font-weight: bold;">
                    {{ item.articleTitle }}
                    <Tag color="green">{{ item.articlePart }}</Tag>
                  </h3>
                  <!-- 作者头像 -->
                  <Avatar :src="item.userPic" size="small"></Avatar>
                  <!-- 作者昵称 -->
                  <h4 style="display:inline;padding-left:5px;">
                    {{ item.userName }}
                  </h4>
                  <!-- 阅读量 -->
                  <h4 style="display:inline-block;width:50px;padding-left:5px;">
                    <Icon color="gray" type="md-book" />
                    {{ item.articleRead }}
                  </h4>
                  <!-- 发布日期 -->
                  <h4 style="display:inline;padding-left:5px;">
                    <Icon color="gray" type="md-calendar" />
                    {{ item.articlePublishTime }}
                  </h4>
                </div>
              </Col>
              <Col
                span="4"
                v-if="activeTabName == 'comment'"
                style="text-align:center;"
              >
                <h2>{{ item.articleCommentNum }}</h2>
                <span class="help-text">评论数</span>
              </Col>
              <Col
                span="4"
                v-if="activeTabName == 'like'"
                style="text-align:center;"
              >
                <h2>{{ item.articleLikeNum }}</h2>
                <span class="help-text">点赞数</span>
              </Col>
              <Col
                span="4"
                v-if="activeTabName == 'read'"
                style="text-align:center;"
              >
                <h2>{{ item.articleRead }}</h2>
                <span class="help-text">阅读量</span>
              </Col>
            </Row>
            <Divider></Divider>
          </div>
        </div>
        <div style="height:500px;padding:200px 0;" v-else>
          <h1 class="help-color" style="text-align:center;">排行榜暂无数据</h1>
        </div>
        <Spin fix size="large" v-if="loading"></Spin>
      </div>
    </Card>
  </div>
</template>

<script>
import {
  GET_READ_TOP_LIST,
  GET_LIKE_TOP_LIST,
  GET_COMMENT_TOP_LIST
} from "@/api/stats.js";
import { ARTICLE_PART_MAP } from "@/utils/util.js";
let NOW = new Date();
export default {
  name: "article-toplist",
  data() {
    let newTab = (label, icon) => {
      return {
        label,
        icon
      };
    };
    let tabs = {
      comment: newTab("评论榜", "ios-chatbubbles"),
      like: newTab("点赞榜", "md-thumbs-up"),
      read: newTab("阅读榜", "ios-book")
    };
    return {
      tabs,
      activeTabName: "comment",
      activeTimeRange: 3,
      activePart: "",
      timeRangeList: [
        {
          label: "三日排行",
          timeRange: 3
        },
        {
          label: "周排行",
          timeRange: 7
        },
        {
          label: "日排行",
          timeRange: 1
        }
      ],
      actionArticleMap: {
        comment: [],
        like: [],
        read: []
      },
      loading: false,
      ARTICLE_PART_MAP
    };
  },
  computed: {
    timeRangeQuery() {
      let format = "y年m月d日 h:m:s";
      return [
        NOW.before(this.activeTimeRange).format(format),
        NOW.format(format)
      ];
    }
  },
  async created() {
    this.getActionTopList(this.activeTabName);
  },
  methods: {
    async getActionTopList(action = this.activeTabName) {
      let map = {
        like: GET_LIKE_TOP_LIST,
        comment: GET_COMMENT_TOP_LIST,
        read: GET_READ_TOP_LIST
      };
      this.loading = true;
      try {
        let now = new Date();
        let article =
          this.activePart != ""
            ? {
                articlePart: this.activePart
              }
            : {};
        let { data } = await map[action]({
          publishTimeStart: now.before(this.activeTimeRange),
          publishTimeEnd: now,
          article,
          start: 0,
          count: 100
        });
        this.actionArticleMap[action] = data.map(d => {
          d.userPic = this.$USER_PIC_PREFIX + d.userPic;
          d.articlePart = ARTICLE_PART_MAP[d.articlePart];
          d.articlePublishTime = new Date(d.articlePublishTime).format("m.d");
          return d;
        });
      } finally {
        this.loading = false;
      }
    },
    async handlerTabClick(name) {
      this.getActionTopList(name);
    },
    handleSelectChange(value) {
      this.getActionTopList();
    },
    handlePartChange() {
      this.getActionTopList();
    }
  }
};
</script>

<style lang="scss" scoped>
.top-list {
  min-height: 500px;
}
</style>
