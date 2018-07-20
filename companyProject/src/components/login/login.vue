<template>
    <div class="login-container">
        <div class="login-title">
            <span>{{$t('login.title')}}</span>
        </div>
        <div class="login-middle">
            <el-row :gutter="20">
                <el-col :span="14">                     
                     <div class="middle-left">
                         &nbsp;
                     </div>
                </el-col>
                <el-col :span="10">                    
                    <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-position="top" label-width="0px" class="login-form">
                        
                        <el-form-item prop="username">
                            <p>{{$t('login.username')}}:</p>
                            <el-input class="login-input" name="username" type="text" v-model="loginForm.username" :placeholder="$t('placeholder.userId')" />
                        </el-form-item>
                        <el-form-item prop="upassword">
                            <p>{{$t('login.password')}}:</p>
                            <el-input class="login-input" name="password" type="password" @keyup.enter.native="handleLogin" v-model="loginForm.upassword" :placeholder="$t('placeholder.password')"></el-input>
                        </el-form-item>
                        <el-form-item prop="authCode" class="authCode-Form">
                            <el-input class="authCode-input" name="authCode" type="text" @keyup.enter.native="handleLogin" v-model="loginForm.authCode" :placeholder="$t('placeholder.verificationCode')"></el-input>
                            <a href="javascript:;" @click="getAuthCode()" style="display:inline-block;height:30px;" class="pull-right">
                                <img :src="authCodeSrc" class="authCodeImg">
                            </a>
                        </el-form-item>
                        <el-form-item>
                            <el-button class="loginBtn" style="width:100%;" @click.native.prevent="handleLogin">
                                {{$t('login.button')}}
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
        <div class="login-footer">
            <p>
                <span>{{$t('login.copyright')}}</span>
                <span>{{$t('login.companyName')}}</span>                 
                <span style="padding-left:50px;">                     
                    <el-tooltip placement="top">
                        <div slot="content">                            
                            <span>{{$t('login.phone')}}:（+86）0755-28219929</span>
                            <br>
                            <span>{{$t('login.telphone')}}:（+86）18666286292</span>
                        </div>
                        <el-button type="text" class="footer-us">{{$t('login.contactus')}}</el-button>
                    </el-tooltip>
                </span>
                &emsp;|&emsp;
                <span>
                    <el-button type="text" class="footer-web">
                        <a href="http://www.iwith-smart.cn/" target="_blank">{{$t('login.website')}}</a>
                    </el-button>
                </span>
            </p>
        </div>

    </div>
</template>

