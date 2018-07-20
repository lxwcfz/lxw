<template>
  <div class="sceneParameter-info">
    <el-form :inline="true">
        <el-form-item>
            <el-button type="primary" @click="openAddDialog()">添加场景参数</el-button>
        </el-form-item>
    </el-form>
    <el-table :data="sceneParamLists" border style="width: 100%; text-align:center;">
        <el-table-column prop="id" :label="$t('scene.id')" width="180" sortable>
        </el-table-column>       
        <el-table-column prop="gmtUpdated" align="left" label="参数名称">
            <template scope="scope">
                <p>中：<span>{{scope.row.namePojo.zh}}</span></p>
                <p>日：<span>{{scope.row.namePojo.jp}}</span></p>
                <p>英：<span>{{scope.row.namePojo.en}}</span></p>
            </template>
        </el-table-column>
        <el-table-column prop="gmtUpdated" align="left" label="参数值">
            <template scope="scope">
                <p>中：<span>{{scope.row.valuePojo.zh}}</span></p>
                <p>日：<span>{{scope.row.valuePojo.jp}}</span></p>
                <p>英：<span>{{scope.row.valuePojo.en}}</span></p>
            </template>
        </el-table-column>
         <el-table-column prop="gmtCreated" label="创建时间" width="180">
        </el-table-column>
        <el-table-column prop="gmtUpdated" label="更新时间" width="180">
        </el-table-column>
        <el-table-column :label="$t('_global.action')" width="180" fixed="right">
                <template scope="scope">
                    <el-button type="primary" size="small" @click="openUpdateDialog(scope.row)">{{$t('_global.edit')}}</el-button>
                    <el-button type="danger" size="small" @click="delSceneParam(scope.row)">{{$t('_global.delete')}}</el-button>
                </template>
            </el-table-column>
    </el-table>

    <el-dialog :title=" btnTag == 'add' ? '添加场景参数':'修改场景参数'" :visible.sync="addSceneParamDialogVisible" class="addDialog" size="small">
            <el-form :model="addSceneParamForm" :rules="addSceneFormRules" ref="addSceneParamForm" label-width="150px">                

                <el-form-item label="中文参数名称" prop="nameZH">
                    <el-input type="text" v-model="addSceneParamForm.nameZH" placeholder="请输入中文场景名称"></el-input>
                </el-form-item>

                <el-form-item label="日文参数名称" prop="nameJP">
                    <el-input type="text" v-model="addSceneParamForm.nameJP" placeholder="请输入日文场景名称"></el-input>
                </el-form-item>

                <el-form-item label="英文参数名称" prop="nameEN">
                    <el-input type="text" v-model="addSceneParamForm.nameEN" placeholder="请输入英文场景名称"></el-input>
                </el-form-item>

                <el-form-item label="场景参数值" prop="value">
                    <el-input type="text" v-model="addSceneParamForm.value" placeholder="请输入英文场景名称"></el-input>
                </el-form-item>      
                
                <el-form-item>
                    <el-button v-if="btnTag == 'add'" type="primary" @click="addValidate()">{{$t('_global.confirm')}}</el-button>
                    <el-button v-else type="primary" @click="updateValidate()">{{$t('_global.lijiEdit')}}</el-button>
                    <el-button @click="resetForm()">{{$t('_global.cancel')}}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
  </div>
</template>

