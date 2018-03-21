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
			_haveInitQiniu:false,
			img_list:[

			],
			select:{
				"li":[
					{
						"class":"event_start",
						"title":"活动开始",
						"yearname":"startyear",
						"monthname":"startmonth",
						"dayname":"startday"
					},
					{
						"class":"event_end",
						"title":"活动结束",
						"yearname":"endyear",
						"monthname":"endmonth",
						"dayname":"endday"
					}
				]
			},	
			date:{
                	"month":[                   
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
            },
			pintuan_set:[
				{"title":"预付款",    "name":"preprice",    "detail":"建议售价的10%以上",	   "class":"preprice"},
				{"title":"优惠价格",    "name":"price",    "detail":"输入团员优惠价格",	   "class":"price"},
				{"title":"所需人数",    "name":"num_people",    "detail":"请输入达到优惠所需人数",	"class":"num num_1"},
				{"title":"最大人数",    "name":"num_max",    "detail":"最大人数",	 "class":"num num_2"}
			],
			event_disc:[
				{"title":"商品数量",    "name":"ware_num",    "detail":"请合理设置勿超卖",	"class":"ware_num"},
				{"title":"活动介绍",    "name":"event_disc",    "detail":"填写商品介绍，勿超800",	"class":"event_disc"}
			],
			event_rule:[
				{"detail":"1.活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则",	"class":"event_rule"},
				{"detail":"2.活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则",	"class":"event_rule"}
			]
		},
		methods:{
			// start: function(){
			// 	var $this = this;
			// 	$.ajax({
			// 		url:"",
			// 		type:"",
			// 		data:{},
			// 		dataType:"json",
			// 		success: function(){
			// 			if(data.error == "0"){
			// 				$this.data. = data.data.;
			// 			}
			// 		},
			// 		error: function(data){
			// 			console.log(error)
			// 		}
			// 	})
			// },
			year: function(){
				var next = myDate.getFullYear()+1;
				if(!($(".event_start .select_year option").eq(1).text(next) && $(".event_end .select_year option").eq(1).text(next))){
					$(".select_year").find("option").eq(1).text(next);
				}	
			},
			startmonthcheck: function(){
				if($(".event_start .select_year").val() == year){
					if($(".event_start .select_month").val() < month){
						alert("请选择活动正确开始月份")
						$(".event_start .select_month").val(month);
					}
				}
			},
			startdaycheck: function(){
				if($(".event_start .select_year").val() == year){
					if($(".event_start .select_month").val() == month){
						if($(".event_start .select_day").val() < day){
							alert("请选择活动正确开始日期");
							$(".event_start .select_day").val(day);
						}
					}	
				}				
			},
			endmonthcheck: function(){
				if($(".event_end .select_year").val() == $(".event_start .select_year").val()){
					if($(".event_end .select_month").val() < $(".event_start .select_month").val()){
						alert("请选择活动正确结束月份")
						$(".event_end .select_month").val($(".event_start .select_month").val());
					}
				}
			},
			enddaycheck: function(){
				if($(".event_end .select_year").val() == $(".event_start .select_year").val()){
					if($(".event_end .select_month").val() == $(".event_start .select_month").val()){
						if($(".event_end .select_day").val() < $(".event_start .select_day").val()){
							alert("请选择活动正确结束日期");
							$(".event_end .select_day").val($(".event_start .select_day").val());
						}
					}	
				}		
			},
			allprice: function(){
				if($(".preprice").css("display") == "none"){
					$(".btn_allprice div").css("margin-left","-.01rem");
					$(".btn_allprice").css("background","#f0f0f0");
					$(".preprice").show();
				}else{
					$(".btn_allprice div").css("margin-left",".28rem");
					$(".btn_allprice").css("background","#06bf02");
					$(".preprice").hide();
				}
			},
			save: function(){
				var startyear = year;
				var startmonth = month;
				var startday = day;
				var _this = this
				var img_url = _this.img_list;
				// console.log($(".input_servephone").val().length)
				if($(".event_title input").val() == ""){
					alert("请填写标题");
				}else if($(".cost input").val() == "" || $(".cost input").val() < 0){
						alert("请正确填写商品原价")
					}else if($(".input_servephone").val().length != 11){
							alert("请填写正确电话号码");
						}else if($(".preprice").css("display") == "list-item"){
							if($(".preprice input").val() == "" || $(".preprice input").val() < 0){
								alert("请正确填写预付款")
							}else if($(".preprice input").val() > $(".price input").val()){
										alert("预付款不能大于设置价格")
									}else if($(".cost input").val() < $(".preprice input").val()){
											alert("预付款不能大于原价");
										}
						}else if($(".price input").val() == "" || $(".price input").val() < 0){
									alert("请正确填写优惠后价格")
								}else if($(".price input").val() > $(".cost input").val()){
										alert("价格不能大于原价")
									}else if($(".num_1 input").val() < 2){
											alert("人数不能少于2");
										}else if($(".ware_num input").val() == "" || $(".ware_num input").val() <= 0){
												alert("请正确填写商品数量")
											}else if($(".event_disc input").val() == ""){
													alert("请填写商品介绍")
												}else if(img_url.length < 1){
														alert("请上传最少一张图片")
													}else 
				{
				
					// $.ajax({
					// 	url:"",
					// 	type:"post",
					// 	data:{
					// 		'startyear':startyear,
					// 		'startmonth':startmonth,
					// 		'startday':startday,
					// 		'img_url':img_url,
					// 		'event_title':$(".event_title input").val(),
					// 		'startyear':$(".event_start .select_year").val(),
					// 		'startmonth':$(".event_estart .select_month").val(),
					// 		'startday':$(".event_start .select_day").val(),
					// 		'endyear':$(".event_end .select_year").val(),
					// 		'endmonth':$(".event_end.select_month").val(),
					// 		'endday':$(".event_end .select_day").val(),
					// 		'oldprice':$(".cost input").val(),
					// 		'preprice':$(".preprice input").val(),	/*如果选了全额支付*/	
					// 		'price':$(".price input").val(),
					// 		'num_people':$(".num_people input").val(),
					// 		'num_max':$(".num_max input").val(),
					// 		'servephone':$(".serve_phone input").val(),
					// 		'ware_num':$(".ware_num input").val(),
					// 		'event_disc':$(".event_disc input").val()
					// 	},
					// 	dataType:"json",
					// 	success:function(){
					// 		window.location.href = "/";
					// 	},
					// 	error:function(){

					// 	}
					// })
				}	
			},
			addimg: function(){
				if(this._haveInitQiniu){
					return 
				}

				this._haveInitQiniu = true;
				let Qiniu = new QiniuJsSDK();
				let token,selfKey;
				let _self = this
				var uploader = Qiniu.uploader({
		            runtimes: 'html5,flash,html4',
		            browse_button: 'btn_file',
		            max_file_size: '100mb',
		            flash_swf_url: 'http://cdn.staticfile.org/Plupload/2.1.1/Moxie.swf',
		            chunk_size: '4mb',

		            uptoken_func: function(){
							$.ajax({
                    			url: 'http://www.yoogus.com/qiniu/token',
                    			dataType: 'json',
                    			type:'POST',
                    			data: {
                        			path: "comm",
                    			},
                    			async:false,
                    			success:function(res){
                    				if(res.error==0){
                    					token = res.uptoken
                    					selfKey = res.key
                    				}else{
                    					// xxxx
                    				}
                    			},
                    			error:function(e){
                    				console.log(e)
                    			}
                			})
                			return token
		            }, //当然建议这种通过url的方式获取token
		            domain: 'http://qiniu.yoogus.com',
		            max_retries: 2,
		            chunk_size: '4mb', // 分块上传时，每块的体积
		            auto_start: true,
		            multi_selection: true,
		            get_new_uptoken:true,
		            filters: {
			            prevent_duplicates: true,
			            mime_types: [{
			                    title: "Image files",
			                    extensions: "jpg,png,jpeg"
			                } // 限定jpg,gif,png后缀上传
			            ]
			        },
		            init: {
		                'UploadProgress': function (up, file) {
		                    // progress(file.percent)
		                },
		                'FileUploaded': function (up, file, info) {
		                    // console.log(file);
		                    var res = JSON.parse(info);
		                    var domain = up.getOption('domain');
		                    var mediaLink = domain + "/" + res.key;
		                    var url = mediaLink;
		                    _self.img_list.push(url)
		                },
		                'Error': function (up, err, errTip) {
		                    console.log(up, err, errTip)
		                },
		                'Key': function (up, file) {
		                    // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
		                    // 该配置必须要在unique_names: false，save_key: false时才生效
		                    var key = selfKey;
		                    // do something with key here
		                    return key
		                }
		            },
        		});
			},			
			// getToken: function() {
			// 	let _self = this
   //          	$.post({
   //                  url: 'http://www.yoogus.com/qiniu/token',
   //                  dataType: 'json',
   //                  data: {
   //                      path: "comm",
   //                  }
   //              }).done(function (res) {
   //                  let token = res.uptoken,
   //                      selfKey = res.key
   //                      _self.addimg(token,selfKey)
   //                  // fn({
   //                  //     token,
   //                  //     selfKey,
   //                  //     ...config
   //                  // })
   //              })
   //              .fail(function (e) {
   //                  console.log(e)
   //              })
   //  		},
			minusimg: function(){
				$(".newimg:last").remove();
				this.img_list.splice(-1,1);
				console.log(this.img_list.length)
			},
			selectmonth: function(){
                var para = year%4;
                var a = $(".select_month").val();
                if(a == "2"){
                    $(".select_day").find("option").eq(30).remove();
                    $(".select_day").find("option").eq(29).remove();
                    $(".select_day").find("option").eq(28).remove();
                    if(para == "0"){
                        $(".select_day").find("option").eq(27).after("<option value='29'>29</option>");
                    }
                };
                if(a == "4"||a == "6"||a == "9"||a == "11"){
                    $(".select_day").find("option").eq(30).remove();
                };
            },
            resetmonth: function(){
                $(".select_day").find("option").eq(30).remove();
                $(".select_day").find("option").eq(29).remove();
                $(".select_day").find("option").eq(28).remove();
                $(".select_day").find("option").eq(27).after("<option value='29'>29</option>");
                $(".select_day").find("option").eq(28).after("<option value='30'>30</option>");
                $(".select_day").find("option").eq(29).after("<option value='31'>31</option>");
                $(".label_day,.select_day").show();
                if($(".select_month").val() == "0"){
                    $(".label_day,.select_day").hide();
                };
            }
            
		}
	});
	var myDate = new Date();
	var year = myDate.getFullYear();
    var month = myDate.getMonth()+1;
    var day = myDate.getDate();
	function choosedate(){
    	$(".select_year option").text(year);
        $(".select_month").val(month);
        $(".select_day").val(day);
        $(".select_year").val(year);
        $(".preprice").hide();
    };
    function initkeyboard(){
    	$(".list_pintuan input,.input_servephone").attr("onkeyup","value=value.replace(/[^0-9-]+/,'')");
    };
    function endyearcheck(){
    	if($(".event_end .select_year").val() < $(".event_start .select_year").val()){
			alert("请选择活动正确结束年份");
			// console.log($(".event_start .select_year").val());
			$(".event_end .select_year").val($(".event_start .select_year").val());
		}
    };
    function circleimg(){
		setInterval(function(){
			$(".num_img").text($(".newimg").length);
			if($(".newimg").length == '0'){
				$(".minus_img").hide();
			}else{
				$(".minus_img").show();
			}
		},0.0001)
	};
	$(".event_end .select_year").blur(function(){
		endyearcheck();
		if($(".event_end .select_year").val() == $(".event_start .select_year").val()){
			$(".event_end .select_month").val(month);
        	$(".event_end .select_day").val(day);
		}
	});
	choosedate();
	initkeyboard();
	circleimg();
	vm.addimg();
	// vm.start();
})