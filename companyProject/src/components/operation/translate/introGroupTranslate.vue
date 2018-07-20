<template>
  <div class="itemTrans-page">
      <el-table :data="introGroupDatas" ref="multipleTable" tooltip-effect="dark" style="width: 100%; text-align:center;" max-height="650">
              <el-table-column prop="id" sortable :label="$t('_global.number')" fixed width="90px">
              </el-table-column>
              <el-table-column :label="$t('introduce.introduceGroupName')">
                  <template scope="scope">
                      <span v-if="_SHOPLANGUAGE == 0 && editTag !== scope.row.id">{{scope.row.groupNamePojo.zh}}</span>
                      <span v-if="_SHOPLANGUAGE == 1 && editTag !== scope.row.id">{{scope.row.groupNamePojo.en}}</span>
                      <span v-if="_SHOPLANGUAGE == 2 && editTag !== scope.row.id">{{scope.row.groupNamePojo.jp}}</span>
                      <div v-if="editTag == scope.row.id" class="td-padding">
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
                      <el-button type="text" size="small" @click="editTranslate(scope.row)" v-if="editTag !== scope.row.id">
                          <i class="el-icon-edit" :title="$t('products.translate')"></i>
                      </el-button>
                      <el-button type="text" size="small" @click="confirmTranslate()" v-if="editTag == scope.row.id">
                          <i class="el-icon-circle-check" :title="$t('_global.confirm')"></i>
                      </el-button>
                      <el-button type="text" size="small" @click="cancelTranslate()" v-if="editTag == scope.row.id">
                          <i class="el-icon-circle-cross" :title="$t('_global.cancel')"></i>
                      </el-button>                      
                  </template>
              </el-table-column>
          </el-table>
          <!-- <div class="block turn-page" style="margin-top:10px;">
              <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="totalItems">
              </el-pagination>
          </div> -->
  </div>
</template>

<script>
import axios from "axios";
import $http from "../../../utils/http";
import Lockr from "lockr";
export default {
  data() {
    return {
      introGroupDatas: [],
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
    this.getIntroGroupList();    
  },

  methods: {
    getIntroGroupList() {
        $http.get('/coron-web/introduceGroup/list',{
            shopId:this.rShopDetailData.id            
        }).then(response => {
            
            response.status && (this.introGroupDatas = response.entry);

        }).catch(error => {
            console.log(error);
        })
    },
    // 翻页
    handleCurrentChange(page) {      
      this.getIntroGroupList();
    },

    editTranslate(item) {      
      this.middleObj = item;
      this.editTag = item.id;
      this.editForm.nameZH = item.groupNamePojo.zh;
      this.editForm.nameJP = item.groupNamePojo.jp;
      this.editForm.nameEN = item.groupNamePojo.en;      
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
            
      let updateParams = {
        id: this.middleObj.id,
        shopId:this.rShopDetailData.id,
        groupNamePojo: itemNameObj        
      };

      axios({
        url: "/coron-web/introduceGroup/update",
        method: "post",
        data: updateParams,
        headers: {
          Language: this._SHOPLANGUAGE
        }
      }).then(response => {
          if (response.data.status) {
            this.$message({
              type: "success",
              message: this.$t('translate.error')
            });
            this.editTag = 0;
            this.getIntroGroupList();
          }
        })
        .catch(error => {
          console.log(error);
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
