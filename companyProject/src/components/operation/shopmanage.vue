<template>
  <div class="shopmanage-page">
    <el-form :inline="true" :model="shopFrom" @submit.native.prevent>
      <el-form-item :label="$t('shop.shopName')">
        <el-input v-model="shopFrom.name" :placeholder="$t('placeholder.shopName')" @keyup.enter.native="getShopList()"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getShopList()">{{$t('_global.search')}}</el-button>
        <el-button type="primary" @click="goAddShop()">{{$t('shop.addShop')}}</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="shopLists" border style="width: 100%; text-align:center;">
      <el-table-column label="ID" prop="id" >
      </el-table-column>
      <el-table-column prop="name.zh" :label="$t('shop.shopName')">
        <template scope="scope">
          <span v-if=" scope.row.language == 0">{{ scope.row.name.zh }}</span>
          <span v-if=" scope.row.language == 1">{{ scope.row.name.en }}</span>
          <span v-if=" scope.row.language == 2">{{ scope.row.name.jp }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('shop.shopAddress')">
        <template scope="scope">          
          <span v-if=" scope.row.language == 0">{{ scope.row.address }}</span>
          <span v-if=" scope.row.language == 1">{{ scope.row.address }}</span>
          <span v-if=" scope.row.language == 2">{{ scope.row.address | addressParse }}</span>
        </template>
      </el-table-column> 
      <el-table-column prop="shopTel" :label="$t('shop.shopContact')">
      </el-table-column>     
      <el-table-column :label="$t('_global.action')" width="130">
        <template scope="scope">
          <el-button type="text" size="small" @click="getShopDetail(scope.row)">{{$t('shop.detailInfo')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block turn-page" style="margin-top:10px;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="totalItems">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import $http from '../../utils/http';
import Lockr from 'lockr';
import { mapGetters,mapMutations} from 'vuex';
export default {
  data() {
    return {
      loading:true,
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      shopFrom: {
        name: ''
      },
      shopLists: [],
    }

  },
  computed:{
    ...mapGetters([
        'shop'
    ])
  },
  created(){    
    this.getShopList();
  },
  methods:{

    getShopList(){
      
      const data ={
        shopName:this.shopFrom.name,
        page:this.currentPage,
        rp:this.pageSize
      };
      $http.post('/coron-web/shop/list',data).then(res => {
        
        if(res.status){
          this.shopLists = res.rows;
          this.totalItems = res.total;
        } else {
          this.$message.error(res.message);
        }
        
      })
    },

    getShopDetail(item){     

      Lockr.set('shopDetailData',item);
      this.$router.push({
        name:'shopdetail',
        params:{
          item:item.id
        }
      })
    },

    handleSizeChange(size) {
      console.log(size);
    },
    // 翻页
    handleCurrentChange(page) {      
      this.getShopList();
    },

    goAddShop(){
      this.$router.push({
        path:'/operation/addshop'
      });      
    },

    ...mapMutations({        
        setShopInfo:'SET_SHOPINFO'
    })
  }
}
</script>

<style>
.shopmanage-page {
  padding: 15px 10px;
}
</style>
