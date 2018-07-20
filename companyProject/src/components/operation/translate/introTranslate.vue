<template>
  <div class="itemTrans-page">
      <el-table :data="introList" ref="multipleTable" tooltip-effect="dark" style="width: 100%; text-align:center;" max-height="650">
              <el-table-column prop="id" sortable label="ID" fixed width="90px">
              </el-table-column>
              <el-table-column :label="$t('introduce.introduceName')">
                  <template scope="scope">
                      <span v-if="_SHOPLANGUAGE == 0 && editTag !== scope.row.id">{{scope.row.titlePojo.zh}}</span>
                      <span v-if="_SHOPLANGUAGE == 1 && editTag !== scope.row.id">{{scope.row.titlePojo.en}}</span>
                      <span v-if="_SHOPLANGUAGE == 2 && editTag !== scope.row.id">{{scope.row.titlePojo.jp}}</span>
                      <div v-if="editTag == scope.row.id" class="td-padding">
                        <el-input :placeholder="$t('placeholder.transNameZH')" v-model="editForm.titleZH" :disabled="_SHOPLANGUAGE == 0">
                          <template slot="prepend">中</template>
                        </el-input>
                        <br>
                        <el-input :placeholder="$t('placeholder.transNameJP')" v-model="editForm.titleJP" :disabled="_SHOPLANGUAGE == 2">
                          <template slot="prepend">日</template>
                        </el-input>
                        <br>
                        <el-input :placeholder="$t('placeholder.transNameEN')" v-model="editForm.titleEN" :disabled="_SHOPLANGUAGE == 1">
                          <template slot="prepend">英</template>
                        </el-input>
                      </div>                      
                  </template>                  
              </el-table-column>              
              <el-table-column :label="$t('introduce.introduceContent')">
                  <template scope="scope">
                      <span v-if="_SHOPLANGUAGE == 0 && editTag !== scope.row.id">{{scope.row.contentPojo.zh}}</span>
                      <span v-if="_SHOPLANGUAGE == 1 && editTag !== scope.row.id">{{scope.row.contentPojo.en}}</span>
                      <span v-if="_SHOPLANGUAGE == 2 && editTag !== scope.row.id">{{scope.row.contentPojo.jp}}</span>                      
                      <div v-if="editTag == scope.row.id">
                        <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 2}" placeholder="请输入中文描述" v-model="editForm.contentZH">                          
                        </el-input>
                        <br>
                        <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 2}" placeholder="请输入日文描述" v-model="editForm.contentJP">                          
                        </el-input>
                        <br>
                        <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 2}" placeholder="请输入英文描述" v-model="editForm.contentEN">                          
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
                      <!-- <el-button type="text" size="small" @click="confirmDel(scope.row)">
                          <i class="el-icon-delete" title="确认"></i>
                      </el-button> -->
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
      introList: [],
      editForm: {
        titleZH: "",
        titleEN: "",
        titleJP: "",
        contentZH: "",
        contentEN: "",
        contentJP: ""
      },
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      formLabelWidth: "120px",      
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
    this.getIntroList();    
  },

  methods: {
    getIntroList() {
      let getParams = {
        shopId: this.rShopDetailData.id,        
        rp: 10,
        page: this.currentPage
      };
      
      $http.get("/coron-web/introduce/list", getParams)
        .then(response => {            
          !!response.rows && (this.introList = response.rows);
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
      this.getIntroList();
    },

    editTranslate(item) {
      
      this.middleObj = item;
      this.editTag = item.id;
      this.editForm.titleZH = item.titlePojo.zh;
      this.editForm.titleJP = item.titlePojo.jp;
      this.editForm.titleEN = item.titlePojo.en;
      this.editForm.contentZH = item.contentPojo.zh;
      this.editForm.contentJP = item.contentPojo.jp;
      this.editForm.contentEN = item.contentPojo.en;
    },

    cancelTranslate() {
      this.editTag = 0;
    },

    confirmTranslate() {
      let introTitleObj = {
        zh: this.editForm.titleZH,
        en: this.editForm.titleEN,
        jp: this.editForm.titleJP
      };
      let introContentObj = {
        zh: this.editForm.contentZH,
        en: this.editForm.contentEN,
        jp: this.editForm.contentJP
      };

      let updateParams = {
        shopId:this.rShopDetailData.id,
        id: this.middleObj.id,
        titlePojo: introTitleObj,
        contentPojo: introContentObj
      };

      axios({
        url: "/coron-web/introduce/update",
        method: "post",
        data: updateParams,
        headers: {
          Language: this._SHOPLANGUAGE
        }
      }).then(response => {
          if (response.data.status) {
            this.$message({
              type: "success",
              message: this.$t('translate.success')
            });
            this.editTag = 0;
            this.getIntroList();
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
