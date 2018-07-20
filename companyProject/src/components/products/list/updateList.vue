<template>
    <div class="addProducts">
        <el-tabs v-model="activeName">
            <el-tab-pane :label="$t('products.updateItem')" name="first">
                <div class="addProductForm">
                    <el-row>
                        <el-col :span="18">
                            <div class="form-content">
                                <el-form ref="productForm" :model="productForm" :rules="rules" label-width="100px">
                                    <el-form-item :label="$t('products.addItemPage.itemNo')" prop="itemNo">
                                        <el-input type="number" v-model="productForm.itemNo" :placeholder="$t('placeholder.itemNo')" style="width:195px;"></el-input>
                                    </el-form-item>
                                    <el-form-item :label="$t('products.addItemPage.catalog')" prop="catalogId" v-if="productForm.itemType != 3">
                                        <el-select v-model="productForm.catalogId" :placeholder="$t('placeholder.catalog')">                                            
                                            <el-option 
                                            v-for="item in catalogDatas" 
                                            :key="item.catalogId" 
                                            :label=" _SHOPLANGUAGE == 0 ? item.nameObject.zh : (_SHOPLANGUAGE == 1 ? item.nameObject.en : item.nameObject.jp)"
                                            :value="`${item.catalogId}`">
                                            </el-option>                                            
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item :label="$t('products.addItemPage.itemName')" prop="itemName">
                                        <el-input v-model="productForm.itemName" :placeholder="$t('placeholder.itemName')" @blur="translateContent(productForm.itemName,'name')"></el-input>
                                    </el-form-item>
                                    <el-form-item :label="$t('products.addItemPage.itemDesc')" prop="itemDesc">
                                        <el-input type="textarea" :rows="2" :placeholder="$t('placeholder.itemDesc')" v-model="productForm.itemDesc" @blur="translateContent(productForm.itemDesc,'desc')">
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item :label="$t('products.addItemPage.type')" prop="itemType">
                                        <el-radio-group v-model="productForm.itemType" :change="itemTypeChange()">
                                            <el-radio label="1">{{$t('products.addItemPage.singleProduct')}}</el-radio>
                                            <el-radio label="2">{{$t('products.addItemPage.setmeal')}}</el-radio>                                            
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item :label="$t('products.addItemPage.setmealItems')" v-if="productForm.itemType == 2">
                                        <el-button type="text" @click="getSetmeal()">
                                            <i class="el-icon-plus"></i>{{$t('products.addItemPage.addSetmeal')}}
                                        </el-button>
                                        <el-table :data="setmealList" border style="width: 100%; margin-top:10px;" max-height="250">
                                            <el-table-column prop="itemNameObject.zh" :label="$t('products.addItemPage.itemName')" width="120">
                                                <template scope="scope">
                                                    <span v-if="_SHOPLANGUAGE == 0">{{scope.row.itemNameObject.zh}}</span>
                                                    <span v-if="_SHOPLANGUAGE == 1">{{scope.row.itemNameObject.en}}</span>
                                                    <span v-if="_SHOPLANGUAGE == 2">{{scope.row.itemNameObject.jp}}</span>
                                                </template>
                                            </el-table-column>
                                           <el-table-column prop="originPrice" sortable :label="$t('products.price')">
                                                <template scope="scope">
                                                    <span v-if="_currencyType !== 'JAPAN'">{{scope.row.originPrice/100}}</span>
                                                    <span v-else>{{scope.row.originPrice}}</span>
                                                </template>
                                            </el-table-column> 
                                            <el-table-column prop="childItems" :label="$t('products.addItemPage.sideDishList')">
                                                <template scope="scope">
                                                    <el-tag v-for="item in scope.row.childItems" :key="item.seq" type="success">                                                        
                                                        <span v-if="_SHOPLANGUAGE == 0">{{item.gname.zh}}</span>
                                                        <span v-if="_SHOPLANGUAGE == 1">{{item.gname.en}}</span>
                                                        <span v-if="_SHOPLANGUAGE == 2">{{item.gname.jp}}</span>
                                                    </el-tag>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="itemAttrs" :label="$t('products.addItemPage.attrList')">
                                                <template scope="scope">
                                                    <el-tag v-for="attr in scope.row.itemAttrs" :key="attr.seq" type="success">                                                        
                                                        <span v-if="_SHOPLANGUAGE == 0">{{attr.gname.zh}}</span>
                                                        <span v-if="_SHOPLANGUAGE == 1">{{attr.gname.en}}</span>
                                                        <span v-if="_SHOPLANGUAGE == 2">{{attr.gname.jp}}</span>
                                                    </el-tag>
                                                </template>
                                            </el-table-column>                                            
                                        </el-table>
                                    </el-form-item>
                                    <el-form-item :label="$t('products.addItemPage.price')" prop="originPrice">                                        
                                        <el-input v-model="productForm.originPrice" type="number" min="0" :placeholder="$t('placeholder.price')"></el-input>
                                    </el-form-item>
                                    <el-form-item :label="$t('products.addItemPage.offprice')" prop="discountPrice" v-if="productForm.itemType != 3">
                                        <el-input v-model="productForm.discountPrice" min="0" :placeholder="$t('placeholder.offprice')"></el-input>
                                    </el-form-item>
                                    <el-form-item :label="$t('products.addItemPage.tag')">
                                        <el-tag :key="tag" type="primary" v-for="tag in itemTags" :closable="true" :close-transition="false" @close="itemTagClose(tag)">
                                            {{tag}}
                                        </el-tag>
                                        <el-input class="input-new-tag" v-if="inputVisible" v-model="tagValue" ref="saveTagInput" size="mini" @keyup.enter.native="handleTagInputConfirm" @blur="handleTagInputConfirm">
                                        </el-input>
                                        <el-button v-else class="button-new-tag" type="text" size="small" @click="showInput">{{$t('products.addItemPage.addTag')}}</el-button>
                                    </el-form-item>
                                    <el-form-item :label="$t('products.addItemPage.img')" prop="picUrl">
                                        <el-upload class="avatar-uploader" action="/coron-web/upload/itemUpload" :show-file-list="false" :on-success="handleAvatarSuccess" :on-remove="handleRemove" :before-upload="beforeAvatarUpload">
                                            <img v-if="imageUrl" :src="baseUrl + productForm.picUrl" class="avatar">
                                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                        </el-upload>
                                        <el-button v-if="imageUrl" size="small" type="text" @click="cancelUpload()"> {{$t('_global.delete')}}</el-button>
                                    </el-form-item>
                                    <el-form-item :label="$t('products.addItemPage.salesTime')" v-if="productForm.itemType != 3">
                                        <el-tag v-for="tag in timeLists" :key="tag" :closable="true" type="primary" @close="timeTagClose(tag)">
                                            {{tag.startTime}}~{{tag.endTime}}
                                        </el-tag>
                                        <el-popover ref="popoverTime" placement="right" width="160" v-model="timeSelectVisible">
                                            <p>
                                                <template>
                                                    <el-checkbox-group v-model="timeLists" @change="handleCheckedTimesChange" class="time-checkbox">
                                                        <el-checkbox v-for="time in timeDatas" :label="time" :key="time">{{time.startTime}}~{{time.endTime}}</el-checkbox>
                                                    </el-checkbox-group>
                                                </template>
                                            </p>
                                            <div style="text-align: right; margin: 0">
                                                <el-button size="mini" type="text" @click="timeSelectVisible = false">{{$t('_global.cancel')}}</el-button>
                                                <el-button type="primary" size="mini" @click="okTime()">{{$t('_global.confirm')}}</el-button>
                                            </div>
                                        </el-popover>
                                        <el-button type="text" v-popover:popoverTime>{{$t('products.addItemPage.selectSalesTime')}}</el-button>
                                    </el-form-item>
                                    <el-form-item :label="$t('products.addItemPage.attrSetting')" v-if="productForm.itemType == 1">
                                        <template>
                                            <el-card class="box-card">
                                                <div slot="header" class="clearfix">
                                                    <span style="line-height: 24px;">{{$t('products.addItemPage.addAttrGroup')}}</span>
                                                    <el-button style="float: right;" type="text" @click="addAttrGroup()">
                                                        <i class="el-icon-plus"></i>{{$t('_global.add')}}
                                                    </el-button>
                                                </div>
                                                <el-form label-width="120px" :inline="true">
                                                    <el-form-item :label="$t('products.addItemPage.attrGroupName')">
                                                        <el-input style="width:100%;" size="small" :placeholder="$t('placeholder.attrGroupName')" v-model="productForm.attrGname" @blur="translateContent(productForm.attrGname,'attrGroup')"></el-input>
                                                    </el-form-item>
                                                    <el-form-item :label="$t('_global.type')">
                                                        <el-radio-group v-model="productForm.attrGtype" size="small">
                                                            <el-radio-button label="single">{{$t('_global.radio')}}</el-radio-button>
                                                            <el-radio-button label="multi">{{$t('_global.multi')}}</el-radio-button>
                                                        </el-radio-group>
                                                    </el-form-item>
                                                    <br>
                                                    <el-form-item :label="$t('products.addItemPage.attrList')">
                                                        <el-tag :key="tag" v-for="tag in productForm.attrGlist" :closable="true" :close-transition="false" @close="handleClose(tag,'attr')">                                                            
                                                            <span v-if="_SHOPLANGUAGE == 0">{{tag.name.zh}}</span>
                                                            <span v-if="_SHOPLANGUAGE == 1">{{tag.name.en}}</span>
                                                            <span v-if="_SHOPLANGUAGE == 2">{{tag.name.jp}}</span>
                                                        </el-tag>
                                                        <el-button class="button-new-tag" size="small" type="primary" @click="selectAttr()">{{$t('products.addItemPage.selectAttr')}}</el-button>
                                                    </el-form-item>
                                                </el-form>
                                                <el-table :data="attrGroups" border style="width: 100%; margin-top:10px;" max-height="250">
                                                    <el-table-column prop="gname.zh" :label="$t('products.addItemPage.name')" width="120">
                                                        <template scope="scope">                                                            
                                                            <span v-if="_SHOPLANGUAGE == 0">{{scope.row.gname.zh}}</span>
                                                            <span v-if="_SHOPLANGUAGE == 1">{{scope.row.gname.en}}</span>
                                                            <span v-if="_SHOPLANGUAGE == 2">{{scope.row.gname.jp}}</span>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column :label="$t('_global.type')" width="120">
                                                        <template scope="scope">
                                                            <span>{{scope.row.selectType | itemToType}}</span>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column prop="attrs" :label="$t('products.addItemPage.attrList')">
                                                        <template scope="scope">
                                                            <el-tag v-for="attr in scope.row.attrs" :key="attr.itemAttrId" type="success">                                                                
                                                                <span v-if="_SHOPLANGUAGE == 0">{{attr.name.zh}}</span>
                                                                <span v-if="_SHOPLANGUAGE == 1">{{attr.name.en}}</span>
                                                                <span v-if="_SHOPLANGUAGE == 2">{{attr.name.jp}}</span>
                                                            </el-tag>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column :label="$t('_global.action')" width="80">
                                                        <template scope="scope">
                                                            <el-button @click.native.prevent="deleteRow(scope.$index,'attr')" type="text" size="small">
                                                                {{$t('_global.delete')}}
                                                            </el-button>
                                                        </template>
                                                    </el-table-column>
                                                </el-table>
                                            </el-card>
                                        </template>
                                    </el-form-item>
                                    <el-form-item :label="$t('products.addItemPage.garnishSetting')" v-if="productForm.itemType == 1">
                                        <template>
                                            <el-card class="box-card">
                                                <div slot="header" class="clearfix">
                                                    <span style="line-height: 24px;">{{$t('products.addItemPage.addGarnishGroup')}}</span>
                                                    <el-button style="float: right;" type="text" @click="addItemGroup()">
                                                        <i class="el-icon-plus"></i>{{$t('_global.add')}}
                                                    </el-button>
                                                </div>
                                                <el-form label-width="120px" :inline="true">
                                                    <el-form-item :label="$t('products.addItemPage.garnishGroupName')">
                                                        <el-input style="width:100%;" size="small" :placeholder="$t('placeholder.sideDishGroupName')" v-model="productForm.itemGname" @blur="translateContent(productForm.itemGname,'itemGname')"></el-input>
                                                    </el-form-item>
                                                    <el-form-item :label="$t('_global.type')">
                                                        <el-radio-group v-model="productForm.itemGtype" size="small">
                                                            <el-radio-button label="single">{{$t('_global.radio')}}</el-radio-button>
                                                            <el-radio-button label="multi">{{$t('_global.multi')}}</el-radio-button>
                                                        </el-radio-group>
                                                    </el-form-item>
                                                    <br>
                                                    <el-form-item :label="$t('products.addItemPage.garnishList')">                                                        
                                                        <el-tag :key="tag" v-for="tag in productForm.itemGlist" :closable="true" :close-transition="false" @close="handleClose(tag,'sideDish')">                                                            
                                                            <span v-if="_SHOPLANGUAGE == 0">{{tag.itemNameObject.zh}}</span>
                                                            <span v-if="_SHOPLANGUAGE == 1">{{tag.itemNameObject.en}}</span>
                                                            <span v-if="_SHOPLANGUAGE == 2">{{tag.itemNameObject.jp}}</span>
                                                        </el-tag>
                                                        <el-button class="button-new-tag" size="small" type="primary" @click="getSideDishes()">{{$t('products.addItemPage.selectGarnish')}}</el-button>
                                                    </el-form-item>
                                                </el-form>
                                                <el-table :data="sideDishGroups" border style="width: 100%; margin-top:10px;" max-height="250">
                                                    <el-table-column prop="gname.zh" :label="$t('products.addItemPage.name')" width="120">
                                                        <template scope="scope">
                                                            <span v-if="_SHOPLANGUAGE==0">{{scope.row.gname.zh}}</span>
                                                            <span v-if="_SHOPLANGUAGE==1">{{scope.row.gname.en}}</span>
                                                            <span v-if="_SHOPLANGUAGE==2">{{scope.row.gname.jp}}</span>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column :label="$t('_global.type')" width="120">
                                                        <template scope="scope">
                                                            <span>{{scope.row.selectType | itemToType}}</span>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column :label="$t('products.addItemPage.garnishList')">
                                                        <template scope="scope">
                                                            <el-tag v-for="item in scope.row.items" :key="item.itemId" type="success">                                                                
                                                                <span v-if="_SHOPLANGUAGE==0">{{item.itemNameObject.zh}}</span>
                                                                <span v-if="_SHOPLANGUAGE==1">{{item.itemNameObject.zh}}</span>
                                                                <span v-if="_SHOPLANGUAGE==2">{{item.itemNameObject.zh}}</span>
                                                            </el-tag>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column :label="$t('_global.action')" width="80">
                                                        <template scope="scope">
                                                            <el-button @click.native.prevent="deleteRow(scope.$index,'sideDish')" type="text" size="small">
                                                                 {{$t('_global.delete')}}
                                                            </el-button>
                                                        </template>
                                                    </el-table-column>
                                                </el-table>
                                            </el-card>
                                        </template>
                                    </el-form-item>                                    
                                </el-form>
                                <div class="btn-fixed">
                                    <el-button type="primary" @click="updateItems()">{{$t('_global.lijiEdit')}}</el-button>
                                    <el-button @click="gobackList()">{{$t('_global.back')}}</el-button>
                                </div>
                            </div>
                        </el-col>
                    </el-row>

                    <el-dialog :title="$t('products.addItemPage.attrList')" :visible.sync="attrListDialogVisible" class="addDialog">
                        <el-form :model="attrListForm">
                            <el-form-item :label="$t('products.addItemPage.attrListName')" :label-width="formLabelWidth">
                                <template>
                                    <el-checkbox-group v-model="checkAttrList" @change="handleCheckedAttrsChange">
                                        <el-checkbox v-for="item in itemAttrDatas" :label="item.itemAttrId" :key="item.itemAttrId">                                            
                                            <span v-if="_SHOPLANGUAGE == 0">{{item.attrNameObject.zh}}</span>
                                            <span v-if="_SHOPLANGUAGE == 1">{{item.attrNameObject.en}}</span>
                                            <span v-if="_SHOPLANGUAGE == 2">{{item.attrNameObject.jp}}</span>
                                        </el-checkbox>
                                    </el-checkbox-group>
                                </template>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="attrListDialogVisible = false">{{$t('_global.cancel')}}</el-button>
                            <el-button type="primary" @click="selectedAttr()">{{$t('_global.lijiAdd')}}</el-button>
                        </div>
                    </el-dialog>

                    <el-dialog :title="$t('products.addItemPage.garnishList')" :visible.sync="itemListDialogVisible" class="addDialog">
                        <el-form>
                            <el-form-item :label="$t('products.addItemPage.garnishListName')" :label-width="formLabelWidth">
                                <template>
                                    <el-checkbox-group v-model="checkSideDishList" @change="handleCheckedDishChange">
                                        <el-checkbox v-for="item in sideDishDatas" :label="item.itemId" :key="item.itemId">                                            
                                            <span v-if="_SHOPLANGUAGE == 0">{{item.itemNameObject.zh}}</span>
                                            <span v-if="_SHOPLANGUAGE == 1">{{item.itemNameObject.en}}</span>
                                            <span v-if="_SHOPLANGUAGE == 2">{{item.itemNameObject.jp}}</span>
                                        </el-checkbox>
                                    </el-checkbox-group>
                                </template>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="itemListDialogVisible = false">{{$t('_global.cancel')}}</el-button>
                            <el-button type="primary" @click="selectedSideDish()">{{$t('_global.lijiAdd')}}</el-button>
                        </div>
                    </el-dialog>

                    <el-dialog :title="$t('products.addItemPage.addSetmeal')" :visible.sync="setmealDialogVisible" class="addDialog ">
                        <el-row :gutter="10">
                            <el-col :span="6">
                                <el-card class="box-card card-item-list">
                                    <div slot="header" class="clearfix">
                                        <span style="line-height: 47px;">{{$t('_global.selected')}}</span>                                        
                                    </div>
                                    <ul>
                                        <li v-for="(item,index) in selectedSetmeals" :key="item.itemId">
                                            <el-button @click.native.prevent="deleteSetmealRow(index)" type="text" size="small">
                                                <i class="el-icon-delete" :title="$t('_global.add')"></i>
                                            </el-button>
                                            <span v-if="_SHOPLANGUAGE == 0">{{item.itemNameObject.zh}}</span>
                                            <span v-if="_SHOPLANGUAGE == 1">{{item.itemNameObject.en}}</span>
                                            <span v-if="_SHOPLANGUAGE == 2">{{item.itemNameObject.jp}}</span>
                                        </li>
                                    </ul>
                                </el-card>
                            </el-col>
                            <el-col :span="18">
                                <el-form :inline="true" :model="itemsForm" @submit.native.prevent>
                                    <el-form-item label="">
                                        <el-input size="small" :placeholder="$t('placeholder.itemName')" v-model="itemsForm.itemName" @keyup.enter.native="getItemList()" >
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button size="small" type="primary" @click="getItemList()">{{$t('products.addItemPage.getItem')}}</el-button>
                                    </el-form-item>
                                </el-form>
                                <el-table :data="productsList" 
                                ref="setMealTable" 
                                tooltip-effect="dark" 
                                style="width: 100%; text-align:center" 
                                height="450">                                    
                                    <el-table-column :label="$t('products.itemName')" fixed>
                                        <template scope="scope">                                    
                                            <span v-if="_SHOPLANGUAGE == 0">{{scope.row.itemNameObject.zh}}</span>
                                            <span v-if="_SHOPLANGUAGE == 1">{{scope.row.itemNameObject.en}}</span>
                                            <span v-if="_SHOPLANGUAGE == 2">{{scope.row.itemNameObject.jp}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="originPrice" sortable :label="$t('products.price')">
                                        <template scope="scope">
                                            <span v-if="_currencyType !== 'JAPAN'">{{scope.row.originPrice/100}}</span>
                                            <span v-else>{{scope.row.originPrice}}</span>
                                        </template>
                                    </el-table-column>                                    
                                    <el-table-column :label="$t('_global.status')">
                                        <template scope="scope">
                                            <span>{{scope.row.isSale | parseIsSale}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column :label="$t('_global.action')" width="100px" fixed="right">
                                        <template scope="scope">
                                            <el-button type="text" size="small" @click="selectItem(scope.row)">
                                                <i class="el-icon-plus" :title="$t('_global.add')"></i>
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <div class="block turn-page" style="margin-top:10px;">
                                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="totalItems">
                                    </el-pagination>
                                </div>                                
                            </el-col>
                        </el-row>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="setmealDialogVisible = false">{{$t('_global.cancel')}}</el-button>
                            <el-button type="primary" @click="addSetmealList()">{{$t('_global.save')}}</el-button>
                        </div>
                    </el-dialog>
                </div>

            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import axios from 'axios';
import $http from '../../../utils/http';
import Lockr from 'lockr';
import Cookies from 'js-cookie';
import {baiduTranslate, returnTransArray } from '../../../utils/translate.js';
export default {
    data() {
        var validateNum = (rule,value,callback) => {
            
            if(value !='' && value <= 0){
                callback(new Error(this.$t('rules.numType')));                                
            }else {
                callback();
            }
        };
        return {            
            activeName: 'first',
            imageUrl: '',
            timeSelectVisible: false,
            timeLists: [],
            checkAll: true,
            catalogDatas:[],
            itemTags: [],
            tagValue: '',
            dialogImageUrl: '',
            dialogVisible: false,
            timeDatas: [],
            itemAttrDatas: [],
            checkAttrList: [],
            sideDishDatas: [],
            checkSideDishList: [],
            attrGroups: [],
            sideDishGroups: [],
            productsList: [],
            setmealList: [],
            selectedSetmeals:[],
            setmealGroup: [],
            inputVisible: false,
            timeDialogVisible: false,
            setmealDialogVisible: false,
            attrDialogVisible: false,
            attrListDialogVisible: false,
            itemListDialogVisible: false,
            formLabelWidth: '120px',
            attrListForm: {
                name: ''
            },
            itemsForm: {
                itemName: '',
                itemType: ''
            },
            timeDurationForm: {
                name: '',
                startTime: '06:30',
                endTime: '22:00'
            },
            productForm: {
                gname: '',
                selectType: 'single',

                itemNameObject: { zh: '' }, //必填
                itemDescObject: { zh: '' },
                shopId: '',   //店铺id

                itemNo: '',         //必填--菜品编号
                catalogId: '',      //必填--所属分类
                itemName: '',       //必填 -- 菜品名称
                itemDesc: '',       //菜品描述
                itemType: "1",        //必填  1单点 2套餐 3配菜
                originPrice: '',    //必填  -- 原价

                discountPrice: '',   //折扣价
                picUrl: '',  //必填  -- 图片
                timeDurationList: [],   //可售时段列表
                timeDurations: [],     //可售时段

                attrGname: '',           //属性组名称
                attrGtype: 'single',     //属性组类型
                attrGlist: [],           //属性组列表

                itemGname: '',           //附属商品组名称--配菜
                itemGtype: 'multi',      //附属商品组类型
                itemGlist: [],           //配菜列表

                setmealGlist: [],       //套餐列表

                itemAttrs: [
                    {
                        title: '属性组',
                        gname: { zh: '', jp: '', en: '' },
                        selectType: 'single',  //multi
                        seq: 0,
                        attrs: []
                    }
                ],
                itemAttr: '',
                childItems: [
                    {
                        gname: { zh: '', jp: '', en: '' },
                        selectType: 'single',
                        seq: 0,
                        items: []
                    }
                ],
                seq: 1,  //必填
                busiType: 1,  //必填
            },
            rules: {
                itemNo: [
                    { required: true, message: this.$t('tips.rules.itemNo'), trigger: 'blur' }
                ],
                catalogId: [
                    { required: true, message: this.$t('tips.rules.catalog'), trigger: 'change' }
                ],
                itemName: [
                    { required: true, message: this.$t('tips.rules.itemName'), trigger: 'blur' }
                ],                
                originPrice: [
                    { required: true, message: this.$t('tips.rules.originPrice'), trigger: 'blur' },
                    { validator: validateNum , trigger:'blur'}
                ],
                discountPrice: [                    
                    { validator: validateNum , trigger:'blur'}
                ],
                itemType: [
                    { required: true, message: this.$t('tips.rules.itemType'), trigger: 'change' }
                ]
            },
            currentPage:1,
            pageSize: 10,
            totalItems:'',
            itemNameTransArray: [],
            itemDescTransArray: [],
            attrGnameTransArray: [],
            itemGnameTransArray: [],
            tagGnameTransArray: [],
            tagGroupObj: { zh: [], en: [], jp: [] }
        }

    },
    computed: {

        baseUrl(){
            return `${window.location.origin}/coron-web/`;
        },
        accepDatas() {
            return Lockr.get("itemUpdateData");
        },
        _SHOPLANGUAGE() {
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
    created() {
        //获取默认列表        
        this.getCatalogList();
        this.getTimeList();
        this.getItemAttrList();
        this.getItemList();
        this.getUpdateData();
    },
    methods: {
        getUpdateData() {            
            const data = this.accepDatas;
            this.productForm.itemNo = data.itemNo;
            this.productForm.catalogId = data.catalogId+"";
            this.tagGroupObj = data.tagsObj;

            if (this._SHOPLANGUAGE == 0) {
                this.productForm.itemName = data.itemNameObject.zh;
                this.productForm.itemDesc = data.itemDescObject.zh;
                this.itemTags = data.tagsObj.zh;
            }
            if (this._SHOPLANGUAGE == 1) {
                this.productForm.itemName = data.itemNameObject.en;
                this.productForm.itemDesc = data.itemDescObject.en;
                this.itemTags = data.tagsObj.en;
            }
            if (this._SHOPLANGUAGE == 2) {
                this.productForm.itemName = data.itemNameObject.jp;
                this.productForm.itemDesc = data.itemDescObject.jp;
                this.itemTags = data.tagsObj.jp;
            }

            if(this._currencyType !== 'JAPAN'){
                this.productForm.originPrice = data.originPrice/100 + "";
                this.productForm.discountPrice = !!data.discountPrice ? data.discountPrice/100 : "";
            } else {
                this.productForm.originPrice = data.originPrice + "";
                this.productForm.discountPrice = !!data.discountPrice ? data.discountPrice : "";
            }

            this.productForm.itemType = data.itemType+"";
            this.timeLists = data.timeDurations;
            this.attrGroups = data.itemAttrs;
            this.productForm.picUrl = this.imageUrl = data.picUrl;
            this.productForm.seq = data.seq;            
            
            if(data.itemType == 1){
                data.childItems.length > 0 ? this.sideDishGroups = data.childItems : this.sideDishGroups = [];
            } else {
                this.setmealGroup = data.childItems;
                data.childItems.length > 0 ? this.setmealList = data.childItems[0].items : this.setmealList = [];
            }

        },

        handleAvatarSuccess(res, file) {

            if (file.response.status) {
                this.imageUrl = URL.createObjectURL(file.raw);
                this.productForm.picUrl = file.response.entry;
                this.$message({
                    type: 'success',
                    message: this.$t('tips.message.imgUploadSuccess')
                })
            }

        },

        itemUploadError(file) {            
            this.$message({
                type: 'error',
                message: this.$t('tips.message.imgUploadError')
            })
        },

        beforeAvatarUpload(file) {

            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error(this.$t('tips.message.jpgorpng'));
            }
            if (!isLt2M) {
                this.$message.error(this.$t('tips.message.picSize'));
            }
            return isJPG && isLt2M;
        },

        cancelUpload(){
            this.imageUrl = '';
            this.productForm.picUrl = '';
        },

        handleRemove(file, fileList) {            
            this.imageUrl = '';
            this.productForm.picUrl = '';
        },

        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },

        handleCheckedAttrsChange(value) {           

        },
        handleCheckedDishChange(value) {
            
        },

        timeTagClose(tag) {
            let _index = this.itemTags.indexOf(tag);
            this.timeLists.splice(this.timeLists.indexOf(tag), 1);            
        },

        handleCheckedTimesChange(value) {
            
        },

        selectItem(item){            
            var self = this;
            if(self.selectedSetmeals.length > 10){
                self.$message({
                    type:'warning',
                    message:this.$t('tips.message.itemCount')
                });
            } else {
                if(JSON.stringify(self.selectedSetmeals).indexOf(JSON.stringify(item)) == -1 ){
                    self.selectedSetmeals.push(item);
                } else {
                    self.$message({
                        type:'warning',
                        message:this.$t('tips.message.itemExist')
                    });
                }
            }      
        },

        async getSetmeal() {
            var self = this;
            await self.getItemList();
            if(self.setmealList.length > 0){
                self.selectedSetmeals = [];
                for (let [index, elem] of self.setmealList.entries()) {                                        
                    self.selectedSetmeals.push(elem);
                }
            } else {
                self.selectedSetmeals = [];
            }
            self.setmealDialogVisible = true; 
        },

        okTime() {            
            this.timeSelectVisible = false;
        },

        // 翻页
        handleCurrentChange(page) {            
            this.getItemList();
        },

        handleSizeChange(size) {
            console.log(size);
        },

        getItemList() {
            //因为是套餐内商品所以默认查询所有单品
            let getParams = {
                itemType: [1],
                itemName:this.itemsForm.itemName == '' ? null : this.itemsForm.itemName,
                rp: 10,
                page: this.currentPage
            };

            $http.post('/coron-web/item/list', getParams)
                .then(response => {

                    !!response.rows && (this.productsList = response.rows);
                    this.totalItems = response.total;
                    console.log(this.productsList);

                })
                .catch(error => {
                    console.log(error);
                    this.$message({
                        type:'error',
                        message:this.$t('tips.message.network')
                    });
                })
        },

        getCatalogList() {
            $http.get('/coron-web/catalog/getCatalogs', {
                page: 1,
                rp: 100
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

        getTimeList() {

            $http.get('/coron-web/shopTimeDuration/list')
                .then(response => {

                    if (response.status) {

                        //response.data.rows && (this.timeDatas = response.data.rows);
                        //{name:'全天',timeDuration:{startTime:'00:00',endTime:'23:59'}}
                        if (response.rows && response.rows.length > 0) {
                            response.rows.forEach((item, index) => {
                                let obj = { startTime: item.startTime, endTime: item.endTime };
                                this.timeDatas.push(obj);                                
                            });
                        }

                    } else {
                        this.$message({
                            type: 'info',
                            message: response.message
                        });
                    }

                })
                .catch(error => {
                    console.log(error);
                   this.$message({
                        type:'error',
                        message:this.$t('tips.message.network')
                    });
                })
        },

        getItemAttrList() {
            $http.get('/coron-web/itemAttr/list',{
                page:1,
                rp:100
            }).then(response => {
                !!response.rows && (this.itemAttrDatas = response.rows);
            }).catch(error => {
                console.log(error);
                this.$message({
                    type:'error',
                    message:this.$t('tips.message.network')
                });
            })
        },
        //获取配菜
        getSideDishes() {
            this.itemListDialogVisible = true;

            $http.get('/coron-web/item/getSideDishes').then(response => {                
                if( response.status){
                    this.sideDishDatas = response.entry;
                } else {
                    this.$message({
                        type:'error',
                        message:response.message
                    })
                }
            }).catch(error => {
                this.$message({
                    type:'error',
                    message:this.$t('tips.message.network')
                });
                console.log(error);
            })
        },

        itemTagClose(tag) {            
            let _index = this.itemTags.indexOf(tag);            
            if (this.tagGnameTransArray.length > 0 || this.tagGroupObj.zh.length > 0) {
                this.tagGroupObj.zh.splice(_index, 1);
                this.tagGroupObj.en.splice(_index, 1);
                this.tagGroupObj.jp.splice(_index, 1);
            }            
        },

        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleTagInputConfirm() {
            let inputValue = this.tagValue;
            this.translateContent(inputValue, 'tag');
            if (inputValue) {
                this.itemTags.push(inputValue);
            }
            this.inputVisible = false;
            this.tagValue = '';
        },

       async translateContent(itemName, type) {
            var self = this;
            let _language = self._SHOPLANGUAGE;
            if(itemName !== ''){
                var res = await baiduTranslate(itemName,_language);
                switch(type){
                    case 'name':
                    var itemNameTrans = returnTransArray(res);
                    self.itemNameTransArray = returnTransArray(res);                    
                    break;
                    case 'desc':
                    self.itemDescTransArray = returnTransArray(res);                    
                    break;
                    case 'attrGroup':
                    self.attrGnameTransArray = returnTransArray(res);                    
                    break;
                    case 'itemGname':
                    self.itemGnameTransArray = returnTransArray(res);                    
                    break;
                    case 'tag':
                    self.tagGnameTransArray = returnTransArray(res);                    
                    if (self._SHOPLANGUAGE == 0) {
                        self.tagGroupObj.zh = self.itemTags;
                        self.tagGroupObj.jp.push(self.tagGnameTransArray[0].jp);
                        self.tagGroupObj.en.push(self.tagGnameTransArray[0].en);
                    } else if (self._SHOPLANGUAGE == 1) {
                        self.tagGroupObj.en = self.itemTags;
                        self.tagGroupObj.zh.push(self.tagGnameTransArray[0].zh);
                        self.tagGroupObj.jp.push(self.tagGnameTransArray[0].jp);
                    } else if (self._SHOPLANGUAGE == 2) {
                        self.tagGroupObj.jp = self.itemTags;
                        self.tagGroupObj.zh.push(self.tagGnameTransArray[0].zh);
                        self.tagGroupObj.en.push(self.tagGnameTransArray[0].en);
                    }                    
                    break;
                }


            }

        },

       async updateItems() {

            await this.translateContent(this.productForm.itemName,'name');
            await this.translateContent(this.productForm.itemDesc,'desc');

            let itemNameObj = { zh: this.productForm.itemName, jp: this.productForm.itemName, en: this.productForm.itemName };
            let itemDescObj = { zh: this.productForm.itemDesc, jp: this.productForm.itemDesc, en: this.productForm.itemDesc };
            let tagsObj = { zh: this.itemTags, jp: this.itemTags, en: this.itemTags };
            if (this._SHOPLANGUAGE == 0) {
                itemNameObj.zh = this.productForm.itemName;
                itemDescObj.zh = this.productForm.itemDesc;
                tagsObj.zh = this.itemTags;
            } else if (this._SHOPLANGUAGE == 1) {
                itemNameObj.en = this.productForm.itemName;
                itemDescObj.en = this.productForm.itemDesc;
                tagsObj.en = this.itemTags;
            } else if (this._SHOPLANGUAGE == 2) {
                itemNameObj.jp = this.productForm.itemName;
                itemDescObj.jp = this.productForm.itemDesc;
                tagsObj.jp = this.itemTags;
            }

            if (this.itemNameTransArray.length > 0) {
                itemNameObj = Object.assign(itemNameObj, this.itemNameTransArray[0]);                
            }
            if (this.itemDescTransArray.length > 0) {
                itemDescObj = Object.assign(itemDescObj, this.itemDescTransArray[0]);                
            }
            if (this.tagGnameTransArray.length > 0) {
                tagsObj = Object.assign(tagsObj, this.tagGroupObj);                
            }

            let updateParams = {
                itemId: this.accepDatas.itemId,
                itemNo: this.productForm.itemNo,
                itemNameObject: itemNameObj,
                itemDescObject: itemDescObj,
                tagsObj: tagsObj,
                catalogId: this.productForm.catalogId ? this.productForm.catalogId : -1,
                originPrice: this._currencyType !== 'JAPAN' ? this.productForm.originPrice * 100 : this.productForm.originPrice,
                discountPrice: this._currencyType !== 'JAPAN' ? (!!this.productForm.discountPrice ? this.productForm.discountPrice * 100 : this.productForm.originPrice * 100) : (!!this.productForm.discountPrice ? this.productForm.discountPrice : this.productForm.originPrice),
                picUrl: this.productForm.picUrl ? this.productForm.picUrl : "",
                itemType: this.productForm.itemType,
                timeDurations: this.timeLists.length == 0 ? [{ startTime: '00:00', endTime: '23:59' }] : this.timeLists,
                itemAttrs: this.attrGroups,
                childItems: this.productForm.itemType == 1 ? this.sideDishGroups : (this.productForm.itemType == 2 ? this.setmealGroup : null),
                seq: this.productForm.seq,
                busiType: 1
            };
            
            this.$refs['productForm'].validate((valid) => {

                if(valid){
                    axios({
                        url: '/coron-web/item/update',
                        method: 'post',
                        data: updateParams,
                        headers: {
                            Language: this._SHOPLANGUAGE
                        }
                    }).then(response => {

                        if (response.data.status == true) {
                            this.$message({
                                type: 'info',
                                message: this.$t('tips.message.updateSuccess')
                            })
                            //添加成功后需要跳转到菜品列表页
                            this.gobackList();
                        }

                    }).catch(error => {
                        console.log(error);
                        this.$message({
                            type: 'error',
                            message: this.$t('tips.message.updateError')
                        })
                    })

                } else {
                    this.$message({
                        type: 'warning',
                        message: this.$t('tips.rules.error')
                    });
                }

            })
        },

        gobackList() {
            this.$router.push({
                path: '/products/list'
            })
        },
        //选取属性列表
        selectAttr() {
            this.attrListDialogVisible = true;
        },
        // 选中属性列表
        selectedAttr() {
            var self = this;

            self.productForm.attrGlist = [];
            self.itemAttrDatas.forEach((item, index) => {

                self.checkAttrList.forEach((item2, index2) => {

                    if (item.itemAttrId == item2) {
                        //选中的数据结构  {itemAttrId:'',name:{zh:'',jp:'',en:''}}                        
                        self.productForm.attrGlist.push({ attrId: item2, name: { zh: item.attrNameObject.zh, jp: item.attrNameObject.jp, en: item.attrNameObject.en } });
                    }
                })

            })
            this.attrListDialogVisible = false;

        },

        // 选中配菜列表
        selectedSideDish() {
            var self = this;

            self.productForm.itemGlist = [];

            self.sideDishDatas.forEach((item, index) => {

                self.checkSideDishList.forEach((item2, index2) => {

                    if (item.itemId == item2) {
                        //选中的数据结构  {itemAttrId:'',name:{zh:'',jp:'',en:''}}                        
                        self.productForm.itemGlist.push(item);

                    }
                })

            })            
            this.itemListDialogVisible = false;

        },

        //根据索引删除已选中的标签
        handleClose(tag,tagType) {

            if(tagType == 'attr'){
                this.productForm.attrGlist.splice(this.productForm.attrGlist.indexOf(tag), 1);
                this.checkAttrList.splice(this.checkAttrList.indexOf(tag.itemAttrId), 1);
            } else {
                this.productForm.itemGlist.splice(this.productForm.itemGlist.indexOf(tag), 1);
                this.checkSideDishList.splice(this.checkSideDishList.indexOf(tag.itemId), 1);
            }   
        },

        deleteRow(rowIndex,tag) {
            //根据索引删除数据            
            tag == 'attr' ? this.attrGroups.splice(rowIndex, 1):this.sideDishGroups.splice(rowIndex,1);
        },

        deleteSetmealRow(rowIndex) {
            //根据索引删除数据
            //this.setmealList.splice(rowIndex, 1);
            this.selectedSetmeals.splice(rowIndex,1);
        },

        //选中配菜列表
        selectedItems() {

        },

       async addAttrGroup() {
            await this.translateContent(this.productForm.attrGname,'attrGroup');

            let attrGname = { zh: this.productForm.attrGname, jp: this.productForm.attrGname, en: this.productForm.attrGname };
            if (this.attrGnameTransArray.length > 0) {
                attrGname = Object.assign(attrGname, this.attrGnameTransArray[0]);
            }

            let attrItem = {
                gname: attrGname,
                selectType: this.productForm.attrGtype,  //multi
                seq: 0,
                attrs: this.productForm.attrGlist
            };

            if (this.productForm.attrGname != '' && this.productForm.attrGlist.length > 0) {

                this.attrGroups.push(attrItem);                
                this.productForm.attrGname = '';
                this.productForm.attrGlist = [];
                this.checkAttrList = [];

            } else {
                this.$message({
                    type: 'info',
                    message: this.$t('tips.message.attrNotNull')
                });
            }

        },

       async addItemGroup() {
            await this.translateContent(this.productForm.attrGname,'itemGname');

            let itemGname = { zh: this.productForm.itemGname, jp: this.productForm.itemGname, en: this.productForm.itemGname };
            if (this.itemGnameTransArray.length > 0) {
                itemGname = Object.assign(itemGname, this.itemGnameTransArray[0]);
            }

            let itemSideDish = {
                gname: itemGname,
                selectType: this.productForm.itemGtype,  //multi
                seq: 0,
                items: this.productForm.itemGlist
            };

            if (this.productForm.itemGname != '' && this.productForm.itemGlist.length > 0) {
                this.sideDishGroups.push(itemSideDish);
                this.productForm.itemGname = '';
                this.productForm.itemGlist = [];
                this.checkSideDishList = [];
            } else {
                this.$message({
                    type: 'info',
                    message: this.$t('tips.message.sideDishNotNull')
                });
            }

        },

        //类型切换
        itemTypeChange() {
            //console.log(this.productForm.itemType);
        },

        addSetmealList() {

            var self = this;
            self.setmealGroup = [];

            if(self.selectedSetmeals.length > 1 && self.selectedSetmeals.length < 10){
                
                self.setmealList = [];
                
                for (let [index, elem] of self.selectedSetmeals.entries()) {                    
                    if(JSON.stringify(self.setmealList).indexOf(JSON.stringify(elem)) ==-1 ){
                        self.setmealList.push(elem);
                    }
                }
                let setmealItem = {
                    gname: { zh: '', en: '', jp: '' },
                    selectType: 'single',
                    seq: 0,
                    items: self.setmealList
                };                
                self.setmealGroup.push(setmealItem);
                self.setmealDialogVisible = false;


            } else {
                this.$message({
                    type: 'warning',
                    message: this.$t('tips.message.num1to10')
                });
            }

        },

        //查询单品事件
        handleIconClick(ev) {
            console.log(ev);
        },

        //添加表单重置
        addFromReset() {
            this.productForm.itemNo = '';
            this.productForm.catalogId = '';
            this.productForm.itemName = '';
            this.productForm.itemDesc = '';
            this.productForm.originPrice = '';
            this.productForm.discountPrice = '';
            this.productForm.picUrl = this.imageUrl = '';
            this.productForm.timeDurations = [];
            this.timeLists = [];
            this.setmealGroup = [];
            this.attrGroups = [];
            this.sideDishGroups = [];
            this.itemTags = [];
            this.setmealList = [];
        }
    }
}
</script>

<style>
.addProductForm .el-form-item__content {
    text-align: left;
}

.addProducts {
    background: #fff;
    border: solid 1px #ccc;
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px !important;
    text-align: center;
}

.avatar {
    width: 100px;
    height: 100px;
    display: block;
}

.el-card__header {
    padding: 2px 20px !important;
}

.el-tag {
    margin-left: 8px;
}
.form-content {
    padding-bottom: 50px;
}
.btn-fixed {
    text-align: center;
    position: fixed;
    bottom: 20px;
    left: 40%;
}
.time-checkbox .el-checkbox+.el-checkbox {
    margin-left: 0;
}
</style>
