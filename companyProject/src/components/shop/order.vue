<template>
  <div class="orderPage">
    <el-form :inline="true" :model="orderFrom">
      <el-form-item :label="$t('shop.order.time')">
        <el-date-picker v-model="startTrade" type="datetime" :placeholder="$t('placeholder.startTime')" align="right" format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerTradetime">
        </el-date-picker>        
        <el-date-picker v-model="endTrade" type="datetime" :placeholder="$t('placeholder.endTime')" align="right" :picker-options="pickerTradetime">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('shop.trade.status')">
        <el-select v-model="tradeStatus" :placeholder="$t('placeholder.orderStatus')"  @change="getSomeThing()">
          <el-option :label="$t('shop.order.all')" value=""></el-option>
          <el-option :label="$t('shop.trade.pendingAudit')" value="1"></el-option>
          <el-option :label="$t('shop.trade.order')" value="4"></el-option>
          <el-option :label="$t('shop.trade.unpaid')" value="6"></el-option>
          <el-option :label="$t('shop.trade.paySuccess')" value="7"></el-option>
          <el-option :label="$t('shop.trade.complete')" value="10"></el-option>
          <el-option :label="$t('shop.trade.closed')" value="11"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getSomeThing()">{{$t('_global.search')}}</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tradeLists" border style="width: 100%; text-align:center;">      
      <el-table-column prop="tradeId" :label="$t('shop.order.orderId')" width="180">
      </el-table-column>
      <el-table-column prop="originalAmount" :label="$t('shop.order.oldPrice')" width="180">
        <template scope="scope">          
          <span v-if="scope.row.currencyPrecision != 0">
            {{scope.row.originalAmount / Math.pow(10,scope.row.currencyPrecision)}}
          </span>
          <span v-else>{{scope.row.originalAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="paidAmount" :label="$t('shop.order.price')" width="180">        
        <template scope="scope">
          <span v-if="scope.row.currencyPrecision != 0">
            {{scope.row.paidAmount / Math.pow(10,scope.row.currencyPrecision)}}
          </span>
          <span v-else>{{scope.row.paidAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tradeStatus" :label="$t('shop.order.status')" width="180">
        <template scope="scope">
          <span>{{ scope.row.tradeStatus| tradeStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createdTime" :label="$t('shop.order.orderTime')">
      </el-table-column>
      <el-table-column :label="$t('_global.action')">
        <template scope="scope">
          <el-button type="primary" size="small" @click="getDetailTrade(scope.row)">{{$t('shop.order.info')}}</el-button>
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
import Cookies from 'js-cookie';
import formatDate from '../../utils/formatDate';
export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      orderFrom: {
        time: '',
        status: '0'
      },
      tradeStatus:'',
      tradeLists: [],
      tradeDetailInfo:'',
      pickerTradetime: {
        shortcuts: [{
          text: this.$t('tips.time.today'),
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: this.$t('tips.time.yestoday'),
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: this.$t('tips.time.aweekago'),
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      startTrade: '',
      endTrade: ''
    }
  },
  created() {
    this.getTrade();
  },
  methods: {
    getTrade() {
      const getData = {
        startTime: this.startTrade == '' ? '' : formatDate(this.startTrade,'yyyy-MM-dd h:m:s'),
        endTime: this.endTrade == '' ? '' : formatDate(this.endTrade,'yyyy-MM-dd h:m:s'),
        tradeStatus: this.tradeStatus,
        page: this.currentPage,
        rp: 10,
      };

      $http.post('/coron-web/trade/getByShop', getData).then(res => {
        if(res.status){
          this.tradeLists = res.rows;
          this.totalItems = res.total;
        }
      })
    },
    
    getDetailTrade(item) {

      var self = this;
      $http.post('/coron-web/trade/getTradeInfo', {
        tradeId: item.tradeId
      }).then(res => {

        if(res.status){
          self.tradeDetailInfo = res.entry;
          Lockr.set("tradeDetailInfo",self.tradeDetailInfo);
          this.$router.push({
            path:'/shop/orderdetail'
          });
        }
      })
    },

    handleSizeChange(size) {
      console.log(size);
    },
    // 翻页
    handleCurrentChange(page) {      
      this.getTrade();
    },


    getSomeThing() {      
      this.getTrade();
    }

  }
}
</script>

<style>
.orderPage {
  padding: 10px 15px;
}
</style>
