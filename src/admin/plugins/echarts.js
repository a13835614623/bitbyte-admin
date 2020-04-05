import Vue from "vue";
// 引入 ECharts 主模块
import echarts from "echarts/lib/echarts";
// 引入柱状图
import "echarts/lib/chart/pie";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/line";
// 引入提示框和标题组件
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/graphic";
import "echarts/lib/component/toolbox";
Vue.use(echarts);
// 默认option
let option = {
  title: {
    left: "center",
    top: "5%",
    textStyle: {
      color: "#000"
    }
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      crossStyle: {
        color: "#999"
      }
    }
  },
  legend: {
    top: "15%",
    right: "3%"
  },
  grid: {
    left: "3%",
    right: "6%",
    top: "25%",
    bottom: "3%",
    containLabel: true
  }
};

/**
 * 绘制图表
 * @param domId domId
 * @param chartOption 图表option
 */
echarts.drawChart = (dom, chartOption) => {
  if (!dom) return;
  let myChart = echarts.init(dom);
  myChart.hideLoading();
  myChart.setOption(option);
  myChart.setOption(chartOption);
  dom.parentNode.onresize = function() {
    myChart.resize();
  };
  return myChart;
};
Vue.prototype.$echarts = echarts;
