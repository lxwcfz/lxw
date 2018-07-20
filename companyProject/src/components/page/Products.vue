<template>
    <div class="productLists">
        <!-- <v-pageTitle vtitle="全部商品"></v-pageTitle> -->
        <el-menu :default-active="activeIndex" class="el-menu-product" mode="horizontal" @select="handleSelect" router>
            <el-menu-item index="list">{{$t('products.itemList')}}</el-menu-item>
            <el-menu-item index="catalog">{{$t('products.cattlogManage')}}</el-menu-item>
            <el-menu-item index="attrlist">{{$t('products.attrManage')}}</el-menu-item>
            <el-menu-item index="timeduration">{{$t('products.timeManage')}}</el-menu-item>
            <el-menu-item index="sidedishes">{{$t('products.garnishManage')}}</el-menu-item>
        </el-menu>        
    
        <div class="clear"></div>
    
        <div class="content-list" id="content-list">

            <transition name="move" mode="out-in">
                <router-view></router-view>
            </transition>
           
        </div>
    
    </div>
</template>

<script>
import vPageTitle from '../common/pageTitle.vue';
import Cookies from 'js-cookie'
export default {
    data() {
        return {
            status: 'alllist',
            activeIndex: 'list',
        }
    },
    
    components: {
        vPageTitle
    },

    computed: {
        onRoutes(){
            return this.$route.path.replace('/dashboard','/products/list');
        }
    },

    created(){
        this.activeIndex = Cookies.get('activeIndex') ? Cookies.get('activeIndex'):'list';
        this.$router.push({
            path:`/products/${this.activeIndex}`
        })
    },
    
    mounted: function () {
        
        function getHeight(){
            var contentHeight = document.body.clientHeight - 151;
            document.getElementById("content-list").style.height = contentHeight + 'px';
        }
        getHeight();
        window.onresize = function(){
            setTimeout(getHeight,500);
        };

    },
    
    methods: {
        //添加 根据当前页面的status 修改 vtitle 的值
        handleSelect(key, keyPath) {                        
            this.activeIndex = key;
            Cookies.set('activeIndex', key);            
        }
    }    
}
</script>

<style scoped>
.el-col {
    text-align: center;
}

.material-icons {
    font-size: 80px;
    color: #ddd;
}

.content-list {
    border: none;    
    background-color: #fff;
}

.el-menu-product .is-active {
    border-bottom: solid 5px #20a0ff;
}
</style>