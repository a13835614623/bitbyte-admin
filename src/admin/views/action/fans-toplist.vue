<template>
  <div>
    <Card style="margin:0;">
      <Row type="flex" justify="space-between">
        <Col>
          <h2>粉丝排行榜</h2>
        </Col>
      </Row>
      <div class="top-list">
        <!-- 粉丝排行榜 -->
        <template v-if="fansList[0]">
          <div v-for="(item, index) in fansList" :key="index">
            <Row type="flex" justify="space-between" style="margin:24px 0;">
              <Col span="1">
                <Avatar
                  size="large"
                  shape="square"
                  style="background-color:skyblue;"
                  ><h1>{{ index + 1 }}</h1></Avatar
                >
              </Col>
              <Col span="4"
                ><Avatar :src="item.userPic" size="large"></Avatar>
                <h3 style="display:inline;padding-left:5px;">
                  {{ item.userName }}
                </h3></Col
              >
              <Col span="15"></Col>
              <Col span="4" style="text-align:center;">
                <h2>{{ item.fansNum }}</h2>
                <span class="help-text">粉丝数</span>
              </Col>
            </Row>
            <Divider></Divider>
          </div>
        </template>
        <div style="height:500px;padding:200px 0;" v-else>
          <h1 class="help-color" style="text-align:center;">排行榜暂无数据</h1>
        </div>
        <Spin fix size="large" v-if="loading"></Spin>
      </div>
    </Card>
  </div>
</template>

<script>
import { GET_FANS_TOP_LIST } from "@/api/stats.js";
import { ARTICLE_PART_MAP } from "@/utils/util.js";
let NOW = new Date();
export default {
  name: "article-toplist",
  data() {
    return {
      fansList: [],
      loading: false,
      ARTICLE_PART_MAP
    };
  },
  async created() {
    this.getFansTopList();
  },
  methods: {
    async getFansTopList() {
      this.loading = true;
      try {
        let fansList = await GET_FANS_TOP_LIST({
          start: 0,
          count: 100
        });
        this.fansList = fansList.data.map(fan => {
          fan.userPic = this.$USER_PIC_PREFIX + fan.userPic;
          return fan;
        });
      } finally {
        this.loading = false;
      }
    },
    handleSelectChange(value) {}
  }
};
</script>

<style lang="scss" scoped>
.top-list {
  min-height: 500px;
}
</style>
