<template>
  <div class="robotDancePage">
    <el-form :inline="true" style="text-align:center;">      
      <el-form-item>
        <el-button type="primary" @click="addRobotDance()">{{$t('robot.addDance')}}</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="robotDanceLists" border style="width: 100%; text-align:center;">
      <el-table-column prop="robotDanceId" fixed="left" sortable :label="$t('robot.danceId')" width="120">
      </el-table-column>
      <el-table-column :label="$t('robot.danceType')"  min-width="150">
        <template scope="prop">
          <span v-if="prop.row.type == 1">{{$t('robot.bootDance')}}</span>
          <span v-if="prop.row.type == 2">{{$t('robot.controlPanelDance')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="version" :label="$t('robot.version')">
      </el-table-column>
      <el-table-column prop="motionCodesPojo.zh.danceName" :label="$t('robot.danceName')" min-width="120">
      </el-table-column>
      <el-table-column prop="motionCodesPojo.zh.danceCode" :label="$t('robot.danceCode')" min-width="200">
      </el-table-column>
      <el-table-column :label="$t('robot.danceImg')" width="150">
        <template scope="prop">          
          <el-popover
            ref="popoverImg"
            placement="top"            
            trigger="hover">
            <img :src="baseUrl + prop.row.motionCodesPojo.zh.danceImg" alt="" width="200" height="200" style="margin-top:5px;">
          </el-popover>          
          <el-button v-popover:popoverImg type="text">
            <img :src="baseUrl + prop.row.motionCodesPojo.zh.danceImg" alt="" width="50" height="50" style="margin-top:5px;">
          </el-button>
        </template>
      </el-table-column>
      <el-table-column :label="$t('robot.danceMusic')" width="330px">
        <template scope="prop">
          <div>
            <audio :src="baseUrl + prop.row.motionCodesPojo.zh.danceMusic" controls="controls">
              Your browser does not support the audio element.
            </audio>
          </div>          
          <!-- <span>{{prop.row.motionCodesPojo.zh.danceMusic}}</span> -->
        </template>
      </el-table-column>
      <el-table-column :label="$t('_global.action')" fixed="right" width="100">
        <template scope="scope">
          <el-button type="text" size="small" @click="updaterobotDance(scope.row)">{{$t('_global.edit')}}</el-button>
          <el-button type="text" size="small" @click="confirmDel(scope.row)">{{$t('_global.delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title=" btnTag == 'add' ? $t('robot.addDance'):$t('robot.updateDance')" :visible.sync="robotDanceDialogVisible">
      <el-form :model="robotDanceForm" :rules="robotDanceFormRules" ref="robotDanceForm" :label-width="formLabelWidth">
        <el-form-item :label="$t('robot.danceName')" prop="danceName">
          <el-input v-model="robotDanceForm.danceName" :placeholder="$t('placeholder.robotDanceZH')"></el-input>          
          <el-input v-model="robotDanceForm.danceNameJP" :placeholder="$t('placeholder.robotDanceJP')"></el-input>          
          <el-input v-model="robotDanceForm.danceNameEN" :placeholder="$t('placeholder.robotDanceEN')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('robot.danceCode')" prop="danceCode">
          <el-input v-model="robotDanceForm.danceCode" :placeholder="$t('placeholder.robotDanceCode')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('robot.danceType')" prop="type">
          <el-select v-model="robotDanceForm.type">
            <el-option :label="$t('robot.bootDance')" value="1"></el-option>
            <el-option :label="$t('robot.controlPanelDance')" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('robot.danceImg')" prop="danceImg">
          <el-upload class="avatar-uploader" action="/coron-web/upload/robotDanceImgUpload" 
          :show-file-list="false" 
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="uploadSuccessTag ? imageUrl:baseUrl + robotDanceForm.danceImg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-button v-if="imageUrl" size="small" type="text" @click="cancelUpload()"> {{$t('_global.delete')}}</el-button>
        </el-form-item>
        <el-form-item :label="$t('robot.danceMusic')" prop="danceMusic">
          <el-upload action="/coron-web/upload/robotDanceMusicUpload" 
          :before-upload="beforeMusicUpload"
          :on-success="handleMusicSuccess"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList">
            <el-button size="small" type="primary">{{$t('robot.clickUploadMusic')}}</el-button>
            <div slot="tip" class="el-upload__tip">{{$t('robot.uploadLimit')}}</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="robotDanceDialogVisible = false">{{$t('_global.cancel')}}</el-button>
        <el-button type="primary" @click="addRobotDancePost()" v-if="btnTag == 'add'">{{$t('_global.lijiAdd')}}</el-button>
        <el-button type="primary" @click="updaterobotDancePost()" v-else>{{$t('_global.lijiEdit')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import $http from '../../utils/http'
export default {
  data() {
    return {      
      robotDanceLists: [],
      robotDanceDialogVisible: false,
      formLabelWidth: '120px',
      robotDanceForm: {
        danceName: '',
        danceNameZH: '',
        danceNameJP: '',
        danceNameEN: '',
        danceCode: '',
        danceImg: '',
        danceMusic: '',
        type: '1'
      },
      robotDanceFormRules:{
        danceName:[
          { required:true , message:'请输入舞蹈名称', trigger:'blur'}
        ],
        danceNameEN:[
          { required:true , message:'请输入舞蹈英文名称', trigger:'blur'}
        ],
        danceNameJP:[
          { required:true , message:'请输入舞蹈日文名称', trigger:'blur'}
        ],
        danceCode:[
          { required:true , message:'请输入舞蹈动作代码', trigger:'blur'}
        ],
        danceImg:[
          { required:true , message:'请上传舞蹈动作图片', trigger:'change'}
        ],
        danceMusic:[
          { required:true , message:'请上传舞蹈动作音乐', trigger:'change'}
        ]
      },
      imgFilelists:[],
      musicFilelists: [],
      fileList: [],
      imageUrl: '',
      middleObj:{},
      btnTag:'add',
      uploadSuccessTag:false
    }
  },
  created() {
    this.getRobotDanceLists();
  },
  computed: {
    baseUrl(){
        return `${window.location.origin}/coron-web/`;
    }
  },
  methods: {

    getRobotDanceLists() {
      $http.get('/coron-web/robotDance/getByShop').then(res => {
        
        if (res.status) {
          this.robotDanceLists = res.entry;
        } else {
          this.$message({
            type:'error',
            message:res.message
          });
        }

      })
    },

    addRobotDance() {
      this.robotDanceDialogVisible = true;
      this.btnTag = 'add';
      this.clearRobotForm();
    },
    
    beforeAvatarUpload(file) {      

      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' ;
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error(this.$t('tips.message.jpgorpng'));
      }
      if (!isLt2M) {
        this.$message.error(this.$t('tips.message.picSize'));
      }
      return isJPG && isLt2M;
    },

    handleAvatarSuccess(res, file ,fileList) {
      
      if(!res.status){
        this.$message.error(this.$t('tips.message.imgUploadError') + res.message);
      } else {
        this.$message.success(this.$t('tips.message.imgUploadSuccess'));
        this.uploadSuccessTag = true;
      }
      this.imageUrl = URL.createObjectURL(file.raw);
      this.robotDanceForm.danceImg = res.entry;      
    },

    cancelUpload(){
      this.imageUrl = '';
      this.robotDanceForm.danceImg = '';
    },

    beforeMusicUpload(file){
      
      const isMP3 = file.type === 'audio/mp3';
      const isLt15M = file.size / 1024 /1024 < 15;

      if (!isMP3) {
        this.$message.error(this.$t('tips.musicUpload.type'));
      }
      if (!isLt15M) {
        this.$message.error(this.$t('tips.musicUpload.size'));
      }
      
      return isMP3 && isLt15M;

    },

    handleMusicSuccess(res, file ,fileList){

      this.fileList = [];
      this.fileList.push(file);

      if(!res.status){
        this.$message.error(this.$t('tips.message.uploadError') + res.message);
      } else {
        this.$message({
          type:'success',
          message:this.$t('tips.message.uploadSuccess')
        });
      }

     
      //this.robotDanceForm.danceMusic = URL.createObjectURL(file.raw);
      this.robotDanceForm.danceMusic = file.response.entry;

    },

    handleRemove(file, fileList) {      
      this.robotDanceForm.danceMusic = '';
    },

    handlePreview(file) {
      console.log(file);
    },

    addRobotDancePost(){
      
      this.$refs['robotDanceForm'].validate((valid) => {

        if (valid) {
          
          this.robotDanceAdd();

        } else {
          
          this.$message({
            type:'error',
            message: this.$t('tips.rules.error')
          });

          return false;
        }

      });
    },

    robotDanceAdd(){

      const data = {
        type: this.robotDanceForm.type,
        motionCodesPojo: {
          zh: {
            danceName: this.robotDanceForm.danceName,
            danceCode: this.robotDanceForm.danceCode,
            danceImg: this.robotDanceForm.danceImg,
            danceMusic: this.robotDanceForm.danceMusic
          },
          en: {
            danceName: this.robotDanceForm.danceNameEN,
            danceCode: this.robotDanceForm.danceCode,
            danceImg: this.robotDanceForm.danceImg,
            danceMusic: this.robotDanceForm.danceMusic
          },
          jp: {
            danceName: this.robotDanceForm.danceNameJP,
            danceCode: this.robotDanceForm.danceCode,
            danceImg: this.robotDanceForm.danceImg,
            danceMusic: this.robotDanceForm.danceMusic
          }
        }
      };

      $http.post('/coron-web/robotDance/add', data).then(res => {                
        
        if(res.status){
          this.robotDanceDialogVisible = false;
          this.getRobotDanceLists();
          this.$message({
            type:'success',
            message:this.$t('tips.message.addSuccess')
          });
        } else {
          this.$message({
            type:'error',
            message:res.message
          })
        }

      })
    },

    updaterobotDance(item){
      this.uploadSuccessTag = false;
      this.robotDanceDialogVisible = true;
      this.btnTag = 'update';
      this.middleObj = item;      
      //根据当前不同的语言显示不同语言的内容
      this.fileList = [];
      let fileObj = {name:item.motionCodesPojo.zh.danceMusic, url:item.motionCodesPojo.zh.danceMusic};
      this.robotDanceForm.danceName = item.motionCodesPojo.zh.danceName;
      this.robotDanceForm.danceNameEN = item.motionCodesPojo.en.danceName;
      this.robotDanceForm.danceNameJP = item.motionCodesPojo.jp.danceName;
      this.robotDanceForm.danceCode = item.motionCodesPojo.zh.danceCode;
      this.robotDanceForm.danceImg = this.imageUrl = item.motionCodesPojo.zh.danceImg;
      this.robotDanceForm.danceMusic = item.motionCodesPojo.zh.danceMusic;
      this.fileList.push(fileObj);

    },

    updaterobotDancePost(){

      const data = {
        robotDanceId:this.middleObj.robotDanceId,
        type: this.robotDanceForm.type,
        motionCodesPojo: {
          zh: {
            danceName: this.robotDanceForm.danceName,
            danceCode: this.robotDanceForm.danceCode,
            danceImg: this.robotDanceForm.danceImg,
            danceMusic: this.robotDanceForm.danceMusic
          },
          en: {
            danceName: this.robotDanceForm.danceNameEN,
            danceCode: this.robotDanceForm.danceCode,
            danceImg: this.robotDanceForm.danceImg,
            danceMusic: this.robotDanceForm.danceMusic
          },
          jp: {
            danceName: this.robotDanceForm.danceNameJP,
            danceCode: this.robotDanceForm.danceCode,
            danceImg: this.robotDanceForm.danceImg,
            danceMusic: this.robotDanceForm.danceMusic
          }
        }
      };

      this.$refs['robotDanceForm'].validate((valid) => {

        if (valid) {          
          $http.post('/coron-web/robotDance/update',data).then(res => {           
           
            if(res.status){
              this.robotDanceDialogVisible = false;
              this.getRobotDanceLists();
              this.$message({
                type:'success',
                message:this.$t('tips.message.updateSuccess')
              });
            } else {
              this.$message({
                type:'error',
                message:res.message
              })
            }

          })

        } else {
          
          this.$message({
            type:'warning',
            message:this.$t('tips.rules.error')
          })
          return false;
        }

      });
      
    },

    delrobotDance(item){
      $http.post('/coron-web/robotDance/delete',{
        robotDanceId:item.robotDanceId
      }).then(res => {

        if(res.status){
          this.getRobotDanceLists();
          this.$message({
            type:'success',
            message:this.$t('tips.message.delSuccess')
          })
        } else {
          this.$message({
            type:'error',
            message:res.message
          })
        }
        
      })
    },

    confirmDel(item){
      this.$confirm(this.$t('tips.message.confirmDel'),this.$t('tips.message.hint'),{
        confirmButtonText:this.$t('tips.message.ok'),
        cancelButtonText:this.$t('tips.message.cancel'),
        type:'warning',
      }).then( () => {
        
        this.delrobotDance(item);

      }).catch(() => {
        this.$message({
          type:'info',
          message:this.$t('tips.message.canceled')
        });
      })
    },

    clearRobotForm(){
      this.robotDanceForm.danceName ='';
      this.robotDanceForm.danceNameJP ='';
      this.robotDanceForm.danceNameEN ='';
      this.robotDanceForm.danceCode = '';
      this.robotDanceForm.danceImg = '';
      this.imageUrl = '';
      this.robotDanceForm.danceMusic ='';
      this.musicFilelists = [];
      this.fileList = [];
    }

  }
}
</script>


<style>
.robotDancePage {
  padding: 20px 15px;
  background-color: #fff;
}
</style>
