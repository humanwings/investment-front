<template>
  <div>
    <h3>行业参数</h3>
    <div class="toolbar">
      <el-button type="primary" icon="el-icon-check" @click="saveAll">
        保存
      </el-button>
      <el-button icon="el-icon-refresh-left" @click="resetAll">
        重置
      </el-button>
      <span class="industry-summary">行业总计：{{ total }}</span>
    </div>

    <el-table
      v-loading="listLoading"
      :data="treeList"
      row-key="code"
      border
      highlight-current-row
      :default-expand-all="false"
      :expand-row-keys="expandedRowKeys"
      class="industry-table"
      :tree-props="{ children: 'children' }"
    >
      <el-table-column label="行业名称" min-width="180">
        <template slot-scope="{ row }">
          <span
            class="industry-name"
            :class="getIndustryNameClass(row)"
          >{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="行业代码" width="140" prop="code" />

      <el-table-column align="center" label="层级" width="100">
        <template slot-scope="{ row }">
          <span>{{ formatLevel(row.level) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="行业风险系数" width="220">
        <template slot-scope="{ row }">
          <el-input
            :value="formatRisk(row.valuationRisk)"
            clearable
            size="small"
            @input="handleRiskChange(row, $event)"
            @clear="clearRisk(row)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getIndustrySettings, saveAllIndustrySettings } from '@/api/industrysettings'

export default {
  name: 'IndustrySettings',
  data() {
    return {
      total: 0,
      listLoading: true,
      flatList: [],
      treeList: [],
      originalList: [],
      expandedRowKeys: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      try {
        const { data } = await getIndustrySettings()
        this.total = data.sum
        this.originalList = this.cloneList(data.list)
        this.setList(data.list)
      } finally {
        this.listLoading = false
      }
    },
    setList(list) {
      this.flatList = this.cloneList(list)
      this.treeList = this.buildTree(this.flatList)
      this.expandedRowKeys = this.getExpandedRowKeys(this.flatList)
    },
    cloneList(list) {
      return JSON.parse(JSON.stringify(list || []))
    },
    buildTree(list) {
      const map = {}
      const roots = []

      list.forEach(item => {
        map[item.code] = {
          ...item,
          children: []
        }
      })

      Object.values(map).forEach(item => {
        if (item.parent && map[item.parent]) {
          map[item.parent].children.push(item)
        } else {
          roots.push(item)
        }
      })

      return roots
    },
    handleRiskChange(row, value) {
      row.valuationRisk = value === '' ? null : value
    },
    clearRisk(row) {
      row.valuationRisk = null
    },
    hasRisk(row) {
      return row.valuationRisk !== null && row.valuationRisk !== undefined && row.valuationRisk !== ''
    },
    getIndustryNameClass(row) {
      if (!this.hasRisk(row)) {
        return ''
      }
      const risk = Number(row.valuationRisk)
      if (Number.isNaN(risk)) {
        return ''
      }
      if (risk > 1) {
        return 'industry-name-high'
      }
      if (risk < 1) {
        return 'industry-name-low'
      }
      return 'industry-name-equal'
    },
    formatRisk(value) {
      return value === null || value === undefined ? '' : String(value)
    },
    getExpandedRowKeys(list) {
      const expanded = new Set()
      const map = {}

      list.forEach(item => {
        map[item.code] = item
      })

      list.forEach(item => {
        if (!this.hasRisk(item)) {
          return
        }
        let current = item.parent
        while (current && map[current]) {
          expanded.add(current)
          current = map[current].parent
        }
      })

      return Array.from(expanded)
    },
    formatLevel(level) {
      const levelMap = {
        1: '一级',
        2: '二级',
        3: '三级'
      }
      return levelMap[level] || level
    },
    resetAll() {
      this.setList(this.originalList)
      this.$message({
        message: '已重置为最近一次加载的数据',
        type: 'success'
      })
    },
    async saveAll() {
      const invalidItem = this.flatList.find(item => {
        if (item.valuationRisk === null || item.valuationRisk === undefined || item.valuationRisk === '') {
          return false
        }
        return Number.isNaN(Number(item.valuationRisk))
      })

      if (invalidItem) {
        this.$message.error(`行业 ${invalidItem.name} 的风险系数不是有效数字`)
        return
      }

      this.listLoading = true
      try {
        const { data } = await saveAllIndustrySettings({
          list: this.flatList.map(item => ({
            code: item.code,
            valuationRisk: item.valuationRisk === null || item.valuationRisk === undefined || item.valuationRisk === ''
              ? null
              : Number(item.valuationRisk)
          }))
        })
        this.total = data.sum
        this.originalList = this.cloneList(data.list)
        this.setList(data.list)
      } finally {
        this.listLoading = false
      }
      this.$message({
        message: '保存成功',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
.toolbar {
  margin-bottom: 16px;
}

.industry-table {
  width: 760px;
  max-width: 100%;
}

.industry-summary {
  margin-left: 12px;
}

.industry-name-high {
  color: #409eff;
  font-weight: 700;
}

.industry-name-low {
  color: #f56c6c;
  font-weight: 700;
}

.industry-name-equal {
  color: #303133;
  font-weight: 700;
}
</style>
