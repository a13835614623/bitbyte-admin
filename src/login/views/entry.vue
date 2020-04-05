<template>
  <v-container style="margin-top:50px;">
    <v-row>
      <v-col cols="12" sm="12">
        <v-btn text class="ma-2" color="white" @click="backToLogin">
          <v-icon dark left>mdi-arrow-left</v-icon>
          返回登录
        </v-btn>
      </v-col>
    </v-row>
    <v-row align="center">
      <template v-for="item in entrys">
        <v-col cols="6" :key="item.title">
          <v-hover v-slot:default="{ hover }">
            <v-card
              max-height="400"
              max-width="400"
              height="400"
              :elevation="hover ? 12 : 2"
              :color="item.color"
              class="mx-auto white--text text-center"
            >
              <v-card-title>{{ item.title }}</v-card-title>
              <v-icon class="mt-10" color="white" size="200">{{
                item.icon
              }}</v-icon>
              <v-fade-transition>
                <v-overlay v-if="hover" absolute color="#036358">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        @click="handlerClickCard(item.url)"
                        color="red"
                        large
                        fab
                        v-on="on"
                      >
                        <v-icon> mdi-cursor-pointer </v-icon></v-btn
                      >
                    </template>
                    <span>{{ item.title }}</span>
                  </v-tooltip>
                </v-overlay>
              </v-fade-transition>
            </v-card>
          </v-hover>
        </v-col>
      </template>
    </v-row>
    <Toast :show.sync="msg.show" :text="msg.text" :color="msg.color" />
  </v-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import Toast from "@/components/toast";
import { ADMIN_URL, LOGIN_URL, AUDIT_URL } from "@/utils/util.js";
export default {
  name: "postLogin",
  data() {
    return {
      entrys: [
        {
          title: "后台管理",
          url: "/admin",
          icon: "mdi-monitor-dashboard",
          color: "#1F7087"
        },
        {
          title: "博客审核",
          url: "/audit",
          icon: "mdi-account-check",
          color: "#952175"
        }
      ],
      msg: {
        show: false,
        text: "",
        color: ""
      }
    };
  },
  components: {
    Toast
  },
  created() {
    if (!this.isLogin) {
      window.location = LOGIN_URL;
    }
  },
  computed: {
    ...mapState(["user"]),
    ...mapGetters(["isLogin"])
  },
  methods: {
    handlerClickCard(link) {
      if (link == "/admin" && this.user.userAuth.indexOf("ROLE_ADMIN") != -1) {
        window.location.href = ADMIN_URL;
      } else if (
        link == "/audit" &&
        this.user.userAuth.indexOf("ROLE_AUDITOR") != -1
      ) {
        window.location.href = AUDIT_URL;
      } else {
        this.showMsg("您没有权限访问此系统!", "error");
      }
    },
    showMsg(text, color) {
      this.msg.show = true;
      this.msg.text = text;
      this.msg.color = color;
    },
    backToLogin() {
      this.$router.replace("/");
    }
  }
};
</script>

<style lang="scss" scoped></style>
