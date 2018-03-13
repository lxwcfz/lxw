$(function(){
	var vm = new Vue({
		el:"#app",
		data:{
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
				{"title":"所需人数",    "name":"num1",    "detail":"请输入达到优惠所需人数",	"class":"num num_1"},
				{"title":"最大人数",    "name":"num2",    "detail":"最大人数",	 "class":"num num_2"}
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
				console.log($(".input_servephone").val().length)
				if($(".preprice input").val() > $(".price input").val()){
					alert("预付款不能大于设置价格")
				};
				if($(".cost input").val() < $(".preprice input").val()){
					alert("预付款不能大于原价");
				};
				if($("input").val() == ""){
					alert("请将信息填写完整");
				}else {
					if($(".num input").val() < "2"){
						alert("人数不能低于2")
					};
					if($(".input_servephone").val().length !== "11"){
						alert("请填写正确电话号码");
					};
				}
			},
			addimg: function(event){
                // var pic = $(event.currentTarget).find("img").attr("id").toString();
                // var container = $(event.currentTarget).parent().attr("id").toString();
                // var button = $(event.currentTarget).attr("id").toString();
                // var myUptoken = "";
                // var myKey = "";
                // var Qiniu = new QiniuJsSDK();
                // var $this = this;
                // var option = {
                //     runtimes: 'html5,flash,html4', // 上传模式，依次退化
                //     browse_button: button, // 上传选择的
                //     uptoken_func: function (file) {
                //         $.ajax({
                //             url: $this.getTokenUrl,
                //             type: "POST",
                //             async: false,
                //             dataType: "json",
                //             data: {
                //                 path: "comm",
                //             },
                //             success: function (data) {
                //                 if (data.error == 0) {
                //                     myUptoken = data.uptoken;
                //                     myKey = data.key;
                //                 } else {
                //                     alert(data.msg);
                //                 }
                //             },
                //             error: function (a, b, c) {
                //                 console.log(a + b + c);
                //             }
                //         });
                //         return myUptoken;
                //     },
                //     get_new_uptoken: true,
                //     unique_names: false, // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
                //     save_key: false, // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
                //     domain: 'http://qiniu.yoogus.com', // bucket域名，下载资源时用到，必需
                //     container: container, // 上传区域DOM ID，默认是browser_button的父元素
                //     max_file_size: '100mb', // 最大文件体积限制
                //     flash_swf_url: $this.getMoxieUrl,
                //     max_retries: 3, // 上传失败最大重试次数
                //     dragdrop: true,
                //     drop_element: container, // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                //     chunk_size: '4mb', // 分块上传时，每块的体积
                //     auto_start: true,
                //     init: {
                //         'FilesAdded': function (up, files) {
                //             plupload.each(files, function (file) {
                //                 // 文件添加进队列后，处理相关的事情
                //             });
                //         },
                //         'BeforeUpload': function (up, file) {
                //             // 每个文件上传前，处理相关的事情
                //         },
                //         'UploadProgress': function (up, file) {
                //             // 每个文件上传时，处理相关的事情
                //         },
                //         'FileUploaded': function (up, file, info) {
                //             // 每个文件上传成功后，处理相关的事情
                //             // 其中info是文件上传成功后，服务端返回的json，形式如：
                //             // {
                //             //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                //             //    "key": "gogopher.jpg"
                //             //  }
                //             // 查看简单反馈
                //             // var domain = up.getOption('domain');
                //             var res = JSON.parse(info);
                //             //img.push(res.key)   ; //加入到数组中，给后台传数据
                //             var domain = up.getOption('domain');
                //             var picPrview = domain + "/" + res.key; //获取上传成功后的文件的Url
                //             document.getElementById(button).setAttribute("disabled", "disabled");
                //             document.getElementById(button).setAttribute("disabled", "disabled");
                //             document.getElementById(pic).setAttribute("src", picPrview);
                //             document.getElementById(pic).setAttribute("data-key", res.key);
                //         },
                //         'Error': function (up, err, errTip) {
                //             //上传出错时，处理相关的事情
                //         },
                //         'UploadComplete': function () {
                //             //队列文件处理完毕后，处理相关的事情
                //         },
                //         'Key': function (up, file) {
                //             // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                //             // 该配置必须要在unique_names: false，save_key: false时才生效
                //             var key = myKey;
                //             // do something with key here
                //             return key
                //         }
                //     }
                // };
                // var uploader = Qiniu.uploader(option);
                // uploader.start();
			},
			minusimg: function(){
				$(".newimg:last").remove();
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
})