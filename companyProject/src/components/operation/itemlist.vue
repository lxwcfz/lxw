<template>
    <el-row>
        <el-col :sm="6" :md="6" :lg="5">
            <template>
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
            </template>
        </el-col>
        <el-col :sm="18" :md="18" :lg="19">
            <transition mode="out-in">
                <template>
                    <div class="item-list">
                        <el-row>
                            <el-col :span="24">
                                <div class="grid-content bg-purple-dark">
                                    <el-form :inline="true" :model="itemsForm">                                        
                                        <el-form-item label="">
                                            <el-input size="small" :placeholder="$t('placeholder.itemName')" icon="search" v-model="itemsForm.itemName" @keyup.enter="getItemList()" :on-icon-click="handleIconClick">
                                            </el-input>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button size="small" type="primary" @click="getItemList()">{{$t('_global.search')}}</el-button>
                                            <el-button size="small" type="primary" @click="goTranslate()">{{$t('products.translate')}}</el-button>
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </el-col>
                        </el-row>
                        <el-table :data="productsList" ref="multipleTable" tooltip-effect="dark" style="width: 100%; text-align:center;" max-height="450">
                            <el-table-column prop="itemNo" sortable label="NO." fixed min-width="90px">
                            </el-table-column>
                            <el-table-column :label="$t('products.itemName')" min-width="150px">
                                <template scope="scope">
                                    <span v-if="_SHOPLANGUAGE == 0">{{scope.row.itemNameObject.zh}}</span>
                                    <span v-if="_SHOPLANGUAGE == 1">{{scope.row.itemNameObject.en}}</span>
                                    <span v-if="_SHOPLANGUAGE == 2">{{scope.row.itemNameObject.jp}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('products.itemDesc')" min-width="300px">
                                <template scope="scope">
                                    <span v-if="_SHOPLANGUAGE == 0">{{scope.row.itemDescObject.zh}}</span>
                                    <span v-if="_SHOPLANGUAGE == 1">{{scope.row.itemDescObject.en}}</span>
                                    <span v-if="_SHOPLANGUAGE == 2">{{scope.row.itemDescObject.jp}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="originPrice" sortable :label="$t('products.price')" min-width="150px">
                                <template scope="scope">
                                    <span v-if="_currencyType == 'CHINESE'">{{scope.row.originPrice/100}}</span>
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
</template>

<script>
import axios from 'axios';
import $http from '../../utils/http';
import Lockr from 'lockr';
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
        rShopDetailData(){
            return Lockr.get('shopDetailData');
        },
        _currencyType(){
            return Lockr.get('shopDetailData').currencyType;
        },        
        _SHOPLANGUAGE(){            
            return this.rShopDetailData.language;        
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
            $http.get('/coron-web/catalog/getByShop',{shopId:this.rShopDetailData.id})
                .then(response => {
                    
                    if(response.status){
                        !!response.entry && (this.catalogDatas = response.entry);
                    } else {
                        this.$message({
                            type:'error',
                            message: response.message
                        });
                    }

                })
                .catch(error => {
                    console.log(error);                    
                    this.$message({
                        type:'error',
                        message: error
                    });
                })
        },

        changeSelected (itemId) {            
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
                shopId:this.rShopDetailData.id,
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
                    alert('网络错误，不能访问,请刷新页面重试！');
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
                console.log(response);
                this.$message({
                    type: 'info',
                    message: '删除成功'
                });
                this.getItemList();
            }).catch(error => {
                console.log(error);
            })
        },

        confirmDel(item) {            
            this.$confirm('确定要删除这个菜品吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal: false,
                type: 'warning'
            }).then(() => {

                this.delItem(item);

            }).catch(() => {

                this.$message({
                type: 'info',
                message: '已取消删除'
                });

            });            
        },

        switchSale(item) {

            $http.post('/coron-web/item/switchSale', {
                itemId: item.itemId,
                isSale: !item.isSale
            }).then(response => {
                console.log(response);
                this.$message({
                    type: 'info',
                    message: '状态更新成功'
                });
                this.getItemList();
            }).catch(error => {
                console.log(error);
                this.$message({
                    type: 'error',
                    message: '状态更新失败'
                });
            })
        },

        handleIconClick(ev) {            
            this.getItemList();
        },

        goTranslate() {            
            this.$router.push({
                name: 'translate'
            })
        }

    }

}
</script>

<style>

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
