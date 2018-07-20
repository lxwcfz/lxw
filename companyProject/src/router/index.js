import Vue from "vue";
import Router from "vue-router";

import Home from "@/components/common/Home";
import Login from "@/components/login/login";

import DashBoard from "@/components/page/DashBoard";
import Products from "@/components/page/Products";

import Introduce from "@/components/page/introduce";

import Shop from "@/components/page/shop";
import Shopinfo from "@/components/shop/info";
import Shoporder from "@/components/shop/order";
import Orderdetail from "@/components/shop/orderDetail";
import Advertising from "@/components/shop/advertising";
import ShopRobotReply from "@/components/shop/robotReply";

import Operation from "@/components/operation/operation";
import Shopmanage from "@/components/operation/shopmanage";
import Ordermanage from "@/components/operation/ordermanage";
import OOrderdetail from "@/components/operation/orderdetail";
import Addshop from "@/components/operation/addShop";
import Updateshop from "@/components/operation/updateShop";
import Shopdetail from "@/components/operation/shopdetail";
import ywItemList from "@/components/operation/itemlist";
import Robot from "@/components/operation/robotmanage";
import OTAmanage from "@/components/operation/otamanage";
import OTAadd from "@/components/operation/otaadd";
import APKmanage from "@/components/operation/apkmanage";
import APKadd from "@/components/operation/apkadd";
import SN from "@/components/operation/sn";
import SNmanage from "@/components/operation/snmanage";
import Translate from "@/components/operation/translate";
import Motion from "@/components/operation/motion";
import RobotReply from "@/components/operation/robotReply";
import sceneParam from "@/components/operation/sceneParam";


import ItemList from "@/components/products/list/itemList";
import AddList from "@/components/products/list/addList";
import UpdateList from "@/components/products/list/updateList";
import SortList from "@/components/products/list/sortList";
import Catalog from "@/components/products/catalog/catalogList";
import AttrList from "@/components/products/attr/attrList";
import TimeDuration from "@/components/products/time/timeList";
import SideDishes from "@/components/products/sidedish/sidedishList";

import { getToken } from "../utils/auth";

Vue.use(Router);

