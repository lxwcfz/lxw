import Vue from 'vue';
import Vuex from 'vuex';

import user from './modules/user'
import shop from './modules/shop'
import * as getters from './getters'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex);

//开发环境调试
const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    modules:{
        user,
        shop
    },    
    getters,    
    strict:debug,
    plugins:debug ? [createLogger()]:[]    
})






