<template>
  <div class="timeForm">
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" @click="addDialog()">{{$t('products.addTime')}}</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="timeDatas" style="width: 100%">
      <el-table-column prop="nameGL.zh" :label="$t('products.timeName')" width="180">
        <template scope="scope">
            <span v-if="_SHOPLANGUAGE == 0">{{scope.row.nameGL.zh}}</span>
            <span v-if="_SHOPLANGUAGE == 1">{{scope.row.nameGL.en}}</span>
            <span v-if="_SHOPLANGUAGE == 2">{{scope.row.nameGL.jp}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" :label="$t('products.startTime')"></el-table-column>
      <el-table-column prop="endTime" :label="$t('products.endTime')"></el-table-column>
      <el-table-column :label="$t('products.action')" width="240">
        <template scope="scope" width="240">
          <el-button size="mini" @click="updateTimeDuration(scope.row)"> {{$t('_global.edit')}} </el-button>
          <el-button size="mini" type="danger" @click="confirmDel(scope.row)"> {{$t('_global.delete')}} </el-button>
        </template>
      </el-table-column>
    </el-table>
  
    <el-dialog :visible.sync="timeDialogVisible" class="addDialog" v-bind:title="btnTag == 'add' ? $t('products.addTime'):$t('products.updateTime')" size="tiny">
      <el-form :model="timeDurationForm" :rules="rules" ref="timeDurationForm">
        <el-form-item :label="$t('products.timeName')" :label-width="formLabelWidth" prop="name">
          <el-input v-model="timeDurationForm.name" :placeholder="$t('placeholder.timeName')" @blur="translateContent(timeDurationForm.name,'time')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('products.timeRange')" :label-width="formLabelWidth" required>          
            <el-time-select :placeholder="$t('placeholder.startTime')" v-model="timeDurationForm.startTime" :picker-options="{
                start: '00:00',
                step: '00:10',
                end: '23:59'
              }">
            </el-time-select>
            <el-time-select :placeholder="$t('placeholder.endTime')" v-model="timeDurationForm.endTime" :picker-options="{
                start: '00:00',
                step: '00:10',
                end: '23:59',
                minTime: timeDurationForm.startTime
              }">
            </el-time-select>            
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="timeDialogVisible = false">{{$t('_global.cancel')}}</el-button>
        <el-button type="primary" @click="asyncAdd()" v-if="btnTag == 'add'">{{$t('_global.lijiAdd')}}</el-button>
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
import {baiduTranslate,returnTransArray} from '../../../utils/translate.js';
export default {
  data() {
    return {
      timeDatas: [],
      timeDialogVisible: false,
      timeDurationId:'',
      btnTag:'',
      titleTag:'',
      timeDurationForm: {
        name: '',
        startTime: '',
        endTime: ''
      },
      rules: {
        name: [
          { required: true, message: this.$t('tips.rules.timeName'), trigger: 'blur' }
        ]
      },     
      formLabelWidth: '120px',
      timeNameTransArray:[]
    }
  },
  created() {

    this.getTimeList();

  },
  computed:{
      _SHOPLANGUAGE(){
          return Cookies.get('SHOPLANGUAGE');
      }
  },
  methods: {

    getTimeList() {

      $http.get('/coron-web/shopTimeDuration/list').then(response => {        

          if (response.status) {
            response.rows && (this.timeDatas = response.rows);
          } else {
            this.$message({
              type: 'error',
              message: response.message
            });
          }

        }).catch(error => {
          console.log(error);          
          this.$message({
            type:'error',
            message:this.$t('tips.rules.error')
          });
        })
    },

    addDialog(){
      this.btnTag = 'add';      
      this.timeDialogVisible = true;
      this.resetForm();
    },

    async translateContent(itemName,type){
        var self = this;
        let _language = self._SHOPLANGUAGE;
        if(itemName !== ''){
          var res = await baiduTranslate(itemName,_language);
          if(type == 'time'){
              self.timeNameTransArray = returnTransArray(res);              
          }
        }        
    },

    asyncAdd: async function(){
      await this.translateContent(this.timeDurationForm.name,'time');
      await this.addTimeDuration();
    },
    asyncUpdate: async function(){
      await this.translateContent(this.timeDurationForm.name,'time');
      await this.updateTimeDurationPost();
    },

    addTimeDuration() {

      let timeNameObj = {zh:this.timeDurationForm.name,jp:this.timeDurationForm.name,en:this.timeDurationForm.name};
      if(this._SHOPLANGUAGE == 0){
          timeNameObj.zh = this.timeDurationForm.name;
      } else if (this._SHOPLANGUAGE == 1){
          timeNameObj.en = this.timeDurationForm.name;
      } else if(this._SHOPLANGUAGE == 2) {
          timeNameObj.jp = this.timeDurationForm.name;
      }

      if(this.timeNameTransArray.length > 0){
          timeNameObj = Object.assign(timeNameObj,this.timeNameTransArray[0]);          
      }

      let timeParams = {
        //nameGL: { zh: this.timeDurationForm.name,jp:this.timeDurationForm.name,en:this.timeDurationForm.name},
        nameGL: timeNameObj,
        startTime: this.timeDurationForm.startTime,
        endTime: this.timeDurationForm.endTime
      };
      
      this.$refs['timeDurationForm'].validate((valid) => {        

        if (valid) {
          
          $http.post('/coron-web/shopTimeDuration/add', timeParams).then(response => {            
            
            this.timeDialogVisible = false;
            this.getTimeList();            
            this.$message({
              type:'success',
              message:this.$t('tips.message.addSuccess')
            });
            this.resetForm();

          }).catch(error => {
            console.log(error);            
          })

        } else {
          this.$message({
            type: 'error',
            message: this.$t('tips.rules.error')
          });
          return false;
        }
      });      

    },

    delTimeDuration(item) {
      
      $http.post('/coron-web/shopTimeDuration/del', {
        
        timeDurationId: item.timeDurationId

      }).then(response => {

        if(response.status){
          this.$message({
            type:'success',
            message:this.$t('tips.message.delSuccess')
          });
        } else {
          this.$message({
            type:'success',
            message:response.message
          });
        }
        
        this.getTimeList();

      }).catch(error => {        
        console.log(error);
      })

    },

    confirmDel(item) {
        this.$confirm(this.$t('tips.message.delTime'), this.$t('tips.message.hint'), {
            confirmButtonText: this.$t('tips.message.ok'),
            cancelButtonText: this.$t('tips.message.cancel'),
            type: 'warning'
        }).then(() => {
            this.delTimeDuration(item);
        }).catch(() => {
            this.$message({
                type: 'info',
                message: this.$t('tips.message.canceled')
            });
        });
    },

    updateTimeDuration(item){      
      this.btnTag = 'update';
      this.timeDialogVisible = true;
      this.timeDurationForm.name = item.nameGL.zh;
      if(this._SHOPLANGUAGE == 0){          
          this.timeDurationForm.name = item.nameGL.zh;
      } else if (this._SHOPLANGUAGE == 1){          
          this.timeDurationForm.name = item.nameGL.en;
      } else if(this._SHOPLANGUAGE == 2) {          
          this.timeDurationForm.name = item.nameGL.jp;
      }
      this.timeDurationForm.startTime = item.startTime;
      this.timeDurationForm.endTime = item.endTime;
      this.timeDurationId = item.timeDurationId;
    },

    updateTimeDurationPost(){

      let timeNameObj = {zh:this.timeDurationForm.name,jp:this.timeDurationForm.name,en:this.timeDurationForm.name};
      if(this.timeNameTransArray.length > 0){
          timeNameObj = Object.assign(timeNameObj,this.timeNameTransArray[0]);          
      }

      let updateParams = {
        timeDurationId:this.timeDurationId,
        nameGL:timeNameObj,
        startTime:this.timeDurationForm.startTime,
        endTime:this.timeDurationForm.endTime
      };
      
      $http.post('/coron-web/shopTimeDuration/update',updateParams).then(response => {

        if(response.status){
          this.$message({
            type:'success',
            message:this.$t('tips.message.updateSuccess')
          });
          this.timeDialogVisible = false;
          this.getTimeList();          
        } else {
          this.$message({
            type:'error',
            message:response.message
          });
        }

      }).catch(error => {
        console.log(error);
      })
    },

    resetForm() {      
      this.timeDurationForm.name = '';
      this.timeDurationForm.startTime ='';
      this.timeDurationForm.endTime = '';
    }
  }
}
</script>
<style scoped>
.timeForm {
  width: 98%;
  text-align: center;
  margin: 0 auto;
  padding: 20px 0;
}
</style>
