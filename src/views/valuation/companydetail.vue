<template>
  <div v-loading="listLoading" class="company-overview-page">
    <div v-if="pageReady">
      <div class="page-header">
        <div>
          <h2 class="page-title">{{ company.name }}</h2>
          <div class="page-meta">
            <span class="meta-chip">{{ displayValue(company.stockCode) }}</span>
            <span class="meta-chip">{{ displayValue(company.exchange) }}</span>
            <span class="meta-chip">{{ displayValue(company.firstIndustry) }}</span>
            <span class="meta-chip">{{ displayValue(financialReport.date) }}</span>
          </div>
          <p class="page-description">{{ displayValue(company.mainBusiness) }}</p>
        </div>
        <el-button icon="el-icon-back" @click="$router.back()">
          返回列表
        </el-button>
      </div>

      <el-card shadow="never" class="summary-card tone-summary">
        <div class="summary-grid">
          <div
            v-for="item in summaryItems"
            :key="item.label"
            class="summary-item"
          >
            <div class="summary-label">{{ item.label }}</div>
            <div class="summary-value">{{ item.value }}</div>
          </div>
        </div>
      </el-card>

      <el-tabs v-model="activeTab" class="overview-tabs">
        <el-tab-pane label="总览" name="overview">
          <div class="section-grid">
            <el-card shadow="never" class="section-card tone-company">
              <div slot="header" class="card-header">
                <span>基本信息</span>
                <span class="card-tip">先看公司画像</span>
              </div>
              <el-descriptions :column="2" border>
                <el-descriptions-item label="证券代码">{{ displayValue(company.stockCode) }}</el-descriptions-item>
                <el-descriptions-item label="交易所">{{ displayValue(company.exchange) }}</el-descriptions-item>
                <el-descriptions-item label="类型">{{ displayValue(company.fsTableType) }}</el-descriptions-item>
                <el-descriptions-item label="IPO时间">{{ displayValue(company.ipoDate) }}</el-descriptions-item>
                <el-descriptions-item label="省份">{{ displayValue(company.province) }}</el-descriptions-item>
                <el-descriptions-item label="实控人">{{ displayValue(company.actualControllerTypes) }}</el-descriptions-item>
                <el-descriptions-item label="一级行业">{{ displayValue(company.firstIndustry) }}</el-descriptions-item>
                <el-descriptions-item label="二级行业">{{ displayValue(company.secondIndustry) }}</el-descriptions-item>
                <el-descriptions-item label="三级行业">{{ displayValue(company.thirdIndustry) }}</el-descriptions-item>
                <el-descriptions-item label="主营业务" :span="2">{{ displayValue(company.mainBusiness) }}</el-descriptions-item>
              </el-descriptions>
            </el-card>

            <el-card shadow="never" class="section-card tone-guide">
              <div slot="header" class="card-header">
                <span>研究提示</span>
                <span class="card-tip">详情内容已开始按主题分层</span>
              </div>
              <div class="insight-list">
                <div class="insight-item">
                  <div class="insight-label">利润贴现</div>
                  <div class="insight-value">看估值、偏差、增长率与拆解明细</div>
                </div>
                <div class="insight-item">
                  <div class="insight-label">财务评价</div>
                  <div class="insight-value">看 ROE、现金流、利润与负债结构</div>
                </div>
                <div class="insight-item">
                  <div class="insight-label">大V推荐</div>
                  <div class="insight-value">看推荐得分与跳转到推荐详情入口</div>
                </div>
              </div>
            </el-card>

            <el-card shadow="never" class="section-card tone-financial">
              <div slot="header" class="card-header">
                <span>财务快照</span>
                <span class="card-tip">保留高频财务判断字段</span>
              </div>
              <el-descriptions :column="2" border>
                <el-descriptions-item label="报告日期">{{ displayValue(financialReport.date) }}</el-descriptions-item>
                <el-descriptions-item label="加权ROE">{{ formatPercentValue(financialReport.wroe) }}</el-descriptions-item>
                <el-descriptions-item label="加权扣非ROE">{{ formatPercentValue(financialReport.wdroe) }}</el-descriptions-item>
                <el-descriptions-item label="每股净资产">{{ numberValue(financialReport.netAssetValuePer) }}</el-descriptions-item>
                <el-descriptions-item label="每股自由现金流">{{ numberValue(financialReport.freeCashFlowPer) }}</el-descriptions-item>
                <el-descriptions-item label="资产负债率">{{ formatPercentValue(financialReport.assetLiabilityRatio) }}</el-descriptions-item>
              </el-descriptions>
            </el-card>

            <el-card shadow="never" class="section-card tone-dividend">
              <div slot="header" class="card-header">
                <span>分红快照</span>
                <span class="card-tip">先看稳定性，再看明细</span>
              </div>
              <el-descriptions :column="2" border class="dividend-summary">
                <el-descriptions-item label="分红率">{{ formatPercentValue(valuation.dividendRate) }}</el-descriptions-item>
                <el-descriptions-item label="连续分红年数">{{ displayValue(valuation.dividendYears) }}</el-descriptions-item>
                <el-descriptions-item label="当前股息率">{{ formatPercentValue(valuation.yield) }}</el-descriptions-item>
                <el-descriptions-item label="五年平均股息率">{{ formatPercentValue(valuation.yieldAverage) }}</el-descriptions-item>
              </el-descriptions>

              <el-table
                :data="dividendList"
                size="mini"
                border
                class="dividend-table"
              >
                <el-table-column align="center" label="年份" width="90" prop="dividendYear" />
                <el-table-column align="center" label="分红金额">
                  <template slot-scope="{ row }">
                    <span>{{ yiValue(row.dividendAmount) }}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="自由现金流">
                  <template slot-scope="{ row }">
                    <span>{{ yiValue(row.freeCashFlow) }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>
        </el-tab-pane>

        <el-tab-pane label="利润贴现" name="profit-discount">
          <div class="section-grid profit-grid">
            <el-card shadow="never" class="section-card tone-profit">
              <div slot="header" class="card-header">
                <span>利润贴现总览</span>
                <span class="card-tip">先看摘要，再决定是否深挖拆解</span>
              </div>
              <div class="valuation-hero">
                <div class="valuation-primary">
                  <div class="valuation-primary-label">利润贴现估值</div>
                  <div class="valuation-primary-value">{{ profitDiscountValuationValue }}</div>
                </div>
                <div class="formula-panel">
                  <div class="formula-title">理论公式</div>
                  <div class="formula-line">{{ profitDiscountTheoryFormula }}</div>
                  <div class="formula-title">带入数字</div>
                  <div class="formula-line">{{ profitDiscountFormulaWithNumbers }}</div>
                  <div class="formula-line">{{ profitDiscountFormulaResultLine }}</div>
                </div>
              </div>
              <el-descriptions :column="2" border>
                <el-descriptions-item label="系统预测增长率">{{ formatPercentValue(valuation.growthRatePrediction) }}</el-descriptions-item>
                <el-descriptions-item label="手动假设增长率">{{ formatPercentValue(valuation.growthRateAssumption) }}</el-descriptions-item>
                <el-descriptions-item label="采用增长率">{{ adoptedGrowthRateDisplay }}</el-descriptions-item>
                <el-descriptions-item label="利润贴现估值">{{ profitDiscountValuationValue }}</el-descriptions-item>
                <el-descriptions-item label="当前股价">{{ displayValue(valuation.price) }}</el-descriptions-item>
                <el-descriptions-item label="利润贴现偏差">{{ profitDiscountDeviationDisplay }}</el-descriptions-item>
                <el-descriptions-item label="FCF静态参考值">{{ fcfReferenceValue }}</el-descriptions-item>
                <el-descriptions-item label="FCF参考偏差">{{ fcfReferenceDeviationDisplay }}</el-descriptions-item>
                <el-descriptions-item label="PE-TTM">{{ numberValue(valuation.pe) }}</el-descriptions-item>
                <el-descriptions-item label="PB(不含商誉)">{{ numberValue(valuation.pb) }}</el-descriptions-item>
                <el-descriptions-item label="市值">{{ yiValue(valuation.marketValue) }}</el-descriptions-item>
                <el-descriptions-item label="股本">{{ yiValue(valuation.capitalization) }}</el-descriptions-item>
              </el-descriptions>
            </el-card>
          </div>

          <el-card shadow="never" class="section-card breakdown-card tone-breakdown">
            <div slot="header" class="card-header">
              <span>利润贴现拆解</span>
              <span class="card-tip">当前先保留拆解结果，后续再拆成独立内容区域</span>
            </div>

            <div class="breakdown-grid">
              <el-descriptions :column="1" border class="breakdown-block">
                <el-descriptions-item label="净资产估值">{{ numberValue(valuationData.netAssetValuation) }}</el-descriptions-item>
                <el-descriptions-item label="净资产折价率">{{ displayValue(valuationData.netAssetDiscount) }}</el-descriptions-item>
                <el-descriptions-item label="每股净资产">{{ numberValue(financialReport.netAssetValuePer) }}</el-descriptions-item>
              </el-descriptions>

              <el-descriptions :column="1" border class="breakdown-block">
                <el-descriptions-item label="分红稳定性">{{ formatPercentValue(valuationData.dividendStability) }}</el-descriptions-item>
                <el-descriptions-item label="预期分红率">{{ formatPercentValue(valuationData.dividendRatePrediction) }}</el-descriptions-item>
                <el-descriptions-item label="次期增速推算">{{ formatPercentValue(valuationData.growthRatePrediction) }}</el-descriptions-item>
              </el-descriptions>

              <el-descriptions :column="1" border class="breakdown-block">
                <el-descriptions-item label="高增长期利润贴现">{{ numberValue(valuationData.highGrowthValuation) }}</el-descriptions-item>
                <el-descriptions-item label="高增长期年数">{{ displayValue(valuationData.growthYears) }}</el-descriptions-item>
                <el-descriptions-item label="折现率">{{ displayValue(valuationData.discountRate) }}</el-descriptions-item>
                <el-descriptions-item label="折现系数累积">{{ displayValue(valuationData.highGrowthDiscountCoefficientSum) }}</el-descriptions-item>
              </el-descriptions>

              <el-descriptions :column="1" border class="breakdown-block">
                <el-descriptions-item label="永续期利润贴现">{{ numberValue(valuationData.perpetualValuation) }}</el-descriptions-item>
                <el-descriptions-item label="永续期增速">{{ formatPercentValue(valuationData.perpetualGrowthRate) }}</el-descriptions-item>
                <el-descriptions-item label="折现系数累积">{{ displayValue(valuationData.perpetualDiscountCoefficientSum) }}</el-descriptions-item>
                <el-descriptions-item label="风险系数">{{ riskSummary }}</el-descriptions-item>
              </el-descriptions>
            </div>

            <div class="breakdown-total">
              <span class="breakdown-total-label">利润贴现估值结果</span>
              <span class="breakdown-total-value">{{ profitDiscountValuationValue }}</span>
            </div>
          </el-card>
        </el-tab-pane>

        <el-tab-pane label="财务评价" name="financial">
          <div class="section-grid">
            <el-card shadow="never" class="section-card tone-financial">
              <div slot="header" class="card-header">
                <span>财务评价摘要</span>
                <span class="card-tip">先看质量，再看结构</span>
              </div>
              <div class="summary-grid compact-summary-grid">
                <div
                  v-for="item in financialSummaryItems"
                  :key="item.label"
                  class="summary-item"
                >
                  <div class="summary-label">{{ item.label }}</div>
                  <div class="summary-value">{{ item.value }}</div>
                </div>
              </div>
            </el-card>

            <el-card shadow="never" class="section-card tone-cashflow">
              <div slot="header" class="card-header">
                <span>盈利与现金流</span>
                <span class="card-tip">看利润质量和现金转化</span>
              </div>
              <el-descriptions :column="2" border>
                <el-descriptions-item label="加权ROE">{{ formatPercentValue(financialReport.wroe) }}</el-descriptions-item>
                <el-descriptions-item label="加权扣非ROE">{{ formatPercentValue(financialReport.wdroe) }}</el-descriptions-item>
                <el-descriptions-item label="每股扣非净利润">{{ numberValue(financialReport.npadnrpatoshaopcPer) }}</el-descriptions-item>
                <el-descriptions-item label="每股经营现金流">{{ numberValue(financialReport.operatingCashFlowPer) }}</el-descriptions-item>
                <el-descriptions-item label="每股自由现金流">{{ numberValue(financialReport.freeCashFlowPer) }}</el-descriptions-item>
                <el-descriptions-item label="毛利率">{{ formatPercentValue(financialReport.grossMargin) }}</el-descriptions-item>
              </el-descriptions>
            </el-card>

            <el-card shadow="never" class="section-card tone-balance">
              <div slot="header" class="card-header">
                <span>增长与负债</span>
                <span class="card-tip">看增长持续性和财务压力</span>
              </div>
              <el-descriptions :column="2" border>
                <el-descriptions-item label="营收本季增长">{{ formatPercentValue(financialReport.incomeGrowthRateCurrent) }}</el-descriptions-item>
                <el-descriptions-item label="扣非利润本季增长">{{ formatPercentValue(financialReport.profitGrowthRateCurrent) }}</el-descriptions-item>
                <el-descriptions-item label="营收累计增长">{{ formatPercentValue(financialReport.incomeGrowthRateTotal) }}</el-descriptions-item>
                <el-descriptions-item label="扣非利润累计增长">{{ formatPercentValue(financialReport.profitGrowthRateTotal) }}</el-descriptions-item>
                <el-descriptions-item label="资产负债率">{{ formatPercentValue(financialReport.assetLiabilityRatio) }}</el-descriptions-item>
                <el-descriptions-item label="有息负债率">{{ formatPercentValue(financialReport.interestLiabilityRatio) }}</el-descriptions-item>
              </el-descriptions>
            </el-card>
          </div>
        </el-tab-pane>

        <el-tab-pane label="大V推荐" name="recommend">
          <div class="section-grid">
            <el-card shadow="never" class="section-card tone-recommend">
              <div slot="header" class="card-header">
                <span>推荐摘要</span>
                <span class="card-tip">当前详情接口先提供推荐分摘要</span>
              </div>
              <div class="summary-grid compact-summary-grid">
                <div
                  v-for="item in recommendSummaryItems"
                  :key="item.label"
                  class="summary-item"
                >
                  <div class="summary-label">{{ item.label }}</div>
                  <div class="summary-value">{{ item.value }}</div>
                </div>
              </div>
            </el-card>

            <el-card shadow="never" class="section-card tone-action">
              <div slot="header" class="card-header">
                <span>推荐入口</span>
                <span class="card-tip">后续可在这里承接更完整的大V明细</span>
              </div>
              <div class="action-panel">
                <p class="action-copy">
                  当前公司详情页已经预留大V推荐区域。现阶段可以先查看推荐得分摘要，或跳转到推荐明细页继续研究。
                </p>
                <div class="action-row">
                  <el-button
                    type="primary"
                    :disabled="!company.stockCode"
                    @click="goRecommendDetail"
                  >
                    查看推荐详情
                  </el-button>
                  <el-button @click="goRecommendRank">
                    查看推荐排行
                  </el-button>
                </div>
              </div>
            </el-card>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-empty v-else description="暂无公司总览数据" />
  </div>
</template>

<script>
import { getCompany } from '@/api/company'
import { formatPercent, formatYi, roundToDecimal } from '@/utils/index'

export default {
  name: 'CompanyDetail',
  data() {
    return {
      activeTab: 'overview',
      listLoading: false,
      companyId: this.$route.params.id,
      company: null,
      valuation: null,
      financialReport: null,
      dividendList: [],
      valuationData: null
    }
  },
  computed: {
    pageReady() {
      return Boolean(this.company && this.valuation && this.financialReport && this.valuationData)
    },
    adoptedGrowthRate() {
      if (!this.valuation) {
        return null
      }
      const assumption = this.valuation.growthRateAssumption
      if (assumption !== null && assumption !== undefined && assumption !== '') {
        return assumption
      }
      return this.valuation.growthRatePrediction
    },
    adoptedGrowthRateDisplay() {
      return this.formatPercentValue(this.adoptedGrowthRate)
    },
    fcfReferenceNumber() {
      if (!this.financialReport || this.financialReport.freeCashFlowPer === null || this.financialReport.freeCashFlowPer === undefined) {
        return null
      }
      return roundToDecimal(this.financialReport.freeCashFlowPer * 10, 2)
    },
    fcfReferenceValue() {
      return this.fcfReferenceNumber === null ? '-' : this.fcfReferenceNumber
    },
    fcfReferenceDeviation() {
      if (this.fcfReferenceNumber === null || !this.valuation || !this.valuation.price) {
        return null
      }
      return this.fcfReferenceNumber / this.valuation.price - 1
    },
    fcfReferenceDeviationDisplay() {
      return this.formatPercentValue(this.fcfReferenceDeviation)
    },
    profitDiscountValuationNumber() {
      if (!this.valuationData || this.valuationData.total === null || this.valuationData.total === undefined) {
        return this.valuation && this.valuation.valuation !== null && this.valuation.valuation !== undefined
          ? roundToDecimal(this.valuation.valuation, 2)
          : null
      }
      return roundToDecimal(this.valuationData.total, 2)
    },
    profitDiscountValuationValue() {
      return this.profitDiscountValuationNumber === null ? '-' : this.profitDiscountValuationNumber
    },
    profitDiscountDeviation() {
      if (this.profitDiscountValuationNumber === null || !this.valuation || !this.valuation.price) {
        return null
      }
      return this.profitDiscountValuationNumber / this.valuation.price - 1
    },
    profitDiscountDeviationDisplay() {
      return this.formatPercentValue(this.profitDiscountDeviation)
    },
    profitDiscountTheoryFormula() {
      return '利润贴现估值 = (净资产估值 + 高增长期利润贴现 + 永续期利润贴现) × 市场风险 × 行业风险'
    },
    profitDiscountFormulaWithNumbers() {
      if (!this.pageReady) {
        return '-'
      }
      return '= (' +
        this.numberValue(this.valuationData.netAssetValuation) + ' + ' +
        this.numberValue(this.valuationData.highGrowthValuation) + ' + ' +
        this.numberValue(this.valuationData.perpetualValuation) + ') × ' +
        this.numberValue(this.valuationData.marketRisk) + ' × ' +
        this.numberValue(this.valuationData.industryRisk)
    },
    profitDiscountFormulaResultLine() {
      return '= ' + this.profitDiscountValuationValue
    },
    riskSummary() {
      if (!this.valuationData) {
        return '-'
      }
      return '市场 ' + this.displayValue(this.valuationData.marketRisk) + ' / 行业 ' + this.displayValue(this.valuationData.industryRisk)
    },
    summaryItems() {
      if (!this.pageReady) {
        return []
      }
      return [
        { label: '当前股价', value: this.displayValue(this.valuation.price) },
        { label: '利润贴现估值', value: this.profitDiscountValuationValue },
        { label: '利润贴现偏差', value: this.profitDiscountDeviationDisplay },
        { label: '综合评分', value: this.displayValue(this.valuation.score) },
        { label: '财务评分', value: this.displayValue(this.valuation.financialScore) },
        { label: '大V评分', value: this.displayValue(this.valuation.recommendationScore) },
        { label: '采用增长率', value: this.adoptedGrowthRateDisplay },
        { label: 'FCF静态参考值', value: this.fcfReferenceValue }
      ]
    },
    financialSummaryItems() {
      if (!this.pageReady) {
        return []
      }
      return [
        { label: '财务评分', value: this.displayValue(this.valuation.financialScore) },
        { label: '加权ROE', value: this.formatPercentValue(this.financialReport.wroe) },
        { label: '每股自由现金流', value: this.numberValue(this.financialReport.freeCashFlowPer) },
        { label: '毛利率', value: this.formatPercentValue(this.financialReport.grossMargin) },
        { label: '资产负债率', value: this.formatPercentValue(this.financialReport.assetLiabilityRatio) },
        { label: '有息负债率', value: this.formatPercentValue(this.financialReport.interestLiabilityRatio) }
      ]
    },
    recommendSummaryItems() {
      if (!this.pageReady) {
        return []
      }
      return [
        { label: '大V评分', value: this.displayValue(this.valuation.recommendationScore) },
        { label: '综合评分', value: this.displayValue(this.valuation.score) },
        { label: '利润贴现偏差', value: this.profitDiscountDeviationDisplay },
        { label: '当前股价', value: this.displayValue(this.valuation.price) },
        { label: '所属行业', value: this.displayValue(this.company.firstIndustry) },
        { label: '证券代码', value: this.displayValue(this.company.stockCode) }
      ]
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    async getDetail() {
      this.listLoading = true
      try {
        const { data } = await getCompany(this.companyId)
        this.company = data.company || null
        this.valuation = data.valuation || null
        this.financialReport = data.financialReport || null
        this.dividendList = data.dividendList || []
        this.valuationData = data.valuationData || null
        if (this.valuationData) {
          this.valuationData.total = (
            this.valuationData.netAssetValuation +
            this.valuationData.highGrowthValuation +
            this.valuationData.perpetualValuation
          ) * this.valuationData.marketRisk * this.valuationData.industryRisk
          this.valuationData.total = roundToDecimal(this.valuationData.total, 2)
        }
      } finally {
        this.listLoading = false
      }
    },
    displayValue(value) {
      return value === null || value === undefined || value === '' ? '-' : value
    },
    formatPercentValue(value) {
      if (value === null || value === undefined || value === '') {
        return '-'
      }
      return formatPercent(value)
    },
    numberValue(value) {
      if (value === null || value === undefined || value === '') {
        return '-'
      }
      return roundToDecimal(value, 2)
    },
    yiValue(value) {
      if (value === null || value === undefined || value === '') {
        return '-'
      }
      return formatYi(value)
    },
    goRecommendDetail() {
      if (!this.company || !this.company.stockCode) {
        return
      }
      this.$router.push('/valuation/recommend/' + this.company.stockCode)
    },
    goRecommendRank() {
      this.$router.push('/valuation/recommend')
    }
  }
}
</script>

<style scoped>
.company-overview-page {
  --page-bg-top: #fffaf1;
  --page-bg-bottom: #f3f8ff;
  --text-main: #2f3441;
  --text-subtle: #6b7280;
  --line-soft: rgba(122, 139, 173, 0.18);
  padding: 18px 18px 32px;
  border-radius: 20px;
  background:
    radial-gradient(circle at top left, rgba(251, 191, 36, 0.16), transparent 28%),
    radial-gradient(circle at top right, rgba(45, 212, 191, 0.18), transparent 30%),
    linear-gradient(180deg, var(--page-bg-top), var(--page-bg-bottom));
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.page-title {
  margin: 0 0 12px;
  color: var(--text-main);
  font-size: 32px;
  letter-spacing: 0.02em;
}

.page-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.meta-chip {
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  color: #31558b;
  font-size: 12px;
  border: 1px solid rgba(49, 85, 139, 0.12);
  backdrop-filter: blur(6px);
}

.page-description {
  margin: 0;
  max-width: 960px;
  color: var(--text-subtle);
  line-height: 1.7;
}

.summary-card,
.section-card {
  margin-bottom: 16px;
  border: 1px solid var(--line-soft);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(71, 85, 105, 0.08);
}

.overview-tabs {
  margin-top: 8px;
}

.overview-tabs ::v-deep .el-tabs__nav-wrap::after {
  background-color: rgba(122, 139, 173, 0.18);
}

.overview-tabs ::v-deep .el-tabs__active-bar {
  height: 4px;
  border-radius: 999px;
  background: linear-gradient(90deg, #f59e0b, #2563eb);
}

.overview-tabs ::v-deep .el-tabs__item {
  height: 42px;
  color: #5f6b7a;
  font-weight: 600;
}

.overview-tabs ::v-deep .el-tabs__item.is-active {
  color: #1f3a63;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.compact-summary-grid {
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}

.summary-item {
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.62);
}

.summary-label,
.card-tip {
  color: #738092;
  font-size: 12px;
}

.summary-value {
  margin-top: 8px;
  color: var(--text-main);
  font-size: 18px;
  font-weight: 600;
}

.section-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  color: var(--text-main);
  font-weight: 700;
}

.dividend-summary {
  margin-bottom: 16px;
}

.dividend-table {
  width: 100%;
}

.profit-grid {
  margin-bottom: 16px;
}

.breakdown-card {
  margin-bottom: 0;
}

.breakdown-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.breakdown-block {
  width: 100%;
}

.breakdown-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 16px;
  border-radius: 14px;
  background: linear-gradient(135deg, #effcf6, #f4fff8);
  border: 1px solid rgba(47, 133, 90, 0.14);
}

.breakdown-total-label {
  color: #446455;
}

.breakdown-total-value {
  color: #2f855a;
  font-size: 24px;
  font-weight: 700;
}

.insight-list {
  display: grid;
  gap: 12px;
}

.insight-item,
.action-panel {
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.55);
}

.insight-label {
  margin-bottom: 6px;
  color: var(--text-main);
  font-weight: 600;
}

.insight-value,
.action-copy {
  margin: 0;
  color: var(--text-subtle);
  line-height: 1.7;
}

.action-row {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.valuation-hero {
  display: grid;
  grid-template-columns: minmax(220px, 280px) 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.valuation-primary {
  padding: 18px;
  border-radius: 16px;
  background: linear-gradient(145deg, #fff6d8, #ffe9b4);
  border: 1px solid rgba(217, 119, 6, 0.16);
}

.valuation-primary-label,
.formula-title {
  color: #8a5a00;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.valuation-primary-value {
  margin-top: 10px;
  color: #7c3f00;
  font-size: 30px;
  font-weight: 800;
}

.formula-panel {
  padding: 18px;
  border-radius: 16px;
  background: linear-gradient(145deg, #f7fbff, #edf4ff);
  border: 1px solid rgba(37, 99, 235, 0.12);
}

.formula-line {
  margin-top: 8px;
  color: #274060;
  line-height: 1.7;
  font-family: 'Courier New', monospace;
  word-break: break-word;
}

.formula-title + .formula-line {
  margin-top: 10px;
}

.tone-summary {
  background: linear-gradient(135deg, rgba(255, 245, 214, 0.96), rgba(229, 241, 255, 0.96));
}

.tone-company {
  background: linear-gradient(180deg, #ffffff, #f7fbff);
}

.tone-guide {
  background: linear-gradient(180deg, #fff9ef, #fff3db);
}

.tone-financial {
  background: linear-gradient(180deg, #f2fbf8, #e9f8f2);
}

.tone-dividend {
  background: linear-gradient(180deg, #fff4f6, #ffeef2);
}

.tone-profit {
  background: linear-gradient(180deg, #fff9ec, #fff3d7);
}

.tone-breakdown {
  background: linear-gradient(180deg, #f7fbff, #eef5ff);
}

.tone-cashflow {
  background: linear-gradient(180deg, #eef8ff, #e5f2ff);
}

.tone-balance {
  background: linear-gradient(180deg, #f8f6ff, #f1ecff);
}

.tone-recommend {
  background: linear-gradient(180deg, #fff8ef, #ffefd9);
}

.tone-action {
  background: linear-gradient(180deg, #fffdf6, #fff8e8);
}

@media (max-width: 768px) {
  .section-grid {
    grid-template-columns: 1fr;
  }

  .valuation-hero {
    grid-template-columns: 1fr;
  }

  .breakdown-total {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
