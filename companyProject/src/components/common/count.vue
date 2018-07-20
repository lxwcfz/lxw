<template>
  <div>
      <h2>{{msg}}</h2>      
      <hr>
       <h3>{{$store.state.count}}</h3> 
      <hr>
      <h4>测试</h4>

      <div>
          <button @click="add(10)">+</button>
          <button @click="reduce">-</button>
      </div>
  </div>
</template>

<script>

import store from '@/store/index';
import {mapState,mapMutations,mapGetters} from 'vuex';

export default {
    data(){
        return {
            msg:'Hello Vuex'            
        }
    },
    computed:{
        //...mapState(["count"]),
        // ...mapGetters(["count"])      
    },
    store,
    methods:mapMutations([
        'add','reduce'
    ])
    
}
</script>

<style>
  
</style>
