import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);
const _import = name => {
  return () => import("./views/" + name);
};
const routes = [
  {
    path: "/",
    redirect: "/dashboard"
  },
  ...["dashboard", "my"].map(name => {
    return {
      path: "/" + name,
      component: _import(name)
    };
  })
];

const router = new VueRouter({
  routes
});

export default router;
