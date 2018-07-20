import originJSONP from "jsonp";
import MD5 from "js-md5";
import $ from "jquery";
import { Message } from "element-ui";

export function jsonp(url, data, option) {
  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
}

export function getTranslateResult(originLanguage, queryContent) {
  const url = "http://api.fanyi.baidu.com/api/trans/vip/translate";
  //APP ID: 20170825000076961
  //密钥: Tpx_Gek5zh5CIJ6OJFOY

  const appid = "20170825000076961";
  const key = "Tpx_Gek5zh5CIJ6OJFOY";
  const salt = new Date().getTime();
  var query = queryContent;
  var str1 = appid + query + salt + key;
  var sign = MD5(str1);
  var from = "auto";

  var toJP = "jp";
  var toEN = "en";
  var toZH = "zh";

  const zh = "zh";
  const en = "en";
  const jp = "jp";

  if (query == "") {
    return {};
  } else {
    let translateJP = $.ajax({
      url: url,
      type: "get",
      dataType: "jsonp",
      data: {
        q: query,
        appid: appid,
        salt: salt,
        from: from,
        to: toJP,
        sign: sign
      }
    });

    let translateEN = $.ajax({
      url: url,
      type: "get",
      dataType: "jsonp",
      data: {
        q: query,
        appid: appid,
        salt: salt,
        from: from,
        to: toEN,
        sign: sign
      }
    });

    let translateZH = $.ajax({
      url: url,
      type: "get",
      dataType: "jsonp",
      data: {
        q: query,
        appid: appid,
        salt: salt,
        from: from,
        to: toZH,
        sign: sign
      }
    });

    // Promise.all([translateJP, translateEN, translateZH]).then(res => {

    //   console.log("翻译promise返回结果", res);

    //   returnTransArray(res);

    // });

    return Promise.all([translateJP, translateEN, translateZH]);
  }
}

export function returnTransArray(array) {
  if (array.error_code == "54000") {
    console.log("我报错了");
    Message({
      type: "error",
      message: "必填参数为空"
    });
  }

  console.log(array);

  let translateResult = [];
  let item = {};

  array.forEach((value, key) => {
    console.log(value);
    if (value.to == "zh") {
      item.zh = value.trans_result[0].dst;
    }
    if (value.to == "en") {
      item.en = value.trans_result[0].dst;
    }
    if (value.to == "jp") {
      item.jp = value.trans_result[0].dst;
    }
  });

  translateResult.push(item);

  console.log("翻译的结果", translateResult);

  return translateResult;
}

export function baiduTranslate(queryContent, shopLanguage) {
  const url = "http://api.fanyi.baidu.com/api/trans/vip/translate";

  const appid = "20170825000076961";
  const key = "Tpx_Gek5zh5CIJ6OJFOY";
  const salt = new Date().getTime();

  var query = queryContent;
  var str1 = appid + query + salt + key;
  var sign = MD5(str1);

  const zh = "zh";
  const en = "en";
  const jp = "jp";

  var toJP = "jp";
  var toEN = "en";
  var toZH = "zh";

  if(query !== ''){
    
    if (shopLanguage == 0) {
      const originLanguage = "zh";
  
      let translateToJP = $.ajax({
        url: url,
        type: "get",
        dataType: "jsonp",
        data: {
          q: query,
          appid: appid,
          salt: salt,
          from: originLanguage,
          to: toJP,
          sign: sign
        }
      });
  
      let translateToEN = $.ajax({
        url: url,
        type: "get",
        dataType: "jsonp",
        data: {
          q: query,
          appid: appid,
          salt: salt,
          from: originLanguage,
          to: toEN,
          sign: sign
        }
      });
  
      return Promise.all([translateToJP, translateToEN]);
    }
  
    if (shopLanguage == 1) {
      const originLanguage = "en";
  
      let translateToJP = $.ajax({
        url: url,
        type: "get",
        dataType: "jsonp",
        data: {
          q: query,
          appid: appid,
          salt: salt,
          from: originLanguage,
          to: toJP,
          sign: sign
        }
      });
  
      let translateToZH = $.ajax({
        url: url,
        type: "get",
        dataType: "jsonp",
        data: {
          q: query,
          appid: appid,
          salt: salt,
          from: originLanguage,
          to: toZH,
          sign: sign
        }
      });
  
      return Promise.all([translateToJP, translateToZH]);
    }
  
    if (shopLanguage == 2) {
      const originLanguage = "jp";
  
      let translateToZH = $.ajax({
        url: url,
        type: "get",
        dataType: "jsonp",
        data: {
          q: query,
          appid: appid,
          salt: salt,
          from: originLanguage,
          to: toZH,
          sign: sign
        }
      });
  
      let translateToEN = $.ajax({
        url: url,
        type: "get",
        dataType: "jsonp",
        data: {
          q: query,
          appid: appid,
          salt: salt,
          from: originLanguage,
          to: toEN,
          sign: sign
        }
      });
  
      return Promise.all([translateToZH, translateToEN]);
    }

  } else {
    return {}
  }

}

