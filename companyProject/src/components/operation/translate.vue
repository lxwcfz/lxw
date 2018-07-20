<template>
  <div class="trans-page" id="trans-page">
    <el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> {{$t('translate.item')}}</span>
        <div class="tab-content" id="tab-content">
          <item-translate></item-translate>
        </div>        
      </el-tab-pane>
      <el-tab-pane :label="$t('translate.catalog')">
        <div class="tab-content">
            <catalogTranslate></catalogTranslate>
        </div>        
      </el-tab-pane>
      <el-tab-pane :label="$t('translate.attribute')">
        <div class="tab-content">
            <attrTranslate></attrTranslate>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('translate.sideDish')">
        <div class="tab-content">
            <sideDishTranslate></sideDishTranslate>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('translate.introGroup')">
        <div class="tab-content">
            <introGroupTranslate></introGroupTranslate>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('translate.intro')">
        <div class="tab-content">
            <introTranslate></introTranslate>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>  
</template>

<script>
import axios from "axios";
import $http from "../../utils/http";
import Lockr from "lockr";
import itemTranslate from './translate/itemTranslate'
import catalogTranslate from './translate/catalogTranslate'
import attrTranslate from './translate/attrTranslate'
import sideDishTranslate from './translate/sideDishTranslate'
import introGroupTranslate from './translate/introGroupTranslate'
import introTranslate from './translate/introTranslate'
export default {
  components:{
    itemTranslate,catalogTranslate,attrTranslate,sideDishTranslate,introGroupTranslate,introTranslate
  },
  data() {
    return {      
      catalogDatas: [],
      productsList: [],
      editForm: {
        nameZH: "",
        nameEN: "",
        nameJP: "",
        descZH: "",
        descEN: "",
        descJP: ""
      },
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      formLabelWidth: "120px",
      typeArray: [],
      editTag: 0,
      middleObj: {}
    }
  },  

  mounted: function() {
    
    //动态计算属性导航的高度
    var catalogNavHeight = document.body.clientHeight - 211;
    document.getElementById("tab-content").style.height = catalogNavHeight + 'px';
    document.getElementsByClassName("tab-content")[0].style.height = catalogNavHeight + 'px';
    document.getElementsByClassName("tab-content")[1].style.height = catalogNavHeight + 'px';
    document.getElementsByClassName("tab-content")[2].style.height = catalogNavHeight + 'px';
    document.getElementsByClassName("tab-content")[3].style.height = catalogNavHeight + 'px';
    document.getElementsByClassName("tab-content")[4].style.height = catalogNavHeight + 'px';
    document.getElementsByClassName("tab-content")[5].style.height = catalogNavHeight + 'px';

  },

  computed: {
    baseUrl(){
        return `${window.location.origin}/coron-web/`;
    },
    rShopDetailData() {
      return Lockr.get("shopDetailData");
    },
    _SHOPLANGUAGE() {
      return this.rShopDetailData.language;
    }
  },

  created() {
    //默认获取属性列表
    this.getItemList();    
  },

  methods: {
    getItemList() {
      let getParams = {
        shopId: this.rShopDetailData.id,
        rp: 10,
        page: this.currentPage
      };

      $http
        .post("/coron-web/item/list", getParams)
        .then(response => {
          !!response.rows && (this.productsList = response.rows);
          this.totalItems = response.total;
        })
        .catch(error => {
          console.log(error);
          alert("网络错误，不能访问,请刷新页面重试！");
        });
    },
    handleSizeChange(size) {
      console.log(size);
    },
    // 翻页
    handleCurrentChange(page) {
      console.log(page);
      console.log(this.currentPage);
      this.getItemList();
    },

    editTranslate(item) {
      console.log("编辑翻译", item);
      this.middleObj = item;
      this.editTag = item.itemId;
      this.editForm.nameZH = item.itemNameObject.zh;
      this.editForm.nameJP = item.itemNameObject.jp;
      this.editForm.nameEN = item.itemNameObject.en;
      this.editForm.descZH = item.itemDescObject.zh;
      this.editForm.descJP = item.itemDescObject.jp;
      this.editForm.descEN = item.itemDescObject.en;
    },

    cancelTranslate() {
      this.editTag = 0;
    },

    confirmTranslate() {
      let itemNameObj = {
        zh: this.editForm.nameZH,
        en: this.editForm.nameEN,
        jp: this.editForm.nameJP
      };
      let itemDescObj = {
        zh: this.editForm.descZH,
        en: this.editForm.descEN,
        jp: this.editForm.descJP
      };

      let updateParams = {
        itemId: this.middleObj.itemId,
        itemNameObject: itemNameObj,
        itemDescObject: itemDescObj
      };

      axios({
        url: "/coron-web/item/update",
        method: "post",
        data: updateParams,
        headers: {
          Language: this._SHOPLANGUAGE
        }
      })
        .then(response => {
          if (response.data.status == true) {
            this.$message({
              type: "info",
              message: "菜品翻译成功"
            });
            this.editTag = 0;
            this.getItemList();
          }
        })
        .catch(error => {
          console.log(error);
          this.$message({
            type: "error",
            message: "请求失败！"
          });
        });
    }
  }
};
</script>

<style>
  .td-padding {
    padding: 8px 0;
  }
  .tab-content {
    overflow-y: auto;
  }
  .tab-content .el-input ,.tab-content .el-textarea{
    margin: 2px 0;
  }
  .tab-content .el-textarea {    
    line-height: 34px;
  }
</style>
