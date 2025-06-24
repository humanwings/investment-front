<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>宏观参数设置</span>
      </div>
      
      <el-form ref="form" :model="form" label-width="calc(180px + 2em)">
        <el-form-item label="美元->人民币">
          <el-input 
            v-model="form.usdToCny" 
            placeholder="美元兑人民币汇率"
            style="width: 120px"
          ></el-input>
        </el-form-item>
        
        <el-form-item label="港币->人民币">
          <el-input 
            v-model="form.hkdToCny" 
            placeholder="港币兑人民币汇率"
            style="width: 120px"
          ></el-input>
        </el-form-item>
        
        <el-form-item label="市场风偏系数">
          <el-input 
            v-model="form.marketRisk" 
            placeholder="市场风偏系数"
            style="width: 120px"
          ></el-input>
        </el-form-item>
        
        <el-form-item label="贴现率(个人期望收益率)">
          <el-input 
            v-model="form.discountRate" 
            placeholder="贴现率"
            style="width: 120px"
          >
            <span slot="append">%</span>
          </el-input>
        </el-form-item>
        
        <el-form-item label="永续增长率">
          <el-input 
            v-model="form.growthRate" 
            placeholder="永续增长率"
            style="width: 120px"
          >
            <span slot="append">%</span>
          </el-input>
        </el-form-item>
        
        <el-form-item label="净资产折算">
          <el-input 
            v-model="form.netAssetRatio" 
            placeholder="净资产折算率"
            style="width: 120px"
          ></el-input>
        </el-form-item>
        
        <el-form-item label="港股折价率">
          <el-input 
            v-model="form.hkDiscount" 
            placeholder="港股折价率"
            style="width: 120px"
          ></el-input>
        </el-form-item>
        
        <el-form-item style="margin-left: 0px; text-align: left">
          <el-button type="primary" @click="handleSubmit">确定</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
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
        marketRisk: '',
        discountRate: '',
        growthRate: '',
        netAssetRatio: '',
        hkDiscount: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getMacroSettings().then(settings => {
        // Convert array of settings to form object
        if (settings && Array.isArray(settings)) {
          settings.forEach(setting => {
            switch(setting.id) {
              case 1: this.form.usdToCny = setting.value; break;
              case 2: this.form.hkdToCny = setting.value; break;
              case 3: this.form.marketRisk = setting.value; break;
              case 4: this.form.discountRate = Number((setting.value * 100).toFixed(2)); break;
              case 5: this.form.growthRate = Number((setting.value * 100).toFixed(2)); break;
              case 6: this.form.netAssetRatio = setting.value; break;
              case 7: this.form.hkDiscount = setting.value; break;
            }
          })
        }
      }).catch(error => {
        console.error('Failed to fetch macro settings:', error)
        this.$message.error('获取宏观参数失败')
      })
    },
    handleSubmit() {
      const settings = [
        {id: 1, value: this.form.usdToCny},
        {id: 2, value: this.form.hkdToCny},
        {id: 3, value: this.form.marketRisk},
        {id: 4, value: this.form.discountRate / 100},
        {id: 5, value: this.form.growthRate / 100},
        {id: 6, value: this.form.netAssetRatio},
        {id: 7, value: this.form.hkDiscount}
      ]
      updateMacroSettings(settings).then(() => {
        this.$message.success('保存成功')
      }).catch(() => {
        this.$message.error('保存失败')
      })
    },
    handleReset() {
      // 保存原始数据
      const originalValues = {}
      this.form = {
        usdToCny: '',
        hkdToCny: '',
        marketRisk: '',
        discountRate: '',
        growthRate: '',
        netAssetRatio: '',
        hkDiscount: ''
      }
      // 重新获取数据
      this.fetchData()
    },
    // handleCancel() {
    //   this.$router.go(-1)
    // }
  }
}
</script>

<style scoped>
.box-card {
  margin: 20px;
}
</style>
