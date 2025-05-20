<template>
  <div style="margin-left:30px">
    <h3>新数据</h3>

    数据总计： {{ total }}
    <el-button
      class="top-button"
      type="primary"
      icon="el-icon-edit-outline"
      @click="showImport()"
    >
    导入数据
    </el-button>

    <el-table v-loading="listLoading" :data="list" height=700 highlight-current-row>
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

      <el-table-column fixed align="center" label="状态" width="120">
        <template slot-scope="{ row }">
          <el-tag :type="statusType[row.status]" effect="dark" size="mini">{{ row.status }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="上市状态" width="120">
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

      <el-table-column align="center" label="人均自由流通市值" width="120">
        <template slot-scope="{ row }">
          <span>{{ formatWan(row.ecmc_psh) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="关注度" width="120">
        <template slot-scope="{ row }">
          <span><el-rate v-model="row.popularity" :max="3" disabled></el-rate></span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="走势" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.trend }}</span>
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
      
      <el-table-column fixed="right" align="right" label="处理" width="260px">
        <template slot-scope="{ row , $index}">
          <el-button-group>
            <el-button v-if="row.ndate"
              class="row-button"
              type="warning"
              size="small"
              icon="el-icon-edit"
              @click="showBuy(row,$index)"
            >
              买入
            </el-button>
            <el-button
              class="row-button"
              type="success"
              size="small"
              icon="el-icon-edit"
              @click="showUpdate(row,$index)"
            >
              编辑
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

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="StockCode" prop="title">
          <el-input v-model="temp.stockCode" />
        </el-form-item>
        <el-form-item label="Date" prop="timestamp">
          <el-date-picker v-model="temp.ndate" type="date" placeholder="Please pick a date" value-format="yyyy-MM-dd"/>
        </el-form-item>
        <el-form-item label="关注度">
          <!-- <el-select v-model="temp.popularity" class="filter-item" placeholder="Please select" clearable>
            <el-option v-for="item in popularityOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select> -->
          <span><el-rate v-model="temp.popularity"   :max="3" ></el-rate></span>
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
        <el-button @click="dialogVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="doHandle()"> 
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <!-- <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="StockCode" prop="title">
          <el-input v-model="temp.stockCode" />
        </el-form-item>
        <el-form-item label="Date" prop="timestamp">
          <el-date-picker v-model="temp.ndate" type="date" placeholder="Please pick a date" value-format="yyyy-MM-dd"/>
        </el-form-item>
        <el-form-item label="关注度">
          <span><el-rate v-model="temp.popularity"   :max="3" ></el-rate></span>
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
        <el-button @click="dialogVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="doHandle()"> 
          Confirm
        </el-button>
      </div>
    </el-dialog> -->

  </div>
</template>

<script>
import { getWaitList,createAnalyte,updateAnalyte,updateSpecial,deleteAnalyte } from "@/api/analyte";
import { reasonOptions,listingStatusOptions,popularityOptions,trendOptions,rankColors } from "@/codebook";

export default {
  name: "WaitList",
  data() {
    return {
      total: 0,
      list: null,
      listLoading: true,
      isEdit: false,
      dialogVisible: false,
      reasonOptions,
      popularityOptions,
      trendOptions,
      rankColors,
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
        id: undefined,
        stockCode: undefined,
        ndate: '',
        plungeReason : '',
        trend : '',
        popularity : 0
      },
      nIndex: -1,
      rules: {
        stockCode: [{ required: true, message: 'stockCode is required', trigger: 'change' }],
        ndate: [{ type: 'date', required: true, message: 'date is required', trigger: 'change' }]
      },
    };
  },
  computed:{
    dialogTitle() {
      return this.isEdit?'更新数据':'导入数据'
    }
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      const { data } = await getWaitList();
      console.log(data);
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
      return (num !== null)?(num * 100).toFixed(2) + '%':"";
    },
    formatYi(num){
      return num?(num / 100000000).toFixed(2) + '亿':"";
    },
    formatWan(num){
      return num?(num / 10000).toFixed(2) + '万':"";
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
    showImport() {
      this.isEdit = false
      this.nIndex = undefined
      this.temp.analyteId = undefined
      this.temp.stockCode = undefined
      this.temp.ndate = ''
      this.temp.plungeReason = ''
      this.temp.trend = ''
      this.temp.popularity = ''
    
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    showUpdate(row,index) {
      this.isEdit = true
      this.nIndex = index
      this.temp.analyteId = row.analyteId
      this.temp.stockCode = row.stockCode
      this.temp.ndate = row.ndate
      this.temp.plungeReason = row.plungeReason
      this.temp.trend = row.trend
      this.temp.popularity = row.popularity

      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    doHandle(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            updateAnalyte(this.temp).then((response) => {
              this.dialogVisible = false
              this.list.splice(this.nIndex, 1, response.data.analyte)

              this.$notify({
                title: 'Success',
                message: 'Created Successfully',
                type: 'success',
                duration: 2000
              })
            })
          }else{
            createAnalyte(this.temp).then((response) => {
              this.dialogVisible = false
              console.log(response);
              this.list.unshift(response.data.analyte)
              this.total++
              this.$notify({
                title: 'Success',
                message: 'Updated Successfully',
                type: 'success',
                duration: 2000
              })
            })
          }
        }
      })
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
