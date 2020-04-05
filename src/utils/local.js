// 本地存储数据的属性
const LOCAL_DATA_MAP = {
  user: "bitbyte.user",
  token: "bitbyte.token"
};
const EMPTY_USER = null;
const EMPTY_TOKEN = "";
// 获取本地用户数据
const GET_LOCAL_USER = () => {
  return JSON.parse(localStorage.getItem(LOCAL_DATA_MAP.user)) || EMPTY_USER;
};
// 获取本地token
const GET_LOCAL_TOKEN = () => {
  return localStorage.getItem(LOCAL_DATA_MAP.token) || EMPTY_TOKEN;
};
// 是否登录
const IS_LOGIN = () => {
  return GET_LOCAL_TOKEN() && GET_LOCAL_USER();
};
// 清除本地数据
const CLEAR_LOCAL_DATA = () => {
  Object.values(LOCAL_DATA_MAP).map(key => {
    localStorage.removeItem(key);
  });
};
// 保存数据
const SAVE_LOCAL_DATA = (data = { user: EMPTY_USER }) => {
  if (!data.user) return;
  localStorage.setItem(LOCAL_DATA_MAP.user, JSON.stringify(data.user));
};
export {
  LOCAL_DATA_MAP,
  CLEAR_LOCAL_DATA,
  IS_LOGIN,
  SAVE_LOCAL_DATA,
  GET_LOCAL_USER,
  GET_LOCAL_TOKEN
};
