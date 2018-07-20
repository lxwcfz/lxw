// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import $ from "jquery";
import App from "./App";
import Lockr from "lockr";
// import ElementLocale from 'element-ui/lib/locale'
import i18n from "./i18n";
import { LANGS } from "@/i18n/lang";

import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
//引入element-ui的默认CSS样式
import "element-ui/lib/theme-default/index.css";
//引入项目中自定义过滤器
import * as filters from "./filters/index";

Vue.use(ElementUI);

Vue.prototype.$ = $;

Vue.config.productionTip = false;

//Register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  template: "<App/>",
  components: { App },
  beforeCreate: function() {
    console.log("beforeCreated.....");
  },
  created() {
    console.log("created .......");
  }
});
