<template>
    <div class="apkmanagePage">
        <el-form :inline="true" style="text-align:center;">
            <el-form-item>
                <el-button type="primary" @click="apkAdd()">{{$t('apkManage.add')}}</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="apkLists" border style="width: 100%; text-align:center;">
            <el-table-column prop="id" sortable label="APP ID" width="120px" fixed="left">
            </el-table-column>
            <el-table-column prop="name" :label="$t('apkManage.apkName')" min-width="150px">
            </el-table-column>
            <el-table-column prop="type" :label="$t('apkManage.apkType')" min-width="130px">
                <template scope="scope">
                    <span v-if="scope.row.type == '1'">{{$t('apkManage.dyApk')}}</span>
                    <span v-else>{{$t('apkManage.kzbApk')}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="downUrl" :label="$t('apkManage.apkDonwloadAddress')" min-width="200px">
            </el-table-column>
            <el-table-column prop="region" :label="$t('apkManage.pushAddress')" min-width="120px">
            </el-table-column>
            <el-table-column prop="fileSize" :label="$t('apkManage.fileSize')" min-width="150px">
            </el-table-column>
            <el-table-column prop="md5" label="MD5" min-width="200px">
            </el-table-column>
            <el-table-column prop="uploadState" :label="$t('apkManage.uploadState')" min-width="150px">
                <template scope="scope">
                    <span v-if="scope.row.uploadState == 1">{{$t('apkManage.success')}}</span>
                    <span v-else>{{$t('apkManage.uploading')}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="publishType" :label="$t('apkManage.pushType')" min-width="120px">
                <template scope="scope">
                    <span v-if="scope.row.publishType == 0">debug</span>
                    <span v-if="scope.row.publishType == 1">test</span>
                    <span v-if="scope.row.publishType == 2">release</span>
                </template>
            </el-table-column>
            <el-table-column prop="publishState" :label="$t('apkManage.pushStatus')" min-width="120px">
                <template scope="scope">
                    <span v-if="scope.row.publishState == 0">testing</span>
                    <span v-else>release</span>
                </template>
            </el-table-column>
            <el-table-column prop="gmtCreated" :label="$t('apkManage.publishDate')" min-width="200px">
            </el-table-column>           
            <el-table-column :label="$t('_global.action')" fixed="right" width="150">
                <template scope="scope">
                    <el-button type="primary" size="small" @click="apkInfoEdit(scope.row)">{{$t('_global.edit')}}</el-button>
                    <el-button type="primary" size="small" @click="confirmDel(scope.row)">{{$t('_global.delete')}}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block turn-page" style="margin-top:10px;">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="totalItems">
            </el-pagination>
        </div>

        <el-dialog :title="$t('apkManage.updateInfo')" :visible.sync="apkUpdateDialogVisible">
            <el-form :model="apkUpdateForm" ref="apkUpdateForm" label-width="100px" class="otaForm">
                <el-form-item :label="$t('apkManage.apkName')" prop="name">
                    <el-input v-model="apkUpdateForm.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="APK CODE" prop="code">
                    <el-input v-model="apkUpdateForm.code" disabled></el-input>
                </el-form-item>
                <el-form-item :label="$t('apkManage.apkType')" prop="type">
                    <el-select v-model="apkUpdateForm.type" disabled>
                        <el-option :label="$t('apkManage.dyApk')" value="1"></el-option>
                        <el-option :label="$t('apkManage.kzbApk')" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('apkManage.pushAddress')" prop="region">
                    <el-select v-model="apkUpdateForm.region" disabled>
                        <el-option label="中国(China)" value="CN"></el-option>
                        <el-option label="日本(Janpan)" value="JP"></el-option>
                        <el-option label="英国(UK)" value="GB"></el-option>
                        <el-option label="美国(US)" value="US"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('apkManage.pushType')" prop="publishType">
                    <el-select v-model="apkUpdateForm.publishType">
                        <el-option label="debug" value="0"></el-option>
                        <el-option label="test" value="1"></el-option>
                        <el-option label="release" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('apkManage.pushStatus')" prop="publishState">
                    <el-select v-model="apkUpdateForm.publishState">
                        <el-option label="testing" value="0"></el-option>
                        <el-option label="release" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('apkManage.fileUpload')" prop="downUrl">
                    <span>{{apkUpdateForm.downUrl}}</span>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="apkUpdate()">{{$t('_global.lijiEdit')}}</el-button>
                    <el-button @click="apkUpdateDialogVisible = false">{{$t('_global.cancel')}}</el-button>
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
            apkLists: [],
            apkUpdateForm: {
                name: '',
                code: '1',
                type: '1',
                region: 'JP',
                publishType: '0',
                publishState: '0',
                downUrl: ''
            },
            apkUpdateDialogVisible: false,
            fileList: [],
            imageUrl: '',
            middleObj: {},
            currentPage: 1,
            pageSize: 8,
            totalItems: 0
        }
    },
    created() {
        this.getAPKLists();
    },
    computed: {

    },
    methods: {
        getAPKLists() {
            $http.post('/coron-web/apk/list', {
                page: this.currentPage,
                rp: this.pageSize
            }).then(res => {
                if (res.status) {
                    this.apkLists = res.rows;
                    this.totalItems = res.total;
                } else {
                    this.$message.error(res.message)
                }
            })
        },

        handleSizeChange(size) {
            console.log(size);
        },
        // 翻页
        handleCurrentChange(page) {
            this.getAPKLists();
        },

        apkInfoEdit(item) {
            this.apkUpdateDialogVisible = true;
            this.middleObj = item;
            this.apkUpdateForm.name = item.name;
            this.apkUpdateForm.code = item.code;
            this.apkUpdateForm.type = item.type.toString();
            this.apkUpdateForm.region = item.region;
            this.apkUpdateForm.publishState = item.publishState.toString();
            this.apkUpdateForm.publishType = item.publishType.toString();
            this.apkUpdateForm.downUrl = item.downUrl;
        },

        apkUpdate() {
            const data = {
                id: this.middleObj.id,
                name: this.middleObj.name,
                code: this.middleObj.code,
                type: this.middleObj.type,
                publishState: this.apkUpdateForm.publishState,
                publishType: this.apkUpdateForm.publishType
            };            

            $http.post('/coron-web/apk/update', data).then(res => {
                
                if (res.status) {
                    this.$message({
                        type: 'success',
                        message: this.$t('tips.message.updateSuccess')
                    });
                    this.apkUpdateDialogVisible = false;
                    this.getAPKLists();
                } else {
                    this.$message.error(res.message);
                }

            })
        },

        apkAdd() {
            this.$router.push({
                path: '/operation/apkadd'
            });
        },

        delAPK(item) {
            $http.post('/coron-web/apk/del', {
                id: item.id
            }).then(res => {
                
                if (res.status) {
                    this.$message({
                        type: 'success',
                        message: this.$t('tips.message.delSuccess')
                    })
                    this.getAPKLists();

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

                this.delAPK(item);

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
.apkmanagePage {
    padding: 10px 15px;
}
</style>
