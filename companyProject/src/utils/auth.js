//auth manage
import Cookies from 'js-cookie'
import { getLoginUser } from '../api/user'

const uid = 'uid';
const uname = 'uname';
const utype = 'utype';
const shop_name = 'shop_name';
const shop_address = 'shop_address';
const TY = 'TY';

export function getUId() {
  return Cookies.get(uid);
}

export function getToken(){

    let token = '';

    if(Cookies.get(TY)){
        token = Cookies.get(TY);
    } else {
        token = Cookies.get('Token');
    }

    return token;

}

export function getUname() {
    return Cookies.get(uname);
}

export function getUtype() {
    return Cookies.get(utype);
}

export function getShopname() {
    return Cookies.get(shop_name);
}

export function getShopaddress() {
    return Cookies.get(shop_address);
}

export function setUId(tokenUid) {
  return Cookies.set(uid, tokenUid);
}

export function removeUId() {
  return Cookies.remove(uid);
}