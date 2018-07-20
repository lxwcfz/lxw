import { getLoginUser } from '../../api/user'
import * as types from '../mutation-types'
const user = {
    state:{        
        userList:[],        
        userId:'',
        uname:'',
        userType:'',
        sex:'',
        shopId:'',
        shopInfo:''
    },

    mutations:{

        [types.SET_USERLIST](state,userList){
            state.userList = userList;
        },
        SET_USERID(state,userId){            
            state.userId = userId;
        },
        SET_USERNAME(state,userName){
            state.uname = userName;
        },
        SET_USERTYPE(state,userType){
            state.userType = userType;
        },
        SET_USERSEX(state,userSex){
            state.userSex = userSex;
        },
        SET_SHOPID(state,shopId){
            state.shopId = shopId;
        },
        SET_SHOPINFO(state,shopInfo){
            state.shopInfo = shopInfo;
        }

    },

    actions:{
        GetLoginInfo({commit,state}){
            return new Promise((resolve,reject) => {
                getLoginUser().then( res => {
                    const data = res;
                    commit('SET_USERID',data.userId);
                    commit('SET_USERNAME',data.uname);
                    commit('SET_USERTYPE',data.userType);
                    commit('SET_USERSEX',data.sex);
                    commit('SET_SHOPID',data.shopId);
                    commit('SET_SHOPINFO',data.shop);

                    resolve(res);
                })
            }).catch(err => {
                reject(err);
            })
        },

        GetUserList({commit,state}){
            return new Promise((resolve,reject) => {
                
            })
        }

    }
}

export default user;