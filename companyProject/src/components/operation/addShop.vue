<template>
  <div class="add-shop">
    <el-form :model="addShopFrom" :rules="addShopFromRules" ref="addShopFrom" label-width="120px" class="addshopForm">
      <el-form-item :label="$t('shop.shopName')" prop="name">
        <el-input v-model="addShopFrom.name" :placeholder="$t('placeholder.shopName')"></el-input>
      </el-form-item>      
      <el-form-item :label="$t('shop.contacts')" prop="contactPerson">
        <el-input v-model="addShopFrom.contactPerson" :placeholder="$t('placeholder.shopContact')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('shop.shopContact')" prop="shopTel">
        <el-input v-model="addShopFrom.shopTel" :placeholder="$t('placeholder.shopTel')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('shop.langSetting')" prop="language">
        <el-radio-group v-model="addShopFrom.language">
          <el-radio label="0">中文</el-radio>
          <el-radio label="1">English</el-radio>
          <el-radio label="2">日本語</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('shop.postCode')" prop="postcode" v-if="addShopFrom.language == '2'">
        <el-input v-model="addShopFrom.postcode" :placeholder="$t('placeholder.postCode')" class="percentage-width"></el-input>        
        <el-button type="primary" icon="search" @click="getjpAddress()">{{$t('_global.search')}}</el-button>
      </el-form-item>
      <el-form-item :label="$t('shop.province')" prop="province" v-if="addShopFrom.language == '2'">
        <el-input v-model="addShopFrom.province" :placeholder="$t('placeholder.province')" class="percentage-width"></el-input>        
      </el-form-item>
      <el-form-item :label="$t('shop.city')" prop="city" v-if="addShopFrom.language == '2'">
        <el-input v-model="addShopFrom.city" :placeholder="$t('placeholder.city')" class="percentage-width"></el-input>        
      </el-form-item>
      <el-form-item :label="$t('shop.street')" prop="street" v-if="addShopFrom.language == '2'">
        <el-input v-model="addShopFrom.street" :placeholder="$t('placeholder.street')" class="percentage-width"></el-input>        
      </el-form-item>
      <el-form-item :label="$t('shop.shopAddress')" prop="address">
        <el-input v-model="addShopFrom.address" :placeholder="$t('placeholder.address')"></el-input>        
      </el-form-item>
      <el-form-item :label="$t('shop.itemPrice')" prop="haveRadioFee" v-if="addShopFrom.language == '2'">
        <el-radio-group v-model="addShopFrom.haveRadioFee">          
          <el-radio label='0'>{{$t('shop.noTax')}}</el-radio>          
          <el-radio label='1'>{{$t('shop.haveTax')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('shop.taxRate')" prop="taxRadio" v-if="addShopFrom.language == '2' && addShopFrom.haveRadioFee == 0">
        <el-input v-model="addShopFrom.taxRadio" type="number" :placeholder="$t('placeholder.taxRate')" class="percentage-width"></el-input><span>%</span>
      </el-form-item>
      <el-form-item :label="$t('shop.isTest')" prop="isTest">
          <el-select v-model="addShopFrom.isTest" :placeholder="$t('placeholder.select')">
              <el-option :label="$t('shop.yes')" value="true"></el-option>
              <el-option :label="$t('shop.no')" value="false"></el-option>
          </el-select>
      </el-form-item>      
      <el-form-item :label="$t('shop.currencyType')" prop="currencyType">
        <el-select v-model="addShopFrom.currencyType" :placeholder="$t('placeholder.select')">
            <el-option label="¥ CHINESE" value="CHINESE"></el-option>
            <el-option label="$ US" value="US"></el-option>
            <el-option label="円 JAPAN" value="JAPAN"></el-option>
        </el-select>
        <span v-if="_SHOPLANGUAGE == 0" style="color:#FF4949;">一经添加不可修改</span>
        <span v-if="_SHOPLANGUAGE == 1" style="color:#FF4949;">Once added, cannot be modified</span>
        <span v-if="_SHOPLANGUAGE == 2" style="color:#FF4949;">選択後は修正してはいけません</span>
      </el-form-item>
      <el-form-item :label="$t('shop.authCode')" prop="custPanelAuthCode">
        <el-input v-model="addShopFrom.custPanelAuthCode" :placeholder="$t('placeholder.authCode')" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item :label="$t('shop.wechatPayId')" prop="wxMerchantId">
        <el-input v-model="addShopFrom.wxMerchantId" :placeholder="$t('placeholder.wechatPayId')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('shop.wechatPayKey')" prop="wxPrivateKey">
        <el-input v-model="addShopFrom.wxPrivateKey" :placeholder="$t('placeholder.wechatPayKey')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('shop.id')" prop="uname">
        <el-input v-model="addShopFrom.uname" :placeholder="$t('placeholder.userId')"></el-input>
      </el-form-item> 
      <el-form-item :label="$t('shop.password')" prop="upassword">
        <el-input v-model="addShopFrom.upassword" type="password" :placeholder="$t('placeholder.password')"></el-input>
      </el-form-item>      
      <el-form-item>
        <el-button type="primary" @click="submitForm('addShopFrom')">{{$t('_global.lijiAdd')}}</el-button>        
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios';
import MD5 from 'js-md5';
import $http from '../../utils/http';
import Cookies from 'js-cookie';
export default {
  data() {
    var validateNumLetter = (rule,value,callback) => {

      if(value != ''){
        if(!/^[A-Za-z0-9]+$/i.test(value)){
            callback(new Error(this.$t('tips.rules.letterornum')));
        }else {
            callback();
        }
      } else {
        callback();
      }
        

    };
    return {
      addShopFrom: {
        name: '',
        address: '',
        contactPerson: '',
        shopTel: '',
        haveRadioFee: '0',
        taxRadio: '8',
        wxMerchantId: '',
        wxPrivateKey: '',
        currencyPrecision:'0',
        currencyType:'',
        custPanelAuthCode:Math.random().toString(36).substr(2).slice(2,8),
        language: "0",
        isTest: "true",
        postcode:'',
        province:'',
        city:'',
        street:'',
        uname:'',
        upassword:''
      },
      addShopFromRules: {
        name: [
          { required: true, message: this.$t('tips.rules.shopname'), trigger: 'blur' }
        ],
        custPanelAuthCode:[
          { validator:validateNumLetter, trigger: 'onchange' }
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
        postcode: [
          { required: true, message: this.$t('tips.rules.postCode'), trigger: 'blur' }
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
        ],
        uname: [          
          { validator: validateNumLetter, trigger: 'onchange' },
          { min: 6, max: 12, message: this.$t('tips.rules.length'), trigger: 'blur' }
        ],
        upassword: [          
          { min: 6, max: 12, message: this.$t('tips.rules.length'), trigger: 'blur' }
        ]
      }
    }
  },
  computed:{
    MD5password(){
        return MD5(this.addShopFrom.upassword)
    },    
    _SHOPLANGUAGE(){            
        return Cookies.get('SHOPLANGUAGE');
    }
  },
  methods: {

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          
          this.addShop();

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

    addShop() {
      let nameObj = {zh:'',jp:'',en:''};
      let shopAddress = this.addShopFrom.address;      

      if(this.addShopFrom.language == '0'){
        nameObj.zh = this.addShopFrom.name;
        shopAddress = this.addShopFrom.address;
      }

      if(this.addShopFrom.language == '1'){
        nameObj.en = this.addShopFrom.name;
        shopAddress = this.addShopFrom.address;
      }
      
      if(this.addShopFrom.language == '2'){
        nameObj.jp = this.addShopFrom.name;

        let addressObj = {};
        addressObj.province = this.addShopFrom.province;
        addressObj.city = this.addShopFrom.city;
        addressObj.street = this.addShopFrom.street;
        addressObj.address = this.addShopFrom.address;

        shopAddress = JSON.stringify(addressObj);

      }

      if(this.addShopFrom.language == '2' && this.addShopFrom.haveRadioFee == '0'){
        this.addShopFrom.taxRadio = parseInt(this.addShopFrom.taxRadio)/100,
        console.log(this.addShopFrom.taxRadio);
      } else {
        console.log(this.addShopFrom.taxRadio);
        this.addShopFrom.taxRadio = null;
      }


      const data = {
        name: { zh: this.addShopFrom.name, jp: this.addShopFrom.name, en: this.addShopFrom.name },
        shopTel: this.addShopFrom.shopTel,
        haveRadioFee: parseInt(this.addShopFrom.haveRadioFee),
        custPanelAuthCode: this.addShopFrom.custPanelAuthCode,
        taxRadio: this.addShopFrom.taxRadio,
        address: shopAddress,
        contactPerson: this.addShopFrom.contactPerson,
        wxMerchantId: this.addShopFrom.wxMerchantId,
        wxPrivateKey: this.addShopFrom.wxPrivateKey,
        language: this.addShopFrom.language,
        isTest: true,
        currencyType: this.addShopFrom.currencyType,
        currencyPrecision: this.addShopFrom.currencyType == 'JAPAN' ? 0 : 2
      };

      const postData = {
        shop: data,
        uname: this.addShopFrom.uname ? this.addShopFrom.uname : null,
        upassword: this.addShopFrom.upassword ? this.MD5password : null
      }

      $http.post('/coron-web/shop/addAndUser', postData).then(res => {
        
        if(res.status){
          this.$message({
            type:'success',
            message:this.$t('tips.message.addSuccess')
          });
          this.$router.push({
            path:'/operation/shopmanage'
          });
        } else {
          this.$message({
            type:'error',
            message:res.message
          });
        }
        
      })
    },

    getjpAddress(){

      if(this.addShopFrom.postcode != ''){
        $http.post('/coron-web/jpaddress/getByPostcode',{
          postcode:this.addShopFrom.postcode
        }).then(res => {          
          if(res.status){
            this.addShopFrom.province = res.entry[0].province;
            this.addShopFrom.city = res.entry[0].city;
            this.addShopFrom.street = res.entry[0].street;
          }
          
        }).catch(res => {
          this.$message({
            type:'error',
            message: this.$t('tips.rules.rightCode')
          });
        })
      } else {
        this.$message({
          type:'warning',
          message:this.$t('tips.message.postCode')
        });
      }
     
    }
  }

}
</script>

<style>
.add-shop {
  padding: 15px 10px;
  background-color: #fff;
}

.addshopForm {
  width: 50%;
  margin: 0 auto;
}
.addshopForm .percentage-width {
  width: 70%;
}
</style>
