import axios from "./base";
let base = "/audit";

let GET_AUDIT_LIST = async queryVo => {
  let { data } = await axios.post(base + "/list", queryVo);
  return data;
};
// 审核通过
let DO_AUDIT_PASS = async ({ auditId, articleId, userId }) => {
  let { data } = await axios.post(
    base +
      "/pass?auditId=" +
      auditId +
      "&articleId=" +
      articleId +
      "&userId=" +
      userId
  );
  return data;
};
// 审核拒绝
let DO_AUDIT_REFUSE = async ({ auditId, articleId, reason, userId }) => {
  let { data } = await axios.post(
    base +
      "/refuse?auditId=" +
      auditId +
      "&reason=" +
      reason +
      "&articleId=" +
      articleId +
      "&userId=" +
      userId
  );
  return data;
};
let DO_AUDIT_CANCEL = async ({ auditId }) => {
  let { data } = await axios.post(base + "/cancel?auditId=" + auditId);
  return data;
};
export { GET_AUDIT_LIST, DO_AUDIT_PASS, DO_AUDIT_REFUSE, DO_AUDIT_CANCEL };
