<template>
  <div>
    <v-container>
      <div class="headline">
        <span>已审博客列表</span>
        <v-btn icon @click="flush">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </div>
    </v-container>
    <v-container>
      <v-row align="center">
        <v-col cols="3">
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="search.submitTimeRange"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                clearable
                v-model="search.submitTimeRange"
                label="选择投递日期"
                prepend-icon="mdi-calendar"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              range
              v-model="search.submitTimeRange"
              no-title
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false">取消</v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.menu.save(search.submitTimeRange)"
                >确定</v-btn
              >
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="3">
          <v-select
            clearable
            v-model="search.articlePart"
            :items="ARTICLE_PART_INFO"
            item-value="value"
            item-text="label"
            label="选择分区"
          ></v-select>
        </v-col>
        <v-col cols="3">
          <v-select
            v-model="search.auditState"
            clearable
            :items="AUDIT_STATE_INFO"
            item-text="label"
            item-value="value"
            label="审核状态"
          ></v-select>
        </v-col>
        <v-col cols="3">
          <v-btn @click="flush" color="primary">
            <v-icon>mdi-magnify</v-icon>
            搜索</v-btn
          >
        </v-col>
      </v-row>
      <v-row>
        <v-chip class="ma-2" color="primary" text-color="white">
          已审博客
          <v-avatar right color="cyan">
            {{ total }}
          </v-avatar>
        </v-chip>
      </v-row>
    </v-container>
    <audit-list
      @load="loadMore"
      :noMore="noMore"
      :loading="loading"
      :user-id="queryVo.audit.auditUser"
      @flush="flush"
      emptyText="暂无已审博客"
      :list="auditList"
    />
    <toast :show.sync="msg.show" :color="msg.color" :text="msg.text" />
  </div>
</template>

<script>
import auditList from "../components/audit-list";
import toast from "@/components/toast";
import {
  AUDIT_STATE_INFO,
  ARTICLE_PART_INFO,
  FORMAT_AUDIT
} from "@/utils/util.js";
import { GET_AUDIT_LIST } from "@/api/audit";
export default {
  name: "dashboard",
  components: {
    auditList,
    toast
  },
  data() {
    return {
      auditList: [],
      msg: {
        show: false,
        color: "info",
        text: ""
      },
      search: {
        articlePart: "",
        auditState: "",
        submitTimeRange: []
      },
      menu: false,
      start: 0,
      AUDIT_STATE_INFO: Object.values(AUDIT_STATE_INFO).filter(a => {
        return parseInt(a.value) != 26;
      }),
      ARTICLE_PART_INFO: Object.values(ARTICLE_PART_INFO),
      noMore: false,
      loading: false,
      total: 0
    };
  },
  computed: {
    queryVo() {
      return {
        audit: {
          auditState: this.search.auditState,
          auditUser: this.$store.state.user.userId
        },
        articlePart: this.search.articlePart,
        articleSubmitTimeStart: this.search.submitTimeRange[0],
        articleSubmitTimeEnd: this.search.submitTimeRange[1],
        start: this.start,
        count: 10
      };
    }
  },
  created() {
    this.getAuditList();
  },
  methods: {
    showMsg(text, color) {
      this.msg.show = true;
      this.msg.text = text;
      this.msg.color = color;
    },
    flush() {
      this.start = 0;
      this.auditList = [];
      this.loading = true;
      setTimeout(() => {
        this.getAuditList();
      }, 200);
    },
    async loadMore() {
      this.start += 10;
      this.getAuditList();
    },
    async getAuditList() {
      this.loading = true;
      try {
        let { data, status, more } = await GET_AUDIT_LIST(this.queryVo);
        if (data.length == 0) {
          this.noMore = true;
        } else {
          this.auditList.push(
            ...data.map(audit => {
              return FORMAT_AUDIT(audit);
            })
          );
        }
        this.total = more;
      } finally {
        this.loading = false;
      }
    },
    changeSearch() {
      this.getAuditList();
    }
  }
};
</script>

<style lang="scss" scoped></style>
