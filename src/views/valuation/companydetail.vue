<template>
  <div v-loading="listLoading">
    <h2>{{ company.name }}</h2>
    <el-row  class="el-row-title">
      <el-col :span="24"><div class="grid-content bg-title"> <span class="inline-title">基本信息</span> </div></el-col>
    </el-row>
    <el-row  class="el-row-content">
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">证券代码</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ company.stockCode }}</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">交易所</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ company.exchange }}</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">类型</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ company.fsTableType }}</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">IPO时间</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ company.ipoDate }}</span></div></el-col>
    </el-row>
    <el-row  class="el-row-content">
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">省份</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ company.province }}</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">实控人</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ company.actualControllerTypes }}</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">主营业务</span></div></el-col>
      <el-col :span="9"><div class="grid-content bg-value"><span class="inline-content">{{ company.mainBusiness }}</span></div></el-col>
    </el-row>
    <el-row  class="el-row-content">
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">一级行业</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ company.firstIndustry }}</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">二级行业</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ company.secondIndustry }}</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">三级行业</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ company.thirdIndustry }}</span></div></el-col>
    </el-row>
    <el-row  class="el-row-content">
    </el-row>
    
    <el-row  class="el-row-title">
      <el-col :span="24"><div class="grid-content bg-title"> <span class="inline-title">估值信息</span> </div></el-col>
    </el-row>

    <el-row  class="el-row-content">
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">综合评分</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ valuation.score }}</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">大V推荐得分</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ valuation.recommendationScore }}</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">财务评价得分</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ valuation.financialScore }}</span></div></el-col>
    </el-row>

    <el-row  class="el-row-content">
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">预期/假定增长率</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ valuation.growthRatePrediction }} / {{ valuation.growthRateAssumption }}</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">估值</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ valuation.valuation }}</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">现价</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ valuation.price }}</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">偏差</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ formatPercent(valuation.deviation) }}</span></div></el-col>
</el-row>

    <el-row  class="el-row-content">
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">PE-TTM</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ roundToDecimal(valuation.pe,2) }}</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">PB(不含商誉)</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ roundToDecimal(valuation.pb,2) }}</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">市值</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ formatYi(valuation.marketValue) }}</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">股本</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ formatYi(valuation.capitalization) }}</span></div></el-col>
    </el-row>

    <el-row  class="el-row-content">
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">分红率</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ formatPercent(valuation.dividendRate) }}</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">连续分红年数</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ valuation.dividendYears }}</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">上市以来持续分红</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ valuation.dividendIsSure }}</span></div></el-col>
    </el-row>

    <el-row  class="el-row-content">
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">股息率</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ formatPercent(valuation.yield) }}</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">五年平均股息率</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ formatPercent(valuation.yieldAverage) }}</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">前瞻股息率</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ formatPercent(valuation.yieldPrediction) }}</span></div></el-col>
    </el-row>
    
    <el-row  class="el-row-title">
      <el-col :span="24"><div class="grid-content bg-title"> <span class="inline-title">最新财务信息</span> </div></el-col>
    </el-row>

    <el-row  class="el-row-content">
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">报告日期</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ financialReport.date }}</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">加权ROE</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ formatPercent(financialReport.wroe) }}</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">加权扣非ROE</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ formatPercent(financialReport.wdroe) }}</span></div></el-col>
    </el-row>

    <el-row  class="el-row-content">
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">每股净资产</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ roundToDecimal(financialReport.netAssetValuePer,2) }}</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">每股扣非净利润</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ roundToDecimal(financialReport.npadnrpatoshaopcPer,2) }}</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">每股经营现金流</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ roundToDecimal(financialReport.operatingCashFlowPer,2) }}</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">每股自由现金流</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ roundToDecimal(financialReport.freeCashFlowPer,2) }}</span></div></el-col>
    </el-row>

    <el-row  class="el-row-content">
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">毛利率</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ formatPercent(financialReport.grossMargin) }}</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">资产负债率</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ formatPercent(financialReport.assetLiabilityRatio) }}</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">有息负债率</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ formatPercent(financialReport.interestLiabilityRatio) }}</span></div></el-col>
    </el-row>

    <el-row  class="el-row-content">
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">营业收入本季度增长率</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ formatPercent(financialReport.incomeGrowthRateCurrent) }}</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">扣非利润本季度增长率</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ formatPercent(financialReport.profitGrowthRateCurrent) }}</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">营业收入累积增长率</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ formatPercent(financialReport.incomeGrowthRateTotal) }}</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">扣非利润累积增长率</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ formatPercent(financialReport.profitGrowthRateTotal) }}</span></div></el-col>
    </el-row>

    <el-row  class="el-row-title">
      <el-col :span="24"><div class="grid-content bg-title"> <span class="inline-title">最近五年分红信息</span> </div></el-col>
    </el-row>

    <el-row  class="el-row-content" v-for="(dividend, index) in dividendList" :key="index">
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">年份</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ dividend.dividendYear }}</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">分红金额</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ formatYi(dividend.dividendAmount) }}</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-name"><span class="inline-content">自由现金流</span></div></el-col>
      <el-col :span="3"><div class="grid-content bg-value"><span class="inline-content">{{ formatYi(dividend.freeCashFlow) }}</span></div></el-col>
    </el-row>

    <el-row  class="el-row-title">
      <el-col :span="24"><div class="grid-content bg-title"> <span class="inline-title">估值参考信息</span> </div></el-col>
    </el-row>

    <el-descriptions class="ed-margin" title="净资产估值" :column="4" border>
      <el-descriptions-item label="每股净资产" :span="1">{{ roundToDecimal(financialReport.netAssetValuePer,2) }}</el-descriptions-item>
      <el-descriptions-item label="净资产折价率" :span="1">{{ valuationData.netAssetDiscount }}</el-descriptions-item>
      <el-descriptions-item label="净资产估值" :span="1">{{ roundToDecimal(valuationData.netAssetValuation,2) }}</el-descriptions-item>
      </el-descriptions>
    <br><br>
    <el-descriptions class="ed-margin" title="分红率估算" :column="4" border>
      <el-descriptions-item label="分红稳定性">{{ formatPercent(valuationData.dividendStability) }}</el-descriptions-item>
      <el-descriptions-item label="预期分红率">{{ formatPercent(valuationData.dividendRatePrediction) }}</el-descriptions-item>
    </el-descriptions>
    <br><br>
    <el-descriptions class="ed-margin" title="高增长期增速估算" :column="4" border>
      <el-descriptions-item label="预期营收增速">{{ formatPercent(valuationData.incomeGrowthRatePrediction) }}</el-descriptions-item>
      <el-descriptions-item label="预期利润增速">{{ formatPercent(valuationData.profitGrowthRatePrediction) }}</el-descriptions-item>
      <el-descriptions-item label="次期增速推算">{{ formatPercent(valuationData.growthRatePrediction) }}</el-descriptions-item>
    </el-descriptions>
    <br><br>
    <el-descriptions class="ed-margin" title="高增长期估值" :column="4" border>
      <el-descriptions-item label="年数">{{ valuationData.growthYears }}</el-descriptions-item>
      <el-descriptions-item label="折现率">{{ valuationData.discountRate }}</el-descriptions-item>
      <el-descriptions-item label="初始每股扣非净利润">{{ roundToDecimal(financialReport.npadnrpatoshaopcPer,2) }}</el-descriptions-item>
      <el-descriptions-item label="折现系数累积">{{ valuationData.highGrowthDiscountCoefficientSum }}</el-descriptions-item>
      <el-descriptions-item label="高增长期估值">{{ valuationData.highGrowthValuation }}</el-descriptions-item>
    </el-descriptions>
    <br><br>
    <el-descriptions class="ed-margin" title="永续期估值" :column="4" border>
      <el-descriptions-item label="永续期增速">{{ formatPercent(valuationData.perpetualGrowthRate) }}</el-descriptions-item>
      <el-descriptions-item label="折现系数累积">{{ valuationData.perpetualDiscountCoefficientSum }}</el-descriptions-item>
      <el-descriptions-item label="永续期估值">{{ valuationData.perpetualValuation }}</el-descriptions-item>
    </el-descriptions>
    <br><br>
    <el-descriptions class="ed-margin" title="风险" :column="4" border>
      <el-descriptions-item label="市场风险">{{ valuationData.marketRisk }}</el-descriptions-item>
      <el-descriptions-item label="行业风险">{{ valuationData.industryRisk }}</el-descriptions-item>
    </el-descriptions>
    <br><br>
    <el-descriptions class="ed-margin" title="最终估值" :column="4" border>
      <el-descriptions-item label="最终估值">{{ roundToDecimal(valuationData.total,2) }}</el-descriptions-item>
    </el-descriptions>

    <BR/><BR/><BR/><BR/>
  </div>
  
