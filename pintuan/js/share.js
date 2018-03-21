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
			top_title:{
				"title":"创建活动-全民拼团创建活动-全民拼团创建活动-全民拼团"
			},
			basic_info:[
				{"class":"num_check",	"num":"9"},
				{"class":"num_cus",	"num":"9"},
				{"class":"num_share",	"num":"9"}
			],
			list_img:{
				img1:[
					{"class":"listimg img_basic",	"url":"../img/1.png"}
				],
				img2:[
					{"class":"listimg img_detail",	"url":"../img/1.png"}
				]
			},
			basic_span:[
				{"class":"oldprice",	"num":"5"},
				{"class":"ware_num",	"num":"5"},
				{"class":"smem_num",	"num":"5"},
				{"class":"lmem_num",	"num":"5"},
				{"class":"price",	"num":"5"},
				{"class":"preprice",	"num":"5"}
			],
			duihuaninfo:[
				{"class":"name",	"text":"杭州电子科技大学"},
				{"class":"phone",	"text":"12312312312"}
			],
			waredetail:[
				{"class":"waredetail",	"text":"春节活动春节活动春节活动春节活动春节活动春节活动春节活动"}
			],
			event:{
				event_time:[
					{"class":"start_year",	"text":"2018"},
					{"class":"start_month",	"text":"03"},
					{"class":"start_day",	"text":"11"},
					{"class":"end_year",	"text":"2018"},
					{"class":"end_month",	"text":"4"},
					{"class":"end_day",	"text":"01"}
				],
				event_rule:[
					{"class":"rule1",	"text":"1.春节活动春节活动春节活动春节活动春节活动春节活动春节活动"},
					{"class":"rule2",	"text":"2.春节活动春节活动春节活动春节活动春节活动春节活动春节活动"},
					{"class":"rule3",	"text":"3.春节活动春节活动春节活动春节活动春节活动春节活动春节活动"},
					{"class":"rule4",	"text":"4.春节活动春节活动春节活动春节活动春节活动春节活动春节活动"},
					{"class":"rule5",	"text":"5.春节活动春节活动春节活动春节活动春节活动春节活动春节活动"},
					{"class":"rule6",	"text":"6.春节活动春节活动春节活动春节活动春节活动春节活动春节活动"}
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
					dataType:"",
					success: function(){
						if(data.error == "0"){
							_this.top_title = data.data.top_title;
							_this.basic_info = data.data.basic_info;
							_this.list_img = data.data.list_img;
							_this.basic_span = data.data.basic_span;
							_this.duihuaninfo = data.data.duihuaninfo;
							_this.waredetail = data.data.waredetail;
							_this.event = data.data.event;
						}
					},
					error: function(){
						console.log(error)
					}
				})
			},
			phone: function(){
				if($(".btn_phone span").css("display") == "none"){
					$(".btn_phone span,.btn_copy").show();
				}else{
					$(".btn_phone span,.btn_copy").hide();
				}
			},
			create: function(){
				$(".hide,.shadow").show();
			},
			close: function(){
				$(".hide,.shadow").hide();
			},
			submit: function(){
				if($(".hide input").eq(1).val().length == "11"){
					var _this = this;
					$.ajax({
						url:"",
						type:"post",
						data:{
							"regis_name":$(".hide input").eq(0).val(),
							"regis_phone":$(".hide input").eq(1).val()
						},
						dataType:"json",
						success: function(){
							window.location.href = "/";
						},
						error: function(){
							console.log(error);
						}
					})
				}
			},
			copy: function(){
				alert("已经复制到剪切板")
			}
		}
	});
	var clipboard = new Clipboard('.btn_copy');
	// vm.start();
})