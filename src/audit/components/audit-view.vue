<template>
  <v-card>
    <v-toolbar
      dark
      color="primary"
      style="position:fixed;width:100%;z-index:99999;"
    >
      <v-toolbar-title class="ml-12">{{
        audit.article.articleTitle
      }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <template v-if="audit.auditState == 26">
          <v-btn dark text @click="$emit('pass')">
            <v-icon left>mdi-check</v-icon>
            <span>通过</span>
          </v-btn>
          <v-btn dark text @click="$emit('refuse')">
            <v-icon left>mdi-close</v-icon>
            <span>拒绝</span>
          </v-btn>
        </template>
        <template v-else>
          <!-- 审核状态 -->
          <v-btn text color="white">
            <v-icon left>{{ AUDIT_STATE_INFO[audit.auditState].icon }}</v-icon>
            <span>{{ AUDIT_STATE_INFO[audit.auditState].label }}</span>
          </v-btn>
          <v-btn text color="white" @click="$emit('cancel')">
            <v-icon left>mdi-cancel</v-icon>
            撤销
          </v-btn>
        </template>
      </v-toolbar-items>
      <v-toolbar-items>
        <v-btn icon dark @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-container style="padding-top:80px;">
      <v-row justify="start">
        <v-col cols="2">
          <v-avatar color="grey darken-3">
            <v-img class="elevation-6" :src="audit.article.userPic"></v-img>
          </v-avatar>
          <span class="ml-3">{{ audit.article.userName }}</span>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row justify="center">
        <v-col cols="12">
          <p v-html="audit.article.articleContent"></p>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row>
        <v-col cols="3">
          <v-icon>mdi-calendar</v-icon>
          {{ audit.createat }}
        </v-col>
        <v-col cols="3">
          <v-icon>mdi-star</v-icon>
          {{ audit.article.articlePart }}
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <span class="subtitle-1">标签:</span>
          <v-chip
            class="ma-2 white--text"
            color="success"
            small
            label
            v-for="(tag, index) in audit.article.articleTags"
            :key="index"
          >
            <v-icon left>mdi-tag</v-icon>
            {{ tag }}
          </v-chip>
        </v-col>
      </v-row>
      <v-row v-if="isRefuse">
        <v-col>
          <span class="subtitle-1">拒绝原因:</span>
          <v-chip class="ma-2 white--text" small color="red">
            {{ audit.auditReason }}
          </v-chip>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import { AUDIT_STATE_INFO } from "@/utils/util.js";
import { mapState } from "vuex";
export default {
  props: {
    audit: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      AUDIT_STATE_INFO
    };
  },
  computed: {
    ...mapState(["user"]),
    isRefuse() {
      return this.audit.auditState == 25;
    }
  },
  methods: {
    closeDialog() {
      this.$emit("close", false);
    }
  }
};
</script>

<style lang="scss" scoped></style>
