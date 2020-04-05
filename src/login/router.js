import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);
const _import = name => {
  return () => import("./views/" + name);
};
const routes = [
  {
    path: "/",
    component: _import("login")
  },
  {
    path: "/entry",
    component: _import("entry")
  }
];

const router = new VueRouter({
  routes
});

export default router;
