<template>
  <div style="margin-left:30px">
    <h3>验证结果比较</h3>

    <span>{{ nameOne }} vs {{ nameTwo }}</span> 
    <span style="margin-left:30px">数据总计： {{ total }}</span>
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

      <el-table-column align="center" label="买入价1" width="120">
        <template v-if="row.buyPriceOne != null" slot-scope="{ row }">
          <span>{{ row.buyPriceOne }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="买入价2" width="120">
        <template v-if="row.buyPriceTwo != null" slot-scope="{ row }">
          <span>{{ row.buyPriceTwo }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="买入日序1" width="120">
        <template v-if="row.buyPriceOne != null" slot-scope="{ row }">
          <span>{{ row.buyDateSeqOne }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="买入日序2" width="120">
        <template v-if="row.buyPriceTwo != null" slot-scope="{ row }">
          <span>{{ row.buyDateSeqTwo }}</span>
        </template>
      </el-table-column> -->

      <!-- <el-table-column align="center" label="仓位1" width="120">
        <template v-if="row.buyPriceOne != null" slot-scope="{ row }">
          <span>{{ row.positionOne.toFixed(2) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="仓位2" width="120">
        <template v-if="row.buyPriceTwo != null" slot-scope="{ row }">
          <span>{{ row.positionTwo.toFixed(2) }}</span>
        </template>
      </el-table-column> -->

      <el-table-column align="center" label="卖出价1" width="120">
        <template v-if="row.sellPriceOne != null" slot-scope="{ row }">
          <span>{{ row.sellPriceOne }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="卖出价2" width="120">
        <template v-if="row.sellPriceTwo != null" slot-scope="{ row }">
          <span>{{ row.sellPriceTwo }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="卖出日序1" width="120">
        <template v-if="row.sellDateSeqOne != null" slot-scope="{ row }">
          <span>{{ row.sellDateSeqOne }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="卖出日序2" width="120">
        <template v-if="row.sellDateSeqTwo != null" slot-scope="{ row }">
          <span>{{ row.sellDateSeqTwo }}</span>
        </template>
      </el-table-column> -->

      <el-table-column align="center" label="盈亏1" width="120">
        <template v-if="row.balanceOne != null" slot-scope="{ row }">
          <span>{{ row.balanceOne.toFixed(2) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="盈亏2" width="120">
        <template v-if="row.balanceTwo != null" slot-scope="{ row }">
          <span>{{ row.balanceTwo.toFixed(2) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="备考1" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.commentOne }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="备考2" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.commentTwo }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column fixed="right" align="center" label="处理" width="200px">
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
      </el-table-column> -->
    </el-table>

    

  </div>
</template>

<script>
import { getComparison } from "@/api/verification";

export default {
  name: "verificationcomparison",
  data() {
    return {
      list: null,
      listLoading: true,
      total: null,
      nameOne: null,
      nameTwo: null,
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
      var postData = {
        idOne: this.$route.params.idOne,
        idTwo: this.$route.params.idTwo
      }
      const { data } = await getComparison(postData);
      const items = data.list;
      this.list = items;
      this.total = data.sum;
      this.nameOne = data.nameOne;
      this.nameTwo = data.nameTwo;
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
