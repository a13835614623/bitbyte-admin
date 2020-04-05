import axios from "./base";
let base = "/stats";
let GET_ARTICLE_STATS = async queryVo => {
  let { data } = await axios.post(base + "/article/get", queryVo);
  return data;
};
let GET_USER_STATS = async queryVo => {
  let { data } = await axios.post(base + "/user/get", queryVo);
  return data;
};
let GET_ACCESS_STATS = async queryVo => {
  let { data } = await axios.post(base + "/access/get", queryVo);
  return data;
};

// 获取博客博客排行榜
let GET_ACTION_TOP_LIST = async queryVo => {
  let { data } = await axios.post(base + "/toplist/article", queryVo);
  return data;
};

// 获取粉丝排行榜
let GET_FANS_TOP_LIST = async queryVo => {
  let { data } = await axios.post(base + "/toplist/fans", queryVo);
  return data;
};
// 获取阅读量排行榜
let GET_READ_TOP_LIST = async queryVo => {
  let { data } = await axios.post(base + "/toplist/read", queryVo);
  return data;
};
// 获取点赞量排行榜
let GET_LIKE_TOP_LIST = async queryVo => {
  let { data } = await axios.post(base + "/toplist/like", queryVo);
  return data;
};

// 获取评论排行榜
let GET_COMMENT_TOP_LIST = async queryVo => {
  let { data } = await axios.post(base + "/toplist/comment", queryVo);
  return data;
};
export {
  GET_ARTICLE_STATS,
  GET_USER_STATS,
  GET_ACCESS_STATS,
  GET_ACTION_TOP_LIST,
  GET_FANS_TOP_LIST,
  GET_READ_TOP_LIST,
  GET_LIKE_TOP_LIST,
  GET_COMMENT_TOP_LIST
};
