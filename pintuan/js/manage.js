$(function(){
	var vm = new Vue({
		el:"#app",
		data:{
			time:{
				"startyear":"2018",
				"startmonth":"03",
				"startday":"12"
			},
			title:{
				"text":"点击活动标题查看分享链接及活动数据点击活动标题查看分享链接及活动数据点击活动标题查看分享链接及活动数据"
			},
			detail:{
				"link":"https://www.baidu.com",
				"url":"../img/1.png"
			},
			list_data:[
				{"class":"list1 list","title":"浏览次数","num":"12"},
				{"class":"list2 list","title":"分享次数","num":"12"},
				{"class":"list3 list","title":"报名次数","num":"12"},
				{"class":"list4 list","title":"成功次数","num":"12"}
			],
			list_func:[
				{"class":"func func_edit","text":"编辑","url":"../img/data_edit.png"},
				{"class":"func func_down","text":"下线","url":"../img/data_down.png"},
				{"class":"func func_delete","text":"删除","url":"../img/data_delete.png"},
				{"class":"func func_member","text":"成员","url":"../img/data_member.png"}
			]
		},
		methods:{
			down: function(){
				if($(".btn_down img").length == "1"){
					var img = "<img class='notrans' src='../img/btn_down.png'>";
					$(".btn_down").append(img);
					$(".data_hide").show();
				}else{
					$(".btn_down img").eq(1).remove();
					$(".data_hide").hide();
				}
			},
			copy: function(){
				alert("已经复制到剪切板")
			},
			watch: function(){
				$(".hide_img").show();
			},
			close: function(){
				$(".hide_img").hide();
			}
		}
	});
	var clipboard = new Clipboard('.btn_copy');
})