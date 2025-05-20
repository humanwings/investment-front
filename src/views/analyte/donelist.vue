<template>
  <div style="margin-left:30px">
    <h3>历史数据</h3>

    数据总计： {{ total }}
    <el-button
      class="top-button"
      type="primary"
      icon="el-icon-edit-outline"
      @click="handleImport()"
    >
    导入数据
    </el-button>

    <el-table v-loading="listLoading" :data="list" highlight-current-row>
      <el-table-column fixed align="center" label="序号" width="50">
        <template slot-scope="{ row }">
          <span>{{ row.analyteId }}</span>
        </template>
      </el-table-column>

      <el-table-column fixed align="center" label="Name" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column fixed align="center" label="N日" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.ndate }}</span>
        </template>
      </el-table-column>

      <el-table-column fixed align="center" label="Code" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.stockCode }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" width="120">
        <template slot-scope="{ row }">
          <el-tag :type="listingStatusType[row.listingStatus]" effect="dark" size="mini">{{ getListingStatus(row.listingStatus) }}</el-tag>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="种类" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.fsType }}</span>
        </template>
      </el-table-column> -->

      <el-table-column align="center" label="PE-TTM" width="120">
        <template v-if="row.pe" slot-scope="{ row }">
          <span>{{ row.pe.toFixed(2) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="PB(不含商誉)" width="120">
        <template v-if="row.pb" slot-scope="{ row }">
          <span>{{ row.pb.toFixed(2) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="市值" width="120">
        <template slot-scope="{ row }">
          <span>{{ formatYi(row.mc) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="流通市值" width="120">
        <template slot-scope="{ row }">
          <span>{{ formatYi(row.cmc) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="自由流通市值" width="120">
        <template slot-scope="{ row }">
          <span>{{ formatYi(row.ecmc) }}</span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" label="股东人数" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.shn }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="人均自由流通市值" width="140">
        <template slot-scope="{ row }">
          <span>{{ formatWan(row.ecmc_psh) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="暴跌原因" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.plungeReason }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="暴跌天数" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.plungeDates }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="暴跌缺口数" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.plungeGap }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="暴跌平台数" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.plungeTerrace }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="暴跌最大幅度" width="120">
        <template slot-scope="{ row }">
          <span>{{ formatPercent(row.plungeMax) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="暴跌总幅度" width="120">
        <template slot-scope="{ row }">
          <span>{{ formatPercent(row.plungeSum) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="N-1日跌幅" width="120">
        <template slot-scope="{ row }">
          <span>{{ formatPercent(row.valleyRange1) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="N日跌幅" width="120">
        <template slot-scope="{ row }">
          <span>{{ formatPercent(row.valleyRange2) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="N-1日振幅" width="120">
        <template slot-scope="{ row }">
          <span>{{ formatPercent(row.valleyAmplitude1) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="N日振幅" width="120">
        <template slot-scope="{ row }">
          <span>{{ formatPercent(row.valleyAmplitude2) }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="N-1日颜色" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.plungeSum }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="N日颜色" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.plungeSum }}</span>
        </template>
      </el-table-column> -->
      
      <el-table-column fixed="right" align="center" label="处理" width="100px">
        <template slot-scope="{ row , $index}">
          <el-button
            class="row-button"
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="confirmDel(row,$index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <div class="block">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>

    <el-dialog title="导入数据" :visible.sync="importVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="StockCode" prop="title">
          <el-input v-model="temp.stockCode" />
        </el-form-item>
        <el-form-item label="Date" prop="timestamp">
          <el-date-picker v-model="temp.ndate" type="date" placeholder="Please pick a date" value-format="yyyy-MM-dd"/>
        </el-form-item>
        <el-form-item label="关注度">
          <span><el-rate v-model="temp.popularity"  :max="3" ></el-rate></span>
        </el-form-item>
        <el-form-item label="走势">
          <el-select v-model="temp.trend" class="filter-item" placeholder="Please select" clearable>
            <el-option v-for="item in trendOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="原因">
          <el-select v-model="temp.plungeReason" class="filter-item" placeholder="Please select" clearable>
            <el-option v-for="item in reasonOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="importVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="importData()"> 
          Confirm
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { createAnalyte,getDonePage,deleteAnalyte } from "@/api/analyte";
import { reasonOptions,listingStatusOptions,popularityOptions,trendOptions } from "@/codebook";

export default {
  name: "DoneList",
  data() {
    return {
      total: 0,
      list: null,
      listLoading: true,
      listQuery:{
        page: 1,
        limit: 10
        // stockCode: undefined,
        // ndate: undefined,
        // plungeReason: undefined
      },
      listingStatusType:{
        normally_listed: 'success',
        special_treatment: 'warning',
        delisting_risk_warning: 'danger'
      },
      importVisible: false,
      dialogStatus: '',
      reasonOptions,
      popularityOptions,
      trendOptions,
      temp: {
        id: undefined,
        stockCode: undefined,
        ndate: '',
        plungeReason : '',
        trend : '',
        popularity : 0
      },
      rules: {
        stockCode: [{ required: true, message: 'stockCode is required', trigger: 'change' }],
        ndate: [{ type: 'date', required: true, message: 'date is required', trigger: 'change' }]
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      const { data } = await getDonePage(this.listQuery);
      const items = data.list;
      this.total = data.sum;
      this.list = items;
      //   this.list = items.map(v => {
      //     this.$set(v, 'edit', false)
      //     v.originalTitle = v.title
      //     return v
      //   })
      this.listLoading = false;
    },
    getListingStatus(status){
      let label = ''
      listingStatusOptions.forEach((obj)=>{
        if (obj.value === status){
          label =  obj.label
        }
      })
      return label
    },
    formatPercent(num){
      return (num * 100).toFixed(2) + '%'
    },
    formatYi(num){
      return (num / 100000000).toFixed(2) + '亿'
    },
    formatWan(num){
      return (num / 10000).toFixed(2) + '万'
    },
    editItem(row) {
      var id = row.strategyId;
      this.$router.push(`/strategy/strategyedit/${id}`);
    },
    confirmDel(row,index) {
      this.$confirm(`此操作将删除此数据, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.delItem(row,index)
      }).catch(() => {
      });
    },
    delItem(row,index) {
      deleteAnalyte(row.analyteId).then(response => {
        // this.list.splice(index, 1)
        this.getList()
        this.$notify({
          title: 'Success',
          message: 'Deleted Successfully',
          type: 'success',
          duration: 2000
        })
      }).catch(error => {
        reject(error)
      })
    },
    handleImport() {
      // this.resetTemp()
      this.dialogStatus = 'create'
      this.importVisible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
    },
    importData(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createAnalyte(this.temp).then((response) => {
            // this.list.unshift(this.temp)
            this.importVisible = false
            // console.log(response);
            // this.list.unshift(response.data.analyte)
            this.handleCurrentChange(1)
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleSizeChange(pageLimit) {
      this.listQuery.limit = pageLimit
      this.getList()
    },
    handleCurrentChange(currentPage) {
      this.listQuery.page = currentPage
      this.getList()
    }
  }
};
</script>

<style scoped>
.edit-input {
  margin: 15px;
  width: 200px;
}

.top-button {
  float: right;
  margin-right: 20px;
  width: 120px;
}

.row-button {
  width: 80px;
}

</style>
