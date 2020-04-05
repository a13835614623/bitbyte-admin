import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
const _import = name => {
  return () => import("./views/" + name);
};
const routes = [
  {
    path: "/",
    component: _import("index"),
    redirect: "dashboard",
    children: [
      "dashboard",
      "user/user-manage",
      "user/perm-manage",
      "user/role-manage",
      "article/article-manage",
      "article/part-manage",
      "action/article-toplist",
      "action/fans-toplist",
      "stats"
    ].map(path => {
      return { path: "/" + path, component: _import(path) };
    })
  }
];

const router = new VueRouter({
  routes
});

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};

export default router;
