var tem = 35;
var hum = 'null';
var flag = 1;
var coor = 0;
var para = 1; 
var ing = 0;
var dict = [];
function voidJob(e) {
	go(e);
}
function go(e) {
	e.target.innerHTML = e.target.innerHTML == "实时监测" ? '监测中...' : '实时监测';
	ing = e.target.innerHTML == "实时监测" ? 0 : 1;
	if(ing == 1) updateData();
};
function updateData() {

	let step = document.getElementsByClassName('switch')[0].getElementsByTagName('span')[0].innerHTML;
	let alltimer = setInterval( function() {
		// fetch('/data',{
		// 	headers: {
		// 		'Content-Type': "application/json"
		// 	},
		// 	method: "GET"
		// }).then( (res) => {
		// 	if(res.ok) {
		// 		res.json().then( (data) => {
		// 			tem = data.data.tem;
		// 		})
		// 	}
		// }).catch( (e) => {
		// 	console.log(e);
		// });
		tem = Math.floor(Math.random() * 10) >= 4 ? 40 : Math.floor(Math.random() * 100);
		third();
		if(document.getElementsByClassName('switch')[0].getElementsByTagName('span')[0].innerHTML !== step) {
			clearInterval(alltimer);
			updateData();
		};
		var div = document.createElement("div");
		var p1 = document.createElement("p");
		var p2 = document.createElement("p");
		var p3 = document.createElement("p");
		let father = document.getElementsByClassName('data')[0];
		div.appendChild(p1);
		div.appendChild(p2);
		div.appendChild(p3);
		father.appendChild(div);
		showBar();
		// console.log(father)
		let divs = father.getElementsByTagName("div");
		let ps = divs[divs.length - 1].getElementsByTagName('p');
		let hour = new Date().getHours().toString().length == 1 ? `0${new Date().getHours()}` : new Date().getHours();
		let min = new Date().getMinutes().toString().length == 1 ? `0${new Date().getMinutes()}` : new Date().getMinutes();
		let sec = new Date().getSeconds().toString().length == 1 ? `0${new Date().getSeconds()}` : new Date().getSeconds();
		ps[0].innerHTML = hour + ':' + min + ':' + sec;
		ps[1].innerHTML = `温度：${tem}`;
		ps[2].innerHTML = `湿度：${hum}`;
		showTime();
		upgradeCv(hour,min,sec);
		if(hum == 'null') ps[2].remove();
		let i = 1;
		let timer = setInterval( function() {
			father.scrollTop += 10;
			i += 1;
			// console.log(father.scrollTop,father.scrollHeight)
			if(father.scrollTop == father.scrollHeight || i == 9) {
				father.scrollTop = father.scrollHeight;
				clearInterval(timer);
			}
		},100);
		if(ing == 0) clearInterval(alltimer);
	},step);
};
function upgradeCv(hour,min,sec) {
	let newData = {
		x: hour + ':' + min + ':' + sec,
		y: tem
	};
	dict.push(newData);
	if(dict.length > 5) dict.splice(0,1);
	console.log(dict);
	//数据源提取
	var len = dict.length;
	var xArr = [], yArr = [], tmp_yArr = [];
	for(var i=0; i<len; i++){
		xArr.push(i * 60);
		tmp_yArr.push(dict[i].y);
	}
	var tmp_minY = Math.min.apply(Math, tmp_yArr);//最小值
	var tmp_maxY = Math.max.apply(Math, tmp_yArr);//最大值
	if(tmp_maxY - tmp_minY <= 100){
		for(var i=0; i<len; i++){
			yArr.push(tmp_yArr[i] - tmp_minY + 50);//与最小的做比较
		}
	}else{//如果相差太大会导致图表不美观
		for(var i=0; i<len; i++){
			yArr.push(tmp_yArr[i] / 500);
		}
	};
	var minY = Math.min.apply(Math, yArr);
	var maxY = Math.max.apply(Math, yArr);
	//canvas 准备
	var canvas = document.getElementById("cv");//获取canvas画布
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0,0,300,150);
	//画折线
	for(var i=0 ;i<len; i++){
		var x = xArr[i] + 20;
		var y = maxY - yArr[i] + minY;
		if(i === 0){
			ctx .moveTo(x, y);
		}else{
	  		ctx .lineTo(x, y);
		}
	};
	ctx .stroke();
	//画点
	for(var i=0; i<len; i++){
		var x = xArr[i] + 20;
		var y = maxY - yArr[i] + minY;
		var xMemo = dict[i].x;
		var yMemo = `${dict[i].y}℃`;
		ctx.beginPath();
		ctx.fillStyle = "#000";
		ctx.arc(x, y, 2, 0, 2*Math.PI);//画点
		ctx.fill();
		ctx.fillText(yMemo, x + 3, y - 10);
		ctx.fillText(xMemo, x - 15, canvas.height - 10, 40);//画文字
	}
};
function changeValue() {
	if(document.getElementsByClassName('switch')[0].getElementsByTagName('input')[0].value < 2000) document.getElementsByClassName('switch')[0].getElementsByTagName('input')[0].value = 2000;
	document.getElementsByClassName('switch')[0].getElementsByTagName('span')[0].innerHTML = document.getElementsByClassName('switch')[0].getElementsByTagName('input')[0].value;
};
function showBar() {
	let barF = document.getElementsByClassName('barCon')[0];
	let bar = document.createElement('div');
	bar.setAttribute('class', 'bar');
	let span = document.createElement('span');
	let p = document.createElement('p');
	bar.appendChild(span);
	bar.appendChild(p);
	if(barF.childNodes.length == 5) {
		// console.log(barF.childNodes.length)
		barF.removeChild(barF.childNodes[0])
	};
	barF.appendChild(bar);
	barGo(barF.getElementsByTagName('div')[barF.getElementsByTagName('div').length -1].getElementsByTagName('p')[0]);
};
function showTime() {
	let x = document.getElementsByClassName('x_axis')[0];
	let span = document.createElement('span');
	if(x.childNodes.length == 5) {
		x.removeChild(x.childNodes[0])
	};
	x.appendChild(span);
	let ff = document.getElementsByClassName('data')[0];
	let child = ff.childNodes[ff.childNodes.length - 1].childNodes[0];
	x.childNodes[x.childNodes.length - 1].innerHTML = child.innerHTML;
}
function start () {
	var key = document.getElementsByClassName('btn_start')[0];
	switch (flag) {
		case 1: 
			let i = 1;
			let timer = setInterval( function() {
				key.style.left = `${0.9*i}%`;
				key.style.top = `${1*i}%`;
				key.style.marginTop = `${0.72 * i}px`;
				key.style.marginLeft = `${-1.4*i}px`;
				key.style.transform = `rotate(${7.3*i}deg)`;
				i += 1;
				if( i == 51 ) {
					clearInterval(timer);
					flag = 2;
				};
			},20);
		break;
		case 2: 
			let a = 1;
			key.style.width = "120px";
			let timer2 = setInterval( function() {
				key.style.marginLeft = `${(2.5 * a)-70}px`;
				key.style.marginTop = `${0.8 * a + 36}px`;
				key.style.width = parseFloat(key.style.width) - 2.4 + 'px';
				a += 1;
				if( a == 51 ) {
					clearInterval(timer2);
					flag = 3;
				};
			},20);
			setTimeout( function() {
				let lock = document.getElementsByClassName('lock')[0];
				let b = 1;
				let timer3 = setInterval( function() {
					let x = b%2 == 0 ? 1 : -1;
					lock.style.transform = `rotate(${x * 30}deg)`;
					b += 1;
					if(b == 6) {
						lock.style.transform = `rotate(0deg)`;
						lock.setAttribute('src',"unlock.png");
						clearInterval(timer3);
						setTimeout( function() {
							let c = 1;
							let timer4 = setInterval( function() {
								lock.style.opacity = `${ 1 - 0.1 * c}`;
								c += 0.5;
								if(lock.style.opacity == 0){
									clearInterval(timer4);
									let boy = document.getElementsByClassName('role')[0];
									let girl = document.getElementsByClassName('role')[1];
									boy.style.display = "block";
									girl.style.display = "block";
									let d = 1;
									let left = document.getElementsByClassName('left')[0];
									let right = document.getElementsByClassName('right')[0];
									let timer5 = setInterval( function() {
										left.style.left = `${d * -6}px`;
										right.style.right = `${d * -6}px`;
										boy.style.marginLeft = `${d * -6}px`;
										girl.style.marginLeft = `${d * 6 - 120}px`;
										d += 1;
										if(parseInt(left.style.left) <= -700) {
											document.getElementsByClassName('doorCon')[0].style.display = "none";
											clearInterval(timer5);
											second();
											// document.getElementsByClassName('showModel')[0].style.display = "flex";
										};
									},20);
								}
							},60)
						},1000);
					};
				},300)
			},1000)
		break;
	};
};
function second() {
	// let i = 1;
	// let obj = document.getElementsByClassName('showModel')[0].getElementsByTagName('div')[0];
	// let font = obj.getElementsByTagName('p')[0];
	// let btn = obj.getElementsByTagName('button')[0];
	// obj.style.width = '400px';
	// obj.style.height = '300px';
	// let timer = setInterval( function() {
	// 	obj.style.width = parseInt(obj.style.width) - i * 2 +'px'; 
	// 	obj.style.height = parseInt(obj.style.height) - i + 'px'; 
	// 	let para = 1-(i * 0.05);
	// 	if(para == 0){
	// 		font.style.display = "none";
	// 		btn.style.display = "none";
	// 	};
	// 	font.style.transform = `scale(${1-(i * 0.05)},${1-(i * 0.05)})`;
	// 	btn.style.transform = `scale(${1-(i * 0.05)},${1-(i * 0.05)})`;
	// 	i += 1;
	// 	if(parseInt(obj.style.width) <= 0 || parseInt(obj.style.height) <= 0) {
	// 		clearInterval(timer);
	// 		obj.parentNode.style.display = "none";
			let boy = document.getElementsByClassName('btn_go')[0];
			let girl = document.getElementsByClassName('btn_back')[0];
			boy.style.opacity = girl.style.opacity = 0;
			let a = 1;
			let timer2 = setInterval( function() {
				boy.style.opacity = 0.01 * a;
				girl.style.opacity = 0.01 * a;
				a += 1;
				if(boy.style.opacity == 1) clearInterval(timer2);
			},20)
		// }
	//},50)
};
function barGo(obj) {
	obj.style.height = "0px";
	let timer = setInterval( function() {
		obj.style.height = parseFloat(obj.style.height) + (25*tem/7)/10 +'px';
		if(parseFloat(obj.style.height) >= (25*tem/7)) {
			clearInterval(timer);
			obj.style.height = (25*tem/7) + 'px';
		}
	},100)
};
function third() {
	let scroll = document.getElementsByClassName('img_con')[0].getElementsByTagName('span')[0];
	if(coor == 0){
		coor = 1;
		scroll.style.height = "0px";
		let a = 1;
		let i = 1;
		let timer1 = setInterval( function() {
			scroll.style.height = parseInt(scroll.style.height) + 5 + 'px';
			a += 1;
			if(parseInt(scroll.style.height) >= 140 || para == 0) {
				clearInterval(timer1);
				let addheight = (tem/10) * 40;
				let timer = setInterval( function() {
					document.getElementsByClassName('container')[0].getElementsByTagName('p')[0].innerHTML = i;
					scroll.style.height = parseInt(scroll.style.height) + 4 + 'px';
					i += 1;
					if (i >= parseInt(tem)) {
						clearInterval(timer);
						para = 0;
						document.getElementsByClassName('container')[0].getElementsByTagName('p')[0].innerHTML = tem;
						scroll.style.height = 140 + addheight + 'px';
					}
				},100);
			}
		},10);
	}else if(para == 0){
		// console.log(tem);
		document.getElementsByClassName('container')[0].getElementsByTagName('p')[0].innerHTML = tem;
		scroll.style.height = 140 + (tem/10) * 40 + 'px';
	};
};
// function black() {
// 	let i = 1;
// 	let obj = document.getElementsByClassName('btn_go')[0];
// 	if(obj.style.left == '80%'){
// 		let timer = setInterval( function() {
// 			obj.style.left = parseFloat(obj.style.left) - 0.2 + '%';
// 			obj.style.transform = `rotate(${-16.2 * i}deg)`;
// 			i = i + 1;
// 			if(parseInt(obj.style.left) == 48) {
// 				clearInterval(timer);
// 				let a = 1;
// 				obj.style.width = '120px';
// 				let timer2 = setInterval( function() {
// 					obj.style.width = parseInt(obj.style.width) + 1 + 'px';
// 					a += 1;
// 					if(a == 50) {
// 						clearInterval(timer2);
// 						let b = 1;
// 						obj.style.width = '170px';
// 						let timer3 = setInterval( function() {
// 							obj.style.width = parseInt(obj.style.width) - 1 + 'px';
// 							b += 1;
// 							if(b == 50) {
// 								clearInterval(timer3);
// 								let timer4 = setInterval( function() {
// 									obj.style.left = parseFloat(obj.style.left) + 0.2 + '%';
// 									if(parseInt(obj.style.left) == 80) clearInterval(timer4);
// 								},16)
// 							}
// 						},50)
// 					}
// 				},50)
// 			}
// 		},18)
// 	};
// };
// function white() {
// 	let i = 1;
// 	let obj = document.getElementsByClassName('btn_back')[0];
// 	if(obj.style.left == '40%'){
// 		let timer = setInterval( function() {
// 			obj.style.left = parseFloat(obj.style.left) + 0.2 + '%';
// 			obj.style.transform = `rotateY(${12 * i}deg)`;
// 			i += 1;
// 			if(parseInt(obj.style.left) == 70) {
// 				clearInterval(timer);
// 				let a = 1;
// 				obj.style.width = '120px';
// 				let timer2 = setInterval( function() {
// 					obj.style.width = parseInt(obj.style.width) + 1 + 'px';
// 					a += 1;
// 					if(a == 50) {
// 						clearInterval(timer2);
// 						let b = 1;
// 						obj.style.width = '170px';
// 						let timer3 = setInterval( function() {
// 							obj.style.width = parseInt(obj.style.width) - 1 + 'px';
// 							b += 1;
// 							if(b == 51) {
// 								clearInterval(timer3);
// 								let timer4 = setInterval( function() {
// 									obj.style.left = parseFloat(obj.style.left) - 0.2 + '%';
// 									if(parseFloat(obj.style.left) == 40) clearInterval(timer4);
// 								},16)
// 							}
// 						},50)
// 					}
// 				},50)
// 			}
// 		},18)
// 	};
// };
// window.onload = function () {
// 	function check() {
// 		// console.log(document.documentElement.clientWidth);
// 		// document.getElementsByClassName('btn_go')[0].style.left = '80%';
// 		// let obj = document.getElementsByClassName('hide')[0];
// 		// document.getElementsByClassName('btn_back')[0].style.left = '40%';
// 		// obj.style.display = "none";
// 		// if(document.documentElement.clientWidth < 400){
// 		// 	obj.style.display = "block";
// 		// }
// 	};
// 	check();
// }