<template>
    <div class="ota-add-page">
        <el-form :model="apkAddForm" :rules="apkAddFormRules" ref="apkAddForm" label-width="100px" class="otaForm">            
            <el-form-item :label="$t('apkManage.apkName')" prop="name">
                <el-input v-model="apkAddForm.name" :placeholder="$t('placeholder.appName')"></el-input>
            </el-form-item>
            <el-form-item label="APK CODE" prop="code">
                <el-input v-model="apkAddForm.code" :placeholder="$t('placeholder.appCode')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('apkManage.apkType')" prop="type">
                <el-select v-model="apkAddForm.type" placeholder="请选择apk类型">
                    <el-option :label="$t('apkManage.dyApk')" value="1"></el-option>
                    <el-option :label="$t('apkManage.kzbApk')" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('apkManage.pushAddress')" prop="region">
                <el-select v-model="apkAddForm.region" placeholder="请选择发布地区">
                    <el-option label="中国(China)" value="CN"></el-option>
                    <el-option label="日本(Japan)" value="JP"></el-option>
                    <el-option label="英国(UK)" value="GB"></el-option>
                    <el-option label="美国(US)" value="US"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('apkManage.pushType')" prop="publishType">
                <el-select v-model="apkAddForm.publishType" placeholder="请选择发布类型">
                    <el-option label="debug" value="0"></el-option>
                    <el-option label="test" value="1"></el-option>
                    <el-option label="release" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('apkManage.pushStatus')" prop="publishState">
                <el-select v-model="apkAddForm.publishState" placeholder="请选择发布状态">
                    <el-option label="testing" value="0"></el-option>
                    <el-option label="release" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('apkManage.fileUpload')">
                <el-upload drag
                action=""
                ref="romUpload"
                :auto-upload="false"
                :file-list="fileList"               
                :on-change="handleChange">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">
                        {{$t('tips.apkUpload.style')}}<em>{{$t('tips.apkUpload.click')}}</em>
                    </div>
                    <div class="el-upload__tip" slot="tip">{{$t('tips.apkUpload.type')}}</div>
                </el-upload>
                <el-progress v-for="(item,index) in percentArray" :key="item" :text-inside="true" :stroke-width="18" :percentage="item" status="success" v-if=" index+1 == percentArray.length"></el-progress>                
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="apkUpload()">{{$t('apkManage.updateConfirm')}}</el-button>
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
            apkAddForm: {
                name: '',
                code: '',
                type: '1',
                region: 'JP',
                publishType: '0',
                publishState: '0'
            },
            apkAddFormRules: {
                name: [
                    { required: true, message: this.$t('tips.rules.appname'), trigger: 'blur' }
                ],
                code: [
                    { required: true, message: this.$t('tips.rules.appcode'), trigger: 'blur' }
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
            
            const isAPK = file.raw.name.slice(-4) === '.apk';
            const isLt200M = file.raw.size / 1024 / 1024 < 200;

            if (!isAPK) {
                this.$message.error(this.$t('tips.apkUpload.type'));
            }
            if (!isLt200M) {
                this.$message.error(this.$t('tips.apkUpload.size'));                
            }
            return isAPK && isLt200M;
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

                    this.myOSSUpload = new OSSUpload(file.raw,2);
                }                

            } else {
                
                this.fileList = [];
                
            }          
            
        },

        apkUpload(){
            
            this.$refs['apkAddForm'].validate((valid) => {
                if(valid){
                    this.startUpload();
                } else {                    
                    this.$message({
                        type:'warning',
                        message:this.$t('tips.rules.error')
                    })
                }
            })

        },

        startUpload(){
            var self = this;
            self.myOSSUpload.on('md5',function(md5){

                var data = {
                    name : self.apkAddForm.name,        
                    code : self.apkAddForm.code,            
                    type : self.apkAddForm.type,            
                    region : self.apkAddForm.region,
                    publishType : self.apkAddForm.publishType,
                    publishState : self.apkAddForm.publishState
                };

                self.myOSSUpload.start(data);
            });

            self.myOSSUpload.on('append', function (data) {                
                this.percent = parseInt(data*100);                
                self.percentArray.push(this.percent);
            });

            self.myOSSUpload.on('finish', function () {                
                self.$router.push({
                    path:'/operation/apkmanage'
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
