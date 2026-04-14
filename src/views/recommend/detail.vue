<template>
  <div>
    <h3>推荐详情</h3>

    <div class="toolbar">
      <el-button icon="el-icon-back" @click="$router.back()">
        返回
      </el-button>
      <span class="summary">股票：{{ summary.stockName || '-' }} ({{ summary.stockCode || '-' }})</span>
      <span class="summary">榜单日期：{{ snapshotDate }}</span>
    </div>

    <el-card shadow="never" class="summary-card">
      <div class="summary-grid">
        <div class="summary-item">
          <div class="summary-label">榜单排名</div>
          <div class="summary-value">{{ summary.rankNo || '-' }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">综合推荐分</div>
          <div class="summary-value">{{ summary.recommendScore || '-' }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">推荐人数</div>
          <div class="summary-value">{{ summary.authorCount || '-' }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">估值偏差</div>
          <div class="summary-value">{{ formatPercent(summary.deviation) }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">财务评分</div>
          <div class="summary-value">{{ summary.financialScore || '-' }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">行业</div>
          <div class="summary-value">{{ summary.industryName || '-' }}</div>
        </div>
      </div>
    </el-card>

    <el-table v-loading="listLoading" :data="list" highlight-current-row>
      <el-table-column align="center" label="大V" width="140" prop="authorName" />
      <el-table-column align="center" label="来源" width="120" prop="sourceSite" />
      <el-table-column align="center" label="推荐日" width="120" prop="tradeDate" />
      <el-table-column align="center" label="动作" width="90" prop="actionType" />
      <el-table-column align="center" label="仓位" width="90">
        <template slot-scope="{ row }">
          <span>{{ formatPercent(row.positionRatio) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="大V权重" width="100" prop="authorWeight" />
      <el-table-column align="center" label="仓位权重" width="100" prop="positionWeight" />
      <el-table-column align="center" label="时效权重" width="100" prop="decayWeight" />
      <el-table-column align="center" label="贡献分" width="100" prop="contributionScore" sortable />
      <el-table-column align="center" label="链接" min-width="180">
        <template slot-scope="{ row }">
          <el-link v-if="row.sourceUrl" :href="row.sourceUrl" target="_blank" type="primary">
            源地址
          </el-link>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { formatPercent } from '@/utils/index'
import { getRecommendDetail } from '@/api/recommend'

export default {
  name: 'RecommendDetail',
  data() {
    return {
      listLoading: false,
      summary: {},
      list: []
    }
  },
  computed: {
    stockCode() {
      return this.$route.params.stockCode
    },
    snapshotDate() {
      return this.$route.query.snapshotDate || ''
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    formatPercent,
    async getDetail() {
      this.listLoading = true
      try {
        const { data } = await getRecommendDetail(this.stockCode, { snapshotDate: this.snapshotDate })
        this.summary = data.summary || {}
        this.list = data.list || []
      } finally {
        this.listLoading = false
      }
    }
  }
}
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.summary {
  color: #606266;
}

.summary-card {
  margin-bottom: 16px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.summary-item {
  padding: 12px;
  border-radius: 6px;
  background: #f5f7fa;
}

.summary-label {
  color: #909399;
  font-size: 12px;
}

.summary-value {
  margin-top: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}
</style>