</template>

<script>
import { getCompany } from "@/api/company";
import { formatPercent,formatYi,formatWan,roundToDecimal} from "@/utils/index";

export default {
  name: "companydetail",
  // props:["isEdit"],
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      listLoading: false,
      companyId:this.$route.params.id,
      company: null,
      valuation: null,
      financialReport: null,
      dividendList: null,
      valuationData: null,
    };
  },
  computed:{
    isEdit : function() {
      return Boolean(this.strategyId)
    }
  },
  mounted(){
    this.listLoading = true;
  },
  created() {
    console.log("companydetail.vue");
    this.getDetail();
  },
  methods: {
    async getDetail() {
      
      const { data } = await getCompany(this.companyId);
      const companyData = data.company
      const valuationData = data.valuation
      
      console.log(data)
      this.company = companyData
      this.valuation = valuationData
      this.financialReport = data.financialReport
      this.dividendList = data.dividendList
      this.valuationData = data.valuationData
      this.valuationData.total = ( data.valuationData.netAssetValuation + data.valuationData.highGrowthValuation + data.valuationData.perpetualValuation ) 
      * data.valuationData.marketRisk * data.valuationData.industryRisk
      console.log()
      this.listLoading = false;
    },
    formatPercent,
    formatYi,
    formatWan,
    roundToDecimal
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

  .el-row-title {
    margin-bottom: 20px;
    margin-left : 20px;
  }
  .el-row-content {
    margin-bottom: 20px;
    margin-left : 40px;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-title {
    background: #99a9bf;
  }
  .bg-name {
    background: #d3dce6;
  }
  .bg-value {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .inline-title {
    color: #FFFFFF;
    padding: 8px 16px;
    display: inline-block;
    font-size: 20px;
  }
  .inline-content {
    padding: 8px 16px;
    display: inline-block;
  }
  .ed-margin {
    margin-left : 40px;
  }
</style>
