function (元素拖放)
// <标签 draggable='draggable'></标签>
被拖放元素：ondragstart = drag(event);
function drag(e) {
	e.dataTransfer.setData('Text', e.target.id);	//设置被拖放元素
};
接受元素：ondrop = drop(event);
function drop(e) {
	e.preventDefault();
	e.dataTransfer.getData('Text');					获取被拖放元素
	e.target.appendChild(document.getElementById(e.dataTransfer.getData('Text')));		执行操作
};
ondragover = allowDrop(event);
function allowDrop(e) {
	e.preventDefault();
}



function (canvas画布)
画布准备
var myCanvas = document.getElementById('canvas');
var cxt = myCanvas.getContext();

设置画布背景
cxt.fillStyle = '#fff'			背景颜色
cxt.fillRect(x, y, width, height)			画一个指定位置坐标和大小的矩形

function 画指定线条
cxt.moveTo(x,y)			从指定位置开始
cxt.lineTo(x,y)			连接到指定位置
cxt.stroke();			开始画线


function 画圆
cxt.fillStyle = '#fff'			圆的背景颜色
cxt.beginPath();
cxt.arc(x, y, r(半径), 0, Math.PI*2, true);				
cxt.closePath();
cxt.fill();				画圆


function 渐变颜色背景
var gra = cxt.createLinearGradient(x, y, width, height);
gra.addColorStop(0, '#fff');			从0开始为白色
gra.addColorStop(1, '#000');			到1结束为黑色
cxt.fillStyle = gra;
cxt.fillRect(x, y, wid, hei);


function 将图片放到画布上
var img = new Image();				准备图片
img.src = 'src';						图片路径
cxt.drawImage(img, x, y);


function (SVG多边形)
画一个五角星，五个点依次连接起来（100,5）=> (40,180) => (190,60) => (10,60) => (160,180)

<svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="190">
   <polygon points="100,5 40,180 190,60 10,60 160,180" style="fill:red;stroke:blue;stroke-width:3;fill-rule:evenodd;" />
</svg>

fill:red				连接区域的背景颜色
stroke:blue				连接线条的颜色
stroke-width			连接线条的粗细
fill-rule		
//


function (Geolocation获取地理信息)
var x=document.getElementById("demo");
function getLocation() {
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition);
	}else{
		x.innerHTML="Geolocation is not supported by this browser.";
	}
};
function showPosition(position) {
	x.innerHTML="Latitude: " + position.coords.latitude + "<br />Longitude: " + position.coords.longitude;
}		 
function showError(error)				处理错误事件
  {
  switch(error.code)
    {
    case error.PERMISSION_DENIED:
      x.innerHTML="User denied the request for Geolocation."
      break;
    case error.POSITION_UNAVAILABLE:
      x.innerHTML="Location information is unavailable."
      break;
    case error.TIMEOUT:
      x.innerHTML="The request to get user location timed out."
      break;
    case error.UNKNOWN_ERROR:
      x.innerHTML="An unknown error occurred."
      break;
    }
  }


function (WEB存储    localStorage     sessionStorage)	

function localStorage
if(typeof(Storage) !== 'undefined') {
	localStorage.setItem('name', 'job');				存入数据
	localStorage.getItem('name');	or  localStorage.name;					获取数据
}else{
	alert('你的设备不支持locakStorage...')
}		

function sessionStorage
if(typeof(Storage) !== "undefined") {
    if (sessionStorage.clickcount) {
        sessionStorage.clickcount = Number(sessionStorage.clickcount) + 1;				已经存在变量的话直接加一
    } else {
        sessionStorage.clickcount = 1;				没有的话，设置次数为1
    }
} else {
    "抱歉！您的浏览器不支持 Web Storage ...";
}



function (应用程序缓存  Application Cache 离线时可使用)		必须再web服务器上配置MIME-type='text/cache-manifest'
<html manifest='demo.appcache'></html>//
function manifest文件后缀名	.appcache
三部分
一、首次下载后进行缓存	
		CACHE MANIFEST
		/index.css
		/cjsdkj.css
		/main.js
二、永远不会被缓存，离线不可用
		/app.asp
		*只是所有其他文件都需要因特网
三、如果没有网络，则替补资源
		/first.html（第一资源）/ /second.html（替补资源）///

function 更新缓存修改manifest文件




function (Web Worker)			外部有一个worker.js文件（执行一些操作）postMessage(data)传入到html中
var w ;
if(typeof(Worker) !== 'undefined') {
	if(typeof(w) == 'undefined') {
		w = new Worker('demo_workers.js');
	};
	w.onmessage = (event) => {
		执行代码 a = event.data;
	}
}else{
	alert('does not support')
}
终止Worker(terminate())



function (服务器发送事件)

if(typeof(EventSource) !== "undefined") {
	var source = new EventSource('../../demo.php');
	source.onmessage = (event) => {
		a = event.data;
	}
}else{
	alert('wrong')
}



function 新增INPUT(email, url, number, range, DatePicker, search, color)
HTML5 拥有多个可供选取日期和时间的新输入类型：

date - 选取日、月、年
month - 选取月、年
week - 选取周和年
time - 选取时间（小时和分钟）
datetime - 选取时间、日、月、年（UTC 时间）
datetime-local - 选取时间、日、月、年（本地时间
function '<keygen />'生成密钥对（公钥、私钥）



