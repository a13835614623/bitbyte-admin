<template>
  <div>
    <!-- 搜索框 -->
    <Row :gutter="16">
      <!-- 标题 -->
      <Col span="4">
        <Input
          v-model="searchArticle.articleTitle"
          placeholder="文章标题"
          clearable
        />
      </Col>
      <!-- 分区 -->
      <Col span="4">
        <Select
          v-model="searchArticle.articlePart"
          clearable
          placeholder="文章分区"
        >
          <Option
            v-for="(label, key) in ARTICLE_PART_MAP"
            :value="key"
            :key="key"
            >{{ label }}</Option
          >
        </Select>
      </Col>
      <!-- 作者昵称 -->
      <Col span="4">
        <Input
          v-model="searchArticle.userName"
          placeholder="作者昵称"
          clearable
        />
      </Col>
      <!-- 发布日期 -->
      <Col span="8">
        <DatePicker
          type="datetimerange"
          split-panels
          style="width:80%;"
          v-model="articlePublishTimeRange"
          placeholder="选择发布日期范围"
          clearable
        />
      </Col>
      <Col span="4">
        <Button
          type="primary"
          @click="firstSearch"
          icon="ios-search"
          style="margin-right:5px;"
          >搜索</Button
        >
      </Col>
    </Row>
    <Divider>文章列表</Divider>
    <!-- 表格 -->
    <Table :columns="columns" :data="curArticleList">
      <template slot-scope="{ row }" slot="action">
        <Button
          type="primary"
          size="small"
          icon="ios-eye"
          style="margin-right: 5px"
          @click="view(row)"
          >查看</Button
        >
        <Button type="error" icon="ios-trash" size="small" @click="remove(row)"
          >删除</Button
        >
      </template>
    </Table>
    <!-- 分页 -->
    <Divider
      ><Page
        :current="curPage"
        :total="total"
        :page-size="pageSize"
        show-total
        @on-change="pageChange"
    /></Divider>
  </div>
</template>

<script>
import { ARTICLE_PROP_MAP, ARTICLE_PART_MAP } from "@/utils/util";
import {
  DO_ADD_ARTICLE,
  GET_ARTICLE_LIST,
  DO_UPDATE_ARTICLE,
  DO_DELETE_ARTICLE
} from "@/api/article";
export default {
  name: "user-manage",
  data() {
    let columns = Object.keys(ARTICLE_PROP_MAP).map(key => {
      return {
        title: ARTICLE_PROP_MAP[key],
        key
      };
    });
    columns.unshift({
      title: "#",
      key: "index",
      minWidth: 30,
      maxWidth: 100
    });
    columns.push({
      title: "操作",
      slot: "action",
      width: 200
    });
    return {
      searchArticle: {},
      articlePublishTimeRange: [],
      columns,
      curArticleList: [],
      total: 0,
      pageSize: 10,
      curPage: 1, //当前页码,
      ARTICLE_PROP_MAP,
      ARTICLE_PART_MAP
    };
  },
  created() {
    this.search();
  },
  computed: {
    start() {
      return this.pageSize * (this.curPage - 1);
    }
  },
  methods: {
    firstSearch() {
      this.curPage = 1;
      this.search();
    },
    // 搜索
    async search(start = this.start) {
      let { data, more } = await GET_ARTICLE_LIST({
        article: this.searchArticle,
        articlePublishStart: this.articlePublishTimeRange[0],
        articlePublishEnd: this.articlePublishTimeRange[1],
        start,
        count: this.pageSize
      });
      this.curArticleList = data.map((article, index) => {
        article.articlePublishTime = new Date(
          article.articlePublishTime
        ).format();
        article.articlePart = ARTICLE_PART_MAP[article.articlePart];
        article.index = this.start + index + 1;
        return article;
      });
      this.total = more;
    },
    pageChange(page) {
      this.curPage = page;
      this.search();
    },
    view(row) {
      //
    },
    async remove({ articleId }) {
      this.$Modal.confirm({
        title: "提示",
        content: "确定要删除此文章吗?",
        async onOk() {
          let { data, status, message } = await DO_DELETE_ARTICLE(articleId);
          this.$Message[status](message);
          this.search();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
