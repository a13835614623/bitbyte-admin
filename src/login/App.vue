<template>
  <v-app>
    <v-img src="@/assets/img/bg.jpg" style="height:100vh;">
      <router-view></router-view>
    </v-img>
  </v-app>
</template>

<script>
import { CLEAR_LOCAL_DATA } from "@/utils/util.js";
import { mapMutations } from "vuex";

export default {
  name: "App",
  created() {
    this.SAVE_USER();
  },
  methods: {
    ...mapMutations(["SAVE_USER"])
  }
};
</script>

<style lang="scss" scoped></style>
