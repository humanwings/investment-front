<template>
  <div style="margin-left:30px">
    <h3>数据验证</h3>

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

      <el-table-column fixed align="center" label="Name" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.stockCode }}</span>
        </template>
      </el-table-column>

      <el-table-column fixed align="center" label="N日" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.ndate }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="买入价" width="120">
        <template v-if="row.buyPrice != null" slot-scope="{ row }">
          <span>{{ row.buyPrice }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="买入日序" width="120">
        <template v-if="row.buyPrice != null" slot-scope="{ row }">
          <span>{{ row.buyDateSeq }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="仓位" width="120">
        <template v-if="row.buyPrice != null" slot-scope="{ row }">
          <span>{{ row.position.toFixed(2) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="卖出价" width="120">
        <template v-if="row.sellPrice != null" slot-scope="{ row }">
          <span>{{ row.sellPrice }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="卖出日序" width="120">
        <template v-if="row.sellDateSeq != null" slot-scope="{ row }">
          <span>{{ row.sellDateSeq }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="盈亏" width="120">
        <template v-if="row.balance != null" slot-scope="{ row }">
          <span>{{ row.balance.toFixed(2) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="备考" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.comment }}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" align="center" label="处理" width="200px">
          <el-button-group>
            <el-button
              class="row-button"
              type="success"
              size="small"
              icon="el-icon-edit"
            >
              编辑
            </el-button>
          </el-button-group>
          <el-button-group>
            <el-button
              class="row-button"
              type="danger"
              size="small"
              icon="el-icon-edit"
            >
              删除
            </el-button>
          </el-button-group>
      </el-table-column>
    </el-table>

    <el-dialog title="导入数据" :visible.sync="importVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="StockCode" prop="title">
          <el-input v-model="temp.stockCode" />
        </el-form-item>
        <el-form-item label="Date" prop="timestamp">
          <el-date-picker v-model="temp.ndate" type="date" placeholder="Please pick a date" value-format="yyyy-MM-dd"/>
        </el-form-item>
        <el-form-item label="Reason">
          <el-select v-model="temp.plungeReason" class="filter-item" placeholder="Please select">
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
import { getVerification } from "@/api/verification";
import { reasonOptions } from "@/codebook";

export default {
  name: "verification",
  data() {
    return {
      strategyId:this.$route.params.id,
      list: null,
      listLoading: true,
      importVisible: false,
      dialogStatus: '',
      reasonOptions,
      temp: {
        id: undefined,
        stockCode: undefined,
        ndate: '',
        plungeReason : ''
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
      // this.listLoading = true;
      var id = this.strategyId? this.strategyId:8;
      console.log(`---------strategyId:${id}`)
      const { data } = await getVerification(id);
      const items = data.list;
      this.list = items;
      this.listLoading = false;
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
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    importData(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createAnalyte(this.temp).then(() => {
            // this.list.unshift(this.temp)
            this.importVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  },
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
