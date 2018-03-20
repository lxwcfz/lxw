$(document).ready(function(){
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
			img:"../img/topbg.png",
			createurl:"",
			manageurl:""
		},
		methods:{
			create: function(){
				window.location.href = "/" + this.createurl;
			},
			manage: function(){
				window.location.href = "/" + this.manageurl;
			}
		}
	})
})