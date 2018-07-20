import $http from '../utils/http';


export function getLoginUser(){
    return $http.get('/coron-web/getLoginUser',{})
}

export function logout(){
    return $http.get('/coron-web/logout')
}

export function getUserList(data){
    return $http.post('/coron-web/user/list',data)
}

export function addUser(data){
    return $http.post('/coron-web/user/add',data)
}

export function updateUser(data){
    return $http.post('/coron-web/user/update',data)
}

export function delUser(data){
    return $http.post('/coron-web/user/del',data)
}

export function getShopUser(id){
    const params = {};
    if(!!id){
        params.shopId = id;
    }else {
        
    }
    return $http.get('/coron-web/user/getByShop',params)
}

export function getUserInfoById(userId){

    const params = {
        userId:userId
    }

    return $http.get('/coron-web/user/getById',params)
}
