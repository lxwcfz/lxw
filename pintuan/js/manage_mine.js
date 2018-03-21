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
			list_event:[
				{"class":"event1",	"title":"活动标题活动标题活动标题活动标题活动标题活动标题活动标题",}
			],
			userinfo:[
				{"class":"userimg",    "name":"咕酱",	  "url":"../img/mem1.png"}
			]
		},
		methods:{
			start: function(){
				var _this = this;
				$.ajax({
					url:"",
					type:"get",
					data:{},
					dataType:"json",
					success: function(){
						if(data.error == "0"){
							_this.list_event = data.data.list_event;
							_this.userinfo = data.data.userinfo;
						}
					},
					error: function(){
						console.log(error)
					}
				})
			}
		}
	});
	// vm.start();
})