<template>
    <div class="itemPage">   
    <el-row>
        <el-col :sm="6" :md="6" :lg="5">            
            <div class="catalog-nav" id="catalog-nav">
                <ul class="catalog-list" id="catalog-list">
                    <li @click="changeSelected(0)" :class="[isActive == 0 ? 'selected' :'']">
                        <a href="javascript:;">{{$t('products.all')}}</a>
                    </li>
                    <li v-for="item in catalogDatas" :key="item.catalogId" @click="changeSelected(item.catalogId)" :class="[isActive == item.catalogId ? 'selected' :'']">
                        <template>
                            <span v-if="_SHOPLANGUAGE == 0">
                                <a href="javascript:;" class="inblock" v-text="item.nameObject.zh"></a>
                            </span>
                            <span v-if="_SHOPLANGUAGE == 1">
                                <a href="javascript:;" class="inblock" v-text="item.nameObject.en"></a>
                            </span>
                            <span v-if="_SHOPLANGUAGE == 2">
                                <a href="javascript:;" class="inblock" v-text="item.nameObject.jp"></a>
                            </span>
                        </template>
                    </li>
                </ul>
            </div>            
        </el-col>
        <el-col :sm="18" :md="18" :lg="19">
            <transition mode="out-in">
                <template>
                    <div class="item-list">
                        <el-row>
                            <el-col :span="24">
                                <div class="grid-content bg-purple-dark">
                                    <el-form :inline="true" :model="itemsForm">
                                        <el-form-item :label="$t('products.status')">
                                            <el-select v-model="itemsForm.isSale" placeholder="状态" size="small" @change="getItemList()">
                                                <el-option :label="$t('products.all')" value=""></el-option>
                                                <el-option :label="$t('products.saleDown')" value="false"></el-option>
                                                <el-option :label="$t('products.saleUp')" value="true"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item :label="$t('products.itemType')">
                                            <el-select v-model="itemsForm.itemType" placeholder="商品类型" size="small" @change="getItemList()">
                                                <el-option :label="$t('products.all')" value=""></el-option>
                                                <el-option :label="$t('products.singleProduct')" value="1"></el-option>
                                                <el-option :label="$t('products.setmeal')" value="2"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="">
                                            <el-input size="small" :placeholder="$t('placeholder.itemName')" icon="search" v-model="itemsForm.itemName" @keyup.enter.native="getItemList()" :on-icon-click="handleIconClick">
                                            </el-input>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button size="small" type="primary" @click="goAdd()">{{$t('products.addItem')}}</el-button>
                                            <el-button size="small" type="primary" @click="goSort()">{{$t('products.itemSort')}}</el-button>
                                            <el-button size="small" type="primary" @click="menuExport()">{{$t('products.itemExport')}}</el-button>                                            
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </el-col>
                        </el-row>
                        <el-table :data="productsList" ref="multipleTable" tooltip-effect="dark" style="width: 100%" max-height="450">
                            <el-table-column prop="itemNo" sortable label="NO." fixed min-width="90px">
                            </el-table-column>
                            <el-table-column :label="$t('products.itemName')" min-width="150px">
                                <template scope="scope">
                                    <span v-if="_SHOPLANGUAGE == 0">{{scope.row.itemNameObject.zh}}</span>
                                    <span v-if="_SHOPLANGUAGE == 1">{{scope.row.itemNameObject.en}}</span>
                                    <span v-if="_SHOPLANGUAGE == 2">{{scope.row.itemNameObject.jp}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('products.itemDesc')" min-width="300px" show-overflow-tooltip>
                                <template scope="scope">
                                    <span v-if="_SHOPLANGUAGE == 0">{{scope.row.itemDescObject ? scope.row.itemDescObject.zh:""}}</span>
                                    <span v-if="_SHOPLANGUAGE == 1">{{scope.row.itemDescObject ? scope.row.itemDescObject.en:""}}</span>
                                    <span v-if="_SHOPLANGUAGE == 2">{{scope.row.itemDescObject ? scope.row.itemDescObject.jp:""}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="originPrice" sortable :label="$t('products.price')" min-width="150px">
                                <template scope="scope">
                                    <span v-if="_currencyType !== 'JAPAN'">{{scope.row.originPrice/100}}</span>
                                    <span v-else>{{scope.row.originPrice}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('products.itemType')" min-width="150px">
                                <template scope="scope">
                                    <span>{{scope.row.itemType | parseProductType}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('products.status')" min-width="80px">
                                <template scope="scope">
                                    <span>{{scope.row.isSale | parseIsSale}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('products.img')" min-width="100px">
                                <template scope="scope">                                    
                                    <el-popover
                                        ref="popoverImg"
                                        placement="left"            
                                        trigger="hover">
                                        <img :src="baseUrl + scope.row.picUrl" width="200" height="200" style="margin-top:5px;" v-if="!!scope.row.picUrl">
                                        <span v-else>NO IMAGE <i class="iconfont icon-noimg"></i></span>
                                    </el-popover>          
                                    <el-button v-popover:popoverImg type="text">
                                        <img :src="baseUrl + scope.row.picUrl" alt="图片" width="50" height="50" v-if="!!scope.row.picUrl">
                                        <span v-else><i class="iconfont icon-noimg"></i></span>
                                    </el-button>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('products.action')" fixed="right" min-width="100px">
                                <template scope="scope">
                                    <el-button type="text" size="small" @click="updateItem(scope.row)">
                                        <i class="el-icon-edit" :title="$t('products.edit')"></i>
                                    </el-button>
                                    <el-button type="text" size="small" @click="confirmDel(scope.row)">
                                        <i class="el-icon-delete" :title="$t('products.delete')"></i>
                                    </el-button>
                                    <el-button type="text" size="small" @click="switchSale(scope.row)" v-if="!scope.row.isSale">
                                        <i class="el-icon-plus" :title="$t('products.putaway')"></i>
                                    </el-button>
                                    <el-button type="text" size="small" @click="switchSale(scope.row)" v-if="scope.row.isSale">
                                        <i class="el-icon-minus" :title="$t('products.soldout')"></i>
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="block turn-page" style="margin-top:10px;">
                            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="totalItems">
                            </el-pagination>
                        </div>
                    </div>
                </template>
            </transition>
        </el-col>
    </el-row>
    </div>
</template>

<script>
import axios from 'axios';
import $http from '../../../utils/http';
import Lockr from 'lockr';
import Cookies from 'js-cookie';
export default {
    data() {
        return {
            isActive: 0,
            catalogDatas: [],
            productsList: [],
            itemsForm: {
                itemName: '',
                itemType: '',
                busiType: 1,   //1点餐系统2民宿3零售
                isSale: '',
                itemNo: '',
                catalogId: null
            },
            currentPage: 1,
            pageSize: 10,
            totalItems: 0,
            formLabelWidth: '120px',
            typeArray:[]
        }
    },

    created() {
        //默认获取属性列表
        this.getCatalogList();
        this.getItemList();        
    },

    computed: {
        baseUrl(){
            return `${window.location.origin}/coron-web/`;
        },
        _SHOPLANGUAGE(){            
            return Cookies.get('SHOPLANGUAGE');
        },
        _currencyType(){
            if(Lockr.get("USERINFO").shop && Lockr.get("USERINFO").shop.currencyType){
                return Lockr.get("USERINFO").shop.currencyType;
            } else {
                return false
            }            
        }
    },

    mounted: function() {        
        
        function getHeight(){            
             //动态计算属性导航的高度
            var catalogNavHeight = document.body.clientHeight - 171;
            document.getElementById("catalog-list").style.height = catalogNavHeight + 'px';
        }
        getHeight();
        window.onresize = function(){
            setTimeout(getHeight,500);
        };

    },

    methods: {
        //添加 根据当前页面的status 修改 vtitle 的值 
        getCatalogList: function() {
            $http.get('/coron-web/catalog/getCatalogs',{
                page:1,
                rp:100
            }).then(response => {
                !!response.entry && (this.catalogDatas = response.entry);
            }).catch(error => {
                console.log(error);                
                this.$message({
                    type:'error',
                    message:this.$t('tips.message.network')
                });
            })
        },

        changeSelected: function(itemId) {            
            this.isActive = itemId;
            this.getItemList();
        },

        handleSizeChange(size) {
            console.log(size);
        },
        // 翻页
        handleCurrentChange(page) {            
            this.getItemList();
        },

        getItemList() {
            this.typeArray = [];
            if(!!this.itemsForm.itemType){
                this.typeArray.push(this.itemsForm.itemType)
            }

            let getParams = {
                itemName:this.itemsForm.itemName,
                itemType: this.typeArray.length > 0 ? this.typeArray:[1,2],
                isSale: this.itemsForm.isSale,                
                rp: 10,
                page: this.currentPage,
                catalogId: !!this.isActive ? this.isActive : null
            };

            $http.post('/coron-web/item/list', getParams)
                .then(response => {
                    !!response.rows && (this.productsList = response.rows);
                    this.totalItems = response.total;
                })
                .catch(error => {
                    console.log(error);
                    this.$message({
                        type:'error',
                        message:this.$t('tips.message.network')
                    });
                })
        },

        updateItem(item) {            
            Lockr.set("itemUpdateData", item);
            this.$router.push({
                path: '/products/update'
            });
        },
        //删除菜品
        delItem(item) {
            $http.post('/coron-web/item/del', {
                itemId: item.itemId
            }).then(response => {
                
                if(response.status){
                    this.$message({
                        type: 'info',
                        message: this.$t('tips.message.delSuccess')
                    });
                    this.getItemList();
                } else {
                    this.$message({
                        type:'warning',
                        message:response.message
                    });
                }
                
            }).catch(error => {
                console.log(error);
            })
        },

        confirmDel(item) {            
            this.$confirm(this.$t('tips.message.confirmDel'), this.$t('tips.message.hint'), {
                confirmButtonText: this.$t('tips.message.ok'),
                cancelButtonText: this.$t('tips.message.cancel'),
                closeOnClickModal: false,
                type: 'warning'
            }).then(() => {
                this.delItem(item);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: this.$t('tips.message.canceled')
                });
            });            
        },

        switchSale(item) {

            $http.post('/coron-web/item/switchSale', {
                itemId: item.itemId,
                isSale: !item.isSale
            }).then(response => {                
                this.$message({
                    type: 'info',
                    message: this.$t('tips.message.updateSuccess')
                });
                this.getItemList();
            }).catch(error => {
                console.log(error);
                this.$message({
                    type: 'error',
                    message: this.$t('tips.message.updateError')
                });
            })
        },

        handleIconClick(ev) {            
            this.getItemList();
        },

        goAdd() {
            Lockr.set("addCatalogID", this.isActive);
            this.$router.push({
                path: '/products/add'                
            })
        },

        goSort() {
            this.$router.push({
                path: '/products/sort'
            })
        },

        menuExport(){            
            window.location.href = '/coron-web/item/exportItems';
        }

    }

}
</script>

<style scoped>
.itemPage {
    height:auto;
    background-color:#fff;
}
.el-col {
    text-align: center;
}

.material-icons {
    font-size: 80px;
    color: #ddd;
}

.content-list {    
    background-color: #fff;
}

.catalog-nav {
    border-right: 1px solid #ccc;
    padding-top: 20px;
    overflow-y:auto;
}

ul.catalog-list {
    list-style: none;
    text-align: left;
    padding: 0;
    margin: 0;
}

ul.catalog-list li {
    height: 42px;
    line-height: 42px;
    padding: 0 18px;
}

ul.catalog-list li a {
    color: #6B6B6B;
}

ul.catalog-list li.selected {
    border-left: 5px solid #20A0FF;
    background-color: rgba(242, 242, 242, 1);
}

.el-table th>.cell {
    text-align: center;
}

.item-list {
    padding: 20px 10px;
}

.turn-page {
    margin-top: 10px;
}

</style>
