<template>
  <v-container class="lighten-5">
    <template v-if="list[0]">
      <v-row v-scroll:#content="onScroll">
        <template v-for="(item, index) in list">
          <v-col cols="6" style="width:40%;diplay:inline-block;" :key="index">
            <audit-card @click-card="handleClickCard(item)" :audit="item" />
          </v-col>
        </template>
      </v-row>
      <p v-if="loading" class="grey--text text--lighten-1 text-center">
        加载中...
      </p>
      <p v-else-if="noMore" class="text-center grey--text mt-4">
        <v-icon color="grey lighten-2" left>mdi-timer-sand-empty</v-icon>
        <span class="grey--text text--lighten-1">没有更多了</span>
      </p>
    </template>
    <v-row class="mt-12" justify="center" align="center" v-else>
      <v-col cols="3" class="text-center">
        <v-icon size="100" color="grey lighten-2">mdi-timer-sand-empty</v-icon>
        <p class="title grey--text text--lighten-1">
          {{ emptyText }}
        </p>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" hide-overlay fullscreen>
      <audit-view
        :audit="curAudit"
        @close="closeDialog"
        @pass="showPassDialog"
        @refuse="showRefuseDialog"
        @cancel="showCancelDialog"
      />
    </v-dialog>
    <!-- 通过确定框 -->
    <v-dialog v-model="passDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">提示</v-card-title>
        <v-card-text>确定要通过此博客吗？</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" text @click="pass">确定</v-btn>
          <v-btn color="grey darken-1" text @click="closePassDialog"
            >取消</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 撤销确认框 -->
    <v-dialog v-model="cancelDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">提示</v-card-title>
        <v-card-text
          >撤销后此博客的审核状态将恢复初始状态,确认继续吗?</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" text @click="cancel">确定</v-btn>
          <v-btn color="grey darken-1" text @click="closeCancelDialog"
            >取消</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 拒绝确定框 -->
    <v-dialog v-model="refuseDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">提示</v-card-title>
        <v-card-text
          ><v-text-field
            v-model="refuseReason"
            label="请输入拒绝原因"
            :rules="[value => !!value || '原因不能为空!']"
            required
          ></v-text-field
        ></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" text @click="refuse">确定</v-btn>
          <v-btn color="grey darken-1" text @click="closeRefuseDialog"
            >取消</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 通知 -->
    <toast :show.sync="msg.show" :color="msg.color" :text="msg.text" />
    <loading :loading="commitLoading" />
  </v-container>
</template>

<script>
import toast from "@/components/toast";
import loading from "@/components/loading";
import auditCard from "./audit-card";
import auditView from "./audit-view";
import { GET_ARTICLE } from "@/api/article.js";
import { FORMAT_ARTICLE } from "@/utils/util.js";
import {
  DO_AUDIT_PASS,
  DO_AUDIT_REFUSE,
  DO_AUDIT_CANCEL
} from "@/api/audit.js";

export default {
  props: {
    list: {
      type: Array,
      required: true
    },
    noMore: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    emptyText: {
      type: String,
      required: false,
      default: "暂无待审博客"
    },
    userId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      dialog: false,
      cancelDialog: false,
      passDialog: false,
      refuseDialog: false,
      refuseReason: "",
      curAudit: {},
      msg: {
        show: false,
        color: "info",
        text: ""
      },
      commitLoading: false,
      scroll: 0
    };
  },
  components: {
    auditCard,
    auditView,
    toast,
    loading
  },
  methods: {
    onScroll({ target: { scrollTop, clientHeight, scrollHeight } }) {
      let tmpHieght = scrollTop + clientHeight + 50;
      // console.log(tmpHieght, scrollHeight, scrollHeight + 20);
      if (
        scrollTop > this.scroll &&
        tmpHieght >= scrollHeight &&
        tmpHieght <= scrollHeight + 20
      ) {
        this.load();
      }
      this.scroll = scrollTop;
    },
    load() {
      this.$emit("load");
    },
    closeDialog() {
      this.dialog = false;
    },
    showDialog() {
      this.dialog = true;
    },
    showPassDialog() {
      this.passDialog = true;
    },
    closePassDialog() {
      this.passDialog = false;
    },
    showRefuseDialog() {
      this.refuseDialog = true;
    },
    closeRefuseDialog() {
      this.refuseDialog = false;
    },
    showCancelDialog() {
      this.cancelDialog = true;
    },
    closeCancelDialog() {
      this.cancelDialog = false;
    },
    showMsg(text, color) {
      this.msg.show = true;
      this.msg.text = text;
      this.msg.color = color;
    },
    async handleClickCard(audit) {
      this.showDialog();
      this.curAudit = audit;
      let { data } = await GET_ARTICLE(audit.auditArticle);
      this.curAudit.article = FORMAT_ARTICLE(data);
    },
    async errorHandler(func) {
      try {
        this.commitLoading = true;
        await func();
      } catch (error) {
        console.error(error);
      } finally {
        this.$emit("flush");
        this.commitLoading = false;
        this.dialog = false;
        this.closePassDialog();
        this.closeRefuseDialog();
        this.closeCancelDialog();
      }
    },
    async pass() {
      this.errorHandler(async () => {
        let { status, message } = await DO_AUDIT_PASS({
          auditId: this.curAudit.auditId,
          articleId: this.curAudit.auditArticle,
          userId: this.userId
        });
        this.showMsg(message, status);
      });
    },
    async refuse() {
      this.errorHandler(async () => {
        let { status, message } = await DO_AUDIT_REFUSE({
          auditId: this.curAudit.auditId,
          articleId: this.curAudit.auditArticle,
          reason: this.refuseReason,
          userId: this.userId
        });
        this.showMsg(message, status);
      });
    },
    async cancel() {
      this.errorHandler(async () => {
        let { status, message } = await DO_AUDIT_CANCEL({
          auditId: this.curAudit.auditId
        });
        this.showMsg(message, status);
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
