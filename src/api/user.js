import axios from "./base";
let base = "/user";
import { FORMAT_USER } from "@/utils/util";
// 添加用户
let DO_USER_LOGIN = async ({ username, password }) => {
  let { data } = await axios.post(
    "/login?username=" + username + "&password=" + password
  );
  if (data.data && data.status == "success") {
    data.data = FORMAT_USER(data.data);
    localStorage.setItem(axios.$data.user, JSON.stringify(data.data));
  }
  return data;
};
// 添加用户
let DO_ADD_USER = async user => {
  let { data } = await axios.post(base + "/register", user);
  return data;
};
// 更新用户
let DO_UPDATE_USER = async user => {
  user.userPic = null;
  let { data } = await axios.post(base + "/update", user);
  return data;
};
// 删除用户
let DO_DELETE_USER = async userId => {
  let { data } = await axios.post(base + "/delete?userId=" + userId);
  return data;
};
// 获取用户列表
let GET_USER_LIST = async queryVo => {
  let { data } = await axios.post(base + "/list", queryVo);
  return data;
};
export {
  DO_USER_LOGIN,
  DO_ADD_USER,
  GET_USER_LIST,
  DO_UPDATE_USER,
  DO_DELETE_USER
};
