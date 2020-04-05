import axios from "./base";
let base = "/article";
// 根据文章ID获取文章
let GET_ARTICLE = async articleId => {
  let { data } = await axios.post(base + "/get/" + articleId);
  return data;
};
//添加文章
let DO_ADD_ARTICLE = async article => {
  let { data } = await axios.post(base + "/add", article);
  return data;
};
// 更新文章
let DO_UPDATE_ARTICLE = async article => {
  let { data } = await axios.post(base + "/update", article);
  return data;
};
//删除文章
let DO_DELETE_ARTICLE = async articleId => {
  let { data } = await axios.post(base + "/delete/" + articleId);
  return data;
};
// 获取文章列表
let GET_ARTICLE_LIST = async queryVo => {
  let { data } = await axios.post(base + "/list", queryVo);
  return data;
};
export {
  GET_ARTICLE,
  DO_ADD_ARTICLE,
  GET_ARTICLE_LIST,
  DO_UPDATE_ARTICLE,
  DO_DELETE_ARTICLE
};
