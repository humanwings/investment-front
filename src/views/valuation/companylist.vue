<template>
  <div style="margin-left:30px">
    <h3>公司估值</h3>

    数据总计： {{ total }}
    <el-button
      class="top-button"
      type="primary"
      icon="el-icon-edit-outline"
      @click="showAdd()"
    >
    加入公司
    </el-button>
    <el-button
      class="top-button"
      type="primary"
      icon="el-icon-s-check"
      @click="confirmReValuateAll()"
    >
    全部重估
    </el-button>
    <el-button
      class="top-button"
      type="primary"
      icon="el-icon-price-tag"
      @click="confirmUpdatePriceAll()"
    >
    股价更新
    </el-button>

    <el-table v-loading="listLoading" :data="list" highlight-current-row  @row-dblclick="handleCurrentChange" :default-sort = "{prop: 'deviation', order: 'descending'}">
      <el-table-column fixed align="center" label="序号" width="50">
        <template slot-scope="{ $index }">
          <span>{{ $index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column fixed align="center" label="Name" width="80" prop="name">
      </el-table-column>

      <!-- <el-table-column fixed align="center" label="Code" width="120" prop="stockCode">
        <template slot-scope="{ row }">
          <span>{{ row.stockCode }}</span>
        </template>
      </el-table-column> -->

      <el-table-column align="center" label="综合评分" width="80" prop="score">
      </el-table-column>

      <el-table-column align="center" label="现价" width="80" prop="price">
      </el-table-column>

      <el-table-column align="center" label="假定增速" width="80">
        <template slot-scope="{ row , $index}">
          <el-input v-model="row.growthRateAssumption" @change="changeGrowthRate(row,$index)"></el-input>
        </template>
      </el-table-column>

      <el-table-column align="center" label="预估增速" width="80" prop="growthRatePrediction">
      </el-table-column>

      <el-table-column align="center" label="估值" width="80" prop="valuation">
      </el-table-column>

      <el-table-column align="center" label="价值偏差1" width="100" 
        :filters="deviationFilter"
        :filter-method="filterDeviationOfProfit">
        <template slot-scope="{ row }">
          <span>{{ formatPercent(row.deviation) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="FCF估值" width="80" prop="freeCashFlowPer" >
        <template slot-scope="{ row }">
          <span>{{ roundToDecimal(row.freeCashFlowPer*10,2) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="价值偏差2" width="100" 
        :filters="deviationFilter"
        :filter-method="filterDeviationOfProfit">
        <template slot-scope="{ row }">
          <span>{{ formatPercent(roundToDecimal(row.freeCashFlowPer*10,2)/row.price - 1,2)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="大V评分" width="80" >
        <template slot-scope="{ row }">
          <span>{{ row.recommendationScore }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="财务评分" width="80" >
        <template slot-scope="{ row }">
          <span>{{ row.financialScore }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="行业分类" width="80">
        <template slot-scope="{ row }">
          <span>{{ row.industryName }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="实控人" width="80">
        <template slot-scope="{ row }">
          <span>{{ row.controller }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="省份" width="80">
        <template slot-scope="{ row }">
          <span>{{ row.province }}</span>
        </template>
      </el-table-column> -->

      <el-table-column align="center" label="市值" width="90" sortable>
        <template slot-scope="{ row }">
          <span>{{ formatYi(row.marketValue) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="财报" width="80">
        <template slot-scope="{ row }">
          <span>{{ row.cfDate }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="股价日" width="80">
        <template slot-scope="{ row }">
          <span>{{ row.cvUpdateTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="更新日" width="80">
        <template slot-scope="{ row }">
          <span>{{ row.cfUpdateTime }}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" align="right" label="处理" width="260px">
        <template slot-scope="{ row , $index}">
          <el-button-group>
            <el-button 
              class="row-button"
              type="warning"
              size="small"
              @click="confirmUpdatePrice(row,$index)"
            >
              股价更新
            </el-button>
            <el-button
              class="row-button"
              type="success"
              size="small"
              @click="confirmUpdateReport(row,$index)"
            >
              财报更新
            </el-button> 
            <el-button
              class="row-button"
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="confirmDel(row,$index)"
            >
              删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <br>

    <el-dialog title="加入公司" :visible.sync="addDialogVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="StockCode" prop="title">
          <el-input ref="stock_code" autofocus=true v-model="temp.stockCode" @change="doAddCompany()" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="doAddCompany()"> 
          Confirm
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { addCompany,updatePrice,updatePriceAll,updateReport,deleteCompany, getCompanyList,reValuateAll,updateGrowthRate } from "@/api/company";
import { formatPercent,formatYi,formatWan,roundToDecimal} from "@/utils/index";
import { deviationFilter } from "@/codebook";

export default {
  name: "CompanyList",
  data() {
    return {
      total: 0,
      list: null,
      listLoading: true,
      addDialogVisible: false,
      statusType:{
        PLUNGE: 'warning',
        DECIDED: '',
        DONE: 'success'
      },
      listingStatusType:{
        normally_listed: 'success',
        special_treatment: 'warning',
        delisting_risk_warning: 'danger'
      },
      temp: {
        companyId: undefined,
        stockCode: undefined,
        growthRateAssumption: undefined
        // ndate: '',
        // plungeReason : '',
        // trend : '',
        // popularity : 0
      },
      nIndex: -1,
      rules: {
        stockCode: [{ required: true, message: 'stockCode is required', trigger: 'change' }]
      },
      deviationFilter
    };
  },
  computed:{
    dialogTitle() {
      return this.isEdit?'更新公司':'加入公司'
    }
  },
  created() {
    this.getList();
    this.listLoading = false;
  },
  methods: {
    async getList() {
      this.listLoading = true;
      const { data } = await getCompanyList();
      console.log(data)
      const items = data.list;
      this.total = data.sum;
      this.list = items;
      this.listLoading = false;
    },
    formatPercent,
    formatYi,
    formatWan,
    roundToDecimal,

    confirmReValuateAll() {
      this.$confirm(`此操作将对所有公司进行重新估值 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.listLoading = true;
        this.doReValuateAll()
      }).catch(() => {
      });
    },
    doReValuateAll() {
      reValuateAll().then(response => {
        const items = response.data.list;
        this.total = response.data.sum;
        this.list = items;
        this.listLoading = false;
        this.$notify({
          title: 'Success',
          message: 'Revaluate Successfully',
          type: 'success',
          duration: 2000
        })
      }).catch(error => {
        reject(error)
      })
    },

    confirmUpdatePrice(row,index) {
      this.$confirm(`此操作将重新取得公司的股价 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.doUpdatePrice(row,index)
      }).catch(() => {
      });
    },
    doUpdatePrice(row,index) {
      updatePrice(row.companyId).then(response => {

        this.$notify({
          title: 'Success',
          message: 'Update Successfully',
          type: 'success',
          duration: 2000
        })
      }).catch(error => {
        reject(error)
      })
    },
    confirmUpdatePriceAll() {
      this.$confirm(`此操作将重新取得所有公司的股价 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.listLoading = true;
        this.doUpdatePriceAll()
      }).catch(() => {
      });
    },
    doUpdatePriceAll() {
      updatePriceAll().then(response => {
        const items = response.data.list;
        this.total = response.data.sum;
        this.list = items;
        this.listLoading = false;
        this.$notify({
          title: 'Success',
          message: 'All Update Successfully',
          type: 'success',
          duration: 2000
        })
      }).catch(error => {
        reject(error)
      })
    },
    confirmUpdateReport(row,index) {
      this.$confirm(`此操作将更新公司财报数据 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.doUpdateReport(row,index)
      }).catch(() => {
      });
    },
    doUpdateReport(row,index) {
      this.temp.companyId = row.companyId;
      updateReport(this.temp).then(response => {
        this.$notify({
          title: 'Success',
          message: 'Update Report Successfully',
          type: 'success',
          duration: 2000
        })
      }).catch(error => {
        reject(error)
      })
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
      console.log(row.companyId)
      deleteCompany(row.companyId).then(response => {
        this.list.splice(index, 1)
        this.total--
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
    showAdd() {
      this.nIndex = undefined
      this.temp.stockCode = undefined
      this.addDialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.$refs['stock_code'].focus();
      })
    },
    doAddCompany(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addCompany(this.temp).then((response) => {
            this.addDialogVisible = false
            console.log(response);
            this.list.unshift(response.data.companyInfo)
            this.total++
            this.$notify({
              title: 'Success',
              message: 'Updated Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    changeGrowthRate(row,index) {
      console.log(row)
      console.log(index)
      this.temp.companyId = row.companyId;
      this.temp.growthRateAssumption = row.growthRateAssumption;
      
      updateGrowthRate(this.temp).then(response => {
        this.list.splice(index, 1, response.data.companyInfo)
        this.$notify({
          title: 'Success',
          message: 'Update Growth Rate Successfully',
          type: 'success',
          duration: 2000
        })
      }).catch(error => {
        reject(error)
      })
    },
    handleCurrentChange(val) {
      console.log("companyId : " + val.companyId)
      this.$router.push(`/valuation/company/${val.companyId}`);
      
    },
    filterDeviationOfProfit(value, row, column){

      var deviation = 0;
      switch (column.label ) {
        case "价值偏差1":
          deviation = row.deviation;
          break;
        case "价值偏差2":
          deviation = roundToDecimal(row.freeCashFlowPer*10,2)/row.price - 1;
          break;
        default:
        console.log("filterDeviationOfProfit column.label error")
          return true;
      }
        
      console.log(column)
      switch (value ) {
        case deviationFilter[0].value:

          return true;
        case deviationFilter[1].value:

          return true;
        case deviationFilter[2].value:

          return deviation >= 1 ;
        case deviationFilter[3].value:
          return deviation >= 0.5 ;
        case deviationFilter[4].value:
          return deviation >= 0.2 ;
        default:
          console.log("filterDeviationOfProfit error")
      }
      return true;
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
