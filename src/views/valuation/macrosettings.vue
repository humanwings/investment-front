<template>
  <div class="macro-params-container">
    <h2>宏观参数设置</h2>
    <el-form label-width="180px">
      <el-form-item label="美元->人民币">
        <el-input v-model="form.usdToCny" placeholder="汇率" style="width: 120px" />
      </el-form-item>
      <el-form-item label="港币->人民币">
        <el-input v-model="form.hkdToCny" placeholder="汇率" style="width: 120px" />
      </el-form-item>
      <el-form-item label="市场风偏系数">
        <el-input v-model="form.marketRiskFactor" placeholder="系数" style="width: 120px" />
      </el-form-item>
      <el-form-item label="贴现率(个人期望收益率)">
        <el-input
          :value="displayForm.discountRate"
          @input="val => handleInput('discountRate', val)"
          placeholder="百分比"
          style="width: 120px">
          <template #append>%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="永续增长率">
        <el-input
          :value="displayForm.perpetualGrowthRate"
          @input="val => handleInput('perpetualGrowthRate', val)"
          placeholder="百分比"
          style="width: 120px">
          <template #append>%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="净资产折算">
        <el-input v-model="form.netAssetConversion" placeholder="折算率" style="width: 120px" />
      </el-form-item>
      <el-form-item label="港股折价率">
        <el-input v-model="form.hkStockDiscount" placeholder="折价率" style="width: 120px" />
      </el-form-item>
    </el-form>

    <div class="button-group">
      <el-button type="primary" @click="handleConfirm">确定</el-button>
      <el-button @click="handleReset" plain style="background-color: #fff8e6">重置</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { getMacroSettings, updateMacroSettings } from '@/api/settings'

export default {
  name: 'MacroSettings',
  data() {
    return {
      form: {
        usdToCny: '',
        hkdToCny: '',
        marketRiskFactor: '',
        discountRate: '',
        perpetualGrowthRate: '',
        netAssetConversion: '',
        hkStockDiscount: ''
      },
      originalData: null,
      percentFields: ['discountRate', 'perpetualGrowthRate']
    }
  },
  computed: {
    displayForm() {
      const result = {...this.form}
      this.percentFields.forEach(field => {
        if (result[field] !== '' && result[field] != null) {
          result[field] = (result[field] * 100).toFixed(2)
        }
      })
      return result
    }
  },
  methods: {
    handleInput(field, value) {
      if (this.percentFields.includes(field)) {
        this.form[field] = value ? parseFloat(value) / 100 : ''
      } else {
        this.form[field] = value
      }
    },
    fetchData() {
      getMacroSettings().then(response => {
        const settingsMap = {}
        response.data.list.forEach(item => {
          settingsMap[item.id] = item.value
        })
        this.form = {
          usdToCny: settingsMap[1] || '',
          hkdToCny: settingsMap[2] || '',
          marketRiskFactor: settingsMap[3] || '',
          discountRate: settingsMap[4] || '',
          perpetualGrowthRate: settingsMap[5] || '',
          netAssetConversion: settingsMap[6] || '',
          hkStockDiscount: settingsMap[7] || ''
        }
        this.originalData = { ...this.form }
      })
    },
    handleConfirm() {
      const settings = [
        { id: 1, value: this.form.usdToCny },
        { id: 2, value: this.form.hkdToCny },
        { id: 3, value: this.form.marketRiskFactor },
        { id: 4, value: this.form.discountRate },
        { id: 5, value: this.form.perpetualGrowthRate },
        { id: 6, value: this.form.netAssetConversion },
        { id: 7, value: this.form.hkStockDiscount }
      ]
      updateMacroSettings(settings).then(() => {
        this.$message.success('参数保存成功')
        this.originalData = { ...this.form }
      })
    },
    handleReset() {
      if (this.originalData) {
        this.form = { ...this.originalData }
      } else {
        this.form = {
          usdToCny: '',
          hkdToCny: '',
          marketRiskFactor: '',
          discountRate: '',
          perpetualGrowthRate: '',
          netAssetConversion: '',
          hkStockDiscount: ''
        }
      }
    },
    handleCancel() {
      this.$router.go(-1)
    }
  },
  created() {
    this.fetchData()
  }
}
</script>

<style scoped>
.macro-params-container {
  padding: 20px;
}
.button-group {
  margin-top: 20px;
  margin-left: 180px; /* 与label宽度一致 */
  text-align: left;
}
</style>
