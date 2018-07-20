<template>
    <div class="intro-manage">
        <div class="intro-toolbar">
            <el-button type="primary" @click="newIntro()">新建提案</el-button>
            <el-button type="primary" @click="introSort()">提案排序</el-button>
        </div>
        <el-row>            
            <el-col :sm="4" :md="4" :lg="4">
                <div class="intro-nav" id="intro-nav">
                    <ul class="intro-list" id="intro-list">
                        <li v-for="item in introGroupDatas" :key="item.id" @click="changeSelected(item.id)" :class="[isActive == item.id ? 'selected' :'']">
                            <a href="javascript:;">{{item.groupNamePojo.zh}}</a>
                        </li>                       
                    </ul>
                </div>
            </el-col>
            <el-col :sm="20" :md="20" :lg="20">
                <div v-if="!sortTag">
                    <div class="content-list" id="content-list">
                        <el-row>
                            <el-col :sm="24" :md="24" :lg="24" v-if="introDatas.length == 0">
                                <div style="text-align:center; padding-top:80px;">
                                <h3>当前提案组下没有提案，请添加!!!</h3>
                                </div>
                            </el-col>
                            <el-col :sm="8" :md="8" :lg="8" v-for="item in introDatas" :key="item.id">
                                <el-card class="box-card intro-card" :body-style="{ padding: '0px' }">
                                    <div slot="header" class="clearfix">
                                        <span style="line-height: 36px;">{{item.titlePojo.zh}}</span>                                    
                                        <el-button style="float: right; margin-left:10px;" type="text" @click="confirmDel(item)"><i class="el-icon-delete"></i></el-button>
                                        <el-button style="float: right;" type="text" @click="updateIntro(item)"><i class="el-icon-edit"></i></el-button>
                                    </div>
                                    <div class="card-body">
                                        <p>
                                            {{item.contentPojo.zh}}
                                        </p>
                                    </div>                                
                                </el-card>
                            </el-col>                        
                        </el-row> 
                    </div>
                    <!-- <div class="add-intro-form" v-else>
                        <el-form :model="introForm" :rules="rules" ref="introForm" label-width="100px" class="demo-ruleForm">
                            <el-form-item label="提案分组" prop="introGroup">                                
                                <el-select v-model="whichGroup" placeholder="请选择">
                                    <el-option
                                    v-for="item in introGroupDatas"
                                    :key="item.id"
                                    :label="item.groupNamePojo.zh"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item> 
                            <el-form-item label="提案名称" prop="title">
                                <el-input v-model="introForm.title" class="input440"></el-input>
                            </el-form-item>                        
                            <el-form-item label="提案内容" prop="content">
                                <el-input type="textarea" class="input440" :autosize="{ minRows: 3, maxRows: 5}" v-model="introForm.content"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="addIntro()" v-if="addBtn">立即创建</el-button>
                                <el-button type="primary" @click="updateIntroPost()" v-else>修改</el-button>
                                <el-button @click="cancelForm()">取消</el-button>
                            </el-form-item>
                        </el-form>
                    </div> -->
                </div>                

                <div class="introSort" v-else>
                    <div><el-button @click="cancelSort()">返回</el-button></div>
                    <div class="drapSortList">
                        <div class="drapSortList-list">                            
                            <draggable :list="introDatas" class="dragArea" @change="moved" :options="{group:'introGroup'}">
                                <div class="list-complete-item" v-for="element in introDatas" :key='element'>
                                    <div class="list-complete-item-handle">{{element.titlePojo.zh}} => {{element.seq}}
                                        <span class="pull-right">
                                            <i class="el-icon-d-caret"></i>
                                        </span>
                                    </div>                            
                                </div>
                            </draggable>
                        </div>
                    </div>                    
                </div>
            </el-col>
        </el-row>

        <el-dialog :visible.sync="introDialogVisible" class="addDialog" v-bind:title="addTag ? '添加提案':'修改提案'">
                    <el-form :model="introForm" :rules="introFormRules" ref="introForm" label-width="100px" class="demo-ruleForm">
                            <el-form-item label="提案分组" prop="introGroup">
                                <!-- <el-input v-model="introForm.name" class="input440"></el-input> -->
                                <el-select v-model="whichGroup" placeholder="请选择">
                                    <el-option
                                    v-for="item in introGroupDatas"
                                    :key="item.id"
                                    :label="item.groupNamePojo.zh"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item> 
                            <el-form-item label="提案名称" prop="title">
                                <el-input v-model="introForm.title" class="input440"></el-input>
                            </el-form-item>                        
                            <el-form-item label="提案内容" prop="content">
                                <el-input type="textarea" class="input440" :autosize="{ minRows: 3, maxRows: 5}" v-model="introForm.content"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="addIntro()" v-if="addTag">立即创建</el-button>
                                <el-button type="primary" @click="updateIntroPost()" v-else>修改</el-button>
                                <el-button @click="cancelForm()">取消</el-button>
                            </el-form-item>
                        </el-form>
                    <!-- <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="addIntro()" v-if="addBtn">立即创建</el-button>
                        <el-button type="primary" @click="updateIntroPost()" v-else>修改</el-button>
                        <el-button @click="cancelForm()">取消</el-button>
                    </div> -->
                </el-dialog>
    </div>
