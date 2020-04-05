import axios from "./base";
let base = "/user/authority";
//根据用户id获取角色列表
let GET_USER_ROLE_LIST = async userId => {
  let { data } = await axios.post(base + "/role/get/" + userId);
  return data;
};
//根据用户id获取权限列表
let GET_USER_PERM_LIST = async userId => {
  let { data } = await axios.post(base + "/perm/get/" + userId + "?name=user");
  return data;
};
//根据角色id获取权限列表
let GET_ROLE_PERM_LIST = async roleId => {
  let { data } = await axios.post(base + "/perm/get/" + roleId + "?name=role");
  return data;
};
//为用户添加角色
let DO_ADD_ROLE_USER = async (userId, roleIdList) => {
  let { data } = await axios.post(
    base + "/role/add?userId=" + userId,
    roleIdList
  );
  return data;
};
//为角色添加权限
let DO_ADD_ROLE_PERM = async (roleId, permIdList) => {
  let { data } = await axios.post(
    base + "/perm/add?roleId=" + roleId,
    permIdList
  );
  return data;
};
//为用户删除角色
let DO_DELETE_ROLE_USER = async (userId, roleIdList) => {
  let { data } = await axios.post(
    base + "/role/delete?userId=" + userId,
    roleIdList
  );
  return data;
};
//为角色删除权限
let DO_DELETE_ROLE_PERM = async (roleId, permIdList) => {
  let { data } = await axios.post(
    base + "/perm/delete?roleId=" + roleId,
    permIdList
  );
  return data;
};
export {
  GET_USER_ROLE_LIST,
  GET_USER_PERM_LIST,
  GET_ROLE_PERM_LIST,
  DO_ADD_ROLE_USER,
  DO_ADD_ROLE_PERM,
  DO_DELETE_ROLE_USER,
  DO_DELETE_ROLE_PERM
};
