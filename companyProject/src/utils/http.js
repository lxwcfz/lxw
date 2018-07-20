import axios from "axios";
import { Message , Loading } from "element-ui";
import router from "../router";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import Lockr from 'lockr';
import Cookies from 'js-cookie';

const _httpLanguage = !!Cookies.get('SHOPLANGUAGE') ? Cookies.get('SHOPLANGUAGE'):0;

//创建 axios 实例
const $http = axios.create({
  baseURL: process.env.BASE_API, //api的base_url
  timeout: 10000, //请求超时时间
  responseType: "json",
  headers: {
    "Content-Type": "application/json", 
    "Language": _httpLanguage
  }
});

var loadingScreen;

//request 拦截器
$http.interceptors.request.use(
  config => {
    //NProgress.start();
    loadingScreen = Loading.service({ fullscreen: true });

    if(config.headers.Language !== Cookies.get('SHOPLANGUAGE')){
      config.headers.Language = Cookies.get('SHOPLANGUAGE');
    }    

    return config;
  },
  error => {
    Message({
      showClose: true,
      message: error
    });

    return Promise.reject(error);
  }
);

//response 拦截器
$http.interceptors.response.use(
  response => {
    return checkStatus(response);
  },
  error => {

    //用户登录的时候会拿到一个基础信息，比如用户名，token,过期时间戳
    if (true) {
      //若访问接口的时候没有发现鉴权的基础信息，直接返回登录页


    } else {
      //如果有基础信息，判断当前时间戳和当前时间，若当前时间大于服务器时间请重新登录

    }

    setTimeout(() => {
      loadingScreen.close();
    }, 500);

    //错误页判断
    if (error.response.status == 403) {
    }
    if (error.response.status == 500) {
    }
    if (error.response.status == 502) {
    }
    if (error.response.status == 404) {
    }

    return Promise.resolve(error);
  }
);

// remove 拦截器
//http.interceptors.request.eject(myInterceptor);

function checkStatus(response) {
  //loading
  //如果状态码正常，则直接返回数据

  if (
    (response && response.status === 200) ||
    response.status === 304 ||
    response.status === 400
  ) {
    
    if (!response.data.status && response.data.responseCode == "10212") {
      Message({
        type: "error",
        message: response.data.message
      });

      router.push({
        path: "/loginIn"
      });
    }

    //NProgress.done();
        
    setTimeout(() => {
      loadingScreen.close();
    }, 0);

    return response.data;
    //如果不需要除了data 之外的数据 可直接返回过滤后的数据
  }

  
  return {
    status: -404,
    msg: "网络异常"
  };
}

function checkCode(res) {
  //如果 code 异常（这里包括网络错误，服务器错误，后端抛出的错误),可以弹出一个错误提示告诉用户
  if (res.status === -404) {
    alert(res.msg);
  }

  if (res.data && !res.data.success) {
    alert(err.data.error_msg);
  }

  return res;
}

export default {
  post(url, data) {
    return $http({
      method: "post",
      url,
      data: data
    });
  },
  get(url, params) {
    return $http({
      method: "get",
      url,
      params
    });
  }
};