</template>

<script>
import axios from 'axios';
import $http from '../../utils/http';
import draggable from 'vuedraggable';
export default {
    components:{
        draggable
    },
    data() {
        return {
            introForm:{
                introGroup:'',
                title:'',
                content:''
            },
            introFormRules:{
                title: [
                    { required: true, message: '请输入提案名称', trigger: 'blur' }                    
                ],
                content:[
                    { required: true, message: '请输入提案内容', trigger: 'blur' },
                    { max: 200, message: '最多两百个字符', trigger: 'blur' }
                ]
            },
            introGroupDatas:[],
            introDatas:[],
            whichGroup:'',
            addTag:true,            
            sortTag:false,
            isActive:0,
            middleObj:{},
            introDialogVisible:false            
        }
    },

    mounted() {

        //动态计算属性导航的高度
        var introduceHeight = document.body.clientHeight - 296;
        document.getElementById("intro-nav").style.height = introduceHeight + 'px';
        document.getElementById("content-list").style.height = introduceHeight + 'px';

    },
    
    computed: {
        _SHOPLANGUAGE() {
            return Cookies.get('SHOPLANGUAGE');
        }
    },

    created() {
        //默认获取属性列表
        this.getIntroGroupList();        
    },

    methods: {

        getIntroGroupList(){
            $http.get('/coron-web/introduceGroup/list').then(response => {
                console.log("提案列表组",response);
                
                response.status && (this.introGroupDatas = response.entry)
                &&(this.isActive = this.whichGroup = response.entry[0].id) 
                && (this.getIntroList(this.isActive));               


            }).catch(error => {
                console.log(error);
            })
        },

        getIntroList(itemId){

            let getParams = {groupId:itemId};

            $http.get('/coron-web/introduce/list',{groupId:itemId}).then(response => {
                console.log("获取提案列表",response);
                response.status && (this.introDatas = response.rows);
            }).catch(error => {
                console.log(error);
            })
        },

        newIntro(){
            this.addTag = true;
            this.addBtn = true;
            this.introForm.title = '';
            this.introForm.content ='';
            this.introDialogVisible = true;
        },

        addIntro(){
            var self = this;
            
            let addParams = {
                groupId:self.whichGroup,
                titlePojo:{zh:self.introForm.title,jp:'',en:''},
                contentPojo:{zh:self.introForm.content,jp:'',en:''},
                type:1,
                position:0
            };

            self.$refs['introForm'].validate((valid) => {
                if(valid){

                    console.log("添加提案",valid);

                     $http.post('/coron-web/introduce/add',addParams).then(response => {
                         console.log("添加提案",response);
                
                        self.addTag = false;
                        self.getIntroList(self.whichGroup);
                        self.introDialogVisible = false;

                    }).catch(error => {
                        console.log("错误信息",error);
                    }) 

                } else {
                    self.$message({
                        type:'warning',
                        message:'请输入必填字段！'
                    })
                }
            });                     

        },

        updateIntro(item){
            console.log(item);
            this.addTag = false;
            this.addBtn = false;
            this.introDialogVisible = true;
            this.introForm.title = item.titlePojo.zh;
            this.introForm.content = item.contentPojo.zh;
            this.whichGroup = item.groupId;
            this.middleObj = item;
        },

        updateIntroPost(){

            let updateParams = {
                id:this.middleObj.id,
                titlePojo:{zh:this.introForm.title,jp:'',en:''},
                contentPojo:{zh:this.introForm.content,jp:'',en:''}
            };

            $http.post('/coron-web/introduce/update',updateParams).then(response => {
                console.log(response);
                this.$message({
                    type:'success',
                    message:'修改成功！'
                });
                this.addTag = false;
                this.introDialogVisible = false;
                this.getIntroList(this.whichGroup);
            }).catch(error => {
                console.log(error);

                this.$message({
                    type:'error',
                    message:'请求错误'
                });
            })

        },

        delIntro(item){
            $http.post('/coron-web/introduce/delete',{
                id:item.id
            }).then(response => {
                console.log(response);
                this.$message({
                    type: 'success',
                    message: '删除成功 '
                });                
                this.getIntroList(this.isActive);
            }).catch(error => {

                console.log(error);

            })
        },

        confirmDel(item){
            this.$confirm('确认要删除这个提案么?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal:false,
                type: 'warning'
            }).then(() => {

                this.delIntro(item);

            }).catch(() => {

                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });

            });
        },

        changeSelected:function(itemId){            
            this.isActive = itemId;
            this.whichGroup = itemId;
            this.getIntroList(itemId);
        },

        cancelForm(){
            // this.addTag = false;
            // this.getIntroList();
            this.introDialogVisible = false;
        },

        introSort(){
            this.sortTag = true;
        },
        cancelSort(){
            this.sortTag = false;
        },

        sortIntro(itemParams){
            
            $http.post('/coron-web/introduce/sort',itemParams).then(response => {

                this.$message({
                    type:'success',
                    message:'更新成功'
                });
                this.getIntroList();

            }).catch(error => {
                this.$message({
                    type:'error',
                    message:'更新失败'
                });
            })
        },

        moved(evt) {

            let newIndex = evt.moved.newIndex;
            let oldIndex = evt.moved.oldIndex;

            console.log(evt);
            console.log(this.introDatas[evt.moved.newIndex+1]);
            console.log(this.introDatas[evt.moved.newIndex]);

            if(newIndex > oldIndex){
                let oldItem = this.introDatas[evt.moved.newIndex],
                    newItem = this.introDatas[evt.moved.newIndex-1];
                
                const item = {
                    id: oldItem.id,
                    groupId:newItem.groupId,
                    oldIndex: oldItem.seq,
                    newIndex: newItem.seq
                };
                
                this.sortIntroGroup(item);

            } else {

                let oldItem = this.introDatas[evt.moved.newIndex],
                    newItem = this.introDatas[evt.moved.newIndex+1];

                const item = {
                    id: oldItem.id,
                    groupId:newItem.groupId,
                    oldIndex: oldItem.seq,
                    newIndex: newItem.seq
                };

                this.sortIntro(item);
            }

        }



    }

}
</script>

<style scoped>

.intro-nav {
    border-right: 1px solid #d1dbe5;
    padding-top: 20px;
}
.intro-toolbar {
    /* background: #f8f8f9; */
    padding: 8px 0 20px 20px;
    border-bottom: solid 1px #d1dbe5;
}

ul.intro-list {
    list-style: none;
    text-align: left;
    padding: 0;
    margin: 0;
}

ul.intro-list li {
    height: 42px;
    line-height: 42px;
    padding: 0 18px;
}

ul.intro-list li a {
    color: #6B6B6B;
}

li.selected {
    border-left: 3px solid #20A0FF;
    background-color: rgba(242, 242, 242, 1);
}

.content-list {
    padding: 8px;    
}

.content-list .intro-card {
    margin:0 8px 8px 0;    
}

.card-body {
    height:200px;
    overflow-y: auto;
}

.content-list .intro-card p {
    padding: 8px 10px;
    margin: 10px 0;    
    text-indent:2em;
    
}

.add-intro-form {
    padding: 20px 10px;
}
.input440 {
    width: 440px;
}

.introSort {
    padding: 30px 0 0 20px;
}

</style>
