$(function(){
	/*AJAX*/
	// var x_csrf_token ='{{csrf_token()}}';
	// $.ajaxSetup({
 //    	headers: {
 //        	'X-CSRF-TOKEN': x_csrf_token,
 //    	}
	// });
	var vm = new Vue({
		el:"#app",
		data:{
			info:[
					{"class":"user_name","text":"姓名：","input_name":"user_name"},
					{"class":"user_phone","text":"联系电话：","input_name":"user_phone"}
			],
			birthinfo:[
				{"class":"birth_name","text":"郑涵"},
				{"class":"birth_num","text":"50"}
			],
			goodnum:[
				{"class":"good_num","text":"128"}
			],
			surinfo:[
				{"url":"../img/1.png","text":"惊喜惊喜惊喜惊喜惊喜"},
				{"url":"../img/1.png","text":"惊喜惊喜惊喜惊喜惊喜"}
			],
			hidemoreinfo:[
				{"url":"../img/1.png"}
			],
			date:{				
                	"month":[      
                		{"month":"","value":"0"},             
                        {"month":"01","value":"1"},
                        {"month":"02","value":"2"},
                        {"month":"03","value":"3"},
                        {"month":"04","value":"4"},
                        {"month":"05","value":"5"},
                        {"month":"06","value":"6"},
                        {"month":"07","value":"7"},
                        {"month":"08","value":"8"},
                        {"month":"09","value":"9"},
                        {"month":"10","value":"10"},
                        {"month":"11","value":"11"},
                        {"month":"12","value":"12"}
                    ],
	                "day":[
	                	{"day":""},
	                    {"day":"01"},
	                    {"day":"02"},
	                    {"day":"03"},
	                    {"day":"04"},
	                    {"day":"05"},
	                    {"day":"06"},
	                    {"day":"07"},
	                    {"day":"08"},
	                    {"day":"09"},
	                    {"day":"10"},
	                    {"day":"11"},
	                    {"day":"12"},
	                    {"day":"13"},
	                    {"day":"14"},
	                    {"day":"15"},
	                    {"day":"16"},
	                    {"day":"17"},
	                    {"day":"18"},
	                    {"day":"19"},
	                    {"day":"20"},
	                    {"day":"21"},
	                    {"day":"22"},
	                    {"day":"23"},
	                    {"day":"24"},
	                    {"day":"25"},
	                    {"day":"26"},
	                    {"day":"27"},
	                    {"day":"28"},
	                    {"day":"29"},
	                    {"day":"30"},
	                    {"day":"31"}
	                ]
            }
		},
		methods:{
			start: function(){
				var _this = this;
				$.ajax({
					url:"",
					type:"",
					data:{},
					dataType:"json",
					success: function(){
						if(data.error == "0"){
							_this.info = data.data.info;
							_this.birthinfo = data.data.birthinfo;
							_this.goodnum = data.data.goodnum;
							_this.surinfo = data.data.surinfo;
							_this.hidemoreinfo = data.data.hidemoreinfo;
						}
					},
					error: function(){
						console.log(error)
					}
				})
			},
			selectmonth: function(){
                var para = $(".select_year").val()%4;
                var a = $(".select_month").val();
                if(a == "2"){
                    $(".select_day").find("option").eq(30 + 1).remove();
                    $(".select_day").find("option").eq(29 + 1).remove();
                    $(".select_day").find("option").eq(28 + 1).remove();
                    if(para == "0"){
                        $(".select_day").find("option").eq(27 + 1).after("<option value='29'>29</option>");
                    }
                };
                if(a == "4"||a == "6"||a == "9"||a == "11"){
                    $(".select_day").find("option").eq(30 + 1).remove();
                };
            },
            resetmonth: function(){
                $(".select_day").find("option").eq(30 + 1).remove();
                $(".select_day").find("option").eq(29 + 1).remove();
                $(".select_day").find("option").eq(28 + 1).remove();
                $(".select_day").find("option").eq(27 + 1).after("<option value='29'>29</option>");
                $(".select_day").find("option").eq(28 + 1).after("<option value='30'>30</option>");
                $(".select_day").find("option").eq(29 + 1).after("<option value='31'>31</option>");
                $(".label_day,.select_day").show();
                // if($(".select_month").val() == "0"){
                //     $(".label_day,.select_day").hide();
                // };
            },
   //          startmonthcheck: function(){
			// 	if($(".select_year").val() == year){
			// 		if($(".select_month").val() < month){
			// 			alert("请选择正确月份")
			// 			$(".select_month").val(month);
			// 		}
			// 	}
			// },
			// startdaycheck: function(){
			// 	if($(".select_year").val() == year){
			// 		if($(".select_month").val() == month){
			// 			if($(".select_day").val() < day){
			// 				alert("请选择正确日期");
			// 				$(".select_day").val(day);
			// 			}
			// 		}	
			// 	}				
			// },
			cardopen: function(){
				$(".hide,.shadow").show();
			},
			cardclose1: function(){
				$(".hide,.shadow").hide();
			},
			cardclose: function(){
				if($(".hide div").eq(0).find("input").val() == ""){
					alert("请填写姓名");
			   	}else if($(".hide div").eq(1).find("input").val().length !== 11 || $(".hide div").eq(1).find("input").val() == ""){
						alert("请填写正确电话号码");
					}else if($(".hide .select_year").val() == ""){
					   		alert("请选择正确年份")
						}else if($(".hide .select_month").val() == ""){
								alert("请选择正确月份")
							}else if($(".hide .select_day").val() == ""){
									alert("请选择正确日期")
								}else{
										$(".hide,.shadow").hide();
									}
			},
			open: function(e){
				var i =1;
				var a = e + 1 ;
				$(".hide_img").hide();
				var timer = setInterval(function(){
					$(".rotate_img"+a+"").css({"transform":"rotateY("+i*5+"deg"+")"});
					i = i + 1;
					if(i == 72){
						$(".hide_img").eq(e).show();
						$(".rotaet_img").css("transform","0deg");
						clearInterval(timer)
					}
				},10)
			},
			// openhide_img: function(e){
			// 	if(!$(".hide_img").is("animated")){
			// 		if(e == 0){
			// 			if(parseFloat($(".hide_img").eq(0).css("top")) !== "4.58"){
			// 				$(".hide_img").eq(1).animate({
			// 					width:"0",
			// 					height:"0",
			// 					left:"1.885rem",
			// 					top:"5.53rem"
			// 				},500);
			// 				$(".hide_img").eq(0).show();
			// 				$(".hide_img").eq(0).animate({
			// 					width:"1.01rem",
			// 					height:"1.9rem",
			// 					left:".2rem",
			// 					top:"4.58rem"
			// 				},500)
			// 			}
			// 		}else if(parseFloat($(".hide_img").eq(1).css("top")) !== "4.58"){
			// 			$(".hide_img").eq(0).animate({
			// 				width:"0",
			// 				height:"0",
			// 				left:".705rem",
			// 				top:"5.53rem"
			// 			},500);
			// 			$(".hide_img").eq(1).show();
			// 			$(".hide_img").eq(1).animate({
			// 				width:"1.01rem",
			// 				height:"1.9rem",
			// 				left:"1.38rem",
			// 				top:"4.58rem"
			// 			},500)
			// 		}
			// 	}
			// },
			more: function(){
				$(".hide_more").show();
				$(".hide_more").animate({
					width:"3.75rem",
					height:"100%",
					left:"0",
					top:"0"
				},1440);
				var i = 1;
				var timer = setInterval(function(){
					$(".hide_more").css({"transform":"rotateY("+i*5+"deg"+")"});
					i = i + 1;
					if(i == 72){
						clearInterval(timer)
					}
				},20)
			},
			hide_more: function(){
				$(".hide_more").hide();
				$(".hide_more").css({
					width:"0",
					height:"0",
					top:"3.335rem",
					left:"1.875rem"
				});
			},
			add: function(){
				var p = parseInt($(".good_num").text()) + 1;

				if(add !== 1){
					$(".good_num").text(p);
					$(".heart1").animate({top:"-=.5rem",opacity:"0"},500);
					$(".heart2").delay(200).animate({top:"-=.5rem",opacity:"0"},500);
				}else{
					alert("已经为他点过赞咯")
				}
				add = 1;
			},
			monthcheck: function(){
				if($(".select_year").val() == year){
					if($(".select_month").val() <= month){
						
					}else{
						alert("请选择正确月份");
						$(".select_month").val(month);
					}
				}
			},
			daycheck: function(){
				if($(".select_month").val() == month){
					if($(".select_day").val() > day){
						alert("请选择正确日期");
						$(".select_day").val(day);
					}
				}
			},
			newca: function(){
				$(".ticknew").css("font-size",".24rem");
				$(".tickold").css("font-size","0");
			},
			oldca: function(){
				$(".ticknew").css("font-size","0");
				$(".tickold").css("font-size","0.24rem");
			}
		}
	});
	var add = 0;
	var myDate = new Date();
	var year = myDate.getFullYear();
    var month = myDate.getMonth()+1;
    var day = myDate.getDate();
	function yearload(){
		var html = "<option></option>";
		var i = 0;
		var timer = setInterval(function(){
			$(".select_year option").eq(i).after(html);
			var num = year - i;
			$(".select_year option").eq(i + 1).text(num);
			i = i + 1;
			if(i == 101){
				clearInterval(timer)
			}
		},0.001);	
		$(".hide div").eq(1).find("input").attr("onkeyup","value=value.replace(/[^0-9-]+/,'')");	
	};
	function init(){
		$(".hide_img").eq(1).css("left","1.37rem");
		$(".rotate_img1,.rotate_img2,.more").css("border-radius",".1rem");
		$(".btn_openhide_img").eq(1).css("left","1.38rem");
		var len = $(".birth_name").text().length-2;
		var relen = (1.65+len*0.18)+"rem";
		$(".birth_num").css("left",relen);
	};
	yearload();
	init();
})