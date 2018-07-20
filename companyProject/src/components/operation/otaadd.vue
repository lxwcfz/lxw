<template>
    <div class="ota-add-page">
        <el-form :model="otaUpdateForm" :rules="otaUpdateFormRules" ref="otaUpdateForm" label-width="100px" class="otaForm">            
            <el-form-item :label="$t('otaManage.romName')" prop="romName">
                <el-input v-model="otaUpdateForm.romName" :placeholder="$t('placeholder.romName')"></el-input>
            </el-form-item>
            <el-form-item label="ROM CODE" prop="romCode">
                <el-input v-model="otaUpdateForm.romCode" :placeholder="$t('placeholder.romCode')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('otaManage.romType')" prop="romType">
                <el-select v-model="otaUpdateForm.romType" placeholder="请选择打包类型">
                    <el-option label="full" value="1"></el-option>
                    <el-option label="delta" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('otaManage.pushAddress')" prop="region">
                <el-select v-model="otaUpdateForm.region" placeholder="请选择发布地区">
                    <el-option label="中国(China)" value="CN"></el-option>
                    <el-option label="日本(Janpan)" value="JP"></el-option>
                    <el-option label="英国(UK)" value="GB"></el-option>
                    <el-option label="美国(US)" value="US"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('otaManage.pushType')" prop="publishType">
                <el-select v-model="otaUpdateForm.publishType" placeholder="请选择发布类型">
                    <el-option label="debug" value="0"></el-option>
                    <el-option label="test" value="1"></el-option>
                    <el-option label="release" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('otaManage.pushStatus')" prop="publishState">
                <el-select v-model="otaUpdateForm.publishState" placeholder="请选择发布状态">
                    <el-option label="testing" value="0"></el-option>
                    <el-option label="release" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('otaManage.fileUpload')">
                <el-upload drag
                action=""
                ref="romUpload"
                :auto-upload="false"
                :file-list="fileList"               
                :on-change="handleChange">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或
                        <em>点击上传</em>
                    </div>
                    <div class="el-upload__tip" slot="tip">只能上传.zip文件</div>
                </el-upload>
                <el-progress v-for="(item,index) in percentArray" :key="item" :text-inside="true" :stroke-width="18" :percentage="item" status="success" v-if=" index+1 == percentArray.length"></el-progress>                
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="otaUpload()">{{$t('otaManage.update')}}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import $http from '../../utils/http'
import OSSUpload from '../../utils/OSSUpload/OSSUpload'
export default {
    data() {
        return {                                   
            otaUpdateForm: {
                romName: '',
                romCode: '',
                romType: '1',
                region: 'JP',
                publishType: '0',
                publishState: '0'
            },
            otaUpdateFormRules: {
                romName: [
                    { required: true, message: this.$t('tips.rules.romname'), trigger: 'blur' }
                ],
                romCode: [
                    { required: true, message: this.$t('tips.rules.romcode'), trigger: 'blur' }
                ]
            },            
            fileList: [],            
            middleObj: {},
            myOSSUpload:{},
            parent:0,
            percentArray:[]
        }
    },
    created() {
        
    },
    computed: {
        percentage(){
            return this.percent
        }
    },
    methods: {

        addRobotDance() {
            this.robotDanceDialogVisible = true;
            this.btnTag = 'add';
            this.clearRobotForm();
        },

        beforeRomUpload(file) {            

            const isZIP = file.raw.name.slice(-4) === '.zip';
            const isLt500M = file.raw.size / 1024 / 1024 < 500;

            if (!isZIP) {
                this.$message.error(this.$t('tips.otaUpload.type'));
                return false;
            }
            if (!isLt500M) {
                this.$message.error(this.$t('tips.otaUpload.size'));
                return false;
            }
            return isZIP && isLt500M;
        },

        handleAvatarSuccess(res, file, fileList) {

            if (!res.status) {
                this.$message.error(res.message);
            }
            this.imageUrl = URL.createObjectURL(file.raw);
            this.robotDanceForm.danceImg = res.entry;

        },

        handleChange(file,fileList){

            const beforeResult = this.beforeRomUpload(file);
            
            if(fileList.length > 1){                
                this.$message.error(this.$t('tips.apkUpload.num'));
                fileList.pop();                                           
            }

            if(beforeResult){

                if(file.status == 'ready'){
                    this.myOSSUpload = new OSSUpload(file.raw,1);
                }                

            } else {
                
                this.fileList = [];
                
            }

        },

        otaUpload(){
            
            this.$refs['otaUpdateForm'].validate((valid) => {
                if(valid){
                    this.startUpload();
                } else {
                    
                    this.$message({
                        type:'warning',
                        message: this.$t('tips.rules.error')
                    })
                }
            })

        },

        startUpload(){
            var self = this;
            self.myOSSUpload.on('md5',function(md5){

                var data = {
                    romName : self.otaUpdateForm.romName,        
                    romCode : self.otaUpdateForm.romCode,            
                    romType : self.otaUpdateForm.romType,            
                    region : self.otaUpdateForm.region,       
                    publishType : self.otaUpdateForm.publishType,
                    publishState : self.otaUpdateForm.publishState
                };

                self.myOSSUpload.start(data);
            });

            self.myOSSUpload.on('append', function (data) {
                
                this.percent = parseInt(data*100);                
                self.percentArray.push(this.percent);

            });

            self.myOSSUpload.on('finish', function () {
                
                self.$router.push({
                    path:'/operation/otamanage'
                })

            });

            self.myOSSUpload.on('error', function (err) {                
                self.$message.error(err);
            });

            self.myOSSUpload.init();
        }

    }
}
</script>


<style>
.ota-add-page {
    padding: 20px 15px;
    background-color: #fff;
}
.otaForm {
    width: 60%;
    margin: 0 auto;
}
</style>
