import * as product from '../../api/product'
import { SET_ATTRLIST,SET_TIMELIST,SET_CATALOGLIST } from '../mutation-types'

const vxItem = {
    state:{
        attrList:[],
        timeList:[],
        catalogList:[]
    },

    mutations:{
        [SET_ATTRLIST](state,data){
            state.attrList = data;
        },
        [SET_TIMELIST](state,data){
            state.timeList = data;
        },
        [SET_CATALOGLIST](state,data){
            state.catalogList = data;
        }
    },

    actions:{

    }
}

export default vxItem;