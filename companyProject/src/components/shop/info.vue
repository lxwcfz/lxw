<template>
    <div class="shop-info">
        <el-row>
            <el-col :sm="24" :md="24" :lg="24">
                <div class="base-info">
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <h3>{{$t('shop.baseInfo')}}</h3>
                        </el-col>
                        <el-col :span="12">
                            <p>                                
                                <span>{{$t('shop.shopName')}}:</span>
                                <span v-if="shop.language == 0" v-text="shop.name.zh"></span>
                                <span v-if="shop.language == 1" v-text="shop.name.en"></span>
                                <span v-if="shop.language == 2" v-text="shop.name.jp"></span>
                            </p>
                        </el-col>
                        <el-col :span="12">
                            <p>
                                <span>{{$t('shop.shopContact')}}:</span>
                                <span v-text="shop.shopTel"></span>
                            </p>
                        </el-col>
                        <el-col :span="12">
                            <p>                                 
                                <span>{{$t('shop.shopAddress')}}:</span>                                
                                <span v-if="shop.language == 0" v-text="shop.address"></span>
                                <span v-if="shop.language == 1" v-text="shop.address"></span>
                                <span v-if="shop.language == 2" >{{shop.address | addressParse}}</span>
                            </p>
                        </el-col>
                        <el-col :span="12">
                            <p>
                                <span>{{$t('shop.langSetting')}}:</span> 
                                <span> {{shop.language | languageType}}</span>
                            </p>
                        </el-col>
                        <el-col :span="12">
                            <p>
                                <span>{{$t('shop.wechatPayId')}}:</span> 
                                <span v-text="shop.wxMerchantId"></span>
                            </p>
                        </el-col>
                        <el-col :span="12">
                            <p>
                                <span>{{$t('shop.wechatPayKey')}}:</span>
                                <span v-text="shop.wxPrivateKey"></span>
                            </p>
                        </el-col>
                        <el-col :span="12">
                            <p>
                                <span>{{$t('shop.authCode')}}:</span>
                                <span v-text="shop.custPanelAuthCode"></span>
                            </p>
                        </el-col>
                        <el-col :span="24">
                            <h3>
                                <span>{{$t('shop.idList')}}:</span>
                                <el-button type="primary" size="small" icon="plus" :title="$t('shop.addId')" @click="addUser()"></el-button>
                            </h3>
                        </el-col>
                        <el-col :span="24">
                            <el-table :data="accountLists" style="width: 100%; text-align:center;" max-height=200>
                                <el-table-column prop="uname" :label="$t('shop.id')" width="200px">
                                </el-table-column>
                                <el-table-column prop="userType" :label="$t('shop.idType')">
                                    <template scope="scope">
                                        <el-tag type="danger" v-if="scope.row.userType == 3">{{$t('shop.manager')}}</el-tag>
                                        <el-tag type="primary" v-if="scope.row.userType == 4">{{$t('shop.employee')}}</el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="userType" :label="$t('shop.employeeInfo')">
                                    <template scope="scope">                                        
                                        <el-tag type="primary"><span>{{$t('shop.userId')}}:</span> {{scope.row.userId}}</el-tag>
                                        <el-tag type="primary"><span>{{$t('shop.phone')}}:</span>{{scope.row.telephone}}</el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column :label="$t('_global.action')" width="100">
                                    <template scope="scope">
                                        <el-button type="text" size="small" @click="updatePassword(scope.row)">
                                            <i class="el-icon-edit" :title="$t('_global.edit')"></i>
                                        </el-button>
                                        <el-button type="text" size="small" @click="confirmDel(scope.row)" v-if="scope.row.userType !== 3">
                                            <i class="el-icon-delete" :title="$t('_global.delete')"></i>
                                        </el-button>                                        
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-col>
                        <el-col :span="24">
                            <h3>{{$t('shop.robotList')}}</h3>
                        </el-col>
                        <el-col :span="24">
                            <el-table :data="equipmentInfos" style="width: 100%; text-align:center;" max-height=200>
                                <el-table-column :label="$t('shop.robotId')" width="100px;">
                                    <template scope="scope">
                                        <span>{{scope.row.robotId}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="sn" :label="$t('shop.robotSN')">
                                </el-table-column>
                                <el-table-column prop="tableNo" :label="$t('shop.tableNO')">
                                </el-table-column>
                                <el-table-column prop="managerId" :label="$t('shop.managerId')">
                                </el-table-column>
                                <el-table-column prop="sn" :label="$t('shop.userDevice')">
                                </el-table-column>
                            </el-table>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
        </el-row>

        <el-dialog :title="$t('shop.addId')" :visible.sync="addUserDialogVisible" class="addDialog" size="tiny">
            <el-form :model="addUserForm" :rules="adduserRules" ref="addUserForm" label-width="100px">
                <el-form-item :label="$t('shop.id')" prop="uname">
                    <el-input type="text" v-model="addUserForm.uname" :placeholder="$t('placeholder.userId')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('shop.password')" prop="upassword">
                    <el-input type="password" v-model="addUserForm.upassword" :placeholder="$t('placeholder.password')"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addUserPost()">{{$t('_global.confirm')}}</el-button>
                    <el-button @click="cancelDialog()">{{$t('_global.cancel')}}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog :title="$t('shop.editPwd')" :visible.sync="updatePWDDialogVisible" class="addDialog" size="tiny">
            <el-form :model="updatepwdForm" :rules="updatepwdRules" ref="updatepwdForm" label-width="100px">
                <el-form-item :label="$t('shop.id')">
                    <el-input type="text" v-model="updatepwdForm.uname" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item :label="$t('shop.oldpwd')" prop="oldupassword" v-if="middleItem.userType == 3">
                    <el-input type="password" v-model="updatepwdForm.oldupassword" :placeholder="$t('placeholder.password')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('shop.newpwd')" prop="newupassword">
                    <el-input type="password" v-model="updatepwdForm.newupassword" :placeholder="$t('placeholder.newpassword')"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="updatePasswordPost('updatepwdForm')">{{$t('_global.confirm')}}</el-button>                    
                    <el-button @click="updatePWDDialogVisible = false">{{$t('_global.cancel')}}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import $http from '../../utils/http';
import * as userApi from '../../api/user';
import { getRobotByShop } from '../../api/shop';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import Lockr from 'lockr';
import MD5 from 'js-md5';
export default {
    data() {
        var validateNumLetter = (rule, value, callback) => {            

            if (!/^[A-Za-z0-9]+$/i.test(value)) {
                callback(new Error(this.$t('tips.rules.letterornum')));
            } else {
                callback();
            }

        };
        return {
            shop: {},
            equipmentInfos: [],
            addUserDialogVisible: false,
            updatePWDDialogVisible:false,
            addUserForm: {
                uname: '',
                upassword: ''
            },
            adduserRules: {
                uname: [
                    { required: true, message: this.$t('tips.rules.username'), trigger: 'blur' },
                    { validator: validateNumLetter, trigger: 'onchange' },
                    { min: 6, max: 12, message: this.$t('tips.rules.length'), trigger: 'blur' }                    
                ],
                upassword: [
                    { required: true, message: this.$t('tips.rules.password'), trigger: 'blur' },
                    { min: 6, max: 12, message: this.$t('tips.rules.length'), trigger: 'blur' }                    
                ]
            },
            updatepwdForm:{
                uname:'',
                oldupassword:'',
                newupassword:'' 
            },
            updatepwdRules:{
                oldupassword:[
                    { required: true, message: this.$t('tips.rules.oldpassword'), trigger: 'blur' },
                    { min: 6, max: 12, message: this.$t('tips.rules.length'), trigger: 'blur' }
                ],
                newupassword:[
                    { required: true, message: this.$t('tips.rules.newpassword'), trigger: 'blur' },
                    { min: 6, max: 12, message: this.$t('tips.rules.length'), trigger: 'blur' }                    
                ]
            },
            middleItem:'',
            accountLists: []
        }
    },
    created() {
        this.getLoginInfo();
        this.getRobot();
        this.getShopUser();
    },
    computed: {
        ...mapGetters([
            'user'
        ])
    },
    methods: {
        getLoginInfo() {
            userApi.getLoginUser().then(res => {
                
                if(res.status){
                    this.shop = res.entry.shop;
                }
                
            });
        },        

        getRobot() {
            getRobotByShop().then(res => {
                
                if(res.status){
                    this.equipmentInfos = res.entry;
                } else {
                    this.$message({
                        type:'error',
                        message:res.message
                    })
                }
                
            })
        },

        getShopUser() {
            userApi.getShopUser().then(res => {                
                if(res.status){
                    this.accountLists = res.entry;
                } else {
                    this.$message({
                        type:'error',
                        message:res.message
                    })
                }                
            })
        },

        addUser() {
            this.addUserForm.uname ='';
            this.addUserForm.upassword ='';
            this.addUserDialogVisible = true;
        },

        addUserPost() {
            const userData = {
                uname: this.addUserForm.uname,
                upassword: MD5(this.addUserForm.upassword),
                userType: 4
            }
            
            this.$refs['addUserForm'].validate((valid) => {
                
                if(valid){
                    userApi.addUser(userData).then(res => {

                        if (res.status) {
                            this.$message({
                                type: 'success',
                                message: this.$t('tips.message.addSuccess')
                            });
                            this.getShopUser();
                            this.addUserDialogVisible = false;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.message
                            })
                        }

                    })
                } else {
                    this.$message({
                        type:'error',
                        message:this.$t('tips.rules.error')
                    })                    
                }
            })

            
        },
        updatePassword(item){

            this.updatePWDDialogVisible = true;            
            this.middleItem = item;            
            this.updatepwdForm.uname = item.uname;
            this.updatepwdForm.newPassword ='';
            
        },

        updatePasswordPost(formName){

            if(this.middleItem.userType == 4){
                var data = {
                    targetUserId:this.middleItem.userId,
                    newPassword:MD5(this.updatepwdForm.newupassword)
                };
            } else {
                var data = {
                    targetUserId:this.middleItem.userId,
                    oldPassword:MD5(this.updatepwdForm.oldupassword),
                    newPassword:MD5(this.updatepwdForm.newupassword)
                };
            }            
            
            this.$refs[formName].validate((valid) => {
                
                if (valid) {
                    
                    $http.post('/coron-web/user/updatePassword',data).then(res => {
                
                        if(res.status){                            
                            this.$message({
                                type:'success',
                                message:this.$t('tips.message.updateSuccess')
                            });
                            this.updatePWDDialogVisible = false;
                        } else {
                            this.$message({
                                type:'error',
                                message:res.message
                            });
                        }

                    })

                } else {
                    console.log('error submit!!');
                    return false;
                }
            });

        },

        delUser(item) {
            const delData = {
                userId: item.userId
            };
            userApi.delUser(delData).then(res => {
                if (res.status) {
                    this.$message({
                        type: 'success',
                        message: this.$t('tips.message.delSuccess')
                    });
                    this.getShopUser();
                } else {
                    this.$message({
                        type: 'error',
                        message: res.message
                    });
                    return false;
                }
            })
        },

        confirmDel(item) {
            this.$confirm(this.$t('tips.message.confirmDel'), this.$t('tips.message.hint'), {
                confirmButtonText: this.$t('tips.message.ok'),
                cancelButtonText: this.$t('tips.message.cancel'),
                closeOnClickModal: false,
                type: 'warning'
            }).then(_ => {
                this.delUser(item);
            }).catch(_ => {
                this.$message({
                    type: 'warning',
                    message: this.$t('tips.message.canceled')
                });
            });
        },        

        resetForm(formName) {
            this.$refs[formName].resetFields();
        },

        cancelDialog() {
            this.addUserDialogVisible = false;
        },

        ...mapMutations({
            getUser: 'GET_USER',
            setUserList: 'SET_USERLIST'
        }),

        ...mapActions({
            vxGetLoginInfo: 'GetLoginInfo'
        })
    }
}
</script>

<style scoped>
.shop-info {
    padding: 10px 15px;
    background: #fff;
}

.shop-info p {
    margin: 5px 0;
    line-height: 30px;
}
</style>
