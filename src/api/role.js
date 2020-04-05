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
let base = "/user/role";
// 添加角色
let DO_ADD_ROLE = async ({ roleDesc, roleStr }) => {
  let { data } = await axios.post(base + "/add", { roleDesc, roleStr });
  return data;
};
let DO_UPDATE_ROLE = async ({ roleId, roleDesc, roleStr }) => {
  let { data } = await axios.post(base + "/update", {
    roleId,
    roleDesc,
    roleStr
  });
  return data;
};
let DO_DELETE_ROLE = async roleId => {
  let { data } = await axios.post(base + "/delete/" + roleId);
  return data;
};
// 获取角色列表
let GET_ROLE_LIST = async queryVo => {
  let { data } = await axios.post(base + "/list", queryVo);
  return data;
};
export {
  DO_ADD_ROLE,
  GET_ROLE_LIST,
  DO_UPDATE_ROLE,
  DO_DELETE_ROLE,
  GET_USER_ROLE_LIST,
  GET_USER_PERM_LIST,
  GET_ROLE_PERM_LIST,
  DO_ADD_ROLE_USER,
  DO_ADD_ROLE_PERM,
  DO_DELETE_ROLE_USER,
  DO_DELETE_ROLE_PERM
};
