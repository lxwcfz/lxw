<template>
  <div class="itemTrans-page">
      <el-table :data="productsList" ref="multipleTable" tooltip-effect="dark" style="width: 100%; text-align:center;" max-height="650">
              <el-table-column prop="itemNo" sortable :label="$t('_global.number')" fixed width="90px">
              </el-table-column>
              <el-table-column :label="$t('products.itemName')">
                  <template scope="scope">
                      <span v-if="_SHOPLANGUAGE == 0 && editTag !== scope.row.itemId">{{scope.row.itemNameObject.zh}}</span>
                      <span v-if="_SHOPLANGUAGE == 1 && editTag !== scope.row.itemId">{{scope.row.itemNameObject.en}}</span>
                      <span v-if="_SHOPLANGUAGE == 2 && editTag !== scope.row.itemId">{{scope.row.itemNameObject.jp}}</span>
                      <div v-if="editTag == scope.row.itemId" class="td-padding">
                        <el-input :placeholder="$t('placeholder.transNameZH')" v-model="editForm.nameZH" :disabled="_SHOPLANGUAGE == 0">
                          <template slot="prepend">中</template>
                        </el-input>
                        <br>
                        <el-input :placeholder="$t('placeholder.transNameJP')" v-model="editForm.nameJP" :disabled="_SHOPLANGUAGE == 2">
                          <template slot="prepend">日</template>
                        </el-input>
                        <br>
                        <el-input :placeholder="$t('placeholder.transNameEN')" v-model="editForm.nameEN" :disabled="_SHOPLANGUAGE == 1">
                          <template slot="prepend">英</template>
                        </el-input>
                      </div>                      
                  </template>                  
              </el-table-column>              
              <el-table-column :label="$t('products.itemDesc')">
                  <template scope="scope">
                      <span v-if="_SHOPLANGUAGE == 0 && editTag !== scope.row.itemId">{{scope.row.itemDescObject.zh}}</span>
                      <span v-if="_SHOPLANGUAGE == 1 && editTag !== scope.row.itemId">{{scope.row.itemDescObject.en}}</span>
                      <span v-if="_SHOPLANGUAGE == 2 && editTag !== scope.row.itemId">{{scope.row.itemDescObject.jp}}</span>                      
                      <div v-if="editTag == scope.row.itemId">
                        <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 2}" :placeholder="$t('placeholder.transDescZH')" v-model="editForm.descZH">                          
                        </el-input>
                        <br>
                        <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 2}" :placeholder="$t('placeholder.transDescJP')" v-model="editForm.descJP">                          
                        </el-input>
                        <br>
                        <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 2}" :placeholder="$t('placeholder.transDescEN')" v-model="editForm.descEN">                          
                        </el-input>
                      </div>
                  </template>
              </el-table-column>
              <el-table-column :label="$t('products.updateTime')" width="200px">
                <template scope="scope">
                  <span>{{scope.row.gmtUpdated}}</span>
                </template>
              </el-table-column>             
              <el-table-column :label="$t('_global.action')" fixed="right" width="100px">
                  <template scope="scope">
                      <el-button type="text" size="small" @click="editTranslate(scope.row)" v-if="editTag !== scope.row.itemId">
                          <i class="el-icon-edit" :title="$t('products.translate')"></i>
                      </el-button>
                      <el-button type="text" size="small" @click="confirmTranslate()" v-if="editTag == scope.row.itemId">
                          <i class="el-icon-circle-check" :title="$t('_global.confirm')"></i>
                      </el-button>
                      <el-button type="text" size="small" @click="cancelTranslate()" v-if="editTag == scope.row.itemId">
                          <i class="el-icon-circle-cross" :title="$t('_global.cancel')"></i>
                      </el-button>                      
                  </template>
              </el-table-column>
          </el-table>
          <div class="block turn-page" style="margin-top:10px;">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="totalItems">
              </el-pagination>
          </div>
  </div>
</template>

<script>
import axios from "axios";
import $http from "../../../utils/http";
import Lockr from "lockr";
export default {
  data() {
    return {
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
    };
  },

  computed: {
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
        itemType: [1, 2],
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
        });
    },
    handleSizeChange(size) {
      console.log(size);
    },
    // 翻页
    handleCurrentChange(page) {      
      this.getItemList();
    },

    editTranslate(item) {      
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
          if (response.data.status) {
            this.$message({
              type: "info",
              message: this.$t('translate.success')
            });
            this.editTag = 0;
            this.getItemList();
          }
        })
        .catch(error => {          
          this.$message({
            type: "error",
            message: this.$t('translate.error')
          });
        });
    }
  }
};
</script>

<style>

</style>
