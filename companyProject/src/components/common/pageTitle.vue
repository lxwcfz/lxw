<template>
    <div class="pageTitle">
        <!-- <div class="pull-right"><h2>{{vtitle.toUpperCase()}}</h2></div> -->
        <!-- <div class="pt-right">
            <span class="pt-Home"><router-link to="DashBoard">Home</router-link></span>
            <span class="pt-line"> / </span>
            <span class="pt-page">{{vtitle}}</span>
        </div> -->
        <div class="breadcrumb-nav pull-left">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item v-for="(item, index) in $route.meta.breadNav" :key="index" :to="{ path:item.path }">{{item.name}}</el-breadcrumb-item>
            </el-breadcrumb> 
        </div>
               
    </div>
</template>
<script>
    export default {
       props:['vtitle']
    }
</script>
<style scoped>
    .pageTitle{
        clear:both;
        height:55px;
        line-height: 55px;
        padding-left: 15px;        
    }
    
    .el-breadcrumb {
        font-size: 16px;
        height: 55px;
        line-height: 55px;
    }

    .pt-Home{
        font-size:20px;
    }
    .pt-line{
        color:#ccc;
    }
    a{
        color:#209e91;
    }
</style>
