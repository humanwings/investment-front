<template>
  <div v-loading="listLoading" class="dcf-list-page">
    <div class="page-header">
      <div>
        <h2 class="page-title">DCF一览</h2>
        <p class="page-description">DCF 工作台已经进入第 9 步：在同一页面横向比较估值结果，并直接调整增长率、折现率和永续增长率。</p>
      </div>
      <div class="page-actions">
        <el-button icon="el-icon-question" @click="helpDialogVisible = true">
          计算说明
        </el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="getList()">
          刷新数据
        </el-button>
      </div>
    </div>

    <el-card shadow="never" class="summary-card">
      <div class="summary-grid">
        <div class="summary-item">
          <div class="summary-label">当前公司数</div>
          <div class="summary-value">{{ total }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">DCF状态</div>
          <div class="summary-value">简化 DCF 已上线</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">已产出结果</div>
          <div class="summary-value">{{ availableValuationCount }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">高安全边际</div>
          <div class="summary-value">{{ positiveDeviationCount }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">当前阶段</div>
          <div class="summary-value">第 9 步手动调参</div>
        </div>
      </div>
    </el-card>

    <el-dialog title="DCF 计算说明" :visible.sync="helpDialogVisible" width="760px">
      <div class="help-section">
        <div class="help-title">计算逻辑</div>
        <p class="help-copy">当前版本仍是简化 DCF：用每股自由现金流作为现金流起点，先做 3 年高增长期预测，再计算永续期终值，最后折现回今天得到每股估值。</p>
      </div>
      <div class="help-section">
        <div class="help-title">核心公式</div>
        <p class="help-copy formula-line">DCF估值 = 高增长期各年折现现金流之和 + 永续期终值的折现现值</p>
        <p class="help-copy formula-line">终值 = 第3年后的次年现金流 ÷ (折现率 - 永续增长率)</p>
      </div>
      <div class="help-section">
        <div class="help-title">调参规则</div>
        <ul class="help-list">
          <li>手动增长率：有手动值时优先采用；为空时回退到系统增长率。</li>
          <li>手动折现率：有手动值时优先采用；但系统会强制保证“采用折现率 ≥ 永续增长率 + 2%”。</li>
          <li>手动永续增长率：有手动值时优先采用；但系统会强制保证“采用永续增长率 ≤ 采用折现率 - 1%”。</li>
          <li>表格中的“手动值”展示你的输入，“采用值”展示实际进入计算的结果，二者不一致时说明触发了边界约束。</li>
        </ul>
      </div>
      <div class="help-section">
        <div class="help-title">参数来源</div>
        <ul class="help-list">
          <li>现金流起点：优先使用 `每股自由现金流`，没有时回退到 `每股经营现金流 × 0.7`。</li>
          <li>增长率：系统值默认复用利润贴现模型的系统增长率，第 9 步开始支持单家公司手动覆盖。</li>
          <li>折现率：以宏观折现率为基准，再结合市场风险与行业风险做归一化调整。</li>
          <li>永续增长率：系统值默认使用宏观参数中的永续增长率，第 9 步开始支持单家公司手动覆盖。</li>
        </ul>
      </div>
      <div class="help-section">
        <div class="help-title">当前边界</div>
        <ul class="help-list">
          <li>这不是研究级 DCF，还没有税率、CapEx、营运资本、分阶段增长路径和敏感性分析。</li>
          <li>这一版适合做并行参考值，不适合直接替代后续更标准的 DCF。</li>
        </ul>
      </div>
    </el-dialog>

    <div class="panel-grid">
      <el-card shadow="never" class="info-card tone-plan">
        <div slot="header" class="card-header">
          <span>本页定位</span>
          <span class="card-tip">第 9 步开始支持核心参数手动覆盖</span>
        </div>
        <div class="signal-list">
          <div class="signal-item">
            <div class="signal-title">当前先解决什么</div>
            <div class="signal-copy">用每股自由现金流作为现金流起点，结合增长率、折现率、永续增长率，给出可横向研究的 DCF 结果。</div>
          </div>
          <div class="signal-item">
            <div class="signal-title">本页现在能做什么</div>
            <div class="signal-copy">列表已支持直接修改手动增长率、手动折现率、手动永续增长率，并即时刷新采用值、DCF 估值、偏离率和终值占比。</div>
          </div>
          <div class="signal-item">
            <div class="signal-title">下一步再补什么</div>
            <div class="signal-copy">后续第 10 步再补税率、CapEx、营运资本和更标准的分阶段现金流路径。</div>
          </div>
        </div>
      </el-card>

      <el-card shadow="never" class="info-card tone-params">
        <div slot="header" class="card-header">
          <span>当前参数位</span>
          <span class="card-tip">系统值、手动值、采用值已经分开</span>
        </div>
        <div class="tag-list">
          <el-tag size="small">系统增长率</el-tag>
          <el-tag size="small" type="warning">手动增长率</el-tag>
          <el-tag size="small" type="success">采用增长率</el-tag>
          <el-tag size="small" type="warning">手动折现率</el-tag>
          <el-tag size="small" type="warning">采用折现率</el-tag>
          <el-tag size="small" type="info">手动永续增长率</el-tag>
          <el-tag size="small" type="info">采用永续增长率</el-tag>
          <el-tag size="small" type="danger">DCF估值</el-tag>
          <el-tag size="small">终值占比</el-tag>
        </div>
        <p class="boundary-note">
          这一版仍是简化 DCF：用当前快照层现金流做估值，不含税率、资本开支路径、营运资本序列和情景分析。
        </p>
      </el-card>
    </div>

    <el-table
      :data="list"
      border
      highlight-current-row
      class="dcf-table"
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

      <el-table-column align="center" label="利润贴现估值" width="140">
        <template slot-scope="{ row }">
          <span>{{ displayNumber(row.profitDiscountValuation) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="系统增长率" width="110">
        <template slot-scope="{ row }">
          <span>{{ displayPercentPoint(row.systemGrowthRate) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手动增长率" width="130">
        <template slot-scope="{ row }">
          <el-input-number
            v-model="row.manualGrowthRateDraft"
            :precision="0"
            :controls="false"
            size="small"
            class="rate-input"
            @change="saveRowAssumptions(row)"
          />
        </template>
      </el-table-column>

      <el-table-column align="center" label="采用增长率" width="110">
        <template slot-scope="{ row }">
          <span>{{ displayPercentPoint(row.adoptedGrowthRate) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手动折现率" width="130">
        <template slot-scope="{ row }">
          <el-input-number
            v-model="row.manualDiscountRateDraft"
            :precision="4"
            :step="0.005"
            :controls="false"
            size="small"
            class="rate-input"
            @change="saveRowAssumptions(row)"
          />
        </template>
      </el-table-column>

      <el-table-column align="center" label="采用折现率" width="120">
        <template slot-scope="{ row }">
          <span>{{ displayRate(row.adoptedDiscountRate) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手动永续增长率" width="140">
        <template slot-scope="{ row }">
          <el-input-number
            v-model="row.manualTerminalGrowthRateDraft"
            :precision="4"
            :step="0.0025"
            :controls="false"
            size="small"
            class="rate-input"
            @change="saveRowAssumptions(row)"
          />
        </template>
      </el-table-column>

      <el-table-column align="center" label="采用永续增长率" width="140">
        <template slot-scope="{ row }">
          <span>{{ displayRate(row.adoptedTerminalGrowthRate) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="DCF估值" width="120">
        <template slot-scope="{ row }">
          <span>{{ displayNumber(row.valuation) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="偏离率" width="110">
        <template slot-scope="{ row }">
          <span :class="deviationClass(row.deviation)">{{ displayDeviation(row.deviation) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="与利润贴现差异" width="140">
        <template slot-scope="{ row }">
          <span>{{ displayNumber(row.profitDiscountGap) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="终值占比" width="110">
        <template slot-scope="{ row }">
          <span>{{ displayDeviation(row.terminalValueRatio) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="财报期" width="110">
        <template slot-scope="{ row }">
          <span>{{ row.cfDate || '-' }}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" align="center" label="操作" width="180">
        <template slot-scope="{ row }">
          <div class="row-actions">
            <el-button size="mini" @click="resetRowAssumptions(row)">
              恢复默认
            </el-button>
            <el-button size="mini" type="primary" @click="goToDetail(row)">
              查看公司
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getDcfList, updateDcfAssumption } from '@/api/dcf'
import { roundToDecimal } from '@/utils/index'

export default {
  name: 'DcfList',
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      helpDialogVisible: false
    }
  },
  computed: {
    availableValuationCount() {
      return this.list.filter(item => this.normalizeNumber(item.valuation) !== null).length
    },
    positiveDeviationCount() {
      return this.list.filter(item => this.normalizeNumber(item.deviation) >= 0.2).length
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      try {
        const { data } = await getDcfList()
        this.list = (data.list || []).map(item => this.normalizeRow(item))
        this.total = data.sum || 0
      } finally {
        this.listLoading = false
      }
    },
    normalizeRow(row) {
      return {
        ...row,
        manualGrowthRateDraft: this.normalizeInteger(row.manualGrowthRate),
        manualDiscountRateDraft: this.normalizeNumber(row.manualDiscountRate),
        manualTerminalGrowthRateDraft: this.normalizeNumber(row.manualTerminalGrowthRate)
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
    displayPercentPoint(value) {
      const numberValue = this.normalizeNumber(value)
      return numberValue === null ? '-' : `${roundToDecimal(numberValue, 0)}%`
    },
    displayRate(value) {
      const numberValue = this.normalizeNumber(value)
      return numberValue === null ? '-' : `${roundToDecimal(numberValue * 100, 2)}%`
    },
    displayDeviation(value) {
      const numberValue = this.normalizeNumber(value)
      return numberValue === null ? '-' : `${roundToDecimal(numberValue * 100, 2)}%`
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
    async saveRowAssumptions(row) {
      try {
        const { data } = await updateDcfAssumption({
          companyId: row.companyId,
          manualGrowthRate: row.manualGrowthRateDraft,
          manualDiscountRate: row.manualDiscountRateDraft,
          manualTerminalGrowthRate: row.manualTerminalGrowthRateDraft
        })
        this.replaceItem(data.item)
        this.$notify({
          title: 'Success',
          message: 'DCF 参数已更新',
          type: 'success',
          duration: 2000
        })
      } catch (error) {
        this.getList()
      }
    },
    replaceItem(item) {
      const targetIndex = this.list.findIndex(row => row.companyId === item.companyId)
      if (targetIndex !== -1) {
        this.list.splice(targetIndex, 1, this.normalizeRow(item))
      }
    },
    resetRowAssumptions(row) {
      row.manualGrowthRateDraft = null
      row.manualDiscountRateDraft = null
      row.manualTerminalGrowthRateDraft = null
      this.saveRowAssumptions(row)
    },
    goToDetail(row) {
      this.$router.push(`/valuation/company/${row.companyId}`)
    }
  }
}
</script>

<style scoped>
.dcf-list-page {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.page-title {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: #1f2d3d;
}

.page-description {
  margin: 8px 0 0;
  color: #606266;
  line-height: 1.6;
}

.page-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.summary-card,
.info-card {
  margin-bottom: 16px;
  border-radius: 16px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.summary-item {
  padding: 16px;
  border-radius: 14px;
  background: linear-gradient(135deg, #f5f7fa, #eef3f8);
}

.summary-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 8px;
}

.summary-value {
  font-size: 22px;
  font-weight: 600;
  color: #1f2d3d;
}

.panel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  font-weight: 600;
}

.card-tip {
  font-size: 12px;
  color: #909399;
}

.tone-plan {
  background: linear-gradient(180deg, #fffdf8 0%, #fff7e8 100%);
}

.tone-params {
  background: linear-gradient(180deg, #f7fbff 0%, #edf5ff 100%);
}

.signal-list {
  display: grid;
  gap: 14px;
}

.signal-item {
  padding: 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.75);
}

.signal-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2d3d;
  margin-bottom: 6px;
}

.signal-copy {
  color: #606266;
  line-height: 1.7;
}

.help-section + .help-section {
  margin-top: 16px;
}

.help-title {
  font-size: 14px;
  font-weight: 700;
  color: #1f2d3d;
  margin-bottom: 8px;
}

.help-copy {
  margin: 0;
  color: #606266;
  line-height: 1.8;
}

.help-list {
  margin: 0;
  padding-left: 18px;
  color: #606266;
  line-height: 1.8;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.boundary-note {
  margin: 16px 0 0;
  color: #606266;
  line-height: 1.7;
}

.dcf-table {
  border-radius: 16px;
  overflow: hidden;
}

.rate-input {
  width: 104px;
}

.is-positive {
  color: #1f9d55;
  font-weight: 600;
}

.is-negative {
  color: #d64545;
  font-weight: 600;
}

.is-neutral {
  color: #c08a00;
}

.company-name {
  font-weight: 600;
  color: #1f2d3d;
}

.company-subline {
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
}

.row-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

@media (max-width: 768px) {
  .dcf-list-page {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
  }
}
</style>
