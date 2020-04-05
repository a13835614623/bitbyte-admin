<template>
  <v-card class="mx-auto" hover @click="handleClick">
    <v-card-title>
      {{ audit.article.articleTitle }}
    </v-card-title>
    <v-card-subtitle>
      <v-row>
        <v-col cols="6">
          <span>分区:</span>
          <v-chip class="ma-2" color="primary" text-color="white">
            <v-icon left>mdi-star</v-icon>
            {{ audit.article.articlePart }}
          </v-chip></v-col
        >
        <v-col cols="6">
          <span>投递时间:</span>
          <v-chip class="ma-2" color="indigo" text-color="white">
            <v-avatar left>
              <v-icon>mdi-calendar</v-icon>
            </v-avatar>
            {{ audit.createat }}
          </v-chip></v-col
        >
      </v-row>
    </v-card-subtitle>
    <v-card-text>
      <span>标签:</span>
      <v-chip
        class="ma-2"
        color="success"
        small
        v-for="(tag, index) in audit.article.articleTags"
        :key="index"
      >
        <v-icon left>mdi-tag</v-icon>
        {{ tag }}
      </v-chip>
    </v-card-text>
    <v-card-text v-if="isRefuse">
      <span>拒绝原因:</span>
      <v-chip class="ma-2 white--text" small color="red">
        {{ audit.auditReason }}
      </v-chip>
    </v-card-text>
    <v-card-actions>
      <v-list-item class="grow">
        <v-list-item-avatar color="grey darken-3">
          <v-img class="elevation-6" :src="audit.article.userPic"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ audit.article.userName }}</v-list-item-title>
        </v-list-item-content>
        <v-row align="center" justify="end">
          <v-btn text :color="AUDIT_STATE_INFO[audit.auditState].color"
            ><v-icon class="mr-2">{{
              AUDIT_STATE_INFO[audit.auditState].icon
            }}</v-icon
            >{{ AUDIT_STATE_INFO[audit.auditState].label }}</v-btn
          >
          <!-- <span class="subheading mr-2">{{ audit.auditState }}</span> -->
        </v-row>
      </v-list-item>
    </v-card-actions>
  </v-card>
</template>

<script>
import { AUDIT_STATE_INFO } from "@/utils/util.js";
export default {
  props: {
    audit: {
      type: Object
    }
  },
  data() {
    return {
      AUDIT_STATE_INFO
    };
  },
  computed: {
    isRefuse() {
      return this.audit.auditState == 25;
    }
  },
  methods: {
    handleClick() {
      this.$emit("click-card", this.audit);
    }
  }
};
</script>

<style lang="scss" scoped></style>
