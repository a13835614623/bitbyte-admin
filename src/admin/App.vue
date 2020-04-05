<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import { IS_LOGIN, LOGIN_URL } from "@/utils/util.js";
import { mapMutations } from "vuex";
export default {
  created() {
    if (!IS_LOGIN()) {
      window.location.href = LOGIN_URL;
    } else {
      this.SAVE_USER();
    }
  },
  methods: {
    ...mapMutations(["SAVE_USER"])
  }
};
</script>
<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
