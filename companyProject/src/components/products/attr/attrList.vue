<template>
  <div class="attrForm">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-button type="primary" @click="addAttr()">{{$t('products.addAttr')}}</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="itemAttrDatas" style="width: 100%" max-height="500">
      <el-table-column type="index" width="80px">
      </el-table-column>
      <el-table-column :label="$t('products.attrName')">
        <template scope="scope">
          <span v-if="_SHOPLANGUAGE == 0">{{scope.row.attrNameObject.zh}}</span>
          <span v-if="_SHOPLANGUAGE == 1">{{scope.row.attrNameObject.en}}</span>
          <span v-if="_SHOPLANGUAGE == 2">{{scope.row.attrNameObject.jp}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('_global.action')" width="240">
        <template scope="scope" width="240">
          <el-button size="mini" @click="editAttr(scope.row)">{{$t('_global.edit')}}</el-button>
          <el-button size="mini" type="danger" @click="confirmDel(scope.row)">{{$t('_global.delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="attrDialogVisible" class="addDialog tasteDialog" v-bind:title="titleTag== 'add' ? $t('products.addAttr'):$t('products.updateAttr')" size="tiny">
      <el-form :model="attrForm" :rules="rules" ref="attrForm">
        <el-form-item :label="$t('products.attrName')" :label-width="formLabelWidth" prop="attrName">
          <el-input v-model="attrForm.attrName" :placeholder="$t('placeholder.attrName')" @blur="translateContent(attrForm.attrName,'attr')"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="attrDialogVisible = false">{{$t('_global.cancel')}}</el-button>
        <el-button type="primary" @click="asyncAdd()" v-if="titleTag == 'add'">{{$t('_global.lijiAdd')}}</el-button>
        <el-button type="primary" @click="asyncUpdate()" v-else>{{$t('_global.lijiEdit')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import $http from '../../../utils/http';
import Cookies from 'js-cookie';
import getLanguage from '../../../utils/sysLanguage.js';
import { baiduTranslate, returnTransArray } from '../../../utils/translate.js';
export default {
  data() {
    return {
      titleTag: 'add',
      itemAttrDatas: [],
      attrDialogVisible: false,
      shopId: '',
      itemAttrId: '',
      attrForm: {
        attrName: '',
      },
      rules: {
        attrName: [
          { required: true, message: this.$t('tips.rules.attrName'), trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px',
      currentPage: 1,
      pageSize: 100,
      attrTransArray: []
    }
  },
  created() {
    //默认获取属性列表
    this.getItemAttrList();
  },
  computed: {
    _SHOPLANGUAGE() {
      return Cookies.get('SHOPLANGUAGE');
    }
  },
  mounted: function() {

  },
  methods: {
    getItemAttrList() {
      $http.get('/coron-web/itemAttr/list', {
        page: this.currentPage,
        rp: this.pageSize
      }).then(response => {

        !!response.rows && (this.itemAttrDatas = response.rows) && response.rows.length > 0 && (this.shopId = response.rows[0].shopId);

      }).catch(error => {

        console.log(error);        
        this.$message({
          type:error,
          message:this.$t('tips.message.network')
        });

      })
    },

    addAttr() {
      this.attrDialogVisible = true;
      this.attrForm.attrName = '';
      this.titleTag = 'add';
    },

    async translateContent(itemName, type) {
      var self = this;
      let _language = self._SHOPLANGUAGE;
      if(itemName !== ''){

        var res = await baiduTranslate(itemName,_language);
        if (type == 'attr') {
          self.attrTransArray = returnTransArray(res);          
        }

      }        

    },

    addAttrPost() {

      let attrNameObj = { zh: this.attrForm.attrName, jp: this.attrForm.attrName, en: this.attrForm.attrName };
      if (this._SHOPLANGUAGE == 0) {
        attrNameObj.zh = this.attrForm.attrName;
      } else if (this._SHOPLANGUAGE == 1) {
        attrNameObj.en = this.attrForm.attrName;
      } else if (this._SHOPLANGUAGE == 2) {
        attrNameObj.jp = this.attrForm.attrName;
      }

      if (this.attrTransArray.length > 0) {
        attrNameObj = Object.assign(attrNameObj, this.attrTransArray[0]);        
      }

      let addParams = {
        shopId: this.shopId,
        isDelete: false,
        attrNameObject: attrNameObj
      };
      this.$refs['attrForm'].validate((valid) => {
        if (valid) {

          $http.post("/coron-web/itemAttr/add", addParams).then(response => {

            if (response.status) {
              this.$message({
                type: 'success',
                message: this.$t('tips.message.addSuccess')
              });
              this.getItemAttrList();
              this.attrForm.attrName = '';
            }
            this.attrDialogVisible = false;

          }).catch(error => {
            console.log(error);
          })

        } else {
          this.$message({
            type: 'error',
            message: this.$t('tips.rules.error')
          });          
        }
      });
    },

    editAttr(item) {
      this.attrDialogVisible = true;
      this.attrForm.attrName = item.attrNameObject.zh;
      if (this._SHOPLANGUAGE == 0) {
        this.attrForm.attrName = item.attrNameObject.zh;
      } else if (this._SHOPLANGUAGE == 1) {
        this.attrForm.attrName = item.attrNameObject.en;
      } else if (this._SHOPLANGUAGE == 2) {
        this.attrForm.attrName = item.attrNameObject.jp;
      }
      this.itemAttrId = item.itemAttrId;
      this.titleTag = 'update';
    },

    editAttrPost() {

      let itemAttrObj = { zh: this.attrForm.attrName, jp: this.attrForm.attrName, en: this.attrForm.attrName };
      if (this._SHOPLANGUAGE == 0) {
        itemAttrObj.zh = this.attrForm.attrName;
      } else if (this._SHOPLANGUAGE == 1) {
        itemAttrObj.en = this.attrForm.attrName;
      } else if (this._SHOPLANGUAGE == 2) {
        itemAttrObj.jp = this.attrForm.attrName;
      }
      if (this.attrTransArray.length > 0) {
        itemAttrObj = Object.assign(itemAttrObj, this.attrTransArray[0]);        
      }

      let updateParams = {
        itemAttrId: this.itemAttrId,
        attrNameObject: itemAttrObj
      };

      this.$refs['attrForm'].validate((valid) => {

        if (valid) {

          $http.post("/coron-web/itemAttr/update", updateParams).then(response => {

            if (response.status) {
              this.$message({
                type: 'success',
                message: this.$t('tips.message.updateSuccess')
              });
              this.getItemAttrList();
              this.attrForm.attrName = '';
            }
            this.attrDialogVisible = false;

          }).catch(error => {
            console.log(error);
          })

        } else {
          this.$message({
            type: 'error',
            message: this.$t('tips.rules.error')
          });          
        }
      });

    },

    asyncAdd: async function(){
      await this.translateContent(this.attrForm.attrName,'attr');
      await this.addAttrPost();
    },
    asyncUpdate: async function(){
      await this.translateContent(this.attrForm.attrName,'attr');
      await this.editAttrPost();
    },

    delAttr(item) {
      $http.post('/coron-web/itemAttr/del', { itemAttrId: item.itemAttrId }).then(response => {
        this.$message({
          type: 'success',
          message:this.$t('tips.message.delSuccess')
        });
        this.getItemAttrList();

      }).catch(error => {
        console.log(error);
      })
    },

    confirmDel(item) {
      this.$confirm(this.$t('tips.message.delAttr'), this.$t('tips.message.hint'), {
        confirmButtonText: this.$t('tips.message.ok'),
        cancelButtonText: this.$t('tips.message.cancel'),
        type: 'warning'
      }).then(() => {
        this.delAttr(item);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('tips.message.canceled')
        });
      });
    }

  }

}
</script>
<style scoped>
.attrForm {
  width: 98%;
  text-align: center;
  margin: 0 auto;
  padding: 20px 0;
}
</style>
