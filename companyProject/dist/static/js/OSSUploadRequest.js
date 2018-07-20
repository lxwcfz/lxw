let config = null;
let xhr;

onmessage = function(e) {
    console.log('on message');
    config = e.data;

    start(config.body);
};


function start(data) {
    let headers = [
        {'Content-Type' : 'application/json'}
    ];

    data.md5 = config.FILE_MD5;
    data.fileSize = config.FILE_SIZE;

    httpRequest(config.ADD, config.POST, headers, JSON.stringify(data), false, function() {
        console.log(xhr);
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            console.log(`result: ${xhr.responseText}`);
            let resultObj = JSON.parse(xhr.responseText);
            if (resultObj.status) {
                /** @namespace resultObj.entry */
                let uploadSize = resultObj.entry;
                if (uploadSize === 0) {
                    config.UPLOAD_SIZE = 0;
                } else {
                    config.UPLOAD_SIZE = uploadSize;
                }
                config.START_PART = getStartPart();
                startAppend();
            } else {
                console.error(`error: ${resultObj}`);
                let errorResult = {
                    error : "文件已上传成功，不可重复上传!"
                };
                postMessage(errorResult);
            }

        }
    });
}

function getStartPart() {
    let startPart = 0;
    if (config.UPLOAD_SIZE === 0) {
        return startPart;
    }
    if (config.UPLOAD_SIZE < config.PART_SIZE) {
        return startPart;
    }
    return (config.UPLOAD_SIZE / config.PART_SIZE);
}

/**
 *
 * 开始追加上传
 */
function startAppend() {
    // 从第一块开始上传
    if (config.START_PART === 0) {
        config.START_PART = 1;
    }
    while (config.START_PART <= config.PART_COUNT) {

        let startIndex = (config.START_PART - 1) * config.PART_SIZE;
        let endIndex = startIndex + config.PART_SIZE;
        let uploadFilePart = null;

        if (config.START_PART === config.PART_COUNT) {
            uploadFilePart = config.FILE.slice(startIndex);
        } else {
            uploadFilePart = config.FILE.slice(startIndex, endIndex);
        }

        let data = new FormData();
        data.append('md5', config.FILE_MD5);
        data.append('fileName', config.FILE_NAME);
        data.append('file', uploadFilePart);

        httpRequest(config.APPEND, config.POST, null, data, false, function() {

        });
        // 不能使用闭包回调
        console.log(xhr);
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            console.log(`result: ${xhr.responseText}`);
            let resultObj = JSON.parse(xhr.responseText);
            if (resultObj.status) {
                let appendResult = {
                    append : config.START_PART / config.PART_COUNT
                };
                postMessage(appendResult);
            } else {
                let errorResult = {
                    error : "文件已上传成功，不可重复上传!"
                };
                postMessage(errorResult);
                return;
            }

        }

        config.START_PART++;
    }
    let finishResult = {
        finish : 'finish'
    };
    postMessage(finishResult);
}

/**
 *
 * @param {string} url
 * @param {string} method
 * @param {Object} headers
 * @param {Object} data
 * @param sync 是否异步 true:异步 false:同步
 * @param {Function} callback
 */
function httpRequest(url, method, headers, data, sync, callback) {
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = callback;
    xhr.open(method, url, sync);// 之所以关闭异步，是为了防止文件块送达服务器的顺序出错
    // 设置请求头 打开连接才能设置头
    if (headers !== null && headers !== undefined) {
        if (headers instanceof Array) {
            for (let i = 0; i < headers.length; i++) {
                for (let key in headers[i]) {
                    console.log(`key: ${key} value: ${headers[i][key]}`);
                    xhr.setRequestHeader(key, headers[i][key]);
                }
            }
        }
    }
    xhr.send(data);// 把打包的数据发送
    return xhr;
}