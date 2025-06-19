<template>
  <div class="macro-settings-container">
    <h3>宏观参数设置</h3>
    
    <el-form ref="form" :model="form" label-width="200px">
      <el-form-item label="美元->人民币">
        <el-input v-model="form.usdToCny" placeholder="请输入汇率" style="width: 120px; margin-left: 4ch"></el-input>
      </el-form-item>
      
      <el-form-item label="港币->人民币">
        <el-input v-model="form.hkdToCny" placeholder="请输入汇率" style="width: 120px; margin-left: 4ch"></el-input>
      </el-form-item>
      
      <el-form-item label="市场风偏系数">
        <el-input v-model="form.marketRisk" placeholder="请输入系数" style="width: 120px; margin-left: 4ch"></el-input>
      </el-form-item>
      
      <el-form-item label="贴现率(个人期望收益率)">
        <el-input v-model="form.discountRate" placeholder="请输入贴现率" type="number" style="width: 120px; margin-left: 4ch">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      
      <el-form-item label="永续增长率">
        <el-input v-model="form.perpetualGrowth" placeholder="请输入增长率" type="number" style="width: 120px; margin-left: 4ch">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      
      <el-form-item label="净资产折算">
        <el-input v-model="form.netAssetRatio" placeholder="请输入折算率" style="width: 120px; margin-left: 4ch"></el-input>
      </el-form-item>
      
      <el-form-item label="港股折价率">
        <el-input v-model="form.hkDiscount" placeholder="请输入折价率" style="width: 120px; margin-left: 4ch"></el-input>
      </el-form-item>
    </el-form>
    
    <div class="button-group" style="text-align: left">
      <el-button type="primary" @click="submitForm" style="margin-left: 120px">确定</el-button>
      <el-button @click="resetForm" style="margin-left: 40px; background-color: #ffffcc">重置</el-button>
    </div>
  </div>
</template>

<script>
import { getMacroSettings, updateMacroSettings } from '@/api/settings'

export default {
  data() {
    return {
      form: {
        usdToCny: '',
        hkdToCny: '',
        marketRisk: '',
        discountRate: '',
        perpetualGrowth: '',
        netAssetRatio: '',
        hkDiscount: ''
      },
      originalForm: {}
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getMacroSettings().then(response => {
        const data = response.data.data
        // 将小数转换为百分数显示，并限制小数位数
        this.form = {
          usdToCny: data.usdToCny,
          hkdToCny: data.hkdToCny,
          marketRisk: data.marketRisk,
          discountRate: parseFloat((data.discountRate * 100).toFixed(2)),  // 转换为百分数并保留2位小数
          perpetualGrowth: parseFloat((data.perpetualGrowth * 100).toFixed(2)),  // 转换为百分数并保留2位小数
          netAssetRatio: data.netAssetRatio,
          hkDiscount: data.hkDiscount
        }
        this.originalForm = {...this.form}
      }).catch(error => {
        this.$message.error('获取宏观参数失败')
      })
    },
    submitForm() {
      const submitData = {
        ...this.form,
        discountRate: this.form.discountRate / 100,  // 转换回小数
        perpetualGrowth: this.form.perpetualGrowth / 100  // 转换回小数
      }
      updateMacroSettings(submitData).then(() => {
        this.$message.success('参数已保存')
        this.originalForm = {...this.form}
      }).catch(error => {
        this.$message.error('保存失败')
      })
    },
    resetForm() {
      // 重置为原始值
      this.form = {...this.originalForm}
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.macro-settings-container {
  padding: 20px;
}
.button-group {
  margin-top: 20px;
  text-align: center;
}
</style>