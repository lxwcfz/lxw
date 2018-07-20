<template>
  <div class="catalogForm">
    <div v-if="!sortTag">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" @click="addCatalog()">{{$t('products.addCatalog')}}</el-button>
          <el-button type="primary" @click="catalogSort()">{{$t('products.catalogSort')}}</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="catalogDatas" style="width: 100%" max-height="500">
        <el-table-column type="index" width="80px">
        </el-table-column>
        <el-table-column prop="nameObject.zh" :label="$t('products.catalogName')">
          <template scope="scope">
            <span v-if="_SHOPLANGUAGE == 0">{{scope.row.nameObject.zh}}</span>
            <span v-if="_SHOPLANGUAGE == 1">{{scope.row.nameObject.en}}</span>
            <span v-if="_SHOPLANGUAGE == 2">{{scope.row.nameObject.jp}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('_global.action')" width="240">
          <template scope="scope" width="240">
            <el-button size="mini" @click="updateCatalog(scope.row)">{{$t('_global.edit')}}</el-button>
            <el-button size="mini" type="danger" @click="confirmDel(scope.row)">{{$t('_global.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>      
    </div>

    <div class="catalogSort" v-else>
      <div>
        <el-button @click="cancelSort()">{{$t('_global.back')}}</el-button>
      </div>
      <div class="drapSortList">
        <div class="drapSortList-list">
          <draggable :list="catalogDatas" class="dragArea" @change="moved" :options="{group:'introGroup'}">
            <div class="list-complete-item" v-for="element in catalogDatas" :key='element'>
              <div class="list-complete-item-handle">
                <span v-if="_SHOPLANGUAGE == 0">{{element.nameObject.zh}}</span>
                <span v-if="_SHOPLANGUAGE == 1">{{element.nameObject.en}}</span>
                <span v-if="_SHOPLANGUAGE == 2">{{element.nameObject.jp}}</span>
                <span class="pull-right">
                  <i class="el-icon-d-caret"></i>
                </span>
              </div>
            </div>
          </draggable>
        </div>
      </div>
    </div>

    <el-dialog :visible.sync="catalogDialogVisible" class="addDialog" :title="btnTag == 'add' ? $t('products.addCatalog') : $t('products.updateCatalog')" size="tiny">
      <el-form :model="catalogForm" :rules="rules" ref="catalogForm">
        <el-form-item :label="$t('products.catalogName')" :label-width="formLabelWidth" prop="catalogName">
          <el-input v-model="catalogForm.catalogName" :placeholder="$t('placeholder.catalogName')" @blur="translateContent(catalogForm.catalogName,'name')"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="catalogDialogVisible = false">{{$t('_global.cancel')}}</el-button>
        <el-button type="primary" @click="asyncAdd()" v-if="btnTag == 'add'">{{$t('_global.confirm')}}</el-button>
        <el-button type="primary" @click="asyncUpdate()" v-else>{{$t('_global.lijiEdit')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import axios from 'axios';
import $http from '../../../utils/http';
import draggable from 'vuedraggable';
import Cookies from 'js-cookie';
import getLanguage from '../../../utils/sysLanguage.js';
import {getTranslateResult,baiduTranslate,returnTransArray} from '../../../utils/translate.js';
export default {
  components: {
    draggable
  },
  data() {
    return {
      catalogDatas: [],
      catalogDialogVisible: false,
      catalogDel: false,
      btnTag: 'add',
      titleTag: '',
      middleObj: {},
      catalogForm: {
        catalogName: ''
      },
      rules: {
        catalogName: [
          { required: true, message: this.$t('tips.rules.catalogName'), trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px',
      currentPage: 1,
      pageSize: 100,
      totalItems: 0,
      sortTag: false,
      catalogNameTransArray:[]
    }
  },
  created() {
    //默认获取属性列表
    this.getCatalogList();
  },
  computed:{
      _SHOPLANGUAGE(){            
          return Cookies.get('SHOPLANGUAGE');
      }
  },
  methods: {
    getCatalogList() {
      $http.get('/coron-web/catalog/getCatalogs',{
        page:this.currentPage,
        rp:this.pageSize
      }).then(response => {          
          !!response.entry && (this.catalogDatas = response.entry);          
        }).catch(error => {
          console.log(error);
          this.$message({
            type:'error',
            message:this.$t('tips.message.network')
          });          
        })
    },

    addCatalog() {      
      this.btnTag = 'add';
      this.catalogDialogVisible = true;
    },

    cancelDialog() {
      this.catalogDialogVisible = false;
      this.catalogForm.catalogName = '';
    },

  async translateContent(itemName,type){
        var self = this;
        let _language = self._SHOPLANGUAGE;        
        if(itemName !== ''){
          var res = await baiduTranslate(itemName,_language);
          if(type == 'name'){
              self.catalogNameTransArray = returnTransArray(res);              
          }

        }
    },

    addCatalogPost() {
      var self = this;

      let catalogObj = { zh: self.catalogForm.catalogName, jp: self.catalogForm.catalogName, en: self.catalogForm.catalogName };
      if(this._SHOPLANGUAGE == 0){
          catalogObj.zh = this.catalogForm.catalogName;
      } else if (this._SHOPLANGUAGE == 1){
          catalogObj.en = this.catalogForm.catalogName; 
      } else if(this._SHOPLANGUAGE == 2) {
          catalogObj.jp = this.catalogForm.catalogName;
      }
      if(self.catalogNameTransArray.length > 0){
        catalogObj = Object.assign(catalogObj,this.catalogNameTransArray[0]);        
      }
      
      //添加的时候需要 商铺id 和 属性名称
      // 商铺id 需要获取列表的时候 就要保存起来
      let params = {
        isDelete: false,
        type: 2,
        isVisible: true,
        position: 1,
        busiType: 1,
        nameObject: catalogObj,
      };

      self.$refs['catalogForm'].validate((valid) => {
        if (valid) {
          $http.post("/coron-web/catalog/add", params).then(response => {

            if (response.status) {
              self.$message({
                type: 'success',
                message: self.$t('tips.message.addSuccess')
              });
              self.getCatalogList();
              self.cancelDialog();
            } else {
              self.$message({
                type: 'error',
                message: response.message
              });
            }

          }).catch(error => {            
            self.$message.error(self.$t('tips.message.network'));
          })

        } else {
          self.$message({
            type: 'warning',
            message: self.$t('tips.rules.error')
          });
        }

      })

    },

    updateCatalog(item) {

      this.btnTag = 'update';      
      this.catalogDialogVisible = true;
      this.middleObj = item;
      this.catalogForm.catalogName = item.nameObject.zh;
      if(this._SHOPLANGUAGE == 0){          
          this.catalogForm.catalogName = item.nameObject.zh;
      } else if (this._SHOPLANGUAGE == 1){          
          this.catalogForm.catalogName = item.nameObject.en;
      } else if(this._SHOPLANGUAGE == 2) {          
          this.catalogForm.catalogName = item.nameObject.jp;
      }

    },

    updateCatalogPost() {
      var self = this; 
      let nameObj = { 
        zh: self.catalogForm.catalogName, 
        en: self.catalogForm.catalogName, 
        jp: self.catalogForm.catalogName 
      };      

      if(self.catalogNameTransArray.length > 0){
        nameObj = Object.assign(nameObj,self.catalogNameTransArray[0]);        
      }

      //更新列表请求
      let updateParams = {
        catalogId: self.middleObj.catalogId,
        nameObject: nameObj,
        isVisible: self.middleObj.isVisible,
        seq: self.middleObj.seq
      };

      self.$refs['catalogForm'].validate((valid) => {
        if (valid) {

          $http.post("/coron-web/catalog/update", updateParams).then(response => {
            if (response.status) {
              self.$message({
                type: 'success',
                message: self.$t('tips.message.updateSuccess')
              });
            }
            self.cancelDialog();
            self.getCatalogList();

          }).catch(error => {
            console.log(error);
            self.$message({
              type: 'error',
              message: self.$t('tips.message.updateError')
            });
          })

        } else {
          self.$message({
            type: 'warning',
            message: self.$t('tips.rules.error')
          });
        }
      })
    },

    asyncAdd: async function(){
      await this.translateContent(this.catalogForm.catalogName,'name');
      await this.addCatalogPost();
    },
    asyncUpdate: async function(){

      await this.translateContent(this.catalogForm.catalogName,'name');
      await this.updateCatalogPost();

    },

    checkChildren(item) {
      return axios.post('/coron-web/item/list', {
        catalogId: item.catalogId
      })
    },

    delCatalog: function(item) {

      $http.post('/coron-web/catalog/del', {
        catalogId: item.catalogId
      }).then(response => {

        if (response.status) {
          this.$message({
            type: 'success',
            message: this.$t('tips.message.delSuccess')
          });
          this.getCatalogList();
        } else {

          this.$message({
            type: 'error',
            message: response.message
          })
        }

      }).catch(error => {
        console.log(error);
      })
    },

    confirmDel(item) {
      let self = this;
      self.checkChildren(item).then(res => {

        if (res.data.rows && res.data.rows.length > 0) {
          self.$alert(self.$t('tips.message.catalogHaveChild'), self.$t('tips.message.hint'), {
            confirmButtonText: self.$t('tips.message.iknow'),
            type: 'warning'
          })
        } else {
          self.$confirm(self.$t('tips.message.delCatalog'), self.$t('tips.message.hint'), {
            confirmButtonText: self.$t('tips.message.ok'),
            cancelButtonText: self.$t('tips.message.cancel'),
            closeOnClickModal: false,
            type: 'warning'
          }).then(() => {
            self.delCatalog(item);
          }).catch(() => {
            self.$message({
              type: 'info',
              message: self.$t('tips.message.canceled')
            });
          });
        }
      })
    },

    catalogSort(){
      this.sortTag = true;
    },

    cancelSort(){
      this.sortTag = false;
    },

    sortCatalog(itemParams) {

            $http.post('/coron-web/catalog/sort', itemParams).then(response => {

                if(response.status){
                  this.$message({
                      type: 'success',
                      message: this.$t('tips.message.exchangeSuccess')
                  });
                } else {
                  this.$message({
                      type: 'error',
                      message: response.message
                  });
                }
                
                this.getCatalogList();

            }).catch(error => {
                
                this.$message({
                    type: 'error',
                    message: this.$t('tips.message.exchangeError')
                });
                this.getCatalogList();
                
            })
        },

    moved(evt) {

      let newIndex = evt.moved.newIndex;
      let oldIndex = evt.moved.oldIndex;      

      if (newIndex > oldIndex) {
        let oldItem = this.catalogDatas[evt.moved.newIndex],
          newItem = this.catalogDatas[evt.moved.newIndex - 1];

        const item = {
          shopId: oldItem.shopId,
          catalogId: newItem.catalogId,
          oldIndex: oldItem.seq,
          newIndex: newItem.seq
        };

        this.sortCatalog(item);

      } else {

        let oldItem = this.catalogDatas[evt.moved.newIndex],
          newItem = this.catalogDatas[evt.moved.newIndex + 1];

        const item = {
          shopId: oldItem.shopId,
          catalogId: newItem.catalogId,
          oldIndex: oldItem.seq,
          newIndex: newItem.seq
        };

        this.sortCatalog(item);
      }

    }

  }
}
</script>
<style scoped>
.catalogForm {
  width: 98%;
  text-align: center;
  margin: 0 auto;
  padding: 20px 0;
}
</style>
