<template>
    <div class="motion-info">        
        <div style="text-align:left; padding:10px 0;">
            <el-switch
                v-model="switchValue"
                on-color="#13ce66"
                off-color="#ff4949" @change="toggleScene()">
            </el-switch>            
            <span :style="{ color: switchValue ? '#13CE66':'#FF4949'}">{{switchValue ? $t('_global.on'):$t('_global.off')}}</span>
            <span v-if="_LANGUAGE == 0">
                （注：开启状态时按个性化语料回复，未编辑的按默认语料回复；关闭状态则统一按默认语料回复）
            </span>
            <span v-if="_LANGUAGE == 1">
                （Note: Reply with individualized corpus in open state; with default corpus in closed state and no edition state）
            </span>
            <span v-if="_LANGUAGE == 2">
                （注意：状態はオンにする時は、ロボットがカスタマイズコーパスによって返事します。編集していない場合は、デフォルトコーパスによって返事します。状態はオフにする時は、デフォルトコーパスによって返事します）
            </span>
        </div>
        <el-table :data="sceneLists" border style="width: 100%; text-align:center;">      
            <el-table-column prop="systemSceneId" :label="$t('scene.id')" min-width="100" fixed="left">
            </el-table-column>            
            <el-table-column prop="title" :label="$t('scene.name')" align="left" width="180">
                <template scope="scope">
                    <span v-if="_LANGUAGE == 0">{{scope.row.titlePojo.zh}}</span>                    
                    <span v-if="_LANGUAGE == 1">{{scope.row.titlePojo.en}}</span>                    
                    <span v-if="_LANGUAGE == 2">{{scope.row.titlePojo.jp}}</span>
                </template>
            </el-table-column>            
            <el-table-column prop="parametersPojo" :label="$t('scene.parameter')" min-width="180">
                <template scope="scope">
                    <el-tag
                    v-for="parameter in scope.row.parametersPojo"
                    :key="parameter.id"                    
                    type="primary"
                    v-if="_LANGUAGE == 0">                    
                    <span v-if="_LANGUAGE == 0">{{parameter.namePojo.zh}}</span>                    
                    <span v-if="_LANGUAGE == 1">{{parameter.namePojo.en}}</span>                    
                    <span v-if="_LANGUAGE == 2">{{parameter.namePojo.jp}}</span>
                    </el-tag>                    
                </template>
            </el-table-column>
            <el-table-column prop="sceneCasePojo" :label="$t('scene.useCorpus')" align="left" min-width="280">
                <template scope="scope">
                    <div v-if="scope.row.id">
                        <div v-if="scope.row.parametersPojo.length == 0">
                            <p v-if="_LANGUAGE == 0">
                                <span v-html="scope.row.corpusPojo.zh.webText">{{scope.row.corpusPojo.zh.webText}}</span>
                            </p>
                            <p v-if="_LANGUAGE == 2">
                                <span v-html="scope.row.corpusPojo.jp.webText">{{scope.row.corpusPojo.jp.webText}}</span>
                            </p>
                            <p v-if="_LANGUAGE == 1">
                                <span v-html="scope.row.corpusPojo.en.webText">{{scope.row.corpusPojo.en.webText}}</span>
                            </p>
                        </div>
                        <div v-else>
                            <p v-if="_LANGUAGE == 0">
                                <span v-html="scope.row.corpusPojo.zh.webValue">{{scope.row.corpusPojo.zh.webValue}}</span>
                            </p>
                            <p v-if="_LANGUAGE == 2">
                                <span v-html="scope.row.corpusPojo.jp.webValue">{{scope.row.corpusPojo.jp.webValue}}</span>
                            </p>
                            <p v-if="_LANGUAGE == 1">
                                <span v-html="scope.row.corpusPojo.en.webValue">{{scope.row.corpusPojo.en.webValue}}</span>
                            </p>
                        </div>
                    </div>
                    <div v-else>
                        <div v-if="scope.row.parametersPojo.length == 0">
                            <p v-if="_LANGUAGE == 0">
                                <span v-html="scope.row.defaultCorpusPojo.zh.webText">{{scope.row.defaultCorpusPojo.zh.webText}}</span>
                            </p>
                            <p v-if="_LANGUAGE == 2">
                                <span v-html="scope.row.defaultCorpusPojo.jp.webText">{{scope.row.defaultCorpusPojo.jp.webText}}</span>
                            </p>
                            <p v-if="_LANGUAGE == 1">
                                <span v-html="scope.row.defaultCorpusPojo.en.webText">{{scope.row.defaultCorpusPojo.en.webText}}</span>
                            </p>
                        </div>
                        <div v-else>
                            <p v-if="_LANGUAGE == 0">
                                <span v-html="scope.row.defaultCorpusPojo.zh.webValue">{{scope.row.defaultCorpusPojo.zh.webValue}}</span>
                            </p>
                            <p v-if="_LANGUAGE == 2">
                                <span v-html="scope.row.defaultCorpusPojo.jp.webValue">{{scope.row.defaultCorpusPojo.jp.webValue}}</span>
                            </p>
                            <p v-if="_LANGUAGE == 1">
                                <span v-html="scope.row.defaultCorpusPojo.en.webValue">{{scope.row.defaultCorpusPojo.en.webValue}}</span>
                            </p>
                        </div>
                    </div>
                </template>                
            </el-table-column>
            <el-table-column prop="sceneCasePojo" :label="$t('scene.case')" align="left" min-width="280">
                <template scope="scope">
                    <p v-if="_LANGUAGE == 0">{{scope.row.sceneCasePojo.zh}}</p>
                    <p v-if="_LANGUAGE == 2">{{scope.row.sceneCasePojo.jp}}</p>
                    <p v-if="_LANGUAGE == 1">{{scope.row.sceneCasePojo.en}}</p>
                </template>                
            </el-table-column> 
            <!-- <el-table-column prop="userUpdatedPojo" :label="$t('scene.operator')" width="180">                
            </el-table-column>  -->
            <el-table-column prop="gmtUpdated" :label="$t('scene.updatetime')" width="180">                
            </el-table-column> 
            <el-table-column :label="$t('_global.action')" width="180" fixed="right">
                <template scope="scope">
                    <el-button type="primary" size="small" @click="updateScene(scope.row)">{{$t('_global.edit')}}</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="block turn-page" style="margin-top:10px;">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="totalItems">
            </el-pagination>
        </div>

        <el-dialog :title=" btnTag == 'add' ? $t('scene.add'):$t('scene.update')" :visible.sync="addSceneDialogVisible" class="addDialog">
            <el-form :model="addSceneForm" ref="addSceneForm" label-width="150px">                

                <el-form-item :label="$t('scene.nameZH')" prop="sceneNameZH" v-if="_LANGUAGE == 0">                    
                    <span>{{addSceneForm.sceneNameZH}}</span>
                </el-form-item>

                <el-form-item :label="$t('scene.nameJP')" prop="sceneNameJP" v-if="_LANGUAGE == 2">
                    <span>{{addSceneForm.sceneNameJP}}</span>
                </el-form-item>

                <el-form-item :label="$t('scene.nameEN')" prop="sceneNameEN" v-if="_LANGUAGE == 1">
                    <span>{{addSceneForm.sceneNameEN}}</span>
                </el-form-item>

                <el-form-item :label="$t('scene.case')" prop="sceneCaseZH">
                    <p v-if="_LANGUAGE == 0"> <span>{{addSceneForm.sceneCaseZH}}</span></p>
                    <p v-if="_LANGUAGE == 1"> <span>{{addSceneForm.sceneCaseEN}}</span></p>
                    <p v-if="_LANGUAGE == 2"> <span>{{addSceneForm.sceneCaseJP}}</span></p>                    
                </el-form-item>

                <el-form-item :label="$t('scene.corpus')" v-if="_LANGUAGE == 0">
                    <p v-if="_LANGUAGE == 0"> <span v-html="defaultCorpusZH">{{defaultCorpusZH}}</span></p>
                    <p v-if="_LANGUAGE == 1"> <span v-html="defaultCorpusEN">{{defaultCorpusEN}}</span></p>
                    <p v-if="_LANGUAGE == 2"> <span v-html="defaultCorpusJP">{{defaultCorpusJP}}</span></p>
                </el-form-item>                

                <el-form-item :label="$t('scene.customCorpus')" prop="customCorpusZH" v-if="_LANGUAGE == 0">
                    <p>
                        <el-button
                        v-for="parameter in selectedParameters"
                        :key="parameter.id"                        
                        type="info" size="mini" @click="insertParameter(parameter,'zh')">
                        {{parameter.namePojo.zh}}
                        </el-button>
                    </p>
                    <el-row>
                      <el-col :span="10">
                          <el-input type="textarea" :autosize="{minRows:3,maxRows:5}" v-model="addSceneForm.customCorpusZH" :placeholder="this.$t('placeholder.customCorpusZH')"></el-input>
                      </el-col>
                      <el-col :span="14">
                          <div class="corpusShow" v-html="corpusNameZH">{{corpusNameZH}}</div>
                      </el-col>
                    </el-row>                    
                </el-form-item>

                <el-form-item prop="customCorpusJP" v-if="_LANGUAGE == 2">
                    <p>                       
                        <el-button 
                        v-for="parameter in selectedParameters"
                        :key="parameter.id"
                        type="info" size="mini" @click="insertParameter(parameter,'jp')">
                        {{parameter.namePojo.jp}}
                        </el-button>
                    </p>
                    <el-row>
                      <el-col :span="10">
                          <el-input type="textarea" :autosize="{minRows:3,maxRows:5}" v-model="addSceneForm.customCorpusJP" :placeholder="this.$t('placeholder.customCorpusJP')"></el-input>
                      </el-col>
                      <el-col :span="14">
                          <div class="corpusShow" v-html="corpusNameJP">{{corpusNameJP}}</div>
                      </el-col>
                    </el-row>
                </el-form-item>

                <el-form-item prop="customCorpusEN" v-if="_LANGUAGE == 1">
                    <p>
                        <el-button
                        v-for="parameter in selectedParameters"
                        :key="parameter.id"
                        type="info" size="mini" @click="insertParameter(parameter,'en')">
                        {{parameter.namePojo.en}}
                        </el-button>
                    </p>
                    <el-row>
                      <el-col :span="10">
                          <el-input type="textarea" :autosize="{minRows:3,maxRows:5}" v-model="addSceneForm.customCorpusEN" :placeholder="this.$t('placeholder.customCorpusEN')"></el-input>
                      </el-col>
                      <el-col :span="14">
                          <div class="corpusShow" v-html="corpusNameEN">{{corpusNameEN}}</div>
                      </el-col>
                    </el-row>
                </el-form-item>                               
                
                <el-form-item>
                    <el-button v-if="btnTag == 'add'" type="primary" @click="addValidate()">{{$t('_global.confirm')}}</el-button>
                    <el-button v-else type="primary" @click="updateValidate()">{{$t('_global.lijiEdit')}}</el-button>
                    <el-button @click="cancelDialog()">{{$t('_global.cancel')}}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import $http from "../../utils/http";
