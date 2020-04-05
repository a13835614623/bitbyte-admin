import Vue from "vue";
import Vuex from "vuex";
import {
  CLEAR_LOCAL_DATA,
  SAVE_LOCAL_DATA,
  IS_LOGIN,
  GET_LOCAL_USER
} from "@/utils/util.js";
Vue.use(Vuex);
const EMPTY_USER = null;

export default new Vuex.Store({
  state: { user: {} },
  getters: {
    // 在线状态
    isLogin(state) {
      return !!(state.user && state.user.userId);
    }
  },
  mutations: {
    // 保存用户信息
    SAVE_USER(state, payload = { user: GET_LOCAL_USER() }) {
      if (!IS_LOGIN()) {
        SAVE_LOCAL_DATA(payload);
      }
      state.user = payload.user;
    },
    // 清除用户信息并删除localStorage
    CLEAR_USER(state) {
      state.user = EMPTY_USER;
      CLEAR_LOCAL_DATA();
    }
  },
  actions: {},
  modules: {}
});
