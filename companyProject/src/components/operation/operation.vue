<template>
  <div class="operationPage">
        <v-pageTitle vtitle="运营管理"></v-pageTitle>
    
        <div class="clear"></div>
    
        <div class="content-list" id="content-list">

            <transition name="move" mode="out-in">
                <router-view></router-view>
            </transition>
           
        </div>
    
    </div>
</template>

<script>
import vPageTitle from '../common/pageTitle.vue'
export default {
  components:{
    vPageTitle
  },
  data(){
    return {

    }
  },
  mounted: function() {

    window.onresize = function(){
        setTimeout(getHeight,500);
    };
    getHeight();
    function getHeight(){            
        //动态计算属性导航的高度
        var contentHeight = document.body.clientHeight - 141;
        document.getElementById("content-list").style.height = contentHeight + 'px';
    }

  },
  methods:{ }
}
</script>

<style>

</style>
