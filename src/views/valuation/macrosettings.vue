<template>
  <div>
    <h3>宏观参数</h3>
    <div class="macro-summary">参数总计：{{ total }}</div>

    <el-table v-loading="listLoading" :data="list" border highlight-current-row>
      <el-table-column align="center" label="ID" width="80" prop="id" />

      <el-table-column align="center" label="参数名" min-width="220">
        <template slot-scope="{ row }">
          <span>{{ getSettingName(row.id) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="备注" min-width="240" prop="comment" />

      <el-table-column align="center" label="参数值" width="220">
        <template slot-scope="{ row }">
          <el-input
            v-model.number="row.value"
            type="number"
            size="small"
            :step="getStep(row.id)"
          />
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="saveItem(row)"
          >
            保存
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getMacroSettings, updateMacroSetting } from '@/api/macrosettings'

export default {
  name: 'MacroSettings',
  data() {
    return {
      total: 0,
      list: [],
      listLoading: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await getMacroSettings()
      this.list = data.list
      this.total = data.sum
      this.listLoading = false
    },
    async saveItem(row) {
      if (row.value === null || row.value === undefined || row.value === '') {
        this.$message.error('参数值不能为空')
        return
      }
      const { data } = await updateMacroSetting({
        id: row.id,
        value: Number(row.value),
        comment: row.comment
      })
      Object.assign(row, data.macroSetting)
      this.$message({
        message: '保存成功',
        type: 'success'
      })
    },
    getStep(id) {
      return id <= 2 ? 0.01 : 0.001
    },
    getSettingName(id) {
      const nameMap = {
        1: '美元->人民币',
        2: '港币->人民币',
        3: '市场风偏系数',
        4: '贴现率(个人期望收益率)',
        5: '永续增长率',
        6: '净资产折算',
        7: '港股折价率'
      }
      return nameMap[id] || `参数${id}`
    }
  }
}
</script>

<style scoped>
.macro-summary {
  margin-bottom: 16px;
}
</style>
