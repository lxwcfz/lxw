<template>
    <div class="header">
        <el-row :gutter="5">
            <!--Logo area-->
            <el-col :xs="12" :sm="12" :md="4">
                <div class="logo">
                    <span class="logo_prefix">iWith</span>
                    <span class="logo_suffix">Admin</span>
                </div>
            </el-col>
            
            <!-- header right area-->
            <!-- <el-col :xs="24" :sm="12" :md="{span:8,offset: 4}">
                <div class="website" style="text-align:center;">
                    <span>{{$t('skin')}}+{{$t('navList.one')}}</span>
                    <span>Website:</span>
                    <span>www.iWith.com</span>
                </div>
            </el-col> -->
    
            <el-col :xs="12" :sm="12" :md="20">
                <div class="user-header pull-right">
                    <el-dropdown trigger="click" menu-align="start">
                        <img src="../../../static/images/b_header2.jpg" width="50px" />
                        <el-dropdown-menu slot="dropdown">
                            <!-- <el-dropdown-item>
                                <div class="setting-div" @click="changeLanguage()">                                    
                                    <span class="setting-string">{{$t('header.changeLanguage')}}</span>
                                </div>
                            </el-dropdown-item> -->
                            <el-dropdown-item>
                                <div class="setting-div">
                                    <!-- <span class="setting-icon">
                                        <i class="iconfont icon-user"></i>
                                    </span> -->
                                    <span class="setting-string">{{$t('header.thisUser')}}：{{loginUname}}</span>
                                </div>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <div class="setting-div" @click="updatePassword()">                                    
                                    <span class="setting-string">{{$t('header.updatePwd')}}</span>
                                </div>
                            </el-dropdown-item>
                            <el-dropdown-item divided>
                                <div class="setting-div" @click="userLogout()">
                                    <!-- <span class="setting-icon">
                                        <i class="iconfont icon-tuichu"></i>
                                    </span> -->
                                    <span class="setting-string"> {{$t('header.logout')}}</span>
                                </div>
                            </el-dropdown-item>
    
                        </el-dropdown-menu>
                    </el-dropdown>                        
                </div>                   
            </el-col>
        </el-row>

        <el-dialog :title="$t('header.updatePwd')" :visible.sync="updatePWDDialogVisible" class="addDialog headerDialog" size="tiny">            
            <el-form :model="updatepwdForm" :rules="updatepwdRules" ref="updatepwdForm" label-width="100px">
                <el-form-item :label="$t('shop.id')">
                    <el-input type="text" v-model="updatepwdForm.uname" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item :label="$t('shop.oldpwd')" prop="oldupassword">
                    <el-input type="password" v-model="updatepwdForm.oldupassword" ></el-input>
                </el-form-item>
                <el-form-item :label="$t('shop.newpwd')" prop="newupassword">
                    <el-input type="password" v-model="updatepwdForm.newupassword" ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="updatePasswordPost('updatepwdForm')">{{$t('_global.confirm')}}</el-button>                    
                    <el-button @click="updatePWDDialogVisible = false">{{$t('_global.cancel')}}</el-button>
                </el-form-item>
            </el-form>            
        </el-dialog>
    
    </div>
</template>

