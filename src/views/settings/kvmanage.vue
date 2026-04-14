<template>
  <div>
    <h3>大V管理</h3>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="大V列表" name="authors">
        <div class="toolbar">
          <el-button type="primary" icon="el-icon-plus" @click="openAuthorDialog()">
            新增大V
          </el-button>
          <el-button type="success" icon="el-icon-refresh" @click="refreshAll">
            刷新榜单
          </el-button>
          <span class="summary">大V总数：{{ authorTotal }}</span>
        </div>

        <el-table v-loading="authorLoading" :data="authors" highlight-current-row>
          <el-table-column align="center" label="名称" min-width="140" prop="authorName" />
          <el-table-column align="center" label="来源" width="120" prop="sourceSite" />
          <el-table-column align="center" label="标签" min-width="140" prop="styleTags" />
          <el-table-column align="center" label="启用" width="80">
            <template slot-scope="{ row }">
              <el-tag :type="row.enabled ? 'success' : 'info'">{{ row.enabled ? '是' : '否' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="默认可信度" width="110" prop="defaultConfidence" />
          <el-table-column align="center" label="调整权重" width="100" prop="manualAdjustWeight" />
          <el-table-column align="center" label="样本数" width="90" prop="sampleCount" />
          <el-table-column align="center" label="30日收益" width="110">
            <template slot-scope="{ row }">
              <span>{{ formatPercent(row.return30d) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="胜率" width="90">
            <template slot-scope="{ row }">
              <span>{{ formatPercent(row.winRate) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="当前权重" width="100" prop="finalWeight" />
          <el-table-column align="center" label="最近数据日" width="120" prop="latestDataDate" />
          <el-table-column fixed="right" align="center" label="处理" width="100">
            <template slot-scope="{ row }">
              <el-button type="text" @click="openAuthorDialog(row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="推荐数据" name="raw">
        <div class="toolbar">
          <el-select v-model="rawQuery.authorId" clearable filterable placeholder="选择大V">
            <el-option
              v-for="item in authors"
              :key="item.authorId"
              :label="item.authorName"
              :value="item.authorId"
            />
          </el-select>
          <el-date-picker
            v-model="rawQuery.tradeDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="推荐日期"
          />
          <el-button type="primary" icon="el-icon-search" @click="getRawList">
            查询
          </el-button>
          <el-button type="primary" icon="el-icon-plus" @click="openRawDialog()">
            新增推荐
          </el-button>
          <span class="summary">数据总数：{{ rawTotal }}</span>
        </div>

        <el-table v-loading="rawLoading" :data="rawList" highlight-current-row>
          <el-table-column align="center" label="大V" width="120" prop="authorName" />
          <el-table-column align="center" label="日期" width="120" prop="tradeDate" />
          <el-table-column align="center" label="代码" width="100" prop="stockCode" />
          <el-table-column align="center" label="名称" min-width="120" prop="stockName" />
          <el-table-column align="center" label="动作" width="90" prop="actionType" />
          <el-table-column align="center" label="仓位" width="90">
            <template slot-scope="{ row }">
              <span>{{ formatPercent(row.positionRatio) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="30日收益" width="100">
            <template slot-scope="{ row }">
              <span>{{ formatPercent(row.resultReturn30d) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="有效" width="80">
            <template slot-scope="{ row }">
              <el-tag :type="row.isValid ? 'success' : 'info'">{{ row.isValid ? '是' : '否' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" align="center" label="处理" width="120">
            <template slot-scope="{ row }">
              <el-button type="text" @click="openRawDialog(row)">编辑</el-button>
              <el-button type="text" @click="deleteRaw(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-dialog :title="authorForm.authorId ? '编辑大V' : '新增大V'" :visible.sync="authorDialogVisible" width="520px">
      <el-form :model="authorForm" label-width="110px">
        <el-form-item label="大V名称">
          <el-input v-model="authorForm.authorName" />
        </el-form-item>
        <el-form-item label="来源站点">
          <el-input v-model="authorForm.sourceSite" />
        </el-form-item>
        <el-form-item label="来源UID">
          <el-input v-model="authorForm.sourceUid" />
        </el-form-item>
        <el-form-item label="风格标签">
          <el-input v-model="authorForm.styleTags" />
        </el-form-item>
        <el-form-item label="默认可信度">
          <el-input-number v-model="authorForm.defaultConfidence" :precision="2" :step="0.1" :min="0.1" />
        </el-form-item>
        <el-form-item label="调整权重">
          <el-input-number v-model="authorForm.manualAdjustWeight" :precision="2" :step="0.1" :min="0" />
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="authorForm.enabled" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="authorForm.remark" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="authorDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveAuthor">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="rawForm.recId ? '编辑推荐数据' : '新增推荐数据'" :visible.sync="rawDialogVisible" width="560px">
      <el-form :model="rawForm" label-width="110px">
        <el-form-item label="大V">
          <el-select v-model="rawForm.authorId" filterable placeholder="选择大V">
            <el-option
              v-for="item in authors"
              :key="item.authorId"
              :label="item.authorName"
              :value="item.authorId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="推荐日期">
          <el-date-picker v-model="rawForm.tradeDate" type="date" value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item label="股票代码">
          <el-input v-model.trim="rawForm.stockCode" @input="onStockCodeInput" @blur="fillStockNameByCode()" />
        </el-form-item>
        <el-form-item label="股票名称">
          <el-input v-model="rawForm.stockName" />
        </el-form-item>
        <el-form-item label="动作">
          <el-select v-model="rawForm.actionType">
            <el-option label="BUY" value="BUY" />
            <el-option label="ADD" value="ADD" />
            <el-option label="HOLD" value="HOLD" />
            <el-option label="REDUCE" value="REDUCE" />
            <el-option label="SELL" value="SELL" />
          </el-select>
        </el-form-item>
        <el-form-item label="仓位">
          <el-input-number v-model="rawForm.positionRatio" :precision="2" :step="0.05" :min="0" :max="1" />
        </el-form-item>
        <el-form-item label="30日收益">
          <el-input-number v-model="rawForm.resultReturn30d" :precision="3" :step="0.01" />
        </el-form-item>
        <el-form-item label="90日收益">
          <el-input-number v-model="rawForm.resultReturn90d" :precision="3" :step="0.01" />
        </el-form-item>
        <el-form-item label="180日收益">
          <el-input-number v-model="rawForm.resultReturn180d" :precision="3" :step="0.01" />
        </el-form-item>
        <el-form-item label="最大回撤">
          <el-input-number v-model="rawForm.resultDrawdown" :precision="3" :step="0.01" />
        </el-form-item>
        <el-form-item label="来源链接">
          <el-input v-model="rawForm.sourceUrl" />
        </el-form-item>
        <el-form-item label="有效">
          <el-switch v-model="rawForm.isValid" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="rawDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRaw">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { formatPercent } from '@/utils/index'
import {
  deleteRecommendRaw,
  getRecommendAuthors,
  getRecommendRawList,
  getRecommendStockByCode,
  refreshRecommendRank,
  saveRecommendAuthor,
  saveRecommendRaw
} from '@/api/recommend'

function defaultAuthorForm() {
  return {
    authorId: null,
    authorName: '',
    sourceSite: '',
    sourceUid: '',
    styleTags: '',
    enabled: 1,
    defaultConfidence: 1,
    manualAdjustWeight: null,
    remark: ''
  }
}

function defaultRawForm() {
  return {
    recId: null,
    authorId: null,
    tradeDate: '',
    stockCode: '',
    stockName: '',
    actionType: 'BUY',
    positionRatio: 0.5,
    resultReturn30d: 0,
    resultReturn90d: 0,
    resultReturn180d: 0,
    resultDrawdown: 0,
    sourceUrl: '',
    isValid: 1
  }
}

export default {
  name: 'RecommendManage',
  data() {
    return {
      activeTab: 'authors',
      authorLoading: false,
      rawLoading: false,
      authors: [],
      authorTotal: 0,
      rawList: [],
      rawTotal: 0,
      authorDialogVisible: false,
      rawDialogVisible: false,
      authorForm: defaultAuthorForm(),
      rawForm: defaultRawForm(),
      rawQuery: {
        authorId: null,
        tradeDate: ''
      },
      stockLookupTimer: null
    }
  },
  created() {
    this.getAuthors()
    this.getRawList()
  },
  beforeDestroy() {
    if (this.stockLookupTimer) {
      clearTimeout(this.stockLookupTimer)
    }
  },
  methods: {
    formatPercent,
    async getAuthors() {
      this.authorLoading = true
      try {
        const { data } = await getRecommendAuthors()
        this.authors = data.list || []
        this.authorTotal = data.sum || 0
      } finally {
        this.authorLoading = false
      }
    },
    async getRawList() {
      this.rawLoading = true
      try {
        const { data } = await getRecommendRawList(this.rawQuery)
        this.rawList = data.list || []
        this.rawTotal = data.sum || 0
      } finally {
        this.rawLoading = false
      }
    },
    openAuthorDialog(row) {
      this.authorForm = row ? { ...row } : defaultAuthorForm()
      this.authorDialogVisible = true
    },
    async saveAuthor() {
      await saveRecommendAuthor(this.authorForm)
      this.authorDialogVisible = false
      await this.getAuthors()
      this.$message.success('保存成功')
    },
    openRawDialog(row) {
      this.rawForm = row ? { ...row } : defaultRawForm()
      this.rawDialogVisible = true
    },
    async saveRaw() {
      await this.fillStockNameByCode()
      await saveRecommendRaw(this.rawForm)
      this.rawDialogVisible = false
      await this.getRawList()
      await this.getAuthors()
      this.$message.success('保存成功')
    },
    async deleteRaw(row) {
      await this.$confirm(`确认删除 ${row.stockCode} 这条推荐数据吗？`, '提示', {
        type: 'warning'
      })
      await deleteRecommendRaw(row.recId)
      await this.getRawList()
      this.$message.success('删除成功')
    },
    async refreshAll() {
      await refreshRecommendRank({})
      this.$message.success('榜单已刷新')
    },
    onStockCodeInput() {
      if (this.stockLookupTimer) {
        clearTimeout(this.stockLookupTimer)
      }
      this.stockLookupTimer = setTimeout(() => {
        this.fillStockNameByCode()
      }, 300)
    },
    async fillStockNameByCode() {
      const stockCode = (this.rawForm.stockCode || '').trim()
      if (!stockCode) {
        return
      }
      const { data } = await getRecommendStockByCode(stockCode)
      const company = data.company || {}
      if (company.name) {
        this.rawForm.stockCode = company.stockCode || stockCode
        this.rawForm.stockName = company.name
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
</style>