<script>
import Vue from 'vue'
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
        var validateNumLetter = (rule,value,callback) => {
            if(!/^[A-Za-z0-9]+$/i.test(value)){
                callback(new Error(this.$t('tips.rules.letterornum')));                
            }else {
                callback();
            }
        };
        return {
            authCodeSrc: '',
            loginForm: {
                username: '',
                upassword: '',
                authCode: ''
            },
            loginRules: {
                username: [
                    { required: true, message: this.$t('tips.rules.username'), trigger: 'blur' },
                    { validator: validateNumLetter , trigger:'onchange'}
                ],
                upassword: [
                    { required: true, message: this.$t('tips.rules.password'), trigger: 'blur' },
                    { min: 6, max: 12, message: this.$t('tips.rules.length'), trigger: 'blur' }
                ],
                authCode: [{ required: true, message: this.$t('tips.rules.authCode'), trigger: 'blur' }]
            }
        }
    },

    computed: {
        MD5password() {
            return MD5(this.loginForm.upassword)
        }
    },

    mounted(){
        //Vue.config.lang = 'zh-cn';        
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
            Lockr.set("LANGUAGE", language);
            if(language == 'zh-cn'){
                Cookies.set('SHOPLANGUAGE', 0);
                Lockr.set("SHOPLANGUAGE", 0);
            } else if (language == 'en-us'){
                Cookies.set('SHOPLANGUAGE', 1);
                Lockr.set("SHOPLANGUAGE", 1);
            } else if (language == 'ja'){
                Cookies.set('SHOPLANGUAGE', 2);
                Lockr.set("SHOPLANGUAGE", 2);
            } else {
                Cookies.set('SHOPLANGUAGE', 0);
                Lockr.set("SHOPLANGUAGE", 0);
            }
            Vue.config.lang = language;
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
                        
                        if (res.status) {                            
                            Cookies.set('Token', res.entry);
                            this.getLoginUserInfo();
                            this.$router.push({ path: '/dashboard' })
                        } else {
                            this.$message.error(res.message);
                        }

                    })

                } else {
                    
                    this.$message({
                        type:'error',
                        message:this.$t('tips.rules.error')
                    })
                    return false;
                }
            })

        },

        getLoginUserInfo() {
            getLoginUser().then(res => {

                if (res.status) {
                    Lockr.set("USERINFO", res.entry);
                    Cookies.set('_UNAME', res.entry.uname);
                    
                    if(res.entry.userType == 3 || res.entry.userType == 4){                        
                        
                        let language = res.entry.shop.language;
                        let _SHOPID = res.entry.shop.id;
                        if(language == 0){
                            Lockr.set("LANGUAGE", 'zh-cn');
                            Cookies.set('LANGUAGE', 'zh-cn');                            
                            Vue.config.lang = 'zh-cn';
                        } else if(language == 1){
                            Lockr.set("LANGUAGE", 'en-us');
                            Cookies.set('LANGUAGE', 'en-us');
                            Vue.config.lang = 'en-us';
                        } else if(language == 2){
                            Lockr.set("LANGUAGE", 'ja');
                            Cookies.set('LANGUAGE', 'ja');
                            Vue.config.lang = 'ja';
                        }
                        Cookies.set('SHOPLANGUAGE', language);
                        Cookies.set('SHOPID', _SHOPID);
                        Lockr.set("SHOPLANGUAGE", language);
                    } else {

                    }
                    
                    if (getToken()) {
                        this.$router.push({
                            path: '/dashboard'
                        })
                    } else {
                        return false;
                    }

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
}

.login-container .login-title {
    height: 70px;
    line-height: 70px;
    padding-left: 30px;
    border-bottom: solid 1px #fff;
    background: rgba(44,48,52,.95);
}

.login-container .login-title span {
    color: #fff;
    font-size: 24px;
    font-weight: 300;
}

.login-container .login-middle {
    min-height: 600px;
    min-width: 1000px;
    max-width: 1200px;
    margin: 0 auto;
    background: #fff url('/coron-web/bigc/static/images/login-robotbg.png') no-repeat;
    background-size: contain;
}

.login-container .svg-container {
    width: 57px;
    height: 54px;
    line-height: 54px;
    display: inline-block;
    text-align: center;
    background-color: #00a2ca;
}

.login-container .login-form {
    width: 250px;
    padding:10px 20px;
    background-color: #fff;    
    margin-top: 80px;
    border: 1px solid #D4D4D4;
    position: absolute;
    right: 160px;
    z-index: 2;
}

.login-container .login-form .el-form-item {
    margin-bottom: 10px;
}

.login-container .form-title {
    text-align: center;
    font-size: 24px;
    font-weight: 400;
}

.login-container input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
}

.login-container .login-form .login-input {
    width: 100%;
}

.login-container .login-form .authCode-input {
    width: 50%;
}

.login-container .login-form p{    
    margin: 0;
    font-weight: 700;
}

.login-container .login-input .el-input__inner {
    line-height: 16px;
    padding: 8px 5px;
    background: transparent;
}

.login-container .authCode-input .el-input__inner {    
    line-height: 16px;
    padding: 8px 5px;
    background: transparent;    
}

.login-container .authCode-Form {
    margin-top: 20px;
}

.login-container .authCodeImg {
    height: 36px;
}

.login-container .loginBtn {
    color: #fff;
    width: 100%;
    height: 36px;
    font-size: 14px;
    font-weight: 700;
    background-color: #00a2ca;
    outline: none;
    border: none;
    border-radius: 4px;
    margin-top: 10px;
}
.login-container .loginBtn:hover {
    color: #fff;
    outline: none;
}

.login-container .login-footer {
    height: 98px;
    line-height: 98px;
    text-align: center;
    width: 100%;
    position: fixed;
    bottom: 0;
    background: #4B5054;
}
.login-container .login-footer p {
    padding:0;
    margin: 0;
    color: #fff;
}

.login-container .login-footer .footer-us,
.login-container .login-footer .footer-web {
    color:rgba(255,255,255,.69);
}

.login-container .login-footer .footer-web a {
    color:rgba(255,255,255,.69);
}
</style>