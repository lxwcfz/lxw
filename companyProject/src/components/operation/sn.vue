<template>
    <div class="robotDancePage">
        <el-form :inline="true" style="text-align:center;">
            <el-form-item label="SN数量">
                <el-input v-model="snFrom.num" type="number" min="1" max="100" :placeholder="$t('placeholder.shopName')" readonly="readonly" @keyup.enter="getSnLists()"></el-input>
                1 <input type="range" v-model="snFrom.num" name="points" min="1" max="100" /> 100
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getSnLists()">{{$t('_global.search')}}</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="snLists" border style="width: 100%; text-align:center;">
            <el-table-column type="index" width="80"></el-table-column>            
            <el-table-column label="sn" min-width="130px">
                <template scope="scope">
                    <span> {{scope.row}}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import $http from "../../utils/http";
export default {
  data() {
    return {
      snLists: [],
      middleObj: {},
      snFrom: {
        num: 10
      }
    };
  },
  created() {
    
  },
  computed: {},
  methods: {
    getSnLists() {
      $http
        .post("/coron-web/robot/addRobotSn", {
          num: parseInt(this.snFrom.num)
        })
        .then(res => {
          if (res.status) {            
            this.snLists = res.entry;
          } else {
            this.$message({
              type: "error",
              message: res.message
            });
          }
        });
    }
  }
};
</script>


<style>
.robotDancePage {
  padding: 10px 15px;
}
</style>
