<template>
  <div v-loading="listLoading" class="profit-discount-page">
    <div class="page-header">
      <div>
        <h2 class="page-title">利润贴现一览</h2>
        <p class="page-description">横向比较利润贴现模型，并在同一页面调整增长率假设。</p>
      </div>
      <div class="page-actions">
        <el-button icon="el-icon-office-building" @click="$router.push('/valuation/company')">
          返回公司列表
        </el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="getList()">
          刷新数据
        </el-button>
      </div>
    </div>

    <el-card shadow="never" class="filter-card">
      <div class="filter-bar">
        <div class="filter-item">
          <span class="filter-label">行业筛选</span>
          <el-select v-model="selectedIndustry" clearable filterable placeholder="全部行业" class="industry-select">
            <el-option
              v-for="industry in industries"
              :key="industry"
              :label="industry"
              :value="industry"
            />
          </el-select>
        </div>
        <div class="filter-item filter-meta">
          <span>当前公司数：{{ filteredList.length }}</span>
          <span>全部公司数：{{ total }}</span>
        </div>
      </div>
    </el-card>

    <el-card shadow="never" class="filter-card">
      <div class="filter-bar batch-bar">
        <div class="filter-item">
          <span class="filter-label">批量增长率</span>
          <el-input-number
            v-model="batchGrowthRate"
            :precision="0"
            :controls="false"
            size="small"
            class="growth-input"
          />
        </div>
        <div class="page-actions">
          <el-button
            type="primary"
            :disabled="!selectedIndustry || batchGrowthRate === null || batchGrowthRate === undefined"
            @click="applyIndustryGrowthRate"
          >
            按行业批量设置
          </el-button>
          <el-button :disabled="!selectedIndustry" @click="resetIndustryGrowthRate">
            恢复该行业默认值
          </el-button>
        </div>
      </div>
    </el-card>

    <el-table
      :data="filteredList"
      border
      highlight-current-row
      class="profit-table"
      @row-dblclick="goToDetail"
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

      <el-table-column align="center" label="系统增长率" width="120">
        <template slot-scope="{ row }">
          <span>{{ displayGrowthRate(row.growthRatePrediction) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手动增长率" width="150">
        <template slot-scope="{ row }">
          <el-input-number
            v-model="row.manualGrowthRateDraft"
            :precision="0"
            :controls="false"
            size="small"
            class="growth-input"
            @change="value => changeGrowthRate(row, value)"
          />
        </template>
      </el-table-column>

      <el-table-column align="center" label="采用增长率" width="120">
        <template slot-scope="{ row }">
          <span>{{ adoptedGrowthRate(row) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="利润贴现估值" width="130">
        <template slot-scope="{ row }">
          <span>{{ displayNumber(row.valuation) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="偏离率" width="120" sortable>
        <template slot-scope="{ row }">
          <span :class="deviationClass(row.deviation)">{{ displayDeviation(row.deviation) }}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" align="center" label="操作" width="180">
        <template slot-scope="{ row }">
          <div class="row-actions">
            <el-button size="mini" @click="resetRowGrowthRate(row)">
              恢复默认
            </el-button>
            <el-button size="mini" type="primary" @click="goToDetail(row)">
              查看详情
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  batchUpdateProfitDiscountGrowthRate,
  getProfitDiscountList,
  resetProfitDiscountGrowthRate,
  updateProfitDiscountGrowthRate
} from '@/api/profitDiscount'
import { formatPercent, roundToDecimal } from '@/utils/index'

export default {
  name: 'ProfitDiscountList',
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      selectedIndustry: '',
      batchGrowthRate: null,
      temp: {
        companyId: undefined,
        growthRateAssumption: undefined
      },
      batchTemp: {
        industryName: '',
        growthRateAssumption: undefined
      }
    }
  },
  computed: {
    industries() {
      return Array.from(new Set(this.list.map(item => item.industryName).filter(Boolean)))
    },
    filteredList() {
      if (!this.selectedIndustry) {
        return this.list
      }
      return this.list.filter(item => item.industryName === this.selectedIndustry)
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      try {
        const { data } = await getProfitDiscountList()
        this.list = (data.list || []).map(item => this.normalizeRow(item))
        this.total = data.sum || 0
      } finally {
        this.listLoading = false
      }
    },
    normalizeRow(row) {
      return {
        ...row,
        manualGrowthRateDraft: this.normalizeInteger(row.growthRateAssumption)
      }
    },
    normalizeNumber(value) {
      if (value === null || value === undefined || value === '') {
        return null
      }
      const numberValue = Number(value)
      return Number.isNaN(numberValue) ? null : numberValue
    },
    normalizeInteger(value) {
      const numberValue = this.normalizeNumber(value)
      return numberValue === null ? null : Math.trunc(numberValue)
    },
    displayNumber(value) {
      const numberValue = this.normalizeNumber(value)
      return numberValue === null ? '-' : roundToDecimal(numberValue, 2)
    },
    displayGrowthRate(value) {
      const numberValue = this.normalizeNumber(value)
      return numberValue === null ? '-' : `${roundToDecimal(numberValue, 0)}%`
    },
    adoptedGrowthRate(row) {
      const value = row.manualGrowthRateDraft === null || row.manualGrowthRateDraft === undefined
        ? row.growthRatePrediction
        : row.manualGrowthRateDraft
      return this.displayGrowthRate(value)
    },
    displayDeviation(value) {
      const numberValue = this.normalizeNumber(value)
      return numberValue === null ? '-' : formatPercent(numberValue)
    },
    deviationClass(value) {
      const deviation = this.normalizeNumber(value)
      if (deviation === null) {
        return ''
      }
      if (deviation >= 0.2) {
        return 'is-positive'
      }
      if (deviation < 0) {
        return 'is-negative'
      }
      return 'is-neutral'
    },
    changeGrowthRate(row, value) {
      this.temp.companyId = row.companyId
      this.temp.growthRateAssumption = value
      updateProfitDiscountGrowthRate(this.temp).then(response => {
        this.replaceItem(response.data.item)
        this.$notify({
          title: 'Success',
          message: '更新增长率成功',
          type: 'success',
          duration: 2000
        })
      }).catch(() => {
        row.manualGrowthRateDraft = this.normalizeInteger(row.growthRateAssumption)
      })
    },
    replaceItem(item) {
      const targetIndex = this.list.findIndex(row => row.companyId === item.companyId)
      if (targetIndex !== -1) {
        this.list.splice(targetIndex, 1, this.normalizeRow(item))
      }
    },
    replaceIndustryItems(items) {
      const normalizedItems = (items || []).map(item => this.normalizeRow(item))
      const itemMap = normalizedItems.reduce((result, item) => {
        result[item.companyId] = item
        return result
      }, {})
      this.list = this.list.map(item => itemMap[item.companyId] || item)
    },
    applyIndustryGrowthRate() {
      this.batchTemp.industryName = this.selectedIndustry
      this.batchTemp.growthRateAssumption = this.batchGrowthRate
      batchUpdateProfitDiscountGrowthRate(this.batchTemp).then(response => {
        this.replaceIndustryItems(response.data.list)
        this.$notify({
          title: 'Success',
          message: '批量设置增长率成功',
          type: 'success',
          duration: 2000
        })
      }).catch(() => {
        this.getList()
      })
    },
    resetIndustryGrowthRate() {
      this.batchTemp.industryName = this.selectedIndustry
      resetProfitDiscountGrowthRate(this.batchTemp).then(response => {
        this.replaceIndustryItems(response.data.list)
        this.$notify({
          title: 'Success',
          message: '已恢复该行业默认增长率',
          type: 'success',
          duration: 2000
        })
      }).catch(() => {
        this.getList()
      })
    },
    resetRowGrowthRate(row) {
      row.manualGrowthRateDraft = null
      this.changeGrowthRate(row, null)
    },
    goToDetail(row) {
      this.$router.push(`/valuation/company/${row.companyId}`)
    }
  }
}
</script>

<style scoped>
.profit-discount-page {
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

.filter-card {
  margin-bottom: 20px;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-label {
  color: #606266;
  font-weight: 600;
}

.filter-meta {
  color: #909399;
}

.batch-bar {
  align-items: center;
}

.industry-select {
  width: 260px;
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

.growth-input {
  width: 100px;
}

.is-positive {
  color: #67c23a;
  font-weight: 600;
}

.is-neutral {
  color: #e6a23c;
  font-weight: 600;
}

.is-negative {
  color: #f56c6c;
  font-weight: 600;
}

.row-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

@media (max-width: 768px) {
  .profit-discount-page {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
  }

  .page-actions {
    justify-content: flex-start;
  }

  .filter-bar {
    align-items: flex-start;
  }

  .filter-item {
    width: 100%;
    flex-wrap: wrap;
  }

  .industry-select {
    width: 100%;
  }
}
</style>
