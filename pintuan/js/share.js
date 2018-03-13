$(function(){
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
			phone: function(){
				if($(".btn_phone span").css("display") == "none"){
					$(".btn_phone span").show();
				}else{
					$(".btn_phone span").hide();
				}
				
			}
		}
	})
})