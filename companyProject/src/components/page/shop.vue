<template>
  <div class="shopLists">
        <v-pageTitle></v-pageTitle>
    
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
import * as user from '../../api/user'
import { mapGetters,mapMutations,mapActions} from 'vuex'
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
            var contentHeight = document.body.clientHeight - 151;
            document.getElementById("content-list").style.height = contentHeight + 'px';
        }

    },
    computed:{
        ...mapGetters([
            'user'
        ])
    },
    created(){        
        this.getUserList();
        this.getLoginInfo();
    },    
    methods :{

        getUserList(){
            user.getUserList({}).then(response => {                
                
                this.setUserList(response.rows)

            })
        },

        ...mapMutations({
            getUser:'GET_USER',
            setUserList:'SET_USERLIST'
        }),

        ...mapActions({
            getLoginInfo:'GetLoginInfo'
        })
    }
}
</script>

<style scoped>
.content-list {    
    background-color: #fff;
    overflow-y: auto;
}
</style>
