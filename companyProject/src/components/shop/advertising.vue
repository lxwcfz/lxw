<template>
    <div class="ad-info">
        <el-form :inline="true">            
            <el-form-item :label="$t('advert.type')">
                <el-select v-model="adType" :placeholder="$t('placeholder.advertType')"  @change="getadvertList()">
                    <el-option :label="$t('advert.video')" value="1"></el-option>
                    <el-option :label="$t('advert.picture')" value="2"></el-option>                    
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="openAddDialog()">{{$t('advert.add')}}</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="adLists" border style="width: 100%; text-align:center;">      
            <el-table-column prop="advertId" :label="$t('advert.ID')" width="180">
            </el-table-column>
            <el-table-column prop="advertName" :label="$t('advert.name')" width="180">
            </el-table-column> 
            <el-table-column :label="$t('advert.picShow')" width="150">
                <template scope="scope">
                    <img :src="baseUrl + scope.row.advertUrlPojo.zh.imgUrl" width="80" height="80" style="margin-top:5px;">
                </template>
            </el-table-column> 
            <el-table-column prop="advertType" :label="$t('advert.type')" width="120">
            </el-table-column>
            <el-table-column prop="advertTextPojo.zh" :label="$t('advert.text')">
                <template scope="scope">
                    <span>ZH：{{scope.row.advertTextPojo.zh}}</span>
                    <br>
                    <span>EN：{{scope.row.advertTextPojo.en}}</span>
                    <br>
                    <span>JP：{{scope.row.advertTextPojo.jp}}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('_global.action')" width="220" fixed="right">
                <template scope="scope">
                    <el-button type="primary" size="small" @click="changeSaleStatus(scope.row)">{{ scope.row.sale ? $t('products.soldout'):$t('products.putaway')}}</el-button>
                    <el-button type="primary" size="small" @click="updateAdvert(scope.row)">{{$t('_global.edit')}}</el-button>
                    <el-button type="danger" size="small" @click="confirmDel(scope.row)">{{$t('_global.delete')}}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block turn-page" style="margin-top:10px;">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="totalItems">
            </el-pagination>
        </div>

        <el-dialog :title=" btnTag == 'add' ? $t('advert.add'):$t('advert.update')" :visible.sync="addAdvertDialogVisible" class="addDialog">
            <el-form :model="addAdvertForm" :rules="addAdvertFormRules" ref="addAdvertForm" label-width="150px">
                <el-form-item :label="$t('advert.type')" prop="adType">
                    <el-select v-model="addAdvertForm.adType" :placeholder="$t('placeholder.advertType')"  @change="getadvertList()">
                        <el-option :label="$t('advert.video')" value="1"></el-option>
                        <el-option :label="$t('advert.picture')" value="2"></el-option>                    
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('advert.name')" prop="adName">
                    <el-input type="text" v-model="addAdvertForm.adName" :placeholder="$t('placeholder.advertName')"></el-input>
                </el-form-item>

                <el-form-item :label="$t('advert.picShow')" prop="imgUrl">
                    <el-upload class="avatar-uploader" action="/coron-web/upload/advertImgUpload" 
                    :show-file-list="false"
                    :before-upload="beforeAdvertPicUpload"
                    :on-success="handleAdvertPicSuccess">
                        <img v-if="advertImgUrl" :src="imgUploadSuccessTag ? advertImgUrl : baseUrl + addAdvertForm.imgUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <el-button v-if="advertImgUrl" size="small" type="text" @click="cancelUpload()"> {{$t('_global.delete')}}</el-button>
                </el-form-item>

                <el-form-item :label="$t('advert.textZH')" prop="advertTextZH">
                    <el-input v-model="addAdvertForm.advertTextZH" :placeholder="$t('placeholder.advertTextZH')"></el-input>
                </el-form-item>

                <el-form-item :label="$t('advert.audioZH')">
                    <el-upload action="/coron-web/upload/advertUploadMusic" 
                    :before-upload="beforeAdvertAudioUpload"
                    :on-success="handleAdvertAudioSuccessZH"
                    :on-error="handleAdvertAudioErrorZH"                    
                    :on-remove="handleRemove"
                    :file-list="fileListZH">
                        <el-button size="small" type="primary">{{$t('robot.clickUploadMusic')}}</el-button>
                        <div slot="tip" class="el-upload__tip">{{$t('advert.upload.limit')}}</div>
                    </el-upload>
                    <span v-if="editTag">{{ addAdvertForm.audioUrlZH}}</span>
                    <audio :src="baseUrl + addAdvertForm.audioUrlZH" controls="controls">
                        Your browser does not support the audio element.
                    </audio>                    
                </el-form-item>

                <el-form-item :label="$t('advert.textJP')" prop="advertTextJP">
                    <el-input v-model="addAdvertForm.advertTextJP" :placeholder="$t('placeholder.advertTextJP')"></el-input>
                </el-form-item>

                <el-form-item :label="$t('advert.audioJP')">
                    <el-upload action="/coron-web/upload/advertUploadMusic" 
                    :before-upload="beforeAdvertAudioUpload"
                    :on-success="handleAdvertAudioSuccessJP"
                    :on-error="handleAdvertAudioErrorJP"
                    :on-remove="handleRemove"
                    :file-list="fileListJP">
                        <el-button size="small" type="primary">{{$t('robot.clickUploadMusic')}}</el-button>                        
                        <div slot="tip" class="el-upload__tip">{{$t('advert.upload.limit')}}</div>
                    </el-upload>
                    <span v-if="editTag">{{ addAdvertForm.audioUrlJP}}</span>
                    <audio :src="baseUrl + addAdvertForm.audioUrlJP" controls="controls">
                        Your browser does not support the audio element.
                    </audio> 
                </el-form-item>

                <el-form-item :label="$t('advert.textEN')" prop="advertTextEN">
                    <el-input v-model="addAdvertForm.advertTextEN" :placeholder="$t('placeholder.advertTextEN')"></el-input>
                </el-form-item>

                <el-form-item :label="$t('advert.audioEN')">
                    <el-upload action="/coron-web/upload/advertUploadMusic" 
                    :before-upload="beforeAdvertAudioUpload"
                    :on-success="handleAdvertAudioSuccessEN"
                    :on-error="handleAdvertAudioErrorEN"
                    :on-remove="handleRemove"
                    :file-list="fileListEN">
                        <el-button size="small" type="primary">{{$t('robot.clickUploadMusic')}}</el-button>
                        <div slot="tip" class="el-upload__tip">{{$t('advert.upload.limit')}}</div>
                    </el-upload>
                    <span v-if="editTag">{{ addAdvertForm.audioUrlEN}}</span>
                    <audio :src="baseUrl + addAdvertForm.audioUrlEN" controls="controls">
                        Your browser does not support the audio element.
                    </audio>
                </el-form-item>
                
                <el-form-item>
                    <el-button v-if="btnTag == 'add'" type="primary" @click="addValidate()">{{$t('_global.confirm')}}</el-button>
                    <el-button v-else type="primary" @click="updateValidate()">{{$t('_global.lijiEdit')}}</el-button>
                    <el-button @click="addAdvertDialogVisible = false">{{$t('_global.cancel')}}</el-button>
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
      adType: "2",
      adLists: [],
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      addAdvertDialogVisible: false,
      btnTag:'add',
      addAdvertForm: {
        adType: "2",
        adName: "",
        imgUrl: "",
        audioUrlZH: "",
        advertTextZH: "",
        audioUrlEN: "",
        advertTextEN: "",
        audioUrlJP: "",
        advertTextJP: ""
      },
      addAdvertFormRules: {
        adName:[
            { required:true , message:this.$t('advert.rules.adName'), trigger:'blur'}
        ],
        imgUrl:[
            { required:true, message:this.$t('advert.rules.imgUrl'),trigger:'change'}
        ],
        advertTextZH:[            
            { min: 1, max: 200, message: this.$t('advert.rules.maxText'), trigger: 'blur' }
        ],
        advertTextEN:[            
            { min: 1, max: 200, message: this.$t('advert.rules.maxText'), trigger: 'blur' }
        ],
        advertTextJP:[            
            { min: 1, max: 200, message: this.$t('advert.rules.maxText'), trigger: 'blur' }
        ]
      },
      advertImgUrl:'',
      advertAudioUrlZH:'',
      advertAudioUrlEN:'',
      advertAudioUrlJP:'',
      imgUploadSuccessTag:false,
      editTag:false,
      fileListZH: [],
      fileListEN: [],
      fileListJP: [],
      midddleObj:{}
    };
  },
  created() {
    this.getadvertList();
  },
  computed: {
    baseUrl(){
        return `${window.location.origin}/coron-web/`;
    }
  },
  methods: {
    getadvertList() {
      $http
        .get("/coron-web/advert/list", {
          advertType: this.adType,
          rp: this.pageSize,
          page: this.currentPage
        })
        .then(res => {
          
          if(res.status){
              this.adLists = res.rows;
              this.totalItems = res.total;
          } else {
              this.$message({
                  type:'error',
                  message:res.message
              });
          }
          
        });
    },

    handleCurrentChange(page) {            
        this.getadvertList();
    },

    openAddDialog(){
        this.addAdvertDialogVisible = true;
        this.btnTag = 'add';
        this.editTag = false;
        this.addAdvertFormReset();
    },
    beforeAdvertPicUpload(file) {

      const isJPGORPNG = file.name.slice(-4) === '.jpg' || file.name.slice(-4) === '.png' || file.name.slice(-5) === '.jpeg';
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isJPGORPNG) {
        this.$message.error(this.$t('advert.upload.pictypeError'));
      }
      if (!isLt1M) {
        this.$message.error(this.$t('advert.upload.picsizeError'));
      }
      return isJPGORPNG && isLt1M;

    },
    handleAdvertPicSuccess(res, file, fileList) {

        if(res.status){
            this.$message({
                type:"success",
                message:this.$t('advert.upload.success')
            });
            this.imgUploadSuccessTag = true;
            this.advertImgUrl = URL.createObjectURL(file.raw);            
            this.addAdvertForm.imgUrl = res.entry;

        } else {
            this.$message.error(this.$t('advert.upload.error'));
        }        
        
    },

    cancelUpload(){
        this.advertImgUrl = '';
        this.addAdvertForm.imgUrl = "";
    },

    beforeAdvertAudioUpload(file){
        
        const isMP3 = file.name.slice(-4) === '.mp3';
        const isLt1M = file.size / 1024 / 1024 < 10;

        if (!isMP3) {
            this.$message.error(this.$t('advert.upload.audiotypeError'));
        }
        if (!isLt1M) {
            this.$message.error(this.$t('advert.upload.audiosizeError'));
        }
        return isMP3 && isLt1M;
    },

    handleAdvertAudioSuccessZH(res, file, fileList) {

        this.editTag = false;

        this.fileListZH = [];
        this.fileListZH.push(file);
        
        if(res.status){
            this.$message({
                type:"success",
                message:this.$t('advert.upload.success')
            });           

            this.advertAudioUrlZH = res.entry;
            this.addAdvertForm.audioUrlZH = res.entry;
        } else {
            this.$message({
                type:'error',
                message:this.$t('advert.upload.error')
            });
        }

    },

    handleAdvertAudioErrorZH(err, file, fileList){
        console.log(err);        
    },

    handleAdvertAudioSuccessEN(res, file, fileList) {

        this.editTag = false;

        this.fileListEN = [];
        this.fileListEN.push(file);
        
        if(res.status){
            this.$message({
                type:"success",
                message:this.$t('advert.upload.success')
            });           

            this.advertAudioUrlEN = res.entry;
            this.addAdvertForm.audioUrlEN= res.entry;
        } else {
            this.$message({
                type:'error',
                message:this.$t('advert.upload.error')
            });
        }

    },

    handleAdvertAudioErrorEN(err, file, fileList){
        console.log(err);        
    },

    handleAdvertAudioSuccessJP(res, file, fileList) {

        this.editTag = false;
        this.fileListJP = [];
        this.fileListJP.push(file);
        
        if(res.status){
            this.$message({
                type:"success",
                message:this.$t('advert.upload.success')
            });           

            this.advertAudioUrlJP = res.entry;
            this.addAdvertForm.audioUrlJP = res.entry;
        } else {
            this.$message({
                type:'error',
                message:this.$t('advert.upload.error')
            });
        }

    },

    handleAdvertAudioErrorJP(err, file, fileList){
        console.log("日文音频上传失败",err);        
    },

    handleRemove(file, fileList) {      
      
    },

    handlePreview(file) {
      console.log(file);
    },

    advertPicUpload() {},

    advertAudioUpload() {},    

    addAdvert() {
      const advertData = {
        advertName: this.addAdvertForm.adName,        
        advertType: this.addAdvertForm.adType,
        advertTextPojo: {
            zh:this.addAdvertForm.advertTextZH,
            en:this.addAdvertForm.advertTextEN,
            jp:this.addAdvertForm.advertTextJP
        },
        advertUrlPojo: {
            zh:{
                imgUrl:this.addAdvertForm.imgUrl,                
                fileUrl:this.addAdvertForm.audioUrlZH
            },
            en:{
                imgUrl:this.addAdvertForm.imgUrl,                
                fileUrl:this.addAdvertForm.audioUrlEN
            },
            jp:{
                imgUrl:this.addAdvertForm.imgUrl,                
                fileUrl:this.addAdvertForm.audioUrlJP
            }
        },
        sale:true
      };
      

      $http.post('/coron-web/advert/add',advertData).then(res => {          
          if(res.status){
              this.getadvertList();
              this.addAdvertFormReset();
          } else {
              this.$message({
                  type:'error',
                  message:res.message
              })
          }

          this.addAdvertDialogVisible = false;
      })


    },

    addValidate(){

        this.$refs['addAdvertForm'].validate((valid) => {

            if (valid) {
            
                this.addAdvert();

            } else {
            
                this.$message({
                    type:'error',
                    message: this.$t('tips.rules.error')
                });

                return false;
            }

        });
          
    },

    changeSaleStatus(item){

        $http.post('/coron-web/advert/update',{
            advertId:item.advertId,
            sale:!item.sale
        }).then(res => {
          
          if(res.status){
              
              this.$message({
                  type:'success',
                  message:this.$t('advert.updateSuccess')
              });
              this.getadvertList();
          } else {
              this.$message({
                  type:'error',
                  message:res.message
              });
          }
        })

    },

    updateAdvert(item){
        this.addAdvertFormReset();
        this.btnTag = 'update';
        this.editTag = true;
        this.addAdvertDialogVisible = true;
        this.imgUploadSuccessTag = false;        
        this.midddleObj = item;
        this.addAdvertForm.adName = item.advertName;
        this.addAdvertForm.adType = item.advertType + "";
        this.addAdvertForm.imgUrl = this.advertImgUrl = item.advertUrlPojo.zh.imgUrl;
        this.addAdvertForm.advertTextZH = item.advertTextPojo.zh;
        this.addAdvertForm.advertTextEN = item.advertTextPojo.en;
        this.addAdvertForm.advertTextJP = item.advertTextPojo.jp;
        this.addAdvertForm.audioUrlZH = item.advertUrlPojo.zh.fileUrl;
        this.addAdvertForm.audioUrlEN = item.advertUrlPojo.en.fileUrl;
        this.addAdvertForm.audioUrlJP = item.advertUrlPojo.jp.fileUrl;
    },


    updateAdvertPost(){

        const updateData = {
            advertId:this.midddleObj.advertId,
            advertName: this.addAdvertForm.adName,            
            advertType: this.addAdvertForm.adType,
            advertTextPojo: {
                zh:this.addAdvertForm.advertTextZH,
                en:this.addAdvertForm.advertTextEN,
                jp:this.addAdvertForm.advertTextJP
            },
            advertUrlPojo: {
                zh:{
                    imgUrl:this.addAdvertForm.imgUrl,
                    fileUrl:this.addAdvertForm.audioUrlZH,
                },
                en:{
                    imgUrl:this.addAdvertForm.imgUrl,
                    fileUrl:this.addAdvertForm.audioUrlEN,
                },
                jp:{
                    imgUrl:this.addAdvertForm.imgUrl,
                    fileUrl:this.addAdvertForm.audioUrlJP,
                }
            }
        };

        $http.post('/coron-web/advert/update',updateData).then(res => {            

            if(res.status){
                this.$message({
                    type:'success',
                    message:this.$t('advert.editSuccess')
                });
                this.getadvertList();
            } else {
                this.$message({
                    type:'error',
                    message:res.message
                });
            }

            this.addAdvertDialogVisible = false;
        })
    },

    updateValidate(){
        this.$refs['addAdvertForm'].validate((valid) => {

            if (valid) {
            
                this.updateAdvertPost();

            } else {
            
                this.$message({
                    type:'error',
                    message: this.$t('tips.rules.error')
                });

                return false;
            }

        });

    },

    delAdvert(item){

        $http.post('/coron-web/advert/delete',{
            advertId:item.advertId
        }).then(res => {

            if(res.status){
            
                this.$message({
                    type:'success',
                    message:this.$t('tips.message.delSuccess')
                });
                this.getadvertList();

            } else {
                this.$message({
                    type:'error',
                    message:res.message
                })
            }
        
      })

    },

    confirmDel(item){
        this.$confirm(this.$t('advert.sureDelete'),this.$t('tips.message.hint'),{
            confirmButtonText:this.$t('tips.message.ok'),
            cancelButtonText:this.$t('tips.message.cancel'),
            type:'warning',
        }).then( () => {
            
            this.delAdvert(item);

        }).catch(() => {
            this.$message({
            type:'info',
            message:this.$t('tips.message.canceled')
            });
        })
    },

    addAdvertFormReset(){
        this.addAdvertForm.adName = "";
        this.addAdvertForm.imgUrl = this.advertImgUrl = "";
        this.addAdvertForm.advertTextZH = "";
        this.addAdvertForm.advertTextEN = "";
        this.addAdvertForm.advertTextJP = "";
        this.addAdvertForm.audioUrlZH = "";
        this.addAdvertForm.audioUrlEN = "";
        this.addAdvertForm.audioUrlJP = "";
        this.fileListZH = [];
        this.fileListEN = [];
        this.fileListJP = [];
    }
  }
};
</script>

<style scoped>
.ad-info {
  padding: 10px 15px;
  background: #fff;
}

.ad-info p {
  margin: 5px 0;
  line-height: 30px;
}
</style>
