import Vue from "vue";
import VueRouter from "vue-router";

import BalanceTableView from "@/views/BalanceTableView";
import AccountBalance from "@/views/AccountBalance";
import AccountList from "@/views/AccountList";

Vue.use(VueRouter);

const routes = [
  {
    path: "/balance",
    name: "Balance",
    component: BalanceTableView,
    alias: "/"
  },
  {
    path: "/account",
    name: "AccountList",
    component: AccountList
  },
  {
    path: "/account/:accName",
    name: "Account",
    component: AccountBalance
  },
  {
    name: "404",
    path: "/404",
    component: () => import("@/views/NotFound"),
    alias: "*"
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
