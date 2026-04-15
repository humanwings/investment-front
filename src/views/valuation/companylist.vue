<template>
  <div v-loading="listLoading" class="company-list-page">
    <div class="page-header">
      <div>
        <h2 class="page-title">公司列表</h2>
        <p class="page-description">公司池入口页，先看公司概况、利润贴现摘要和评分，再进入详情或利润贴现一览。</p>
      </div>
      <div class="page-actions">
        <el-button type="primary" icon="el-icon-data-analysis" @click="$router.push('/valuation/profit-discount')">
          利润贴现一览
        </el-button>
        <el-button icon="el-icon-plus" @click="showAdd()">
          加入公司
        </el-button>
        <el-button icon="el-icon-refresh" @click="confirmReValuateAll()">
          全部重估
        </el-button>
        <el-button icon="el-icon-price-tag" @click="confirmUpdatePriceAll()">
          股价更新
        </el-button>
      </div>
    </div>

    <el-card shadow="never" class="summary-card">
      <div class="summary-grid">
        <div class="summary-item">
          <div class="summary-label">公司数量</div>
          <div class="summary-value">{{ total }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">高估值偏离公司</div>
          <div class="summary-value">{{ positiveDeviationCount }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">高财务评分公司</div>
          <div class="summary-value">{{ strongFinancialCount }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">高大V评分公司</div>
          <div class="summary-value">{{ strongRecommendCount }}</div>
        </div>
      </div>
    </el-card>

    <el-table
      :data="list"
      highlight-current-row
      border
      class="company-table"
      @row-dblclick="handleCurrentChange"
    >
      <el-table-column align="center" label="序号" width="70">
        <template slot-scope="{ $index }">
          <span>{{ $index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="公司" min-width="180">
        <template slot-scope="{ row }">
          <div class="company-name">{{ row.name || '-' }}</div>
          <div class="company-subline">{{ row.industryName || '-' }}</div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="现价" width="110">
        <template slot-scope="{ row }">
          <span>{{ displayNumber(row.price) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="利润贴现估值" width="130">
        <template slot-scope="{ row }">
          <span>{{ displayNumber(row.valuation) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="利润贴现偏离" width="130" sortable>
        <template slot-scope="{ row }">
          <span>{{ displayDeviation(row.deviation) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="财务评分" width="110">
        <template slot-scope="{ row }">
          <span>{{ displayScore(row.financialScore) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="大V评分" width="110">
        <template slot-scope="{ row }">
          <span>{{ displayScore(row.recommendationScore) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="综合结论" min-width="220">
        <template slot-scope="{ row }">
          <div class="tag-list">
            <el-tag size="mini" :type="deviationTagType(row.deviation)">
              {{ deviationTagText(row.deviation) }}
            </el-tag>
            <el-tag size="mini" type="info">
              财务 {{ displayScore(row.financialScore) }}
            </el-tag>
            <el-tag size="mini" type="warning">
              大V {{ displayScore(row.recommendationScore) }}
            </el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="财报期" width="100">
        <template slot-scope="{ row }">
          <span>{{ row.cfDate || '-' }}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" align="center" label="操作" width="270">
        <template slot-scope="{ row, $index }">
          <el-button-group>
            <el-button size="mini" type="primary" @click="handleCurrentChange(row)">
              详情
            </el-button>
            <el-button size="mini" type="warning" @click="confirmUpdatePrice(row, $index)">
              股价更新
            </el-button>
            <el-button size="mini" type="success" @click="confirmUpdateReport(row, $index)">
              财报更新
            </el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="confirmDel(row, $index)" />
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="加入公司" :visible.sync="addDialogVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" class="dialog-form">
        <el-form-item label="StockCode" prop="stockCode">
          <el-input ref="stock_code" v-model="temp.stockCode" autofocus @change="doAddCompany()" />
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
import {
  addCompany,
  deleteCompany,
  getCompanyList,
  reValuateAll,
  updatePrice,
  updatePriceAll,
  updateReport
} from '@/api/company'
import { formatPercent, roundToDecimal } from '@/utils/index'

export default {
  name: 'CompanyList',
  data() {
    return {
      total: 0,
      list: [],
      listLoading: true,
      addDialogVisible: false,
      temp: {
        companyId: undefined,
        stockCode: undefined
      },
      rules: {
        stockCode: [{ required: true, message: 'stockCode is required', trigger: 'change' }]
      }
    }
  },
  computed: {
    positiveDeviationCount() {
      return this.list.filter(item => this.normalizeNumber(item.deviation) > 0.2).length
    },
    strongFinancialCount() {
      return this.list.filter(item => this.normalizeNumber(item.financialScore) >= 70).length
    },
    strongRecommendCount() {
      return this.list.filter(item => this.normalizeNumber(item.recommendationScore) >= 70).length
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      try {
        const { data } = await getCompanyList()
        this.list = data.list || []
        this.total = data.sum || 0
      } finally {
        this.listLoading = false
      }
    },
    normalizeNumber(value) {
      if (value === null || value === undefined || value === '') {
        return null
      }
      const numberValue = Number(value)
      return Number.isNaN(numberValue) ? null : numberValue
    },
    displayNumber(value) {
      const numberValue = this.normalizeNumber(value)
      return numberValue === null ? '-' : roundToDecimal(numberValue, 2)
    },
    displayDeviation(value) {
      const numberValue = this.normalizeNumber(value)
      return numberValue === null ? '-' : formatPercent(numberValue)
    },
    displayScore(value) {
      const numberValue = this.normalizeNumber(value)
      return numberValue === null ? '-' : roundToDecimal(numberValue, 1)
    },
    deviationTagText(value) {
      const deviation = this.normalizeNumber(value)
      if (deviation === null) {
        return '偏离待更新'
      }
      if (deviation >= 0.5) {
        return '高安全边际'
      }
      if (deviation >= 0.2) {
        return '具备观察价值'
      }
      if (deviation >= 0) {
        return '接近合理区间'
      }
      return '高于估值参考'
    },
    deviationTagType(value) {
      const deviation = this.normalizeNumber(value)
      if (deviation === null) {
        return 'info'
      }
      if (deviation >= 0.2) {
        return 'success'
      }
      if (deviation >= 0) {
        return 'warning'
      }
      return 'danger'
    },
    confirmReValuateAll() {
      this.$confirm('此操作将对所有公司进行重新估值，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        this.doReValuateAll()
      }).catch(() => {})
    },
    doReValuateAll() {
      reValuateAll().then(response => {
        this.list = response.data.list || []
        this.total = response.data.sum || 0
        this.listLoading = false
        this.$notify({
          title: 'Success',
          message: 'Revaluate Successfully',
          type: 'success',
          duration: 2000
        })
      })
    },
    confirmUpdatePrice(row) {
      this.$confirm('此操作将重新取得公司的股价，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doUpdatePrice(row)
      }).catch(() => {})
    },
    doUpdatePrice(row) {
      updatePrice(row.companyId).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Update Successfully',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    confirmUpdatePriceAll() {
      this.$confirm('此操作将重新取得所有公司的股价，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        this.doUpdatePriceAll()
      }).catch(() => {})
    },
    doUpdatePriceAll() {
      updatePriceAll().then(response => {
        this.list = response.data.list || []
        this.total = response.data.sum || 0
        this.listLoading = false
        this.$notify({
          title: 'Success',
          message: 'All Update Successfully',
          type: 'success',
          duration: 2000
        })
      })
    },
    confirmUpdateReport(row) {
      this.$confirm('此操作将更新公司财报数据，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doUpdateReport(row)
      }).catch(() => {})
    },
    doUpdateReport(row) {
      this.temp.companyId = row.companyId
      updateReport(this.temp).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Update Report Successfully',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    confirmDel(row, index) {
      this.$confirm('此操作将删除此数据，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delItem(row, index)
      }).catch(() => {})
    },
    delItem(row, index) {
      deleteCompany(row.companyId).then(() => {
        this.list.splice(index, 1)
        this.total -= 1
        this.$notify({
          title: 'Success',
          message: 'Deleted Successfully',
          type: 'success',
          duration: 2000
        })
      })
    },
    showAdd() {
      this.temp.stockCode = undefined
      this.addDialogVisible = true
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
        this.$refs.stock_code.focus()
      })
    },
    doAddCompany() {
      this.$refs.dataForm.validate(valid => {
        if (!valid) {
          return
        }
        addCompany(this.temp).then(response => {
          this.addDialogVisible = false
          this.list.unshift(response.data.companyInfo)
          this.total += 1
          this.$notify({
            title: 'Success',
            message: 'Updated Successfully',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    handleCurrentChange(row) {
      this.$router.push(`/valuation/company/${row.companyId}`)
    }
  }
}
</script>

<style scoped>
.company-list-page {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 16px;
}

.page-title {
  margin: 0 0 8px;
  font-size: 26px;
}

.page-description {
  margin: 0;
  color: #606266;
}

.page-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.summary-card {
  margin-bottom: 20px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.summary-item {
  padding: 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f5f7fa 0%, #eef3f8 100%);
}

.summary-label {
  color: #909399;
  font-size: 13px;
  margin-bottom: 8px;
}

.summary-value {
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.company-table {
  width: 100%;
}

.company-name {
  font-weight: 600;
  color: #303133;
}

.company-subline {
  margin-top: 4px;
  color: #909399;
  font-size: 12px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
}

.dialog-form {
  width: 400px;
  margin-left: 50px;
}

@media (max-width: 1200px) {
  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .company-list-page {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
  }

  .page-actions {
    justify-content: flex-start;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
