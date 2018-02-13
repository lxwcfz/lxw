$(function(){
	var vm = new Vue({
		el:"#app",
		data:{
			imglist:[
				{"class":"flower th1","url":"../img/th.png"},
				{"class":"flower th2","url":"../img/th.png"},
				{"class":"flower th3","url":"../img/th.png"},
				{"class":"flower th4","url":"../img/th.png"},
				{"class":"flower th5","url":"../img/th.png"},
				{"class":"flower th6","url":"../img/th.png"},
				{"class":"flower sx1","url":"../img/xysx.png"},
				{"class":"flower sx2","url":"../img/xysx.png"},
				{"class":"flower sx3","url":"../img/xysx.png"},
				{"class":"flower sx4","url":"../img/xysx.png"},
				{"class":"flower sx5","url":"../img/xysx.png"},
				{"class":"flower sx6","url":"../img/xysx.png"},
				{"class":"flower bh1","url":"../img/bbh.png"},
				{"class":"flower bh2","url":"../img/bbh.png"},
				{"class":"flower bh3","url":"../img/bbh.png"},
				{"class":"flower bh4","url":"../img/bbh.png"},
				{"class":"flower bh5","url":"../img/bbh.png"},
				{"class":"flower bh6","url":"../img/bbh.png"},
				{"class":"flower rose1","url":"../img/rose.png"},
				{"class":"flower rose2","url":"../img/rose.png"},
				{"class":"flower rose3","url":"../img/rose.png"},
				{"class":"flower rose4","url":"../img/rose.png"},
				{"class":"flower rose5","url":"../img/rose.png"},
				{"class":"flower rose6","url":"../img/rose.png"},
				{"class":"start","url":"../img/btn_start.png"},
				// {"class":"n n1","url":"../img/next.png"},
				// {"class":"n n2","url":"../img/next.png"},
				// {"class":"n n3","url":"../img/next.png"},
				// {"class":"n n4","url":"../img/next.png"},
				// {"class":"n n5","url":"../img/next.png"},
				// {"class":"n n6","url":"../img/next.png"},
				// {"class":"n n7","url":"../img/next.png"},
				// {"class":"n n8","url":"../img/next.png"},
				// {"class":"n n9","url":"../img/next.png"},
				// {"class":"n n10","url":"../img/next.png"},
				// {"class":"n n11","url":"../img/next.png"},
				// {"class":"n n12","url":"../img/next.png"},
				// {"class":"n n13","url":"../img/next.png"},
				// {"class":"n n14","url":"../img/next.png"},
				// {"class":"n n15","url":"../img/next.png"},
				// {"class":"n n16","url":"../img/next.png"},
				// {"class":"n n17","url":"../img/next.png"},
				// {"class":"n n18","url":"../img/next.png"},
				// {"class":"n n19","url":"../img/next.png"},
				// {"class":"n n20","url":"../img/next.png"},
				// {"class":"n n21","url":"../img/next.png"},
				{"class":"n n22","url":"../img/next.png"},
				{"class":"n n23","url":"../img/next.png"},
				{"class":"n n24","url":"../img/next.png"},
				{"class":"n n25","url":"../img/next.png"},
				{"class":"n n26","url":"../img/next.png"},
				{"class":"n n27","url":"../img/next.png"},
				{"class":"n n28","url":"../img/next.png"},
				{"class":"n n29","url":"../img/next.png"},
				{"class":"n n30","url":"../img/next.png"},
				{"class":"n n31","url":"../img/next.png"},
				{"class":"n n32","url":"../img/next.png"},
				{"class":"n n33","url":"../img/next.png"},
				{"class":"n n34","url":"../img/next.png"},
				{"class":"n n35","url":"../img/next.png"},
				{"class":"n n36","url":"../img/next.png"},
				{"class":"pig","url":"../img/piggie.png"},
				{"class":"dog","url":"../img/doggie.png"},
				{"class":"bike","url":"../img/bike.png"},
				{"class":"bikeright","url":"../img/bikeright.png"},
				{"class":"fat","url":"../img/fat.png"},
				{"class":"bare","url":"../img/bare.png"},
				{"class":"icecream","url":"../img/icecream.png"},
				{"class":"heart","url":"../img/heart.gif"},
				{"class":"trumpet","url":"../img/trumpet.png"},
				{"class":"play","url":"../img/play.png"},
				{"class":"xgll","url":"../img/xgll.png"},
				{"class":"zjj","url":"../img/zjj.png"},
				{"class":"flls","url":"../img/flls.png"},
				{"class":"flash","url":"../img/flash.gif"},
				{"class":"together","url":"../img/together.png"},
				{"class":"aiya","url":"../img/aiya.png"},
				{"class":"thinkagain","url":"../img/thinkagain.png"},
				{"class":"yeah","url":"../img/yeah.png"}
			],
			plist:[
				{"class":"p1","text":"那天，我们在马原课初次相遇"},
				{"class":"p2","text":"千万分之一的机会让我们相聚"},
				{"class":"p3","text":"慢慢地，我开始变得积极"},
				{"class":"p4","text":"而你也不会经常生气"},
				{"class":"p5","text":"因为你有了可以倾诉的我"},
				{"class":"p6","text":"我有了可以思念的你"},
				{"class":"p7","text":"我们的甜蜜瞬间很多"},
				{"class":"p8","text":"小吵小闹也不少"},
				{"class":"p9","text":"生活因为彼此的出现变得多姿多彩"},
				{"class":"p10","text":"甜蜜时光一天天过去了"},
				{"class":"p11","text":"你在我的心中种下了一棵小树苗"},
				{"class":"p12","text":"我们的牵手和拥抱"},
				{"class":"p13","text":"是小树苗的养分"},
				{"class":"p14","text":"在我们的呵护下，它茁壮成长"},
				{"class":"p15","text":"不断增加你在我心中的分量"},
				{"class":"p16","text":"我们已经走过100多个晨夕"},
				{"class":"p17","text":"每个晚安在我的心头难以忘记"},
				{"class":"p18","text":"我们都渐渐习惯了彼此的存在"},
				{"class":"p19","text":"爱情让我们无法分开"},
				{"class":"p20","text":"我也愿意沉迷"},
				{"class":"p21","text":"一定会不离不弃"},
				{"class":"p22","text":"和妹妹永远在一起"},
				{"class":"p23","text":"亲爱的，我爱你"},
				{"class":"p24","text":"小宝贝，情人节快乐"}
			],
			sec:{
				"select":[
					{"class":"select1",
					"option":[
							{"t":""},
							{"t":"草莓味的屎"},
							{"t":"芒果味的屁"},
							{"t":"辣条味的尿"},
							{"t":"babie's saliva"}
						]
					},
					{"class":"select2",
					"option":[
							{"t":""},
							{"t":"1元"},
							{"t":"2元"},
							{"t":"0元"},
							{"t":"不知道"}
						]
					},
					{"class":"select3",
					"option":[
							{"t":""},
							{"t":"巴雷特狙击步枪"},
							{"t":"勃朗宁"},
							{"t":"迫击炮"},
							{"t":"毛瑟手枪"}
						]
					},
					{"class":"select4",
					"option":[
							{"t":""},
							{"t":"摩洛哥"},
							{"t":"摩纳哥"},
							{"t":"梵蒂冈"},
							{"t":"阿联酋"}
						]
					},
					{"class":"select5",
					"option":[
							{"t":""},
							{"t":"霍华德"},
							{"t":"詹姆斯"},
							{"t":"波波维奇"},
							{"t":"约翰沃尔"}
						]
					},
				]
			},
			song:[
				{
					"class":"finally by",
					"title":"终于等到你",
				},
				{
					"class":"onlylove",
					"title":"only love",
				},
				{
					"class":"wait",
					"title":"waiting for you",
				}
			],
			resbtn:[
				{"class":"res"},
				{"class":"ress1"},
				{"class":"ress2"},
				{"class":"ress3"},
				{"class":"ress4"},
				{"class":"ress5"},
			],
			closebtn:[
				{"class":"closebtn1"},
				{"class":"closebtn2"},
				{"class":"closebtn3"},
				{"class":"closebtn4"},
				{"class":"closebtn5"},
			]
		}
	});
	$(".startwindow button").click(function(){
		$(".hide,.startwindow").hide();
		$(".coordinate").delay(500).animate({top:".96rem"},1000)
	});
	/*喇叭*/
	function reset(){
		var ptop = -($(".player").find("button").length * 0.4 + ($(".player").find("button").length) * 0.06)+"rem";
		var rtop = -(parseFloat(ptop)+0.01)+"rem";
		$(".player").css("top",ptop);
		$(".recup").css("top",rtop);
	}
	reset();
	$(".trumpet").click(function(){
		$(".audio").get(0).pause();
		$(this).hide();
		$(".play").show();
	});
	$(".play").click(function(){
		$(this).hide();
		$(".audio").get(0).play();
		$(".trumpet").show();
	});
	var ptop = $(".player").css("top");
	$(".recup").click(function(){
		if($(".player").css("top") == ptop){
			$(".recup").css("transform","rotate(180deg)");
			$(".player").animate({top:"0"},1000)
		}else{
			$(".recup").css("transform","rotate(0deg)");
			$(".player").animate({top:ptop},1000)
		}
	});
	$(".player button").click(function(){
		$(this).removeClass("by");
		var song = $(this).attr("class");
		$("audio").attr("src","../music/"+song+".mp3");
		$(".player button").removeClass("by");
		$(this).addClass("by");
	})
	/*底部栏*/
	$(".cbtn").click(function(){
		$(".pp,.bb,.dd,.hh").hide();
		$(this).find("img").show();
		$(".hide,.ask").show();
	});
	$(".ask .yes").click(function(){
		$(".ask").hide();
		$(".aiya").show();
	});
	$(".aiya,.yeah").click(function(){
		$(".hide").hide();
		$(this).hide();
	});
	$(".thinkagain").click(function(){
		$(this).hide();
	});
	$(".ask .no").click(function(){
		$(".res").show();
		$(".ask").hide();
	})
	$(".res").click(function(){
		$(this).hide();
		$(".ask").show();
	})
	$(".c1").click(function(){
		$(".ask img").css("height","60%");
		$(".ask img").attr("src","../img/pig.png");
		$(".ask p").text("你是不是臭猪？");
		$(".res").text("你要面对现实！（点一下）");
	});
	$(".c2").click(function(){
		$(".ask img").css("height","60%");
		$(".ask img").attr("src","../img/dog.png");
		$(".ask p").text("你是不是最爱哥哥的狗狗？");
		$(".res").text("你能不违背自己的内心吗？");
	});
	$(".c3").click(function(){
		$(".ask img").css("height","60%");
		$(".ask img").attr("src","../img/baby.png");
		$(".ask p").text("哥哥是你的宝宝吗？");
		$(".res").text("那你是哥哥的宝宝");
	});
	$(".c4").click(function(){
		$(".ask img").css("height","100%");
		$(".ask img").attr("src","../img/bro.png");
		$(".ask p").text("你是不是最喜欢哥哥这个坏蛋了？");
		$(".res").text("哥哥再坏对你也只有爱");
	})
	/*首页*/
	$(".btn").click(function(){
		$(".window,.hide").show();
		$(".window button").hide();
	});
	$(".ress1,.ress2,.ress3,.ress4,.ress5").click(function(){
		$(this).hide();
	});
	$(".ress1").click(function(){
		if($(this).text() == "恭喜你，首战告捷，进入下一关吧"){
			$(".yeah").show();
			$(".window").hide();
			$(".start").addClass("startt1");
			if($(".start").attr("class") == "start startt1"){
				$(".coordinate").animate({top:".8rem",left:"2.4rem"},1000);
			};
		}
	});
	$(".ress2").click(function(){
		if($(this).text() == "不错不错，再接再厉"){
			$(".yeah").show();
			$(".window").hide();
			$(".start").addClass("startt2");
			if($(".start").attr("class") == "start startt1 startt2"){
				$(".coordinate").animate({top:"2.16rem",left:"2.8rem"},1000);
			};
		}
	});
	$(".ress3").click(function(){
		if($(this).text() == "这么轻松？不愧是我的宝宝"){
			$(".yeah").show();
			$(".window").hide();
			$(".start").addClass("startt3");
			if($(".start").attr("class") == "start startt1 startt2 startt3"){
				$(".coordinate").animate({top:"3.9rem",left:"2.4rem"},1000);
			};
		}
	});
	$(".ress4").click(function(){
		if($(this).text() == "还差最后一关哦，加油，么么哒"){
			$(".yeah").show();
			$(".window").hide();
			$(".start").addClass("startt4");
			if($(".start").attr("class") == "start startt1 startt2 startt3 startt4"){
				$(".coordinate").animate({top:"1.8rem",left:"1.65rem"},1000);
			};
		}
	});
	$(".ress5").click(function(){
		if($(this).text() == "哈哈哈，不容易啊，小宝贝，通关啦，点击隐藏按钮欣赏吧，仔细寻找哦"){
			$(".window,.hide").hide();
			$(".start").addClass("startt5");
			$(".realflag").hide(500);
			$(".coordinate .role").delay(500).animate({width:"2.4rem"},500);
			$(".coordinate .role").delay(1600).animate({width:"0"},500);
			setInterval(function(){
				trans();
			},1);
		}
	});
	function trans(){
		if(parseFloat($(".coordinate .role").css("width")) > "160"){
			$(".role").attr("src","../img/cool.png");
		}else{
			$(".role").attr("src","../img/flag.png");
		};
	};
	$(".btn1").click(function(){
		$(".window .title").text("欢迎来到猪猪历险记，第一关");
		$(".window .desc").text("哥哥最喜欢吃什么？");
		$(".window select").hide();
		$(".window .select1,.closebtn1,.btn2").show();
	});
	$(".closebtn1").click(function(){
		if($(".select1").val() == "babie's saliva"){
			$(".ress1").show();
			$(".ress1").text("恭喜你，首战告捷，进入下一关吧");
		}else{
			$(".ress1").show();
			$(".ress1").text("你才喜欢吃，哈哈哈");
			$(".thinkagain,.hide").show();
		}
	});
	$(".btn2").click(function(){
		$(".window .title").text("第二关");
		$(".window .desc").text("一个人花8元买只鸡，9元卖出去，10元买回来，11元再卖出去，请问他赚了多少");
		$(".window select").hide();
		$(".window .select2,.closebtn2,.btn3").show();
	});
	$(".closebtn2").click(function(){
		if($(".select2").val() == "1元"){
			$(".ress2").show();
			$(".ress2").text("不错不错，再接再厉");
		}else{
			$(".ress2").show();
			$(".ress2").text("错啦，你这坨猪");
			$(".thinkagain,.hide").show();
		}
	});
	$(".btn3").click(function(){
		$(".window .title").text("第三关");
		$(".window .desc").text("下列武器，哥哥最喜欢什么");
		$(".window select").hide();
		$(".window .select3,.closebtn3,.btn4").show();
	});
	$(".closebtn3").click(function(){
		if($(".select3").val() == "毛瑟手枪"){
			$(".ress3").show();
			$(".ress3").text("这么轻松？不愧是我的宝宝")
		}else{
			$(".ress3").show();
			$(".ress3").text("本来只是能猜一次的，不过考虑到你太笨了，再给你机会吧");
			$(".thinkagain,.hide").show();
		}	
	});
	$(".btn4").click(function(){
		$(".window .title").text("第四关");
		$(".window .desc").text("下列国家哪个最穷");
		$(".window select").hide();
		$(".window .select4,.closebtn4,.btn5").show();
	});
	$(".closebtn4").click(function(){
		if($(".select4").val() == "摩洛哥"){
			$(".ress4").show();
			$(".ress4").text("还差最后一关哦，加油，么么哒")
		}else{
			$(".ress4").show();
			$(".ress4").text("小猪猪太丢人了吧，不会百度吗");
			$(".thinkagain,.hide").show();
		}	
	});
	$(".btn5").click(function(){
		$(".window .title").text("最后一关");
		$(".window .desc").text("Jig Saw中幕后黑手最像NBA中哪位人物");
		$(".window select").hide();
		$(".window .select5,.closebtn5").show();
	});
	$(".closebtn5").click(function(){
		if($(".select5").val() == "波波维奇"){
			$(".ress5").show();
			$(".ress5").text("哈哈哈，不容易啊，小宝贝，通关啦，点击隐藏按钮欣赏吧，仔细寻找哦")
		}else{
			$(".ress5").show();
			$(".ress5").text("对于你这种笨宝宝，其实应该设计成:错了就从首关开始");
			$(".thinkagain,.hide").show();
		}	
	});
	/*开始*/
	$(".start").click(function(){
		if($(this).attr("class") == "start startt1 startt2 startt3 startt4 startt5"){			
			$(".bg").animate({left:"3.75rem"},1000);
			$(".pig").delay(1000).animate({"left":"1.3rem"},1000);
			$(".dog").delay(1000).animate({"left":"1.9rem"},1000);
			$(".btn").hide();
			$(".flower,.hideright,.hideleft,.cbtn").show();
			$(this).toggle(2000);
		}
	});
	/*第二步*/
	$(".n36").click(function(){
		if(!$("#app").is("animated")){
			$(".th1,.th2,.th3,.bh1,.bh2,.bh3").animate({"left":"-=3.85rem"},2000);
			$(".rose1,.rose2,.rose3").animate({"left":"-=3.87rem"},1200);
			$(".sx1,.sx2,.sx3").animate({"left":"-=3.9rem"},1200);
			$(".rose4,.rose5,.rose6,.bh4,.bh5,.bh6").animate({"right":"-=3.87rem"},2000);
			$(".sx4,.sx5,.sx6").animate({"right":"-=3.77rem"},1200);
			$(".th4,.th5,.th6").animate({"right":"-=3.85rem"},1200);
			$(".n36").hide();
		}
	});
	/*第三步*/
	$(".n35").one("click",function(){
		if(!$("#app").is("animated")){
			$(".flash").toggle(1000);
			$(".flash").delay(2000).toggle(1000);
			$(".heart").delay(3000).toggle(1000);
			$(".n35").hide();
		}
	});
	/*第四步*/
	function fadd(){
		$(".th1,.th2,.th3,.bh1,.bh2,.bh3").animate({"left":"+=3.85rem"},2000);
		$(".rose1,.rose2,.rose3").animate({"left":"+=3.87rem"},1200);
		$(".sx1,.sx2,.sx3").animate({"left":"+=3.9rem"},1200);
		$(".rose4,.rose5,.rose6,.bh4,.bh5,.bh6").animate({"right":"+=3.87rem"},2000);
		$(".sx4,.sx5,.sx6").animate({"right":"+=3.77rem"},1200);
		$(".th4,.th5,.th6").animate({"right":"+=3.85rem"},1200);
	};
	function fmin(){
		$(".th1,.th2,.th3,.bh1,.bh2,.bh3").animate({"left":"-=3.85rem"},2000);
		$(".rose1,.rose2,.rose3").animate({"left":"-=3.87rem"},1200);
		$(".sx1,.sx2,.sx3").animate({"left":"-=3.9rem"},1200);
		$(".rose4,.rose5,.rose6,.bh4,.bh5,.bh6").animate({"right":"-=3.87rem"},2000);
		$(".sx4,.sx5,.sx6").animate({"right":"-=3.77rem"},1200);
		$(".th4,.th5,.th6").animate({"right":"-=3.85rem"},1200);
	};
	function rolereset(){
		$(".pig").animate({left:"1.3rem",top:".02rem"},1000);
		$(".dog").animate({left:"1.9rem",top:"0"},1000);
	};
	$(".n34").one("click",function(){
		if(!$("#app").is("animated")){
			$(".p1").animate({left:"0"},1000);
			$(".p2").delay(2000).animate({top:"2.4rem"},1000);
			$(".p3").delay(4000).animate({left:"0"},1000);
			$(".p4").delay(6000).animate({bottom:"3.91rem"},1000);
			$(".bare").delay(7000).animate({left:".3rem"},1000);
			$(".icecream").delay(8000).animate({top:"3rem"},1000);
			$(".fat").delay(9000).animate({left:"2.4rem"},1000);
			$(".n34").hide();
		}
	});
	$(".n33").one("click",function(){
		if(!$("#app").is("animated")){
			$(".n33").hide();
			$(".p1,.p2,.p3,.p4,.bare,.icecream,.fat").fadeOut(1000);
			fadd();
		}
	});
	$(".n32").one("click",function(){
		if(!$("#app").is("animated")){
			$(".n32").hide();
			$(".p5").animate({left:"0"},1000);
			$(".p6").delay(2000).animate({top:"2.4rem"},1000);
			$(".p7").delay(4000).animate({left:"0"},1000);
			$(".p8").delay(6000).animate({bottom:"3.91rem"},1000);
			fmin();
		}
	});
	$(".n31").one("click",function(){
		if(!$("#app").is("animated")){
			$(".n31").hide();
			$(".flower").toggle(1000);
			$(".xgll").animate({left:"0"},1000);
			$(".bike").delay(1000).animate({left:"0"},1000);
			$(".pig").delay(2000).animate({left:".06rem",top:"3.5rem"},1000);
			$(".dog").delay(2000).animate({left:".6rem",top:"3.4rem"},1000);
			$(".dog,.pig").delay(2000).animate({left:"+=3.75rem"},2000);
			$(".bike").delay(3000).animate({left:"+=3.75rem"},2000);
		}
	});
	$(".n30").one("click",function(){
		if(!$("#app").is("animated")){
			$(".n30").hide();
			$(".p5,.p6,.p7,.p8,.flower").toggle(1000);
			rolereset();
		}
	});
	$(".n29").one("click",function(){
		if(!$("#app").is("animated")){
			$(".n29").hide();
			fadd();
			$(".p9").animate({left:"0"},1000);
			$(".zjj").animate({left:"0"},1000);
			$(".p10").delay(2000).animate({top:"2.4rem"},1000);
			$(".p11").delay(4000).animate({left:"0"},1000);
			$(".p12").delay(6000).animate({bottom:"3.91rem"},1000);
		}
	});
	$(".n28").one("click",function(){
		if(!$("#app").is("animated")){
			$(".bikeright").animate({left:"2.59rem"},1000);
			$(".dog").animate({left:"3.2rem",top:"3.4rem"},1000);
			$(".pig").animate({left:"2.6rem",top:"3.5rem"},1000);
			$(".pig,.dog").delay(1000).animate({left:"-=3.75rem"},2000);
			$(".bikeright").delay(1000).animate({left:"-=3.75rem"},2000);
			$(".p9,.p10,.p11,.p12").toggle(1000);
			$(".n28").hide();
		}
	});	
	$(".n27").one("click",function(){
		if(!$("#app").is("animated")){
			$(".n27").hide();
			fmin();
			rolereset();
			$(".p13").animate({left:"0"},1000);
			$(".p14").delay(2000).animate({top:"2.4rem"},1000);
			$(".p15").delay(4000).animate({left:"0"},1000);
			$(".p16").delay(6000).animate({bottom:"3.91rem"},1000);
		}
	})
	$(".n26").one("click",function(){
		if(!$("#app").is("animated")){
			$(".n26").hide();
			$(".flower").toggle(1000);
			$(".p17").animate({left:"0"},1000);
			$(".p18").delay(2000).animate({top:"2.4rem"},1000);
			$(".p19").delay(4000).animate({left:"0"},1000);
			$(".p20").delay(6000).animate({bottom:"3.91rem"},1000);
		}
	});
	$(".n25").one("click",function(){
		if(!$("#app").is("animated")){
			$(".n25").hide();
			$(".flower").toggle(1000);
			$(".flls").animate({left:"0"},1000);
			$(".bike").delay(1000).animate({left:"0"},1000);
			$(".pig").delay(2000).animate({left:".06rem",top:"3.5rem"},1000);
			$(".dog").delay(2000).animate({left:".6rem",top:"3.4rem"},1000);
			$(".dog,.pig").delay(2000).animate({left:"+=3.75rem"},2000);
			$(".bike").delay(3000).animate({left:"+=3.75rem"},2000);
		}
	});
	$(".n24").one("click",function(){
		if(!$("#app").is("animated")){
			$(".n24").hide();
			$(".flower").toggle(1000);
			$(".p17").animate({left:"0"},1000);
			$(".p18").delay(2000).animate({top:"2.4rem"},1000);
			fadd();
			$(".p19").delay(4000).animate({left:"0"},1000);
			$(".p20").delay(6000).animate({bottom:"3.91rem"},1000);
		}
	});
	$(".n23").one("click",function(){
		if(!$("#app").is("animated")){
			$(".n23").hide();
			fmin();
			$(".p21").animate({left:"0"},1000);
			$(".p22").delay(2000).animate({top:"2.4rem"},1000);
			$(".p23").delay(4000).animate({left:"0"},1000);
			$(".p24").delay(6000).animate({bottom:"3.91rem"},1000);
		}
	});
	$(".n22").one("click",function(){
		if(!$("#app").is("animated")){
			$(".n22").hide();
			rolereset();
			$(".xgll").animate({left:"+=3.75rem"},1000);
			$(".zjj").animate({left:"-=3.75rem"},1000);
			$(".flls").animate({top:"+=5rem"},1000);
			$(".together").delay(1000).fadeIn(1000);
			$(".flash").delay(1000).toggle(1000);
			$(".p23").delay(3000).animate({top:"+=.3rem"},500);
			$(".p23").css("z-index","100000");
		}
	})
	/*最后一步*/
})