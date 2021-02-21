import Vue from "vue";
import VueRouter from "vue-router";

import BalanceTableView from "@/views/BalanceTableView";
import AccountBalance from "@/views/AccountBalance";

Vue.use(VueRouter);

const routes = [
  {
    path: "/balance",
    name: "Balance",
    component: BalanceTableView
  },
  {
    path: "/account/:accName",
    name: "Account",
    component: AccountBalance
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
