<template>
    <div class="motion-info">
        <el-form :inline="true">
            <el-form-item>
                <el-button type="primary" @click="openAddDialog()"> {{$t('scene.add')}} </el-button>
            </el-form-item>
        </el-form>
        <el-table :data="sceneLists" border style="width: 100%; text-align:center;">      
            <el-table-column prop="id" :label="$t('scene.id')" fixed="left" width="180">
            </el-table-column>            
            <el-table-column prop="title" :label="$t('scene.name')" align="left" width="180">
                <template scope="scope">
                    <span>中：{{scope.row.titlePojo.zh}}</span>
                    <!-- <br>
                    <span>en：{{scope.row.titlePojo.en}}</span>
                    <br>
                    <span>日：{{scope.row.titlePojo.jp}}</span> -->
                </template>
            </el-table-column>            
            <el-table-column prop="parametersPojo" :label="$t('scene.parameter')" min-width="280">
                <template scope="scope">
                    <el-tag
                    v-for="parameter in scope.row.parametersPojo"
                    :key="parameter.namePojo.zh"                    
                    type="primary"
                    >
                    {{parameter.namePojo.zh}}
                    </el-tag>                    
                </template>
            </el-table-column>
            <el-table-column prop="sceneCasePojo" :label="$t('scene.case')" align="left" min-width="280">
                <template scope="scope">
                    <p>中：{{scope.row.sceneCasePojo.zh}}</p>
                    <!-- <p>日：{{scope.row.sceneCasePojo.jp}}</p>
                    <p>en：{{scope.row.sceneCasePojo.en}}</p> -->
                </template>                
            </el-table-column>
            <el-table-column prop="corpusPojo" :label="$t('scene.corpus')" align="left" min-width="280">
                <template scope="scope">
                    <div v-if="scope.row.parametersPojo.length == 0">
                        <p>
                            中：<span v-html="scope.row.corpusPojo.zh.webText">{{scope.row.corpusPojo.zh.webText}}</span>
                        </p>
                        <!-- <p>
                            日：<span v-html="scope.row.corpusPojo.jp.webText">{{scope.row.corpusPojo.jp.webText}}</span>
                        </p>
                        <p>
                            en：<span v-html="scope.row.corpusPojo.en.webText">{{scope.row.corpusPojo.en.webText}}</span>
                        </p> -->
                    </div>
                    <div v-else>
                        <p>
                            中：<span v-html="scope.row.corpusPojo.zh.webValue">{{scope.row.corpusPojo.zh.webValue}}</span>
                        </p>
                        <!-- <p>
                            日：<span v-html="scope.row.corpusPojo.jp.webValue">{{scope.row.corpusPojo.jp.webValue}}</span>
                        </p>
                        <p>
                            en：<span v-html="scope.row.corpusPojo.en.webValue">{{scope.row.corpusPojo.en.webValue}}</span>
                        </p> -->
                    </div>
                </template>                
            </el-table-column> 
            <!-- <el-table-column prop="userUpdatedPojo" :label="$t('scene.operator')" width="180">                
            </el-table-column>  -->
            <el-table-column prop="gmtUpdated" :label="$t('scene.updatetime')" width="180">                
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

        <el-dialog :title=" btnTag == 'add' ? $t('scene.add'):$t('scene.update')" :visible.sync="addSceneDialogVisible" class="addDialog">
            <el-form :model="addSceneForm" :rules="addSceneFormRules" ref="addSceneForm" label-width="150px">                

                <el-form-item :label="$t('scene.nameZH')" prop="sceneNameZH">
                    <el-input type="text" v-model="addSceneForm.sceneNameZH" :placeholder="$t('placeholder.sceneNameZH')"></el-input>
                </el-form-item>

                <!-- <el-form-item :label="$t('scene.nameJP')" prop="sceneNameJP">
                    <el-input type="text" v-model="addSceneForm.sceneNameJP" :placeholder="$t('placeholder.sceneNameJP')"></el-input>
                </el-form-item>

                <el-form-item :label="$t('scene.nameEN')" prop="sceneNameEN">
                    <el-input type="text" v-model="addSceneForm.sceneNameEN" :placeholder="$t('placeholder.sceneNameEN')"></el-input>
                </el-form-item> -->

                <el-form-item :label="$t('scene.parameterList')">
                    <el-select
                    v-model="checkedParameters"
                    multiple
                    :placeholder="$t('placeholder.sceneParam')"
                    @change="parameterChange()">
                        <el-option
                        v-for="parameter in parameters"
                        :key="parameter.id"
                        :label="parameter.namePojo.zh"
                        :value="parameter.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('scene.corpus')" prop="corpusZH">
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
                          <el-input type="textarea" :autosize="{minRows:2,maxRows:3}" v-model="addSceneForm.corpusZH" :placeholder="$t('placeholder.corpusZH')"></el-input>
                      </el-col>
                      <el-col :span="14">
                          <div class="corpusShow" v-html="corpusNameZH">{{corpusNameZH}}</div>
                      </el-col>
                    </el-row>                    
                </el-form-item>

                <!-- <el-form-item prop="corpusJP">
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
                          <el-input type="textarea" :autosize="{minRows:2,maxRows:3}" v-model="addSceneForm.corpusJP" :placeholder="$t('placeholder.corpusJP')"></el-input>
                      </el-col>
                      <el-col :span="14">
                          <div class="corpusShow" v-html="corpusNameJP">{{corpusNameJP}}</div>
                      </el-col>
                    </el-row>
                </el-form-item>

                <el-form-item prop="corpusEN">
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
                          <el-input type="textarea" :autosize="{minRows:2,maxRows:3}" v-model="addSceneForm.corpusEN" :placeholder="$t('placeholder.corpusEN')"></el-input>
                      </el-col>
                      <el-col :span="14">
                          <div class="corpusShow" v-html="corpusNameEN">{{corpusNameEN}}</div>
                      </el-col>
                    </el-row>
                </el-form-item> -->

                <el-form-item :label="$t('scene.case')" prop="sceneCaseZH">
                    <el-input v-model="addSceneForm.sceneCaseZH" type="textarea" :placeholder="$t('placeholder.sceneCaseZH')">
                    </el-input>                    
                </el-form-item>

                <!-- <el-form-item prop="sceneCaseJP">
                    <el-input v-model="addSceneForm.sceneCaseJP" type="textarea" :placeholder="$t('placeholder.sceneCaseJP')">                        
                    </el-input>
                </el-form-item>

                <el-form-item prop="sceneCaseEN">
                    <el-input v-model="addSceneForm.sceneCaseEN" type="textarea" :placeholder="$t('placeholder.sceneCaseEN')">                        
                    </el-input>
                </el-form-item> -->
                
                <el-form-item>
                    <el-button v-if="btnTag == 'add'" type="primary" @click="addValidate()">{{$t('_global.confirm')}}</el-button>
                    <el-button v-else type="primary" @click="updateValidate()">{{$t('_global.lijiEdit')}}</el-button>
                    <el-button @click="addSceneDialogVisible = false">{{$t('_global.cancel')}}</el-button>
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
      sceneLists: [],
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
        parameters:[],        
        corpusZH:"",
        corpusJP:"",
        corpusEN:"",
        sceneCaseZH:"",
        sceneCaseJP:"",
        sceneCaseEN:""
      },
      addSceneFormRules: {
        sceneNameZH:[
            { required:true , message:this.$t('scene.rules.nameZH'), trigger:'blur'}
        ],
        sceneNameJP:[
            { required:true , message:this.$t('scene.rules.nameJP'), trigger:'blur'}
        ],
        sceneNameEN:[
            { required:true , message:this.$t('scene.rules.nameEN'), trigger:'blur'}
        ],
        corpusZH:[
            { required:true , message:this.$t('scene.rules.corpusZH'), trigger:'blur'}
        ],
        corpusJP:[
            { required:true , message:this.$t('scene.rules.corpusJP'), trigger:'blur'}
        ],
        corpusEN:[
            { required:true , message:this.$t('scene.rules.corpusEN'), trigger:'blur'}
        ],
        sceneCaseZH:[
            { required:true , message:this.$t('scene.rules.sceneCaseZH'), trigger:'blur'}
        ],
        sceneCaseJP:[
            { required:true , message:this.$t('scene.rules.sceneCaseJP'), trigger:'blur'}
        ],
        sceneCaseEN:[
            { required:true , message:this.$t('scene.rules.sceneCaseEN'), trigger:'blur'}
        ]
      },
      midddleObj:{},
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
  },
  computed: {
    baseUrl(){
        return `${window.location.origin}/coron-web/`;
    }
  },
  watch:{
      'addSceneForm.corpusZH':function(val){
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
      'addSceneForm.corpusJP':function(val){
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
                } else {
                    this.corpusValueJP = corpus;
                }
                
            })

            this.selectedParameterNamesJP.forEach((elem,i) => {
                                
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
      'addSceneForm.corpusEN':function(val){
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
                } else {
                    this.corpusValueEN = corpus;
                }
                
            })

            this.selectedParameterNamesEN.forEach((elem,i) => {
                                
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
    getSceneList() {
      $http
        .post("/coron-web/scene/list", {          
          rp: this.pageSize,
          page: this.currentPage
        }).then(res => {
          
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

    openAddDialog(){
        this.addSceneDialogVisible = true;
        this.btnTag = 'add';
        this.addSceneFormReset();        
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
    insertParameter(item,lang){

        if(lang == 'zh'){
            this.addSceneForm.corpusZH += `{${item.namePojo.zh}}`;
        } else if (lang == 'jp'){
            this.addSceneForm.corpusJP += `{${item.namePojo.jp}}`;
        } else if (lang == 'en'){
            this.addSceneForm.corpusEN += `{${item.namePojo.en}}`;
        }
        
    },

    addSence() {

      const sceneData = {
          titlePojo:{
              zh:this.addSceneForm.sceneNameZH,
              en:this.addSceneForm.sceneNameEN,
              jp:this.addSceneForm.sceneNameJP
          },
          parametersPojo:this.selectedParameters,
          corpusPojo:{
            zh:{
                webText:this.addSceneForm.corpusZH,
                webValue:this.corpusNameZH,
                value:this.corpusValueZH
            },
            en:{
                webText:this.addSceneForm.corpusEN,
                webValue:this.corpusNameEN,
                value:this.corpusValueEN
            },
            jp:{
                webText:this.addSceneForm.corpusJP,
                webValue:this.corpusNameJP,
                value:this.corpusValueJP
            }
          },
          sceneCasePojo:{
              zh:this.addSceneForm.sceneCaseZH,
              en:this.addSceneForm.sceneCaseEN,
              jp:this.addSceneForm.sceneCaseJP
          }        
      };
      $http.post('/coron-web/scene/add',sceneData).then(res => {          
          
          if(res.status){
              this.$message({
                  type:'success',
                  message:this.$t('motion.addSuccess')
              })
              this.getSceneList();              
              
          } else {
              this.$message({
                  type:'error',
                  message:this.$t('motion.addError') + res.message
              })
          }

          this.addSceneDialogVisible = false;
      })


    },

    addValidate(){
        this.$refs['addSceneForm'].validate((valid) => {

            if (valid) {
            
                this.addSence();

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
        this.addSceneDialogVisible = true;
        this.midddleObj = item;
        console.log(item);
        this.addSceneForm.sceneNameZH = item.titlePojo.zh;
        this.addSceneForm.sceneNameEN = item.titlePojo.en;
        this.addSceneForm.sceneNameJP = item.titlePojo.jp;  
        this.addSceneForm.corpusZH = item.corpusPojo.zh.webText;
        this.addSceneForm.corpusEN = item.corpusPojo.en.webText;
        this.addSceneForm.corpusJP = item.corpusPojo.jp.webText;
        this.addSceneForm.sceneCaseZH = item.sceneCasePojo.zh;
        this.addSceneForm.sceneCaseJP = item.sceneCasePojo.jp;
        this.addSceneForm.sceneCaseEN = item.sceneCasePojo.en;
        this.checkedParameters = [];
        if(item.parametersPojo && item.parametersPojo[0]){
            item.parametersPojo.forEach((value,i) => {
                this.checkedParameters.push(value.id);
            })
        }
        this.parameterChange();

    },

    regxReplace(){
        var str = "你好,{amount}";
        //查找所有{} 之间的内容
        var regx = "/\{(.| )+?\}/gim";
        str.replace(regx,`<span>测试</span>`);
    },

    updateScenePost(){

        const updateData = {
            id:this.midddleObj.id,
            titlePojo:{
                zh:this.addSceneForm.sceneNameZH,
                en:this.addSceneForm.sceneNameEN,
                jp:this.addSceneForm.sceneNameJP
            },
            parametersPojo:this.selectedParameters,
            corpusPojo:{
                zh:{
                    webText:this.addSceneForm.corpusZH,
                    webValue:this.corpusNameZH,
                    value:this.corpusValueZH
                },
                en:{
                    webText:this.addSceneForm.corpusEN,
                    webValue:this.corpusNameEN,
                    value:this.corpusValueEN
                },
                jp:{
                    webText:this.addSceneForm.corpusJP,
                    webValue:this.corpusNameJP,
                    value:this.corpusValueJP
                }
            },
            sceneCasePojo:{
                zh:this.addSceneForm.sceneCaseZH,
                en:this.addSceneForm.sceneCaseEN,
                jp:this.addSceneForm.sceneCaseJP
            }                
        };

        $http.post('/coron-web/scene/update',updateData).then(res => {            
            
            if(res.status){
                this.$message({
                    type:'success',
                    message:this.$t('motion.updateSuccess')
                });

                this.addSceneDialogVisible = false;
                this.getSceneList();
                this.addSceneFormReset();
            } else {
                this.$message({
                    type:'error',
                    message:res.message
                });
            }

            this.addSceneDialogVisible = false;

        })
    },

    handleCurrentChange(page) {            
        this.getSceneList();
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

    },

    delScene(item){

        $http.post('/coron-web/scene/delete',{
            id:item.id
        }).then(res => {

            if(res.status){
            
                this.$message({
                    type:'success',
                    message:this.$t('tips.message.delSuccess')
                });
                this.getSceneList();

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
            
            this.delScene(item);

        }).catch(() => {
            this.$message({
                type:'info',
                message:this.$t('tips.message.canceled')
            });
        })
    },

    addSceneFormReset(){

        this.addSceneForm.sceneNameZH = "";
        this.addSceneForm.sceneNameEN = "";
        this.addSceneForm.sceneNameJP = "";        
        this.addSceneForm.corpusZH = "";
        this.addSceneForm.corpusEN = "";
        this.addSceneForm.corpusJP = "";
        this.addSceneForm.sceneCaseZH = "";
        this.addSceneForm.sceneCaseJP = "";
        this.addSceneForm.sceneCaseEN = "";
        this.checkedParameters = [];
        
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
