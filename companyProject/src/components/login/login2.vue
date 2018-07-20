<template>
  <div class="login-container">
    <div class="login-title">
      <span>IWITH 商家管理系统</span>
    </div>    

    <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px" class="login-form">      
      <el-form-item prop="username">
        <span class="svg-container pull-left">          
          <img src="../../../static/images/user_icon.png">
        </span>
        <el-input class="login-input" autocomplete="off" name="username" type="text" v-model="loginForm.username" placeholder="用户名" />
      </el-form-item>      
      <el-form-item prop="password">
        <span class="svg-container pull-left">          
          <img src="../../../static/images/password_icon.png">
        </span>
        <el-input class="login-input" autocomplete="off" name="password" type="password" @keyup.enter.native="handleLogin" v-model="loginForm.upassword" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item prop="authCode" class="authCode-Form">        
        <el-input class="authCode-input" name="authCode" type="text" @keyup.enter.native="handleLogin" v-model="loginForm.authCode" placeholder="请输入验证码"></el-input>
        <a href="javascript:;" @click="getAuthCode()" style="display:inline-block;height:30px;" class="pull-right">
          <img :src="authCodeSrc" alt="验证码" class="authCodeImg">
        </a>
      </el-form-item>
      <el-form-item>
        <el-button class="loginBtn" style="width:100%;" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
    </el-form>

    
  </div>
</template>

<script>
import axios from 'axios'
import $http from '../../utils/http'
import { getLoginUser } from '../../api/user'
import MD5 from 'js-md5'
import Lockr from "lockr"
import Cookies from 'js-cookie'
import { getToken } from "../../utils/auth"
export default {  
  data() {    
    return {
      authCodeSrc:'',
      loginForm: {
        username: 'zpb',
        upassword: '123456',
        authCode:''
      },
      loginRules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        upassword: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        authCode:[{ required: true, message: '请输入验证码', trigger: 'blur' }]
      }      
    }
  },

  computed : {
    MD5password(){
        return MD5(this.loginForm.upassword)
    }
  },

  created(){
    
    this.getLoginUserInfo();
    this.getAuthCode();
    
  }, 

  methods: {
    
    getAuthCode(){
      axios.get('/coron-web/getPicValidateCode',{}).then(res => {        
        this.authCodeSrc = res.data.imgData;
      })
    },

    handleLogin() {
      
      const data = {
        uname: this.loginForm.username,
        upassword: MD5(this.MD5password + this.loginForm.authCode),
        captcha: this.loginForm.authCode
      };

      this.$refs.loginForm.validate(valid => {
        if(valid){

          $http.post('/coron-web/login',data).then( res => {
            console.log(res);
            if(res.status){
               this.getLoginUserInfo();
               Cookies.set('Token',res.entry);
               this.$router.push({ path: '/dashboard' })
            } else {
                this.$message.error(res.message);
            }

          })
        } else {
          console.log("error commit");
          return false;
        }
      })
      
    },

    getLoginUserInfo(){
      getLoginUser().then(res => {        
        
        if(res.status){

          if(getToken()){
            this.$router.push({
              path:'/dashboard'
            })
          } else {
            return false;
          }

          Lockr.set("USERINFO",res.entry);
        }        
        
      })
    }
  }
}
</script>

<style>
  
.login-container {
  position: relative;
  width: 100%;
  height: 100%;     
  background: #fff url('../../../static/images/login_bg.png') left top no-repeat;
  background-size:contain;
}

.login-container .login-title {
  height: 155px;
  text-align: center;
  padding-top: 200px;  
}
.login-container .login-title span {
  color: #fff;
  font-size: 40px;
  font-weight: 300;  
}

.login-container .svg-container {
    width: 57px;
    height: 54px;
    line-height:54px;
    display: inline-block;    
    text-align: center;    
    background-color: #2d3a4b;
}

.login-container .login-form {  
    width: 432px;    
    margin: 50px auto 0;    
}

.login-container input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
}

.login-container .login-form .login-input {
    width: 375px;    
}
.login-container .login-form .authCode-input {
    width: 60%;    
}

.login-container .login-input .el-input__inner {
  height: 54px;
  border-radius: 0;
  border-left: none;
}

.login-container .authCode-input .el-input__inner{
  height: 54px;
  border-radius: 0;
}
.login-container .authCodeImg {
  height: 54px;
}
.login-container .loginBtn{
  color: #fff;
  width: 100%;
  height: 52px;
  font-size: 24px;
  background-color: #2d3a4b;
}

</style>