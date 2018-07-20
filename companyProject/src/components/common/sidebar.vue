<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
            <el-menu-item index="/dashboard">               
                    <span class="sb-icon"><i class="iconfont icon-zhuye"></i></span>
                    <span class="sb-cn">{{$t('sidebar.homepage')}}</span>
            </el-menu-item>
            
            <!-- v-if="authType == 3 || authType == 4" -->
            <el-menu-item index="/products" v-if="authType == 3 || authType == 4">
                <span class="sb-icon"><i class="iconfont icon-iconcpgl"></i></span>                
                <span class="sb-cn">{{$t('sidebar.itemmanage')}}</span>
            </el-menu-item>
            
            <!-- v-if="authType == 3" -->
            <el-submenu index="2" v-if="authType == 3">
                <template slot="title">
                    <span class="sb-icon"><i class="iconfont icon-tian"></i></span>
                    <span class="sb-cn">{{$t('sidebar.introducemanage')}}</span>
                </template>
                <el-menu-item index="/introduce">{{$t('sidebar.introducemanage')}}</el-menu-item>
            </el-submenu>

            <!-- v-if="authType == 3" -->
            <el-submenu index="3" v-if="authType == 3">
                <template slot="title">
                    <span class="sb-icon"><i class="iconfont icon-yunying"></i></span>
                    <span class="sb-cn">{{$t('sidebar.shopmanage')}}</span>
                </template>
                <el-menu-item index="/shop/info">{{$t('sidebar.infomanage')}}</el-menu-item>
                <el-menu-item index="/shop/order">{{$t('sidebar.ordermanage')}}</el-menu-item>
                <el-menu-item index="/shop/advertising"> {{$t('sidebar.advertmanage')}} </el-menu-item>
                <el-menu-item v-if="_LANGUAGE == 0" index="/shop/robotreply"> {{$t('sidebar.scenereplymanage')}} </el-menu-item>
            </el-submenu>
            <!-- v-if="authType == 1 || authType == 2" -->
            <el-submenu index="4" v-if="authType == 1 || authType == 2">
                <template slot="title">
                    <span class="sb-icon"><i class="iconfont icon-yunying"></i></span>
                    <span class="sb-cn">{{$t('sidebar.operationmanage')}}</span>
                </template>
                <el-menu-item index="/operation/shopmanage">{{$t('sidebar.shopmanage')}}</el-menu-item>
                <el-menu-item index="/operation/ordermanage">{{$t('sidebar.ordermanage')}}</el-menu-item>                
            </el-submenu>
            <!-- v-if="authType == 7" -->
            <el-submenu index="5" v-if="authType == 7">
                <template slot="title">
                    <span class="sb-icon"><i class="iconfont icon-user"></i></span>
                    <span class="sb-cn">{{$t('sidebar.devmanage')}}</span>
                </template>
                <el-menu-item index="/operation/robot">{{$t('sidebar.dancemanage')}}</el-menu-item>
                <el-menu-item index="/operation/otamanage">{{$t('sidebar.otamanage')}}</el-menu-item>
                <el-menu-item index="/operation/apkmanage">{{$t('sidebar.apkmanage')}}</el-menu-item>
                <el-menu-item index="/operation/sn">{{$t('sidebar.snget')}}</el-menu-item>
                <el-menu-item index="/operation/snmanage">{{$t('sidebar.snmanage')}}</el-menu-item>
                <el-menu-item index="/operation/motion"> {{$t('sidebar.motionmanage')}} </el-menu-item>                
                <el-menu-item index="/operation/robotreply"> {{$t('sidebar.scenemanage')}} </el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>
<script>
import $http from '../../utils/http';
import { getLoginUser } from '../../api/user';
import Cookies from 'js-cookie';
export default {
    data(){
        return {
            authType:''
        }
    },
    computed:{
        onRoutes(){
            return this.$route.path.replace('/','');
        },
        _LANGUAGE(){
            return Cookies.get('SHOPLANGUAGE');
        }
    },
    created(){
        this.getLoginUserInfo();
    },
    methods:{
        //获取登录信息
        getLoginUserInfo(){
            getLoginUser().then( res => {
                if(res.status){                        
                    this.authType = res.entry.userType;
                } else {
                    this.$router.push({
                        path:'/loginIn'
                    });
                }

            })
        }
    }
}
</script>
<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        width: 200px;
        left: 0;
        top: 66px;
        bottom:0;
        background: #324157;       
    }
    .sidebar > ul {
        height:100%;
    }

    .el-menu-item, .el-submenu__title{
        font-size:14px;     
    }
     
    .material-icons {font-size:12px;}
</style>
