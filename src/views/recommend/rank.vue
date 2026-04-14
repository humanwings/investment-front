<template>
  <div>
    <h3>大V推荐榜</h3>

    <div class="toolbar">
      <el-date-picker
        v-model="query.snapshotDate"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="榜单日期"
      />
      <el-button type="primary" icon="el-icon-search" @click="getList">
        查询
      </el-button>
      <el-button type="success" icon="el-icon-refresh" @click="refreshRanking">
        刷新榜单
      </el-button>
      <span class="summary">榜单日期：{{ displaySnapshotDate }}</span>
      <span class="summary">股票数：{{ total }}</span>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      highlight-current-row
      :default-sort="{ prop: 'rankNo', order: 'ascending' }"
      @row-dblclick="goDetail"
    >
      <el-table-column align="center" label="排名" width="70" prop="rankNo" />
      <el-table-column align="center" label="代码" width="100" prop="stockCode" />
      <el-table-column align="center" label="名称" min-width="140" prop="stockName" />
      <el-table-column align="center" label="综合推荐分" width="120" prop="recommendScore" sortable />
      <el-table-column align="center" label="推荐人数" width="100" prop="authorCount" sortable />
      <el-table-column align="center" label="加权人数" width="110" prop="weightedAuthorCount" sortable />
      <el-table-column align="center" label="平均仓位" width="100">
        <template slot-scope="{ row }">
          <span>{{ formatPercent(row.avgPositionRatio) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="核心大V" width="130" prop="topAuthorName" />
      <el-table-column align="center" label="最近推荐日" width="120" prop="lastRecommendDate" />
      <el-table-column align="center" label="估值偏差" width="110">
        <template slot-scope="{ row }">
          <span>{{ formatPercent(row.deviation) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="财务评分" width="100" prop="financialScore" sortable />
      <el-table-column align="center" label="综合评分" width="100" prop="valuationScore" sortable />
      <el-table-column align="center" label="行业" min-width="140" prop="industryName" />
      <el-table-column fixed="right" align="center" label="处理" width="100">
        <template slot-scope="{ row }">
          <el-button type="text" @click="goDetail(row)">
            查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { formatPercent } from '@/utils/index'
import { getRecommendRank, refreshRecommendRank } from '@/api/recommend'

export default {
  name: 'RecommendRank',
  data() {
    return {
      listLoading: false,
      list: [],
      total: 0,
      snapshotDate: '',
      query: {
        snapshotDate: ''
      }
    }
  },
  computed: {
    displaySnapshotDate() {
      return this.query.snapshotDate || this.snapshotDate || '-'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    formatPercent,
    async getList() {
      this.listLoading = true
      try {
        const { data } = await getRecommendRank(this.query)
        this.list = data.list || []
        this.total = data.sum || 0
        this.snapshotDate = data.snapshotDate
        if (!this.query.snapshotDate) {
          this.query.snapshotDate = data.snapshotDate
        }
      } finally {
        this.listLoading = false
      }
    },
    async refreshRanking() {
      this.listLoading = true
      try {
        const { data } = await refreshRecommendRank({
          snapshotDate: this.query.snapshotDate
        })
        this.snapshotDate = data.refresh.snapshotDate
        this.query.snapshotDate = data.refresh.snapshotDate
      } finally {
        this.listLoading = false
      }
      await this.getList()
      this.$message.success('榜单已刷新')
    },
    goDetail(row) {
      this.$router.push({
        name: 'recommenddetail',
        params: { stockCode: row.stockCode },
        query: { snapshotDate: this.query.snapshotDate }
      })
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
</style>
