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
			payinfo:[
				{"class":"pay_price",	"text":"12"},
				{"class":"pay_shop",	"text":"优咕"},
				{"class":"pay_event",	"text":"活动名称活动名称活动名称活动名称活动名称"}
			]
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
							_this.payinfo = data.data.payinfo;
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