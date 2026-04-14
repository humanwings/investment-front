<template>
  <div>
    <h3>推荐权重规则</h3>

    <div class="toolbar">
      <el-button type="primary" icon="el-icon-plus" @click="openDialog()">
        新增规则
      </el-button>
      <el-button type="success" icon="el-icon-refresh" @click="refreshAll">
        按当前规则刷新榜单
      </el-button>
      <span class="summary">规则数：{{ total }}</span>
    </div>

    <el-table v-loading="listLoading" :data="list" highlight-current-row>
      <el-table-column align="center" label="启用" width="80">
        <template slot-scope="{ row }">
          <el-tag :type="row.enabled ? 'success' : 'info'">{{ row.enabled ? '是' : '否' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="规则名称" min-width="140" prop="ruleName" />
      <el-table-column align="center" label="收益权重" width="100" prop="returnWeight" />
      <el-table-column align="center" label="胜率权重" width="100" prop="winRateWeight" />
      <el-table-column align="center" label="回撤惩罚" width="100" prop="drawdownWeight" />
      <el-table-column align="center" label="活跃度权重" width="100" prop="activityWeight" />
      <el-table-column align="center" label="样本权重" width="100" prop="sampleSizeWeight" />
      <el-table-column align="center" label="仓位模式" width="100" prop="positionWeightMode" />
      <el-table-column align="center" label="衰减天数" width="100" prop="decayDays" />
      <el-table-column align="center" label="大V上限" width="100" prop="maxAuthorWeight" />
      <el-table-column align="center" label="最小样本" width="100" prop="minSampleCount" />
      <el-table-column fixed="right" align="center" label="处理" width="100">
        <template slot-scope="{ row }">
          <el-button type="text" @click="openDialog(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="form.ruleId ? '编辑规则' : '新增规则'" :visible.sync="dialogVisible" width="560px">
      <el-form :model="form" label-width="120px">
        <el-form-item label="规则名称">
          <el-input v-model="form.ruleName" />
        </el-form-item>
        <el-form-item label="收益权重">
          <el-input-number v-model="form.returnWeight" :precision="2" :step="0.05" :min="0" />
        </el-form-item>
        <el-form-item label="胜率权重">
          <el-input-number v-model="form.winRateWeight" :precision="2" :step="0.05" :min="0" />
        </el-form-item>
        <el-form-item label="回撤惩罚">
          <el-input-number v-model="form.drawdownWeight" :precision="2" :step="0.05" :min="0" />
        </el-form-item>
        <el-form-item label="活跃度权重">
          <el-input-number v-model="form.activityWeight" :precision="2" :step="0.05" :min="0" />
        </el-form-item>
        <el-form-item label="样本数权重">
          <el-input-number v-model="form.sampleSizeWeight" :precision="2" :step="0.05" :min="0" />
        </el-form-item>
        <el-form-item label="仓位模式">
          <el-select v-model="form.positionWeightMode">
            <el-option label="DIRECT" value="DIRECT" />
            <el-option label="LOG" value="LOG" />
          </el-select>
        </el-form-item>
        <el-form-item label="衰减天数">
          <el-input-number v-model="form.decayDays" :min="1" />
        </el-form-item>
        <el-form-item label="大V权重上限">
          <el-input-number v-model="form.maxAuthorWeight" :precision="2" :step="0.1" :min="0.1" />
        </el-form-item>
        <el-form-item label="最小样本数">
          <el-input-number v-model="form.minSampleCount" :min="1" />
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="form.enabled" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRule">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRecommendRules, refreshRecommendRank, saveRecommendRule } from '@/api/recommend'

function defaultForm() {
  return {
    ruleId: null,
    ruleName: '',
    returnWeight: 0.4,
    winRateWeight: 0.2,
    drawdownWeight: 0.1,
    activityWeight: 0.1,
    sampleSizeWeight: 0.2,
    positionWeightMode: 'DIRECT',
    decayDays: 30,
    maxAuthorWeight: 3,
    minSampleCount: 5,
    enabled: 1
  }
}

export default {
  name: 'RecommendRules',
  data() {
    return {
      listLoading: false,
      list: [],
      total: 0,
      dialogVisible: false,
      form: defaultForm()
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      try {
        const { data } = await getRecommendRules()
        this.list = data.list || []
        this.total = data.sum || 0
      } finally {
        this.listLoading = false
      }
    },
    openDialog(row) {
      this.form = row ? { ...row } : defaultForm()
      this.dialogVisible = true
    },
    async saveRule() {
      await saveRecommendRule(this.form)
      this.dialogVisible = false
      await this.getList()
      this.$message.success('保存成功')
    },
    async refreshAll() {
      await refreshRecommendRank({})
      this.$message.success('榜单已按当前规则刷新')
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
