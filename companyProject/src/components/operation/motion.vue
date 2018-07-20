<template>
    <div class="monrion-info">
        <el-form :inline="true">
            <el-form-item>
                <el-button type="primary" @click="openAddDialog()">{{$t('motion.add')}}</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="motionLists" border style="width: 100%; text-align:center;">      
            <el-table-column prop="motionId" :label="$t('motion.id')" width="180">
            </el-table-column>            
            <el-table-column prop="motionCode" :label="$t('motion.code')" width="180">                
            </el-table-column>            
            <el-table-column prop="advertType" :label="$t('motion.name')">
                <template scope="scope">
                    <span>中文：{{scope.row.motionNamePojo.zh}}</span>
                    <br>
                    <span>英文：{{scope.row.motionNamePojo.en}}</span>
                    <br>
                    <span>日文：{{scope.row.motionNamePojo.jp}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('_global.action')" width="180" fixed="right">
                <template scope="scope">
                    <el-button type="primary" size="small" @click="updateMotion(scope.row)">{{$t('_global.edit')}}</el-button>
                    <el-button type="danger" size="small" @click="confirmDel(scope.row)">{{$t('_global.delete')}}</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="block turn-page" style="margin-top:10px;">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="totalItems">
            </el-pagination>
        </div>

        <el-dialog :title=" btnTag == 'add' ? $t('motion.add'):$t('motion.update')" :visible.sync="addMotionDialogVisible" class="addDialog">
            <el-form :model="addMotionForm" :rules="addMotionFormRules" ref="addMotionForm" label-width="150px">                

                <el-form-item :label="$t('motion.code')" prop="motionCode">
                    <el-input type="text" v-model="addMotionForm.motionCode" placeholder="请输入动作编号"></el-input>
                </el-form-item>

                <el-form-item :label="$t('motion.nameZH')" prop="motionNameZH">
                    <el-input v-model="addMotionForm.motionNameZH" placeholder="请输入中文动作名称"></el-input>
                </el-form-item>

                <el-form-item :label="$t('motion.nameJP')" prop="motionNameJP">
                    <el-input v-model="addMotionForm.motionNameJP" placeholder="请输入日文动作名称"></el-input>
                </el-form-item>                

                <el-form-item :label="$t('motion.nameEN')" prop="motionNameEN">
                    <el-input v-model="addMotionForm.motionNameEN" placeholder="请输入英文动作名称"></el-input>
                </el-form-item>
                
                <el-form-item>
                    <el-button v-if="btnTag == 'add'" type="primary" @click="addValidate()">{{$t('_global.confirm')}}</el-button>
                    <el-button v-else type="primary" @click="updateValidate()">{{$t('_global.lijiEdit')}}</el-button>
                    <el-button @click="addMotionDialogVisible = false">{{$t('_global.cancel')}}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import $http from "../../utils/http";
import Lockr from "lockr";
import MD5 from "js-md5";
export default {
  data() {
    return {      
      motionLists: [],
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      addMotionDialogVisible: false,
      btnTag:'add',
      addMotionForm: {
        motionCode:"",
        motionNameZH:"",
        motionNameJP:"",
        motionNameEN:""        
      },
      addMotionFormRules: {
        motionCode:[
            { required:true , message:this.$t('motion.rules.code'), trigger:'blur'}
        ],        
        motionNameZH:[
            { required:true , message:this.$t('motion.rules.nameZH'), trigger:'blur'},
            { min: 1, max: 200, message: this.$t('motion.rules.maxText'), trigger: 'blur' }
        ],
        motionNameEN:[
            { required:true , message:this.$t('motion.rules.nameEN'), trigger:'blur'},
            { min: 1, max: 200, message: this.$t('motion.rules.maxText'), trigger: 'blur' }
        ],
        motionNameJP:[
            { required:true , message:this.$t('motion.rules.nameJP'), trigger:'blur'},
            { min: 1, max: 200, message: this.$t('motion.rules.maxText'), trigger: 'blur' }
        ]
      },
      midddleObj:{}
    };
  },
  created() {
    this.getRobotMotionList();
  },
  computed: {
    baseUrl(){
        return `${window.location.origin}/coron-web/`;
    }
  },
  methods: {
    getRobotMotionList() {
      $http
        .get("/coron-web/robotMotion/list", {          
          rp: this.pageSize,
          page: this.currentPage
        })
        .then(res => {
          
          if(res.status){
              this.motionLists = res.rows;
              this.totalItems = res.total;
          } else {
              this.$message({
                  type:'error',
                  message:res.message
              });
          }
          
        });
    },

    openAddDialog(){
        this.addMotionDialogVisible = true;
        this.btnTag = 'add';
        this.addMotionFormReset();
    },
    addMotion() {
      const motionData = {
        motionCode: this.addMotionForm.motionCode,
        motionNamePojo: {
            zh:this.addMotionForm.motionNameZH,
            en:this.addMotionForm.motionNameEN,
            jp:this.addMotionForm.motionNameJP
        }
      };      

      $http.post('/coron-web/robotMotion/add',motionData).then(res => {          
          if(res.status){
              this.$message({
                  type:'success',
                  message:this.$t('motion.addSuccess')
              })
              this.getRobotMotionList();
              this.addMotionFormReset();
          } else {
              this.$message({
                  type:'error',
                  message:this.$t('motion.addError') + res.message
              })
          }

          this.addMotionDialogVisible = false;
      })


    },

    addValidate(){

        this.$refs['addMotionForm'].validate((valid) => {

            if (valid) {
            
                this.addMotion();

            } else {
            
                this.$message({
                    type:'error',
                    message: this.$t('tips.rules.error')
                });

                return false;
            }

        });
          
    },

    updateMotion(item){
        this.btnTag = 'update';
        this.addMotionDialogVisible = true;        
        this.midddleObj = item;
        this.addMotionForm.motionCode = item.motionCode;
        this.addMotionForm.motionNameZH = item.motionNamePojo.zh;
        this.addMotionForm.motionNameEN = item.motionNamePojo.en;
        this.addMotionForm.motionNameJP = item.motionNamePojo.jp;
    },


    updateMotiontPost(){

        const updateData = {
            motionId:this.midddleObj.motionId,
            motionCode: this.addMotionForm.motionCode,
            motionNamePojo: {
                zh:this.addMotionForm.motionNameZH,
                en:this.addMotionForm.motionNameEN,
                jp:this.addMotionForm.motionNameJP
            }            
        };

        $http.post('/coron-web/robotMotion/update',updateData).then(res => {            
            
            if(res.status){
                this.$message({
                    type:'success',
                    message:this.$t('motion.updateSuccess')
                });

                this.addMotionDialogVisible = false;
                this.getRobotMotionList();
            } else {
                this.$message({
                    type:'error',
                    message:res.message
                });
            }


            this.addMotionDialogVisible = false;


        })
    },

    handleCurrentChange(page) {            
        this.getRobotMotionList();
    },

    updateValidate(){
        this.$refs['addMotionForm'].validate((valid) => {

            if (valid) {
            
                this.updateMotiontPost();

            } else {
            
                this.$message({
                    type:'error',
                    message: this.$t('tips.rules.error')
                });

                return false;
            }

        });

    },

    delMotion(item){

        $http.post('/coron-web/robotMotion/delete',{
            motionId:item.motionId
        }).then(res => {

            if(res.status){
            
                this.$message({
                    type:'success',
                    message:this.$t('tips.message.delSuccess')
                });
                this.getRobotMotionList();

            } else {
                this.$message({
                    type:'error',
                    message:res.message
                })
            }
        
      })



    },

    confirmDel(item){
        this.$confirm(this.$t('motion.sureDel'),this.$t('tips.message.hint'),{
            confirmButtonText:this.$t('tips.message.ok'),
            cancelButtonText:this.$t('tips.message.cancel'),
            type:'warning',
        }).then( () => {
            
            this.delMotion(item);

        }).catch(() => {
            this.$message({
            type:'info',
            message:this.$t('tips.message.canceled')
            });
        })
    },

    addMotionFormReset(){

        this.addMotionForm.motionCode = "";        
        this.addMotionForm.motionNameZH = "";
        this.addMotionForm.motionNameJP = "";
        this.addMotionForm.motionNameEN = "";
        
    }
  }
};
</script>

<style scoped>
.monrion-info {
  padding: 10px 15px;
  background: #fff;
  text-align: center;
}

.monrion-info p {
  margin: 5px 0;
  line-height: 30px;
}
</style>