<script>
import Vue from 'vue';
import {LANGS} from '@/i18n/lang';
import Lockr from 'lockr';
import Cookies from 'js-cookie';
import MD5 from 'js-md5';
import $http from '../../utils/http';
import { getLoginUser,logout } from '../../api/user';
import getLanguage from '../../utils/sysLanguage';
export default {
    data() {
         var validateNumLetter = (rule,value,callback) => {
            if(!/^[A-Za-z0-9]+$/i.test(value)){
                callback(new Error('请输入数字加字母！'));
            }else {
                callback();
            }
        };
        return {
            name: 'linxin',
            shopInfo:'',
            locale: 'zh-cn',
            langs: LANGS,
            loginUname:'',
            updatePWDDialogVisible:false,            
            updatepwdForm:{
                uname:'',
                oldupassword:'',
                newupassword:'' 
            },
            updatepwdRules:{
                oldupassword:[
                    { required: true, message: '请输入原密码', trigger: 'blur' },
                    { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
                ],
                newupassword:[
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }                    
                ]
            }
        }
    },
    computed : {
        USERINFO(){
            return Cookies.get('_UNAME');
        }
    },
    mounted(){
        Vue.config.lang = Lockr.get("LANGUAGE");
    },
    created(){
        
        Vue.config.lang = Cookies.get('LANGUAGE');

        getLoginUser().then(res => {
            if(res.status){                
                this.shopInfo = res.entry;
                this.loginUname = res.entry.uname;
            }
        })
             
    },
    methods: {        
        userLogout(){
            logout().then(res => {                
                if(res.status){
                    Cookies.remove('Token');
                    Cookies.remove('TY');
                    Cookies.remove('LANGUAGE');
                    Cookies.remove('SHOPLANGUAGE');
                    Cookies.remove('_CUSTOMIZEMESSAGE');
                    Cookies.remove('_UNAME');
                    Cookies.remove('SHOPID');
                    this.$router.push({
                        path:'/loginIn'
                    });
                }
            })
        },

        getOSLanguage(){
            var language = getLanguage();
            console.log("当前浏览器语言是：",language);
            Lockr.set("LANGUAGE", language);
            Vue.config.lang = language;
        },
        changeLanguage(){

            if(this.locale == 'ja'){
                this.locale = 'zh-cn';
            } else if (this.locale == 'zh-cn'){
                this.locale = 'en-us';
            } else if(this.locale = 'en-us'){
                this.locale = 'ja';
            }
            
            Vue.config.lang = this.locale;
        },

        updatePassword(){

            this.updatePWDDialogVisible = true;            
            this.updatepwdForm.uname = this.shopInfo.uname;
            this.updatepwdForm.oldupassword ='';
            this.updatepwdForm.newupassword ='';
            
        },

        updatePasswordPost(formName){

            const data = {
                targetUserId:this.shopInfo.userId,                
                oldPassword:MD5(this.updatepwdForm.oldupassword),
                newPassword:MD5(this.updatepwdForm.newupassword)
            };
            
            this.$refs[formName].validate((valid) => {
                
                if (valid) {
                
                    $http.post('/coron-web/user/updatePassword',data).then(res => {
                
                        if(res.status){
                            this.$message({
                                type:'success',
                                message:'修改成功'
                            });
                            this.updatePWDDialogVisible = false;
                            this.userLogout();
                        } else {
                            this.$message({
                                type:'error',
                                message:res.message
                            });                            
                        }

                    })

                } else {
                    console.log('error submit!!');
                    this.$message({
                        type:'error',
                        customClass:'zIndexMessage',
                        message: '校验失败,请检查'
                    });                    
                    return false;
                }
            });

        }
    }
}
</script>
<style scoped>
.header {
    position: fixed;
    box-sizing: border-box;
    width: 100%;
    height: 66px;
    font-size: 14px;
    line-height: 66px;
    background-color: #324157;
    box-shadow: 2px 0 3px rgba(0, 0, 0, .5);
    z-index: 9000;
    padding: 0 32px 0 40px;
    overflow: hidden;
}

.header .logo {
    float: left;
    cursor: pointer;
    font-size: 22px;
}

.logo_prefix {
    color: #209e91;
}

.logo_suffix {
    color: #fff;
}

.header .search {
    float: left;
    color: #fff;
    font-size: 14px;
}

.website span {
    display: inline-block;
    color: #209e91;
}

.website span:first-child {
    color: #fff;
}

.user-header {
    line-height: 10px;
    padding-top: 7px;
    font-size: 12px;
}

.user-header img {
    border-radius: 50%;
    cursor: pointer;
}

.pop-image {
    display: block;
    float: left;
}

.pop-image img {
    border-radius: 50%;
}

.pop-div {
    height: 55px;
    clear: both;
}

.pop-content {
    display: block;
    font-size: 12px;
    line-height: 14px;
    padding-top: 15px;
    margin-left: 60px;
}

.pop-time {
    display: block;
    float: right;
    font-size: 10px;
    color: #ccc;
}

.pop-title {
    font-size: 12px;
    color: #209e91;
}

.task-div {
    clear: both;
    height: 55px;
}

.task-span {
    display: block;
    float: left;
    font-size: 12px
}

.task-content {
    width: 160px;
    line-height: 16px;
    margin-left: 10px;
    padding: 5px;
}

.task-time {
    clear: both;
    float: right;
    color: #ccc;
}

.setting-div {
    height: 30px;
    line-height: 30px;
    clear: both;
}

.setting-div span {
    display: block;
    float: left;
    font-size: 12px;
}

.setting-icon {
    padding-top: 3px;
    padding-right: 3px;
}

.zIndexMessage {
    z-index: 9999 !important;
    top: 300px;
}
.headerDialog {
    z-index: 9999 !important;
}

</style>