const router = new Router({
  mode: "history",
  //base: __dirname,
  base:process.env.NODE_ENV === 'production' ? '/coron-web/bigc/':__dirname,
  //base:'/coron-web/bigc/',
  routes: [
    {
      path: "/",
      component: Home,
      meta: {
        requireAuth: true
      },
      children: [
        {
          path: "",
          component: DashBoard,
          meta: {
            requireAuth: true
          }
        },
        {
          path: "/dashboard",
          component: DashBoard,
          meta: {
            requireAuth: true
          }
        },
        {
          path: "/products",
          component: Products,
          redirect: "/products/list",
          meta: {
            requireAuth: true,
            breadNav: [{ name: "商品管理", path: "" }, { name: "商品列表", path: "" }]
          },
          children: [
            { path: "list", component: ItemList },
            { path: "add", component: AddList },
            { path: "update", component: UpdateList },
            { path: "sort", component: SortList },
            { path: "catalog", component: Catalog },
            { path: "timeduration", component: TimeDuration },
            { path: "attrlist", component: AttrList },
            { path: "sidedishes", component: SideDishes }
          ]
        },
        {
          path: "/introduce",
          component: Introduce,
          meta: ["提案管理", "提案列表"],
          meta: {
            requireAuth: true,
            breadNav: [{ name: "提案管理", path: "" }, { name: "提案列表", path: "" }]
          }
        },
        {
          path: "/operation",
          component: Operation,
          redirect: "/operation/shopmanage",
          children: [
            {
              path: "shopmanage",
              component: Shopmanage,
              meta: {
                requireAuth: true,
                breadNav: [
                  { name: "运营管理", path: "" },
                  { name: "店铺管理", path: "" }
                ]
              }
            },
            {
              path: "addshop",
              component: Addshop,
              meta: {
                requireAuth: true,
                breadNav: [
                  { name: "运营管理", path: "" },
                  { name: "店铺管理", path: "/operation/shopmanage" },
                  { name: "店铺添加", path: "" }
                ]
              }
            },
            {
              path: "updateshop",
              component: Updateshop,
              meta: {
                requireAuth: true,
                breadNav: [
                  { name: "运营管理", path: "" },
                  { name: "店铺管理", path: "/operation/shopmanage" },
                  { name: "店铺修改", path: "" }
                ]
              }
            },
            {
              path: "shopdetail",
              name: "shopdetail",
              component: Shopdetail,
              meta: {
                requireAuth: true,
                breadNav: [
                  { name: "运营管理", path: "" },
                  { name: "店铺详情", path: "" }
                ]
              }
            },
            {
              path: "itemlist",
              name: "itemlist",
              component: ywItemList,
              meta: {
                requireAuth: true,
                breadNav: [
                  { name: "运营管理", path: "/operation/shopmanage" },
                  { name: "店铺详情", path: "/operation/shopdetail" },
                  { name: "商品列表", path: "" }
                ]
              }              
            },
            {
              path: "translate",
              name: "translate",
              component: Translate,
              meta: {
                requireAuth: true,
                breadNav: [
                  { name: "运营管理", path: "" },
                  { name: "店铺详情", path: "/operation/apkmanage" },
                  { name: "商品列表", path: "/operation/itemlist" },
                  { name: "翻译", path: "" }
                ]
              }              
            },            
            {
              path: "ordermanage",
              component: Ordermanage,
              meta: ["运营管理", "订单管理"],
              meta: {
                requireAuth: true,
                breadNav: [
                  { name: "运营管理", path: "" },
                  { name: "订单管理", path: "" }
                ]
              }
            },
            {
              path: "orderdetail",
              component: OOrderdetail,
              meta: {
                requireAuth: true,
                breadNav: [
                  { name: "运营管理", path: "" },
                  { name: "订单管理", path: "/operation/ordermanage" },
                  { name: "订单详情", path: "" }
                ]
              }
            },
            {
              path: "robot",
              component: Robot,
              meta: {
                requireAuth: true,
                breadNav: [
                  { name: "运营管理", path: "" },
                  { name: "机器人管理", path: "" }
                ]
              }
            },
            {
              path: "otamanage",
              component: OTAmanage,
              meta: {
                requireAuth: true,
                breadNav: [
                  { name: "运营管理", path: "" },
                  { name: "OTA升级管理", path: "" }
                ]
              }
            },
            {
              path: "otaadd",
              component: OTAadd,
              meta: {
                requireAuth: true,
                breadNav: [
                  { name: "运营管理", path: "" },
                  { name: "OTA升级管理", path: "/operation/otamanage" },
                  { name: "OTA升级", path: "" }
                ]
              }
            },
            {
              path: "apkmanage",
              component: APKmanage,
              meta: {
                requireAuth: true,
                breadNav: [
                  { name: "运营管理", path: "" },
                  { name: "APK升级管理", path: "" },
                  { name: "升级列表", path: "" }
                ]
              }
            },
            {
              path: "apkadd",
              component: APKadd,
              meta: {
                requireAuth: true,
                breadNav: [
                  { name: "运营管理", path: "" },
                  { name: "APK升级管理", path: "/operation/apkmanage" },
                  { name: "APK升级", path: "" }                  
                ]
              }
            },
            {
              path: "sn",
              component: SN,
              meta: {
                requireAuth: true,
                breadNav: [
                  { name: "开发者管理", path: "" },
                  { name: "SN查询", path: "" }
                ]
              }
            },
            {
              path: "snmanage",
              component: SNmanage,
              meta: {
                requireAuth: true,
                breadNav: [
                  { name: "开发者管理", path: "" },
                  { name: "SN管理", path: "" }
                ]
              }
            },
            {
              path: "motion",
              name: "motion",
              component: Motion,
              meta: {
                requireAuth: true,
                breadNav: [
                  { name: "开发者管理", path: "" },
                  { name: "动作管理", path: "" }                  
                ]
              }
            },
            {
              path: "sceneparam",
              name: "sceneparam",
              component: sceneParam,
              meta: {
                requireAuth: true,
                breadNav: [
                  { name: "开发者管理", path: "" },
                  { name: "场景参数管理", path: "" }                  
                ]
              }
            },
            {
              path: "robotreply",
              name: "robotreply",
              component: RobotReply,
              meta: {
                requireAuth: true,
                breadNav: [
                  { name: "开发者管理", path: "" },
                  { name: "场景管理", path: "" }                  
                ]
              }
            }
          ]            
        },
        {
          path: "/shop",
          component: Shop,
          redirect: "/shop/info",
          children: [
            {
              path: "info",
              component: Shopinfo,
              meta: {
                requireAuth: true,
                breadNav: [
                  { name: "商家管理", path: "" },
                  { name: "信息管理", path: "" }
                ]
              }
            },
            {
              path: "order",
              component: Shoporder,
              meta: ["商家管理", "订单管理"],
              meta: {
                requireAuth: true,
                breadNav: [
                  { name: "商家管理", path: "" },
                  { name: "订单管理", path: "" }
                ]
              }
            },
            {
              path: "orderdetail",
              component: Orderdetail,              
              meta: {
                requireAuth: true,
                breadNav: [
                  { name: "商家管理", path: "" },
                  { name: "订单管理", path: "/shop/order" },
                  { name: "订单详情", path: "" }
                ]
              }
            },
            {
              path:"advertising",
              component: Advertising,
              meta:{
                requireAuth:true,
                breadNav:[
                  { name: "商家管理", path: "" },
                  { name: "广告管理", path: "" }                  
                ]
              }
            },
            {
              path:"robotreply",
              component: ShopRobotReply,
              meta:{
                requireAuth:true,
                breadNav:[
                  { name: "商家管理", path: "" },
                  { name: "场景回复管理", path: "" }                  
                ]
              }
            }
          ]
        }
      ]
    },
    {
      path: "/loginIn",
      name: "login",
      component: Login
    },
    // catch all redirect
    { path: "*", redirect: "/dashboard" }
  ]
});

//路由的钩子函数  控制当前的权限
router.beforeEach((to, from, next) => {
  //let token = getToken();
  let token = getToken();
    
  if (to.meta.requireAuth) {
    if (token) {
      next();
    } else {
      next({
        path: "/loginIn",
        query: { redirect: to.fullPath }
      });

      return false;
    }
  } else {
    next();
    return false;
  }
});

export default router;
