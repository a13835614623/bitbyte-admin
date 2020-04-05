import axios from "./base";
import {
  GET_USER_ROLE_LIST,
  GET_USER_PERM_LIST,
  GET_ROLE_PERM_LIST,
  DO_ADD_ROLE_USER,
  DO_ADD_ROLE_PERM,
  DO_DELETE_ROLE_USER,
  DO_DELETE_ROLE_PERM
} from "./authority";
let base = "/user/perm";
//添加权限
let DO_ADD_PERM = async ({ permDesc, permStr }) => {
  let { data } = await axios.post(base + "/add", { permDesc, permStr });
  return data;
};
// 更新权限
let DO_UPDATE_PERM = async ({ permId, permDesc, permStr }) => {
  let { data } = await axios.post(base + "/update", {
    permId,
    permDesc,
    permStr
  });
  return data;
};
//删除权限
let DO_DELETE_PERM = async permId => {
  let { data } = await axios.post(base + "/delete/" + permId);
  return data;
};
// 获取权限列表
let GET_PERM_LIST = async queryVo => {
  let { data } = await axios.post(base + "/list", queryVo);
  return data;
};
export {
  DO_ADD_PERM,
  GET_PERM_LIST,
  DO_UPDATE_PERM,
  DO_DELETE_PERM,
  GET_USER_ROLE_LIST,
  GET_USER_PERM_LIST,
  GET_ROLE_PERM_LIST,
  DO_ADD_ROLE_USER,
  DO_ADD_ROLE_PERM,
  DO_DELETE_ROLE_USER,
  DO_DELETE_ROLE_PERM
};
