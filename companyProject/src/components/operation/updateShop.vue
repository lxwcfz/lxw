<template>
    <div class="add-shop">
        <el-form :model="updateShopForm" :rules="updateShopFormRules" ref="updateShopForm" label-width="120px" class="addshopForm">
            <el-form-item :label="$t('shop.shopName')" prop="name">
                <el-input v-model="updateShopForm.name" :placeholder="$t('placeholder.shopName')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('shop.contacts')" prop="contactPerson">
                <el-input v-model="updateShopForm.contactPerson" :placeholder="$t('placeholder.shopContact')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('shop.shopContact')" prop="shopTel">
                <el-input v-model="updateShopForm.shopTel" :placeholder="$t('placeholder.shopTel')"></el-input>
            </el-form-item>
            <el-form-item label="语言" prop="language">
                <el-radio-group v-model="updateShopForm.language" :disabled="true">
                    <el-radio label="0">中文</el-radio>
                    <el-radio label="1">English</el-radio>
                    <el-radio label="2">日本語</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('shop.postCode')" prop="postcode" v-if="updateShopForm.language == '2'">
                <el-input v-model="updateShopForm.postcode" :placeholder="$t('placeholder.postCode')" class="percentage-width"></el-input>
                <el-button type="primary" icon="search" @click="getjpAddress()">{{$t('_global.search')}}</el-button>
            </el-form-item>
            <el-form-item :label="$t('shop.province')" prop="province" v-if="updateShopForm.language == '2'">
                <el-input v-model="updateShopForm.province" :placeholder="$t('placeholder.province')" class="percentage-width"></el-input>
            </el-form-item>
            <el-form-item :label="$t('shop.city')" prop="city" v-if="updateShopForm.language == '2'">
                <el-input v-model="updateShopForm.city" :placeholder="$t('placeholder.city')" class="percentage-width"></el-input>
            </el-form-item>
            <el-form-item :label="$t('shop.street')" prop="street" v-if="updateShopForm.language == '2'">
                <el-input v-model="updateShopForm.street" :placeholder="$t('placeholder.street')" class="percentage-width"></el-input>
            </el-form-item>
            <el-form-item :label="$t('shop.shopAddress')" prop="address">
                <el-input v-model="updateShopForm.address" :placeholder="$t('placeholder.address')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('shop.itemPrice')" prop="haveRadioFee" v-if="updateShopForm.language == '2'" :disabled="updateShopForm.language == '2'">
                <el-radio-group v-model="updateShopForm.haveRadioFee">
                    <el-radio label="0">{{$t('shop.noTax')}}</el-radio>
                    <el-radio label="1">{{$t('shop.haveTax')}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('shop.taxRate')" prop="taxRadio" v-if="updateShopForm.language == '2' && updateShopForm.haveRadioFee == 0">
                <el-input v-model="updateShopForm.taxRadio" :placeholder="$t('placeholder.taxRate')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('shop.isTest')" prop="isTest">
                <el-select v-model="updateShopForm.isTest" :placeholder="$t('placeholder.select')">
                    <el-option :label="$t('shop.yes')" value="true"></el-option>
                    <el-option :label="$t('shop.no')" value="false"></el-option>
                </el-select>
            </el-form-item>            
            <el-form-item :label="$t('shop.currencyType')" prop="currencyType">
                <el-select v-model="updateShopForm.currencyType" :placeholder="$t('placeholder.select')" :disabled="true">
                    <el-option label="¥ CHINESE" value="CHINESE"></el-option>
                    <el-option label="$ US" value="US"></el-option>
                    <el-option label="円 JAPAN" value="JAPAN"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('shop.authCode')" prop="custPanelAuthCode">
                <el-input v-model="updateShopForm.custPanelAuthCode" :disabled="true" :placeholder="$t('placeholder.authCode')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('shop.wechatPayId')" prop="wxMerchantId">
                <el-input v-model="updateShopForm.wxMerchantId" :placeholder="$t('placeholder.wechatPayId')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('shop.wechatPayKey')" prop="wxPrivateKey">
                <el-input v-model="updateShopForm.wxPrivateKey" :placeholder="$t('placeholder.wechatPayKey')"></el-input>
            </el-form-item>
            
            <el-form-item>
                <el-button type="primary" @click="submitForm('updateShopForm')">{{$t('_global.lijiEdit')}}</el-button>                
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import axios from 'axios'
import $http from '../../utils/http'
import Lockr from 'lockr'
export default {
    data() {
        var validateNumLetter = (rule,value,callback) => {

            if(!/^[A-Za-z0-9]+$/i.test(value)){
                callback(new Error(this.$t('tips.rules.letterornum')));
            }else {
                callback();
            }

        };
        return {            
            updateShopForm: {
                name: '',
                address: '',
                contactPerson: '',
                shopTel: '',
                haveRadioFee: '0',
                taxRadio: '',
                wxMerchantId: '',
                wxPrivateKey: '',
                language: "0",
                isTest: 'true',
                postcode: '',
                province: '',
                city: '',
                street: '',
                custPanelAuthCode:'',
                currencyPrecision:'0',
                currencyType:''
            },
            updateShopFormRules: {
                name: [
                    { required: true, message: this.$t('tips.rules.shopname'), trigger: 'blur' }
                ],                
                shopTel: [
                    { required: true, message: this.$t('tips.rules.shoptel'), trigger: 'blur' }
                ],
                currencyPrecision: [
                   { required: true, message: this.$t('tips.rules.currencyPrecision'), trigger: 'blur' }
                ],
                currencyType: [
                    { required: true, message: this.$t('tips.rules.currencyType'), trigger: 'blur' }
                ],
                haveRadioFee: [
                    { required: true, message: this.$t('tips.rules.haveRadioFee'), trigger: 'blur' }
                ],
                address: [
                    { required: true, message: this.$t('tips.rules.shopaddress'), trigger: 'blur' }
                ],                
                province: [
                    { required: true, message: this.$t('tips.rules.province'), trigger: 'blur' }
                ],
                city: [
                    { required: true, message: this.$t('tips.rules.city'), trigger: 'blur' }
                ],
                street: [
                    { required: true, message: this.$t('tips.rules.street'), trigger: 'blur' }
                ],
                isTest: [
                    { required: true, message: this.$t('tips.rules.istestShop'), trigger: 'blur' }
                ]
            }
        }
    },

    computed: {
        rShopDetailData() {
            return Lockr.get('shopDetailData');
        },
        _SHOPLANGUAGE(){            
            return Cookies.get('SHOPLANGUAGE');
        }
    },

    created() {
        this.getUpdateData();
    },

    methods: {

        getUpdateData() {
            var data = this.rShopDetailData;
            
            this.updateShopForm.language = data.language + "";
            this.updateShopForm.address = data.address;
            if(data.language == 0){
                this.updateShopForm.name = data.name.zh;
            }
            if(data.language == 1){
                this.updateShopForm.name = data.name.en;
            }
            if(data.language == 2){
                this.updateShopForm.name = data.name.jp;
                if(data.address.startsWith("{",0) && data.address.includes('}')){
                    let shopAddressParse = JSON.parse(data.address);
                    this.updateShopForm.province = shopAddressParse.province;
                    this.updateShopForm.city = shopAddressParse.city;
                    this.updateShopForm.street = shopAddressParse.street;
                    this.updateShopForm.address = shopAddressParse.address;
                } else {
                    this.updateShopForm.address = data.address;
                }                
            }            
            this.updateShopForm.currencyPrecision = data.currencyPrecision;
            this.updateShopForm.currencyType = data.currencyType;
            this.updateShopForm.contactPerson = data.contactPerson;
            this.updateShopForm.shopTel = data.shopTel;            
            this.updateShopForm.haveRadioFee = (data.haveRadioFee + 0) + "";
            this.updateShopForm.taxRadio = data.taxRadio;
            this.updateShopForm.wxMerchantId = data.wxMerchantId;
            this.updateShopForm.wxPrivateKey = data.wxPrivateKey;
            this.updateShopForm.isTest = data.isTest + "";
            if(!!data.custPanelAuthCode){
                this.updateShopForm.custPanelAuthCode = data.custPanelAuthCode;
            } else {                
                this.updateShopForm.custPanelAuthCode = Math.random().toString(36).substr(2).slice(1,7);
            }
            
        },

        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.updateShop();
                } else {
                    this.$message({
                        type:'error',
                        message:this.$t('tips.rules.error')
                    });
                    return false;
                }
            });
        },

        resetForm(formName) {
            this.$refs[formName].resetFields();
        },

        updateShop() {
            let nameObj = {zh:'',jp:'',en:''};
            let shopAddress = this.updateShopForm.address;

            if(this.updateShopForm.language == 0){
                nameObj.zh = this.updateShopForm.name;
                shopAddress = this.updateShopForm.address;
            }
            if(this.updateShopForm.language == 1){
                nameObj.en = this.updateShopForm.name;
                shopAddress = this.updateShopForm.address;
            }
            if(this.updateShopForm.language == 2){
                nameObj.jp = this.updateShopForm.name;

                let addressObj = {};
                addressObj.province = this.updateShopForm.province;
                addressObj.city = this.updateShopForm.city;
                addressObj.street = this.updateShopForm.street;
                addressObj.address = this.updateShopForm.address;

                shopAddress = JSON.stringify(addressObj);
            }

            if(this.updateShopForm.language == '2' && this.updateShopForm.haveRadioFee == '0'){
                this.updateShopForm.taxRadio = parseInt(this.updateShopForm.taxRadio)/100;
                
            } else {
                
                this.updateShopForm.taxRadio = null; 
            }

            const data = {
                id: this.rShopDetailData.id,
                name: { zh: this.updateShopForm.name, jp: this.updateShopForm.name, en: this.updateShopForm.name },
                shopTel: this.updateShopForm.shopTel,
                haveRadioFee: parseInt(this.updateShopForm.haveRadioFee),
                custPanelAuthCode: this.updateShopForm.custPanelAuthCode,
                taxRadio: this.updateShopForm.taxRadio,
                address: shopAddress,
                contactPerson: this.updateShopForm.contactPerson,
                wxMerchantId: this.updateShopForm.wxMerchantId,
                wxPrivateKey: this.updateShopForm.wxPrivateKey,
                language: this.updateShopForm.language,
                isTest: true,                
                currencyType: this.updateShopForm.currencyType,
                currencyPrecision: this.updateShopForm.currencyType == 'JAPAN' ? 0 : 2
            };

            $http.post('/coron-web/shop/update', data).then(res => {

                if (res.status) {
                    this.$message({
                        type: 'success',
                        message: this.$t('tips.message.updateSuccess')
                    });
                    this.$router.push({
                        path: '/operation/shopmanage'
                    });
                } else {
                    this.$message({
                        type: 'success',
                        message: res.data.message
                    });
                }

            })
        },

        getjpAddress() {

            if (this.updateShopForm.postcode != '') {
                $http.post('/coron-web/jpaddress/getByPostcode', {
                    postcode: this.updateShopForm.postcode
                }).then(res => {
                    
                    if (res.status) {
                        this.updateShopForm.province = res.entry[0].province;
                        this.updateShopForm.city = res.entry[0].city;
                        this.updateShopForm.street = res.entry[0].street;
                    } 

                }).catch(res => {
                    this.$message({
                        type: 'error',
                        message: this.$t('tips.rules.rightCode')
                    });
                })
            } else {
                this.$message({
                    type: 'warning',
                    message: this.$t('tips.rules.postCode')
                });
            }



        }
    }

}
</script>

<style>
.add-shop {
    padding: 15px 10px;
}

.addshopForm {
    width: 50%;
    margin: 0 auto;
}
</style>
