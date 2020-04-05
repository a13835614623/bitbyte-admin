import { ARTICLE_PART_MAP, USER_PIC_PREFIX } from "./util";
const DEFAULT_FORMAT_STR = "y.m.d h:m:s";
// 格式化article
let FORMAT_ARTICLE = article => {
  if (!article) return null;
  article.articlePart = ARTICLE_PART_MAP[article.articlePart];
  article.articleTags = article.articleTags.split("-");
  article.userPic = USER_PIC_PREFIX + article.userPic;
  return article;
};
// 格式化audit
let FORMAT_AUDIT = (audit, formatStr = DEFAULT_FORMAT_STR) => {
  if (!audit) return null;
  audit.auditTime = new Date(audit.auditTime).format(formatStr);
  audit.createat = new Date(audit.createat).format(formatStr);
  audit.updateat = new Date(audit.updateat).format(formatStr);
  audit.article = FORMAT_ARTICLE(audit.article);
  return audit;
};
// 格式化user
let FORMAT_USER = (user, formatStr = DEFAULT_FORMAT_STR) => {
  if (!user) return null;
  user.userPic = USER_PIC_PREFIX + user.userPic;
  if (user.createat) user.createat = new Date(user.createat).format(formatStr);
  if (user.updateat) user.updateat = new Date(user.updateat).format(formatStr);
  return user;
};

export { FORMAT_USER, FORMAT_AUDIT, FORMAT_ARTICLE };
