const ARTICLE_PART_MAP = {
  16: "编程语言",
  17: "开发技术",
  18: "数据结构与算法",
  19: "数据库",
  20: "架构设计",
  21: "技术前瞻",
  22: "其他"
};
const AUDIT_STATE_MAP = {
  24: "审核通过",
  25: "审核拒绝",
  26: "未审核"
};
const ARTICLE_PART_INFO = {};
let newMap = (label, color, icon, value) => {
  return { label, color, icon, value };
};
Object.keys(ARTICLE_PART_MAP).forEach(key => {
  ARTICLE_PART_INFO[key] = newMap(ARTICLE_PART_MAP[key], "", "", key);
});
const AUDIT_STATE_INFO = {
  24: newMap(AUDIT_STATE_MAP[24], "success", "mdi-shield-check-outline", "24"),
  25: newMap(AUDIT_STATE_MAP[25], "error", "mdi-shield-remove-outline", "25"),
  26: newMap(AUDIT_STATE_MAP[26], "warning", "mdi-state-machine", "26")
};

const RECORD_COMMON_PROP_MAP = {
  // createat: "更新时间",
  // updateat: "创建时间"
};
const USER_PROP_MAP = Object.assign(
  {
    userId: "用户ID",
    userPic: "头像",
    userName: "昵称",
    userSex: "性别",
    userMobile: "手机号",
    userBirthday: "生日",
    userAddress: "地址",
    userEmail: "邮箱",
    userPassword: "密码",
    userState: "状态"
  },
  RECORD_COMMON_PROP_MAP
);
const PERM_PROP_MAP = Object.assign(
  {
    permStr: "权限表达式",
    permDesc: "描述"
  },
  RECORD_COMMON_PROP_MAP
);
const ROLE_PROP_MAP = Object.assign(
  {
    roleStr: "角色表达式",
    roleDesc: "描述"
  },
  RECORD_COMMON_PROP_MAP
);
const ARTICLE_PROP_MAP = Object.assign({
  // articleId: "文章ID",
  articleTitle: "标题",
  // articleUser: "作者ID",
  userName: "作者昵称",
  // userPic: "作者头像",
  articleRead: "阅读量",
  articlePublishTime: "发布时间",
  articleTags: "标签",
  articlePart: "分区",
  articleState: "状态"
  // articleContent: "文章内容",
  // articleMdContent: "文章内容(Markdown)",
});
const USER_SEX_LIST = ["男", "女", "保密"];
// 访问类型属性k/v映射
const ACCESS_TYPE_MAP = {
  14: "首页",
  15: "博客分区"
};
// 访问值属性k/v映射
const ACCESS_VALUE_MAP = Object.assign(
  {
    23: "首页"
  },
  ARTICLE_PART_MAP
);
// 文章状态
const ARTICLE_STATE_MAP = {
  24: "审核通过",
  25: "审核拒绝",
  27: "已创建",
  28: "已发布",
  29: "审核中",
  32: "已删除",
  PASS: 24,
  REFUSE: 25,
  CREATED: 27,
  PUBLISHED: 28,
  AUDITING: 29,
  DELETED: 32
};
const USER_STATE_MAP = {
  31: "已锁定",
  32: "已删除",
  33: "已封禁",
  34: "正常",
  LOCKED: 31,
  DELETED: 32,
  BANNED: 33,
  NORMAL: 34
};
const PARTS = Object.values(ARTICLE_PART_MAP);
export {
  AUDIT_STATE_MAP,
  AUDIT_STATE_INFO,
  ARTICLE_STATE_MAP,
  USER_STATE_MAP,
  ARTICLE_PART_INFO,
  ARTICLE_PART_MAP,
  ARTICLE_PROP_MAP,
  USER_PROP_MAP,
  PERM_PROP_MAP,
  ROLE_PROP_MAP,
  USER_SEX_LIST,
  ACCESS_TYPE_MAP,
  ACCESS_VALUE_MAP,
  PARTS
};
