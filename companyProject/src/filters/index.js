//过滤菜品类型
export function parseProductType(itemType){    
    if(itemType == 1){
        return '单点';
    } else if(itemType == 2){
        return '套餐';
    } else if (itemType == 3){
        return '配菜';
    }
}

//过滤商品售卖状态
export function parseIsSale(isSale){
    if(isSale == 1){
        return '已上架';
    } else if(isSale == 0){
        return '未上架';
    }
}

//过滤语言类型
export function languageType(language){    
    
    if(language === 0){
        return '中文';
    } else if(language === 1){
        return 'ENGLISH';
    } else if(language === 2){
        return '日本語'
    }
}

//过滤itemType single  mutli
export function itemToType(itemType){
    if(itemType == 'single'){
        return '单选'
    } else {
        return '多选'
    }
}

export function orderStatus(orderStatus){
    if(orderStatus == '1'){
        return '待审核'
    }
    if(orderStatus == '2'){
        return '审核通过'
    } 
    if(orderStatus == '3'){
        return '人工退单'
    } 
    if(orderStatus == '4'){
        return '审核未通过'
    } 
    if(orderStatus == '5'){
        return '取消'
    }    
}

export function tradeStatus(tradeStatus){
    if(tradeStatus == '1'){
        return '待审核'
    }
    if(tradeStatus == '4'){
        return '下单'
    }
    if(tradeStatus == '6'){
        return '待支付'
    }
    if(tradeStatus == '7'){
        return '支付成功'
    }
    if(tradeStatus == '10'){
        return '完成'
    }
    if(tradeStatus == '11'){
        return '关闭'
    }
}


export function tradeType(type){
    if(type == '1'){
        return '点餐交易'
    }
    if(type == '2'){
        return '酒店交易'
    } 
    if(type == '3'){
        return '医院交易'
    }
}



// japan address JSON.parse
export function addressParse(address){    
        
    if(address.startsWith("{",0) && address.includes('}')){        
        var addressObj = JSON.parse(address);
        return `${addressObj.province} ${addressObj.city} ${addressObj.street} ${addressObj.address}`
    } else {
        return address;
    }
   
}