$(function(){
	var vm = new Vue({
		el: "#app",
		data: {
			signList: {
				signUpList: {
					class: "form_signUp",
					id: "signUp",
					action: "",
					method: "",
					button: "注册",
					inputs: [
						{
							id: "userName",
							type: "text",
							text: "名称:"
						},
						{
							id: "userEmail",
							type: "email",
							text: "邮箱:"
						},
						{
							id: "userPassword",
							type: "password",
							text: "密码:"
						},
						{
							id: "userPassword",
							type: "password",
							text: "确认密码:"
						}
					]
				},
				signInList: {
					class: "form_signIn",
					id: "signIn",
					action: "",
					method: "",
					button: "登录",
					remem: true,
					inputs: [
						{
							id: "loginInEmail",
							type: "email",
							text: "邮箱:"
						},
						{
							id: "loginInPassword",
							type: "password",
							text: "密码:"
						}
					]
				}
			}
		}
	});
	
});
function checkInput() {
	let arr = [];
	for(let i = 0; i < $(".normalInput").length; i ++) {
		arr.push($(".normalInput")[i]);
	};
	if($(".form_signIn").css("display") == "none"){
		arr.splice(4,2)
	}else{
		arr.splice(0,4);
	}

	console.log(arr);
	let i = 0;
	arr.forEach(function(e){
		if(e.value == "") {
			i = 1;
		};
	});
	i == 1 ? $(".btn_submit").attr("type","button") : $(".btn_submit").attr("type","submit");
};
function goSignIn() {
	$("#app form,.content").hide();
	$(".form_signIn").fadeIn(200);
	$(".form_signIn").css("display","inline-flex");
	checkInput();
};
function goSignUp() {
	$("#app form,.content").hide();
	$(".form_signUp").fadeIn(200);
	$(".form_signUp").css("display","inline-flex");
	checkInput();
};