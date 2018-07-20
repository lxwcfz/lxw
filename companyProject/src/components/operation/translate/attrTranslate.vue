<template>
  <div class="attrTrans-page">
      <el-table :data="attrDatas" ref="multipleTable" tooltip-effect="dark" style="width: 100%; text-align:center;" max-height="550">
              <el-table-column prop="itemAttrId" sortable :label="$t('_global.number')" fixed width="90px">
              </el-table-column>
              <el-table-column :label="$t('products.attrName')">
                  <template scope="scope">
                      <span v-if="_SHOPLANGUAGE == 0 && editTag !== scope.row.itemAttrId">{{scope.row.attrNameObject.zh}}</span>
                      <span v-if="_SHOPLANGUAGE == 1 && editTag !== scope.row.itemAttrId">{{scope.row.attrNameObject.en}}</span>
                      <span v-if="_SHOPLANGUAGE == 2 && editTag !== scope.row.itemAttrId">{{scope.row.attrNameObject.jp}}</span>
                      <div v-if="editTag == scope.row.itemAttrId" class="td-padding">
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
              <el-table-column :label="$t('products.updateTime')" width="200px">
                  <template scope="scope">                      
                      <span>{{scope.row.gmtUpdated}}</span>
                  </template>
              </el-table-column>              
              <el-table-column :label="$t('_global.action')" fixed="right" width="100px">
                  <template scope="scope">
                      <el-button type="text" size="small" @click="editTranslate(scope.row)" v-if="editTag !== scope.row.itemAttrId">
                          <i class="el-icon-edit" :title="$t('products.translate')"></i>
                      </el-button>
                      <el-button type="text" size="small" @click="confirmTranslate()" v-if="editTag == scope.row.itemAttrId">
                          <i class="el-icon-circle-check" :title="$t('_global.confirm')"></i>
                      </el-button>
                      <el-button type="text" size="small" @click="cancelTranslate()" v-if="editTag == scope.row.itemAttrId">
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
    data(){
        return {
            attrDatas: [],
            editForm: {
                nameZH: "",
                nameEN: "",
                nameJP: ""
            },
            currentPage: 1,
            pageSize: 10,
            totalItems: 0,
            typeArray: [],
            editTag: 0,
            middleObj: {}
        }
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
        this.getAttrList();
    },

    methods:{
        getAttrList: function() {
            $http.get('/coron-web/itemAttr/list',{
                shopId:this.rShopDetailData.id,
                page:this.currentPage,
                rp:this.pageSize
            }).then(response => {

                if(response.status){
                    this.attrDatas = response.rows;
                    this.totalItems = response.total;
                } else {
                    this.$message({
                        type:'error',
                        message: response.message
                    })
                }
                
            }).catch(error => {
                console.log(error);                
            })
        },

        handleSizeChange(size) {
            console.log(size);
        },
        // 翻页
        handleCurrentChange(page) {            
            this.getCatalogList();
        },

        editTranslate(item) {            
            this.middleObj = item;
            this.editTag = item.itemAttrId;
            this.editForm.nameZH = item.attrNameObject.zh;
            this.editForm.nameJP = item.attrNameObject.jp;
            this.editForm.nameEN = item.attrNameObject.en;           
        },

        cancelTranslate() {
            this.editTag = 0;
        },
        confirmTranslate() {
            let catalogNameObj = {
                zh: this.editForm.nameZH,
                en: this.editForm.nameEN,
                jp: this.editForm.nameJP
            };      

            let updateParams = {
                shopId: this.rShopDetailData.id,
                itemAttrId: this.middleObj.itemAttrId,
                attrNameObject: catalogNameObj        
            };

            $http.post("/coron-web/itemAttr/update", updateParams).then(response => {
                if (response.status) {
                    this.$message({
                        type: 'success',
                        message: this.$t('translate.success')
                    });
                    this.getAttrList();
                    this.cancelTranslate();
                } else {
                    this.$message({
                        type:'error',
                        message: response.message
                    });
                }                

            }).catch(error => {
                console.log(error);
                this.$message({
                    type: 'error',
                    message: this.$t('translate.error')
                });
            })
        }
    }
}
</script>

<style>

</style>

