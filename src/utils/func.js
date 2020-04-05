let DATE_FORMAT = (date, formatStr = "y-m-d h:m:s") => {
  formatStr = formatStr.toLocaleLowerCase();
  if (!(date instanceof Date) || !date) return "无";
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let min = date.getMinutes();
  let second = date.getSeconds();
  let func = t => {
    return t < 10 ? "0" + t : t;
  };
  formatStr = formatStr
    .replace("y", year)
    .replace("m", func(month))
    .replace("d", func(day))
    .replace("h", func(hour))
    .replace("m", func(min))
    .replace("s", func(second));
  return formatStr;
};
/**
 * 获取日期列表
 * @param {*} endDate 结束日期
 * @param {*} length 长度
 * @param {*} formatStr 格式字符串
 */
let GET_DATE_LIST = (endDate, length, formatStr = "y-m-d") => {
  let end = new Date(endDate);
  let dateList = [];
  dateList.push(DATE_FORMAT(new Date(end.getTime()), formatStr));
  for (let i = 0; i < length - 1; i++) {
    end.setDate(end.getDate() - 1);
    dateList.unshift(DATE_FORMAT(new Date(end.getTime()), formatStr));
  }
  return dateList;
};
export { GET_DATE_LIST, DATE_FORMAT };
