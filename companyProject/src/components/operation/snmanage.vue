<template>
    <div class="robotDancePage">        
        <div style="padding:10px 0;">
            <el-input v-model="snSearchForm.name" :placeholder="$t('snManage.placeholderName')" style="width:200px"></el-input>
            <el-button type="primary" @click="getSn()">{{$t('_global.search')}}</el-button>
        </div>
        <el-table :data="snLists" border style="width: 100%; text-align:center;">
            <el-table-column label="ID" fixed="left" prop="robotId" width="80"></el-table-column>            
            <el-table-column :label="$t('snManage.robotName')" fixed="left" prop="robotName" min-width="130px">                
            </el-table-column>           
            <el-table-column :label="$t('snManage.romVersion')" prop="romVersion" min-width="230px">                
            </el-table-column>
            <el-table-column :label="$t('snManage.appVersion')" prop="appVersion" min-width="130px">
            </el-table-column>
            <el-table-column label="sn" min-width="230px" prop="sn">                
            </el-table-column>
            <el-table-column :label="$t('snManage.isTest')" min-width="130px" prop="isTest">
                <template scope="scope">
                    <span v-if="scope.row.isTest == 1">{{$t('shop.yes')}}</span>
                    <span v-if="scope.row.isTest == 0">{{$t('shop.no')}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('snManage.tableNo')" min-width="130px" prop="tableNo">                
            </el-table-column>
            <el-table-column :label="$t('snManage.shopId')" min-width="130px" prop="shopId">                
            </el-table-column>
            <el-table-column :label="$t('snManage.managerId')" min-width="130px" prop="managerId">                
            </el-table-column>            
            <el-table-column :label="$t('_global.action')" fixed="right" width="100px">
                <template scope="scope">                    
                    <el-button type="text" size="small" @click="snUpdate(scope.row)">
                        <i class="el-icon-edit" :title="$t('_global.edit')"></i>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block turn-page" style="margin-top:10px;">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="totalItems">
            </el-pagination>
        </div>

        <el-dialog
        :title="$t('snManage.update')"
        :visible.sync="snDialogVisible"
        size="tiny">
            <el-form label-width="80px" :model="snForm">
                <el-form-item :label="$t('snManage.robotId')">
                    <el-input v-model="snForm.robotId" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item :label="$t('snManage.isTest')">
                    <el-select v-model="snForm.isTest">
                        <el-option :label="$t('shop.yes')" value="1"></el-option>
                        <el-option :label="$t('shop.no')" value="0"></el-option>
                    </el-select>
                </el-form-item>                 
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="snDialogVisible = false">{{$t('_global.cancel')}}</el-button>
                <el-button type="primary" @click="changeTest()">{{$t('_global.confirm')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import $http from "../../utils/http";
export default {
  data() {
    return {
      snLists: [],
      middleObj: {},
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      snName:'',
      snDialogVisible:false,
      snForm: {
        robotId: '',
        isTest: ''
      },
      snSearchForm:{
          name:''
      }      
    }
  },
  created() {
    this.getSnLists();
  },
  computed: {},
  methods: {
    getSnLists() {
      $http
        .post("/coron-web/robot/getAllSn",{
            rp:this.pageSize,
            page:this.currentPage
        })
        .then(res => {
          if (res.status) {            
            this.snLists = res.entry.rows;
            this.totalItems = res.entry.total;
          }
        });
    },

    getSn(){
        $http.post('/coron-web/robot/getBySn',{
            sn:this.snSearchForm.name
        }).then( res => {            
            if(res.status && res.entry){                
                this.snLists = [];
                this.snLists.push(res.entry);
                this.totalItems = 1;
            } else {                
                this.$message({
                    type:'error',
                    message:this.$t('snManage.noSN')
                });
            }

        }).catch( err => {
            console.log(err);
        })



    },

    handleSizeChange(size) {
        console.log(size);
    },
    // 翻页
    handleCurrentChange(page) {        
        this.getSnLists();
    },

    snUpdate(item){        
        this.snDialogVisible = true;
        this.snForm.robotId = item.robotId;
        this.snForm.isTest = typeof item.isTest == "undefined" ? "":item.isTest+ "";      
    },

    changeTest(){
        let data = {
            robotId:this.snForm.robotId,
            isTest:this.snForm.isTest
        }

        $http.post('/coron-web/robot/update',data).then(res => {            
            if(res.status){
                this.snDialogVisible = false;
                this.$message({
                    type:'success',
                    message:this.$t('tips.message.updateSuccess')
                });
                this.getSnLists();
            } else {
                this.$message({
                    type:'error',
                    message:this.$t('tips.message.updateError')
                });
            }
        })        


    }
  }
};
</script>


<style>
.robotDancePage {
  padding: 10px 15px;
  background-color: #fff;
}
</style>
