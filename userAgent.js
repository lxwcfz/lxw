var browser = {
    versions:function(){ 
        var u = navigator.userAgent, app = navigator.appVersion; 
        return {
           trident: u.indexOf('Trident') > -1, //IE内核
           presto: u.indexOf('Presto') > -1, //opera内核
           webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
           gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
           mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
           ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
           android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
           iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone
           iPad: u.indexOf('iPad') > -1, //是否iPad
        };
    }(),
    language:(navigator.browserLanguage || navigator.language).toLowerCase()
};
if(browser.versions.mobile) alert('mobile');
// if( browser.versions.ios || browser.versions.iPhone || browser.versions.iPad){
//     alert('苹果');
// }else if( browser.versions.android ){
//   alert('安卓');
// }else{
//   alert('其他');
// }