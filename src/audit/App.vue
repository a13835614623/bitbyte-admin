<template>
  <v-app>
    <v-app-bar color="primary" short app clippedLeft>
      <v-img src="@/assets/img/logo_white.png" max-width="150" />
      <v-chip color="red" class="title white--text ml-5">后台审核系统</v-chip>
      <v-spacer></v-spacer>
      <v-avatar size="40" left>
        <v-img :src="user.userPic" />
      </v-avatar>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn text color="white" v-on="on">
            {{ user.userName }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in [{ title: '注销' }]"
            :key="index"
            @click="logout"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer clipped app>
      <v-list-item>
        <v-list-item-content class="mt-5 mb-5 text-center">
          <span class="headline font-weight-bold primary--text">
            BITBYTE-AUDIT</span
          >
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list nav>
        <v-subheader>全部审核</v-subheader>
        <v-list-item link @click="handleListItemClick('/dashboard')">
          <v-list-item-icon>
            <v-icon color="cyan">mdi-calendar-check</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>待审核列表</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-subheader>与我相关</v-subheader>
        <v-list-item link @click="handleListItemClick('/my')">
          <v-list-item-icon>
            <v-icon color="red">mdi-account-details</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>我的审核</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <v-container fluid id="content" style="max-height:90vh;overflow:auto;">
        <router-view></router-view>
      </v-container>
    </v-content>
    <v-footer app>
      <!-- -->
    </v-footer>
    <loading :loading="loading" />
  </v-app>
</template>
<script>
import { mapMutations, mapState } from "vuex";
import { IS_LOGIN, LOGIN_URL } from "@/utils/util.js";
import loading from "@/components/loading";
export default {
  name: "App",
  data() {
    let newNav = (title, icon, link) => {
      return {
        title,
        icon,
        link
      };
    };
    let leftNavs = [
      newNav("待审核列表", "mdi-view-dashboard", "/dashboard"),
      newNav("我的审核", "mdi-account", "/my")
    ];
    return {
      leftNavs,
      right: null,
      loading: false
    };
  },
  components: {
    loading
  },
  created() {
    if (!IS_LOGIN()) {
      window.location.href = LOGIN_URL;
    } else {
      this.SAVE_USER();
    }
  },
  computed: {
    ...mapState(["user"])
  },
  methods: {
    ...mapMutations(["SAVE_USER", "CLEAR_USER"]),
    handleListItemClick(link) {
      if (link != this.$route.path) this.$router.replace(link);
    },
    logout() {
      this.loading = true;
      this.CLEAR_USER();
      window.location.href = LOGIN_URL;
    }
  }
};
</script>
<style lang="scss">
html {
  overflow: hidden !important;
}
</style>
