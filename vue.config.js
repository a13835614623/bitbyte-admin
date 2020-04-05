// 开发环境
let dev_url = "http://127.0.0.1:9527";
// 目标url
let target = "http://106.12.196.8";
module.exports = {
  outputDir: "dist",
  indexPath: "login.html",
  lintOnSave: true,
  // 是否使用包含运行时编译器的 Vue 构建版本
  runtimeCompiler: false,
  // 不使用sourceMap
  productionSourceMap: false,
  pages: {
    audit: {
      // page 的入口
      entry: "src/audit/main.js",
      // 模板来源
      template: `public/audit.html`,
      // 在 dist/index.html 的输出
      filename: "audit.html",
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: "Bitbyte博客审核系统",
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ["chunk-vendors", "chunk-common", "audit"]
    },
    login: {
      // page 的入口
      entry: "src/login/main.js",
      // 模板来源
      template: "public/login.html",
      // 在 dist/index.html 的输出
      filename: "login.html",
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: "Bitbyte后台登录",
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ["chunk-vendors", "chunk-common", "login"]
    },
    admin: {
      // page 的入口
      entry: "src/admin/main.js",
      // 模板来源
      template: "public/admin.html",
      // 在 dist/index.html 的输出
      filename: "admin.html",
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: "Bitbyte后台管理系统",
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ["chunk-vendors", "chunk-common", "admin"]
    }
  },
  //axios域代理，解决axios跨域问题
  devServer: {
    proxy: {
      "/api": {
        target,
        changeOrigin: true,
        ws: true,
        pathRewrite: {}
      }
    }
  },
  // webpack配置
  configureWebpack: config => {
    config.module.rules.push({
      test: /\.vue$/,
      use: [
        {
          loader: "iview-loader", // 解决ivew组件 忽略前缀i的问题
          options: {
            prefix: false
          }
        }
      ]
    });
  },
  // 全局引入scss
  css: {
    loaderOptions: {
      scss: {
        prependData: `
          @import "@/assets/scss/index.scss";
        `
      }
    }
  },
  transpileDependencies: ["vuetify"]
};