<script>
import $http from "../../utils/http";
export default {
    data(){
        return {
            sceneParamLists:[],
            addSceneParamDialogVisible:false,
            btnTag:'add',
            addSceneParamForm:{
                nameZH:"",
                nameEN:"",
                nameJP:"",
                value:""
            },
            addSceneFormRules: {
                nameZH:[
                    { required:true , message:"请输入中文参数名称", trigger:'blur'}
                ],
                nameJP:[
                    { required:true , message:"请输入日文参数名称", trigger:'blur'}
                ],
                nameEN:[
                    { required:true , message:"请输入英文参数名称", trigger:'blur'}
                ],
                value:[
                    { required:true , message:"请输入参数值", trigger:'blur'}
                ]
            },
            middleObj:{}
        }
    },
    created() {
        this.getAllParameters();
    },
    computed: {
        baseUrl(){
            return `${window.location.origin}/coron-web/`;
        }
    },
    methods:{
        getAllParameters(){
            $http.get('/coron-web/sceneParameter/getAll').then(res => {
                console.log("场景参数",res);
                if(res.status){
                    this.sceneParamLists = res.entry;
                }
            })
        },

        openAddDialog(){
            this.addSceneParamDialogVisible = true;
            this.btnTag = 'add';
        },

        addSceneParam(){
            let addParam = {
                namePojo:{
                    zh:this.addSceneParamForm.nameZH,
                    en:this.addSceneParamForm.nameEN,
                    jp:this.addSceneParamForm.nameJP
                },
                valuePojo:{
                    zh:this.addSceneParamForm.value,
                    en:this.addSceneParamForm.value,
                    jp:this.addSceneParamForm.value
                }
            };

            $http.post('/coron-web/sceneParameter/add',addParam).then(res => {
                if(res.status){
                    console.log("tianjiajieguo",res);
                    this.$message({
                        type:'success',
                        message: "添加成功"
                    });
                    this.getAllParameters();
                    this.resetForm(); 
                }
            })
        },

    addValidate(){
            this.$refs['addSceneParamForm'].validate((valid) => {

                if (valid) {
                    this.addSceneParam();
                } else {
                    this.$message({
                        type:'error',
                        message: this.$t('tips.rules.error')
                    });
                    return false;
                }

            });

        },

        openUpdateDialog(item){
            this.btnTag = 'update';
            this.addSceneParamDialogVisible = true;
            this.middleObj = item;
            console.log(item);
            this.addSceneParamForm.nameZH = item.namePojo.zh;
            this.addSceneParamForm.nameEN = item.namePojo.en;
            this.addSceneParamForm.nameJP = item.namePojo.jp;
            this.addSceneParamForm.value = item.valuePojo.zh;
        },

        updateSceneParam(){
            let updateParam = {
                id:this.middleObj.id,
                namePojo:{
                    zh:this.addSceneParamForm.nameZH,
                    en:this.addSceneParamForm.nameEN,
                    jp:this.addSceneParamForm.nameJP
                },
                valuePojo:{
                    zh:this.addSceneParamForm.value,
                    en:this.addSceneParamForm.value,
                    jp:this.addSceneParamForm.value
                }
            }

            $http.post('/coron-web/sceneParameter/update',updateParam).then(res => {
                if(res.status){
                    console.log(res);
                    this.$message({
                        type:'success',
                        message: "修改成功"
                    });
                    this.getAllParameters();
                    this.resetForm();
                } else {
                    this.$message({
                        type:'error',
                        message:res.message
                    });
                }
            })
        },

        updateValidate(){
            this.$refs['addSceneParamForm'].validate((valid) => {

                if (valid) {
                    this.updateSceneParam();
                } else {
                    this.$message({
                        type:'error',
                        message: this.$t('tips.rules.error')
                    });

                    return false;
                }

            });

        },

        delSceneParam(item){

            this.$confirm('确定删除当前参数么?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                $http.post('/coron-web/sceneParameter/delete',{
                    id:item.id
                }).then(res => {
                    if(res.status){
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getAllParameters();
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
                    }
                })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });

        },

        resetForm() {
            this.addSceneParamDialogVisible = false;
            this.$refs['addSceneParamForm'].resetFields();
        }
    

        
    }
};
</script>

<style scoped>
.sceneParameter-info {
  padding: 10px 15px;
  background: #fff;
  text-align: center;
}

.sceneParameter-info p {
  margin: 5px 0;
  line-height: 30px;
}
</style>
