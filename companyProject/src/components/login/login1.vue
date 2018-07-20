<template>
    <div class="login-container">
        <div class="login-title">
            <span>IWITH 商家管理系统</span>
        </div>
        <div class="login-middle">
            <el-row :gutter="20">
                <el-col :span="14">
                    <button>IWITH</button>
                </el-col>
                <el-col :span="10">                    
                    <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px" class="login-form">
                        <el-form-item>
                            <div class="form-title">
                                <span>IWITH 商家管理系统</span>
                            </div>
                        </el-form-item>
                        <el-form-item prop="username">
                            <span class="svg-container pull-left">
                                <img src="../../../static/images/user_icon.png">
                            </span>
                            <el-input class="login-input" name="username" type="text" v-model="loginForm.username" placeholder="用户名" />
                        </el-form-item>
                        <el-form-item prop="password">
                            <span class="svg-container pull-left">
                                <img src="../../../static/images/password_icon.png">
                            </span>
                            <el-input class="login-input" name="password" type="password" @keyup.enter.native="handleLogin" v-model="loginForm.upassword" placeholder="密码"></el-input>
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
                </el-col>
            </el-row>
        </div>
        <div class="login-footer">
            <p>Copyright © 版权所有 深圳市艾唯尔科技有限公司 
                <span style="padding-left:50px;">                     
                    <el-tooltip placement="top">
                        <div slot="content">                            
                            <span>联系电话：（+86）0755-28219929</span>
                            <br>
                            <span>联系手机号：（+86）18666286292</span>
                        </div>
                        <el-button type="text">联系我们</el-button>
                    </el-tooltip>
                </span>
                &emsp;|&emsp;
                <span><el-button type="text">IWITH 官网</el-button></span>
            </p>
        </div>

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
import getLanguage from '../../utils/sysLanguage'
export default {
    data() {
        return {
            authCodeSrc: '',
            loginForm: {
                username: 'zpb',
                upassword: '123456',
                authCode: ''
            },
            loginRules: {
                username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
                upassword: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                authCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
            }
        }
    },

    computed: {
        MD5password() {
            return MD5(this.loginForm.upassword)
        }
    },

    created() {

        this.getOSLanguage();
        this.getLoginUserInfo();
        this.getAuthCode();

    },

    methods: {

        getAuthCode() {
            axios.get('/coron-web/getPicValidateCode', {}).then(res => {
                this.authCodeSrc = res.data.imgData;
            })
        },

        getOSLanguage(){
            var language = getLanguage();
            console.log("当前浏览器语言是：",language);
            Lockr.set("LANGUAGE", language);
        },

        handleLogin() {

            const data = {
                uname: this.loginForm.username,
                upassword: MD5(this.MD5password + this.loginForm.authCode),
                captcha: this.loginForm.authCode
            };

            this.$refs.loginForm.validate(valid => {
                
                if (valid) {

                    $http.post('/coron-web/login', data).then(res => {
                        console.log(res);
                        if (res.status) {
                            this.getLoginUserInfo();
                            Cookies.set('Token', res.entry);
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

        getLoginUserInfo() {
            getLoginUser().then(res => {

                if (res.status) {
                    console.log("用户登录信息",res);
                    
                    if (getToken()) {
                        this.$router.push({
                            path: '/dashboard'
                        })
                    } else {
                        return false;
                    }

                    if(res.entry.userType == 3 || res.entry.userType == 4){                        
                        console.log("店铺级别账号：",res.entry.shop);
                        Cookies.set('SHOPLANGUAGE', res.entry.shop.language);
                        Lockr.set("SHOPLANGUAGE", res.entry.shop.language);
                    }                    

                    Lockr.set("USERINFO", res.entry);
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
    background: #2d3a4b url('/coron-web/static/images/login_background.png') left 130px no-repeat;    
    background-size: 100%;
}

.login-container .login-title {
    height: 130px;
    line-height: 130px;
    padding-left: 30px;
    border-bottom: solid 1px #fff;
}

.login-container .login-title span {
    color: #fff;
    font-size: 36px;
    font-weight: 300;
}

.login-container .login-middle {
    min-height: 500px;
}

.login-container .svg-container {
    width: 57px;
    height: 54px;
    line-height: 54px;
    display: inline-block;
    text-align: center;
    background-color: #2d3a4b;
}

.login-container .login-form {
    width: 402px;
    padding: 30px;
    background-color: #fff;    
    margin-top: 50px;
    box-shadow:0px 0px 8px #000;
    
}
.login-container .form-title {
    text-align: center;
    font-size: 28px;
    font-weight: 400;
}

.login-container input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
}

.login-container .login-form .login-input {
    width: 345px;
}

.login-container .login-form .authCode-input {
    width: 60%;
}

.login-container .login-input .el-input__inner {
    height: 54px;
    border-radius: 0;
    border-left: none;
}

.login-container .authCode-input .el-input__inner {
    height: 54px;
    border-radius: 0;
}

.login-container .authCodeImg {
    height: 54px;
}

.login-container .loginBtn {
    color: #fff;
    width: 100%;
    height: 52px;
    font-size: 24px;
    background-color: #2d3a4b;
}
.login-container .login-footer {
    height: 98px;
    line-height: 98px;
    text-align: center;
    width: 100%;
    position: fixed;
    bottom: 0;
    background: #fff;
}
.login-container .login-footer p {
    padding:0;
    margin: 0;
}
</style>