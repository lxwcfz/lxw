/**
 *
 * browser-md5-file Javascript Library v 1.0
 *
 * https://github.com/forsigner/browser-md5-file | Released under MIT license
 *
 *
 * OSS上传类
 * 封装了后端断点续传的调用
 * 封装了文件分割 和 md5获取
 * 1.获取文件md5
 * 2.通过md5查询文件是否已经上传
 * 3.如果上传过了 判断是否上传完
 *      true: 上传完则 return
 *      false: 未上传完 获取uploadId 并且查询最新的partId 来进行断点续传
 * 4.上传完成每一块都回调callback 通知调用者
 *
 */


// 引用资源
//document.write('<script language=javascript src=\'lib/browser-md5-file.js\'></script>');
import './lib/browser-md5-file';
//import OSS from './lib/OSSUploadRequest';

// 外网域名ll
//let HOST = 'http://localhost:9010';
let HOST = window.location.origin;

let config = {
    POST : 'POST',// 请求方式
    GET : 'GET',// 请求方式
    PART_SIZE : 1024 * 1024,// 每次上传文件part大小 (默认1mb)
    OTAROM_ADD : HOST + '/coron-web/otarom/addOtaRom',// 判断是否可以上传OTA
    OTAROM_APPEND : HOST + '/coron-web/otarom/appendOtaRom',// 追加上传文件接口OTA
    APK_ADD : HOST + '/coron-web/apk/addApk',// 判断是否可以上传APK
    APK_APPEND : HOST + '/coron-web/apk/appendApk',// 追加上传文件接口APK
    ADD : null,// 真实调用地址
    APPEND : null,// 真实调用地址
    FILE_MD5 : null,// 文件md5
    FILE_NAME : null,// 文件名
    FILE_SIZE : null,// 文件总大小
    UPLOAD_SIZE : null,// 已上传文件大小 byte 字节
    PART_COUNT : null,// 分割文件的总块数
    START_PART : null,// 需要从第几块开始上传
    FILE : null,// 当前上传的文件
    TYPE : null,// 判断当前是 上传ota 还是 apk 1:ota 2:apk
    handles : []// 随便写一个事件存储中心吧
};

/**
 * OSSUpload 上传类
 * @param {file} file 文件流
 * @param {int} type 1:ota 2:apk
 * @constructor
 */
export default function OSSUpload(file, type) {
    if (file === null || file === undefined) {
        throw '文件不能为空!';
    }
    if (type === null || type === undefined) {
        throw '上传类型不能为空!';
    }
    console.log(`创建句柄`);
    config.FILE = file;
    /** @namespace file.name */
    config.FILE_NAME = file.name;
    config.TYPE = type;
    if (type === 1) {
        config.ADD = config.OTAROM_ADD;
        config.APPEND = config.OTAROM_APPEND;
    } else if (type === 2) {
        config.ADD = config.APK_ADD;
        config.APPEND = config.APK_APPEND;
    }
}

OSSUpload.prototype.init = function() {
    console.log(`init`);
    initMd5();
    config.FILE_SIZE = getSize();
    config.PART_COUNT = getPartCount();
    console.log(`md5: ${config.FILE_MD5}`);
    console.log(`size: ${config.FILE_SIZE}`);
    console.log(`count: ${config.PART_COUNT}`);
};

OSSUpload.prototype.start = function(body) {

    config.body = body;
    let temp = {
        POST : config.POST,
        GET : config.GET,
        PART_SIZE : config.PART_SIZE,
        HOST : config.HOST,
        OTAROM_ADD : config.OTAROM_ADD,
        OTAROM_APPEND : config.OTAROM_APPEND,
        APK_ADD : config.APK_ADD,
        APK_APPEND : config.APK_APPEND,
        ADD : config.ADD,
        APPEND : config.APPEND,
        FILE_MD5 : config.FILE_MD5,
        FILE_NAME : config.FILE_NAME,
        FILE_SIZE : config.FILE_SIZE,
        UPLOAD_SIZE : config.UPLOAD_SIZE,
        PART_COUNT : config.PART_COUNT,
        START_PART : config.START_PART,
        FILE : config.FILE,
        TYPE : config.TYPE,
        body : config.body
    };

    //let worker = new Worker('lib/OSSUploadRequest.js');
    //let worker = new Worker('/coron-web/bigc/static/js/OSSUploadRequest.js');
    let worker = new Worker('/coron-web/bigc/static/js/OSSUploadRequest.js');

    worker.onmessage = function (e) {
        let result = e.data;
        if (result.append) {
            emit('append', result.append);
        }
        if (result.finish) {
            emit('finish', result.finish);
        }
        if (result.error) {
            emit('error', result.error);
        }
    };

    worker.postMessage(temp);

};

OSSUpload.prototype.on = function (eventName, callback) {
    config.handles[eventName] = callback;
};

function emit (eventName) {
    if(config.handles[arguments[0]]){
        config.handles[arguments[0]](arguments[1]);
    }
}

/**
 * 初始化md5值 强行用事件把异步转为同步
 */
function initMd5() {

    browserMD5File(config.FILE, function (err, md5) {
        config.FILE_MD5 = md5;
        emit('md5', config.FILE_MD5);
    });
}

function getSize() {
    return config.FILE.size;
}

function getPartCount() {
    let partCount = 0;
    if (config.FILE_SIZE < config.PART_SIZE) {
        partCount = 1;
    } else {
        if (config.FILE_SIZE % config.PART_SIZE === 0) {
            partCount = config.FILE_SIZE / config.PART_SIZE;
        } else {
            partCount = parseInt(config.FILE_SIZE / config.PART_SIZE) + 1;
        }
    }
    return partCount
}