import Lockr from "lockr";
import Cookies from 'js-cookie';
import MD5 from "js-md5";
export default {
  data() {
    return {
      switchValue:false,
      sceneLists:[],
      parameters:[],
      checkedParameters:[],
      selectedParameters:[],
      selectedParameterNamesZH:[],
      selectedParameterNamesJP:[],
      selectedParameterNamesEN:[],
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      addSceneDialogVisible: false,
      btnTag:'add',
      addSceneForm: {
        sceneNameZH:"",
        sceneNameJP:"",
        sceneNameEN:"",
        sceneCaseZH:"",
        sceneCaseJP:"",
        sceneCaseEN:"",      
        corpusZH:"",
        corpusJP:"",
        corpusEN:"",
        customCorpusZH:"",
        customCorpusJP:"",
        customCorpusEN:"" 
      },
      addSceneFormRules: {
        customCorpusZH:[
            { required:true , message:this.$t('placeholder.customCorpusZH'), trigger:'blur'}
        ],
        customCorpusJP:[
            { required:true , message:this.$t('placeholder.customCorpusJP'), trigger:'blur'}
        ],
        customCorpusEN:[
            { required:true , message:this.$t('placeholder.customCorpusEN'), trigger:'blur'}
        ]
      },
      midddleObj:{},
      defaultCorpusZH:"",
      defaultCorpusEN:"",
      defaultCorpusJP:"",
      corpusNameZH:"",
      corpusNameEN:"",
      corpusNameJP:"",
      corpusValueZH:"",
      corpusValueEN:"",
      corpusValueJP:""
    };
  },
  created() {    
    this.getSceneList();
    this.getParameters();
    this.getShopInfoById();
  },
  computed: {
    
    baseUrl(){
        return `${window.location.origin}/coron-web/`;
    },
    _LANGUAGE(){
        return Cookies.get('SHOPLANGUAGE');
    },
    _SHOPID(){
        return Cookies.get('SHOPID');
    }

  },
  watch:{
      'addSceneForm.customCorpusZH':function(val){
        let regex,
            corpus = val;

        if(this.selectedParameters.length == 0){
            this.corpusValueZH = val;
            this.corpusNameZH = val;
        } else {
            
            //需要反向的把name 值替换成value 再提交
            this.selectedParameters.forEach((item,i) => {

                var regex2 = new RegExp(`{${item.namePojo.zh}}`,'gim');
                var value2 = corpus.match(regex2);

                if(value2 && value2[0]){
                    
                    var rpValue = value2[0];                    
                    corpus = corpus.replace(new RegExp(rpValue,'gim'),item.valuePojo.zh);
                    this.corpusValueZH = corpus;
                    
                } else {
                    this.corpusValueZH = corpus;
                }

            })

            this.selectedParameterNamesZH.forEach((elem,i) => {
            
                //var regex = new RegExp(`(${elem})`,'gim');
                //规定val 输入的时候参数必须在{}中
                regex = new RegExp(`{${elem}}`,'gim');            
                var value = val.match(regex);
                
                if(value && value[0]){
                    var strValue = value[0].substring(value[0].indexOf('{')+1,value[0].lastIndexOf('}'));
                    val = val.replace(new RegExp(value[0],'gim'),`<span class="el-tag el-tag--danger"><span class="el-select__tags-text">${strValue}</span></span>`);
                    this.corpusNameZH = val;
                } else {
                    this.corpusNameZH = val;
                }
                
            });

        }
 
        //var value = val.match(/\{(.|\\n)+?\}/gim);

      },
      'addSceneForm.customCorpusJP':function(val){
          let regex,
              corpus = val;
        
        if(this.selectedParameters.length == 0){
            this.corpusValueJP = val;
            this.corpusNameJP = val;
        } else {

            //需要反向的把name 值替换成value 再提交
            this.selectedParameters.forEach((item,i) => {

                var regex2 = new RegExp(`{${item.namePojo.jp}}`,'gim');
                var value2 = corpus.match(regex2);
                if(value2 && value2[0]){
                    var rpValue = value2[0];
                    corpus = corpus.replace(new RegExp(rpValue,'gim'),item.valuePojo.jp);
                    this.corpusValueJP = corpus;
                }
                
            })

            this.selectedParameterNamesJP.forEach((elem,i) => {
                
                //var regex = new RegExp(`(${elem})`,'gim');
                regex = new RegExp(`{${elem}}`,'gim');          
                var value = val.match(regex);
                if(value && value[0]){
                    var strValue = value[0].substring(value[0].indexOf('{')+1,value[0].lastIndexOf('}'));                
                    val = val.replace(new RegExp(value[0],'gim'),`<span class="el-tag el-tag--danger"><span class="el-select__tags-text">${strValue}</span></span>`);
                    this.corpusNameJP = val;
                } else {
                    this.corpusNameJP = val;
                }
                
            });
        }
      },
      'addSceneForm.customCorpusEN':function(val){
          let regex,
            corpus = val;
        
        if(this.selectedParameters.length == 0){
            this.corpusValueEN = val;
            this.corpusNameEN = val;
        } else {
            //需要反向的把name 值替换成value 再提交
            this.selectedParameters.forEach((item,i) => {

                var regex2 = new RegExp(`{${item.namePojo.en}}`,'gim');
                var value2 = corpus.match(regex2);
                if(value2 && value2[0]){
                    var rpValue = value2[0];
                    corpus = corpus.replace(new RegExp(rpValue,'gim'),item.valuePojo.en);
                    this.corpusValueEN = corpus;
                }
                
            })

            this.selectedParameterNamesEN.forEach((elem,i) => {
                
                //var regex = new RegExp(`(${elem})`,'gim');
                regex = new RegExp(`{${elem}}`,'gim');                    
                var value = val.match(regex);
                if(value && value[0]){
                    var strValue = value[0].substring(value[0].indexOf('{')+1,value[0].lastIndexOf('}'));                
                    val = val.replace(new RegExp(value[0],'gim'),`<span class="el-tag el-tag--danger"><span class="el-select__tags-text">${strValue}</span></span>`);
                    this.corpusNameEN = val;
                } else {
                    this.corpusNameEN = val;
                }
                
            });
        }
        
      }

  },
  methods: {
      getShopInfoById(){
          $http.get('/coron-web/shop/getById',{
              id:this._SHOPID
          }).then(res => {
              if(res.status){                  
                  this.switchValue = res.entry.customizeMessage;
              }
          })
      },
    getSceneList() {
      $http
        .post("/coron-web/sceneShop/list", {          
          rp: this.pageSize,
          page: this.currentPage
        })
        .then(res => {
          
          if(res.status){
              this.sceneLists = res.rows;
              this.totalItems = res.total;
          } else {
              this.$message({
                  type:'error',
                  message:res.message
              });
          }
          
        });
    },

    toggleScene(){
        $http.post('/coron-web/shop/update',{
            customizeMessage: !this.switchValue
        }).then(res => {            
            if(res.status){
                this.$message({
                    type:'success',
                    message:this.$t('tips.message.updateSuccess')
                });
                this.getShopInfoById();
            }else {
                this.$message({
                    type:'error',
                    message:res.message
                })
            }
        })
    },

    insertParameter(item,lang){
        
        if(lang == 'zh'){
            this.addSceneForm.customCorpusZH += `{${item.namePojo.zh}}`;
        } else if (lang == 'jp'){
            this.addSceneForm.customCorpusJP += `{${item.namePojo.jp}}`;
        } else if (lang == 'en'){
            this.addSceneForm.customCorpusEN += `{${item.namePojo.en}}`;
        }     
    },

    cancelDialog(){
        this.addSceneDialogVisible = false;
        this.sceneFormReset();
    },

    updateScene(item){
        this.btnTag = 'update';
        this.addSceneDialogVisible = true;
        this.midddleObj = item;
        console.log(item);
        this.addSceneForm.sceneNameZH = item.titlePojo.zh;
        this.addSceneForm.sceneNameEN = item.titlePojo.en;
        this.addSceneForm.sceneNameJP = item.titlePojo.jp;        
                        
        this.addSceneForm.sceneCaseZH = item.sceneCasePojo.zh;
        this.addSceneForm.sceneCaseJP = item.sceneCasePojo.jp;
        this.addSceneForm.sceneCaseEN = item.sceneCasePojo.en;        

        this.defaultCorpusZH = item.parametersPojo.length == 0 ? item.defaultCorpusPojo.zh.webText:item.defaultCorpusPojo.zh.webValue;
        this.defaultCorpusEN = item.parametersPojo.length == 0 ? item.defaultCorpusPojo.en.webText:item.defaultCorpusPojo.en.webValue;
        this.defaultCorpusJP = item.parametersPojo.length == 0 ? item.defaultCorpusPojo.jp.webText:item.defaultCorpusPojo.jp.webValue;

        if(item.corpusPojo){
            
            this.addSceneForm.customCorpusZH = item.corpusPojo.zh.webText;
            this.addSceneForm.customCorpusEN = item.corpusPojo.en.webText;
            this.addSceneForm.customCorpusJP = item.corpusPojo.jp.webText;
        }
        this.checkedParameters = [];
        if(item.parametersPojo && item.parametersPojo[0]){
            item.parametersPojo.forEach((value,i) => {
                this.checkedParameters.push(value.id);
            })
        }
        this.parameterChange();

    },

    getParameters(){
        $http.get('/coron-web/sceneParameter/getAll').then(res => {
            if(res.status){
                this.parameters = res.entry;
            }
        })
    },

    parameterChange(){

        this.selectedParameters = [];
        this.selectedParameterNamesZH =[];
        this.selectedParameterNamesEN =[];
        this.selectedParameterNamesJP =[];
        this.parameters.forEach((value,i) => {
                
            if(this.checkedParameters.includes(value.id)){
                this.selectedParameters.push(value);
                this.selectedParameterNamesZH.push(value.namePojo.zh);
                this.selectedParameterNamesEN.push(value.namePojo.en);
                this.selectedParameterNamesJP.push(value.namePojo.jp);
            }

        });
    },

    updateScenePost(){

        const updateData = {
            id: !!this.midddleObj.id ? this.midddleObj.id : null,
            systemSceneId:this.midddleObj.systemSceneId,
            shopId:this.midddleObj.shopId,
            defaultCorpusPojo:this.midddleObj.defaultCorpusPojo,
            key:this.midddleObj.key,
            titlePojo:{
                zh:this.addSceneForm.sceneNameZH,
                en:this.addSceneForm.sceneNameEN,
                jp:this.addSceneForm.sceneNameJP
            },
            parametersPojo:this.selectedParameters,
            sceneCasePojo:{
                zh:this.addSceneForm.sceneCaseZH,
                en:this.addSceneForm.sceneCaseEN,
                jp:this.addSceneForm.sceneCaseJP
            },
            corpusPojo:{
                zh:{
                    webText:this.addSceneForm.customCorpusZH,
                    webValue:this.corpusNameZH,
                    value:this.corpusValueZH
                },
                en:{
                    webText:this.addSceneForm.customCorpusEN,
                    webValue:this.corpusNameEN,
                    value:this.corpusValueEN
                },
                jp:{
                    webText:this.addSceneForm.customCorpusJP,
                    webValue:this.corpusNameJP,
                    value:this.corpusValueJP
                }
            }                    
        };

        $http.post('/coron-web/sceneShop/update',updateData).then(res => {            
            
            if(res.status){
                this.$message({
                    type:'success',
                    message:this.$t('tips.message.updateSuccess')
                });

                this.addSceneDialogVisible = false;
                this.getSceneList();
                this.sceneFormReset();
                
            } else {
                this.$message({
                    type:'error',
                    message:res.message
                });
            }
            

        })
    },

    handleCurrentChange(page) {            
        this.getSceneList();
    },

    sceneFormReset(){
        this.addSceneForm.customCorpusZH = "";
        this.addSceneForm.customCorpusEN = "";
        this.addSceneForm.customCorpusJP = "";
    },

    updateValidate(){
        this.$refs['addSceneForm'].validate((valid) => {

            if (valid) {
            
                this.updateScenePost();

            } else {
            
                this.$message({
                    type:'error',
                    message: this.$t('tips.rules.error')
                });

                return false;
            }

        });

    }

  }
};
</script>

<style scoped>
.motion-info {
  padding: 10px 15px;
  background: #fff;
  text-align: center;
}

.motion-info p {
  margin: 5px 0;
  line-height: 30px;
}
.corpusShow {
    padding-left: 10px;
    line-height: 20px;
    height: 50px;
}
.corpusShow .el-tag {
    margin-left: 0;
}
</style>
