<template>
    <div class="robotDancePage">
        <el-form :inline="true" style="text-align:center;">
            <el-form-item>
                <el-button type="primary" @click="otaAdd()">{{$t('otaManage.add')}}</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="romLists" border style="width: 100%; text-align:center;">
            <el-table-column prop="romId" sortable label="ROM ID" width="120px" fixed="left">
            </el-table-column>
            <el-table-column prop="romName" :label="$t('otaManage.romName')" min-width="150px">
            </el-table-column>
            <el-table-column prop="romCode" label="ROM CODE" min-width="130px">
            </el-table-column>
            <el-table-column prop="romType" :label="$t('otaManage.romType')" min-width="130px">
                <template scope="scope">
                    <span v-if="scope.row.romType == '1'">full</span>
                    <span v-else>delta</span>
                </template>
            </el-table-column>
            <el-table-column prop="downUrl" :label="$t('otaManage.romDonwloadAddress')" min-width="200px">
            </el-table-column>
            <el-table-column prop="region" :label="$t('otaManage.pushAddress')" min-width="120px">
            </el-table-column>
            <el-table-column prop="fileSize" :label="$t('otaManage.fileSize')" min-width="150px">
            </el-table-column>
            <el-table-column prop="uploadState" :label="$t('otaManage.isUploadSuccess')" min-width="150px">
                <template scope="scope">
                    <span v-if="scope.row.uploadState">{{$t('otaManage.success')}}</span>
                    <span v-else>{{$t('otaManage.failed')}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="uploadSize" :label="$t('otaManage.fileSize')" min-width="150px">
            </el-table-column>
            <el-table-column prop="md5" label="MD5" min-width="200px">
            </el-table-column>
            <el-table-column prop="publishType" :label="$t('otaManage.pushType')" min-width="150px">
                <template scope="scope">
                    <span v-if="scope.row.publishType == '0'">debug</span>
                    <span v-if="scope.row.publishType == '1'">test</span>
                    <span v-if="scope.row.publishType == '2'">release</span>
                </template>
            </el-table-column>
            <el-table-column prop="publishState" :label="$t('otaManage.pushStatus')" min-width="150px">
                <template scope="scope">
                    <span v-if="scope.row.publishState == '0'">testing</span>
                    <span v-else>release</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('_global.action')" width="150" fixed="right">
                <template scope="scope">
                    <el-button type="primary" size="small" @click="otaInfoEdit(scope.row)">{{$t('_global.edit')}}</el-button>
                    <el-button type="primary" size="small" @click="confirmDel(scope.row)">{{$t('_global.delete')}}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block turn-page" style="margin-top:10px;">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="totalItems">
            </el-pagination>
        </div>

        <el-dialog :title="$t('otaManage.updateInfo')" :visible.sync="otaUpdateDialogVisible">
            <el-form :model="otaUpdateForm" ref="otaUpdateForm" label-width="100px" class="otaForm">
                <el-form-item :label="$t('otaManage.romName')" prop="romName">
                    <el-input v-model="otaUpdateForm.romName" disabled></el-input>
                </el-form-item>
                <el-form-item label="ROM CODE" prop="romCode">
                    <el-input v-model="otaUpdateForm.romCode" disabled></el-input>
                </el-form-item>
                <el-form-item :label="$t('otaManage.romType')" prop="romType" >
                    <el-select v-model="otaUpdateForm.romType" disabled>
                        <el-option label="full" value="1"></el-option>
                        <el-option label="delta" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('otaManage.pushAddress')" prop="region">
                    <el-select v-model="otaUpdateForm.region" disabled>
                        <el-option label="中国(China)" value="CN"></el-option>
                        <el-option label="日本(Janpan)" value="JP"></el-option>
                        <el-option label="英国(UK)" value="GB"></el-option>
                        <el-option label="美国(US)" value="US"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('otaManage.pushType')" prop="publishType" >
                    <el-select v-model="otaUpdateForm.publishType" disabled>
                        <el-option label="debug" value="0"></el-option>
                        <el-option label="test" value="1"></el-option>
                        <el-option label="release" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('otaManage.pushStatus')" prop="publishState">
                    <el-select v-model="otaUpdateForm.publishState">
                        <el-option label="testing" value="0"></el-option>
                        <el-option label="release" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('otaManage.fileUpload')" prop="downUrl">
                    <span>{{otaUpdateForm.downUrl}}</span>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="otaUpdate()">{{$t('_global.lijiEdit')}}</el-button>
                    <el-button @click="otaUpdateDialogVisible = false">{{$t('_global.cancel')}}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import $http from '../../utils/http'
export default {
    data() {
        return {
            romLists: [],
            otaUpdateForm: {
                romName: '',
                romCode: '1',
                romType: '1',
                region: 'JP',
                publishType: '0',
                publishState: '0',
                downUrl:''
            },
            middleObj:{},
            otaUpdateDialogVisible: false,
            fileList: [],
            imageUrl: '',
            middleObj: {},
            btnTag: 'add',
            currentPage: 1,
            pageSize: 8,
            totalItems: 0
        }
    },
    created() {
        this.getRomLists();
    },
    computed: {

    },
    methods: {

        getRomLists() {
            $http.get('/coron-web/otarom/list', {
                page: this.currentPage,
                rp: this.pageSize
            }).then(res => {
                if (res.status) {
                    this.romLists = res.rows;
                    this.totalItems = res.total;
                } else {
                    this.$message({
                        type:'error',
                        message:res.message
                    });
                }
            })
        },

        handleSizeChange(size) {
            console.log(size);
        },
        // 翻页
        handleCurrentChange(page) {            
            this.getRomLists();
        },

        otaInfoEdit(item) {
            this.otaUpdateDialogVisible = true;

            this.middleObj = item;
            this.otaUpdateForm.romName = item.romName;
            this.otaUpdateForm.romCode = item.romCode;
            this.otaUpdateForm.romType = item.romType.toString();
            this.otaUpdateForm.region = item.region;
            this.otaUpdateForm.publishState = item.publishState.toString();
            this.otaUpdateForm.publishType = item.publishType.toString();
            this.otaUpdateForm.downUrl = item.downUrl;
        },

        otaUpdate() {
            const data = {
                romId: this.middleObj.romId,                
                publishState: this.otaUpdateForm.publishState               
            };            
            $http.post('/coron-web/otarom/update', data).then(res => {
                
                if (res.status) {
                    this.$message({
                        type: 'success',
                        message: this.$t('tips.message.updateSuccess')
                    });
                    this.otaUpdateDialogVisible = false;
                    this.getRomLists();
                } else {
                    this.$message.error(res.message);
                }

            })
        },

        otaAdd() {
            this.$router.push({
                path: '/operation/otaadd'
            });
        },

        delRom(item) {
            $http.post('/coron-web/otarom/delete', {
                romId: item.romId
            }).then(res => {
                console.log(res);
                if(res.status){                    
                    this.$message({
                        type: 'success',
                        message: this.$t('tips.message.delSuccess')
                    })
                    this.getRomLists();
                    
                } else {
                    this.$message({
                        type: 'error',
                        message: res.message
                    })
                }               

            })
        },

        confirmDel(item) {
            this.$confirm(this.$t('tips.message.confirmDel'), this.$t('tips.message.hint'), {
                confirmButtonText: this.$t('tips.message.ok'),
                cancelButtonText: this.$t('tips.message.cancel'),
                type: 'warning',
            }).then(() => {

                this.delRom(item);

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: this.$t('tips.message.canceled')
                });
            })
        }

    }
}
</script>


<style>
.robotDancePage {
    padding: 10px 15px;
}
</style>
