import axios from "axios";
import { LOCAL_DATA_MAP, LOGIN_URL,BASE_URL } from "@/utils/util";
axios.defaults.baseURL = BASE_URL;
axios.defaults.timeout = 10000;
axios.$loginURL = LOGIN_URL;
axios.$data = LOCAL_DATA_MAP;
// 请求拦截器
axios.interceptors.request.use(
  config => {
    // 获取token
    const AUTH_TOKEN = localStorage.getItem(axios.$data.token);
    if (AUTH_TOKEN) {
      config.headers.common["Authorization"] = AUTH_TOKEN;
    }
    return config;
  },
  error => {
    console.log(error);
  }
);
axios.interceptors.response.use(
  res => {
    if (!res) return res;
    let authorization = res.headers.Authorization || res.headers.authorization;
    if (authorization) {
      localStorage.setItem(LOCAL_DATA_MAP.token, authorization);
    }
    return res;
  },
  error => {
    if (error.response) {
      let res = error.response;
      if (res.status == 401) {
        window.location = LOGIN_URL;
      }
    }
    console.error(error);
  }
);
export default axios;
