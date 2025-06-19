<template>
  <div class="industry-settings-container">
    <h3>行业设置</h3>
    <div class="button-group" style="text-align: left; margin-bottom: 20px;">
      <el-button type="primary" @click="submitChanges">确定</el-button>
      <el-button @click="resetChanges">重置</el-button>
    </div>
    <el-tree 
      :data="treeData" 
      :props="treeProps" 
      node-key="code"
      :default-expand-all="false"
      style="margin-top: 0;"
    >
      <template #default="{ node, data }">
        <span class="custom-node">
          <span style="min-width: 200px; display: inline-block;">{{ data.name }}</span>
          <el-input 
            v-model="data.valuationRisk" 
            style="width: 80px; margin-left: 10px;"
            class="small-input"
            :placeholder="data.valuationRisk === null || data.valuationRisk === '' ? '' : '风险值'"
            @click.native.stop
            @change="handleRiskChange(data)"
          />
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script>
import { getIndustryRiskList, updateIndustryRisk } from '@/api/settings'

export default {
  data() {
    return {
      treeData: [],  // 树状结构数据
      treeProps: {  // 树配置（匹配后台字段）
        children: 'children',
        label: 'name',  // 根据实际字段名调整
        value: 'code'   // 添加value字段
      }
    }
  },
  created() {
    this.fetchIndustryData()
  },
  methods: {
    async fetchIndustryData() {
      try {
        const { data } = await getIndustryRiskList()
        if (Array.isArray(data.list)) {
          this.treeData = this.buildTree(data.list)
          this.originalData = JSON.parse(JSON.stringify(data.list)) // 深拷贝保存初始数据
        }
        console.log('原始数据:', data)  // 确认数据结构
        // 确保数据是数组且包含industryId和parentId字段
        if (Array.isArray(data.list)) {
          this.treeData = this.buildTree(data.list)
          console.log('转换后的树状数据:', this.treeData)
        } else {
          console.error('数据格式不正确:', data)
        }
      } catch (error) {
        console.error('加载失败:', error)
        this.$message.error('加载行业数据失败')
      }
    },
    // 扁平数组转树状结构核心方法
    buildTree(list) {
      const map = {}
      const result = []
      // 1. 先建立节点映射表
      list.forEach(item => {
        map[item.code] = { ...item, children: [] }  // 使用code作为key
      })
      // 2. 根据parent关联子节点
      list.forEach(item => {
        if (item.parent && map[item.parent]) {
          map[item.parent].children.push(map[item.code])
        } else {
          result.push(map[item.code])  // 根节点
        }
      })
      return result
    },
    
    handleRiskChange(data) {
      console.log('风险值修改:', data.code, data.valuationRisk)
      // 这里可以添加保存逻辑
    },
    
    async submitChanges() {
      try {
        const updates = this.getModifiedRisks()
        console.log('准备提交的更新数据:', updates) // 添加日志
        const response = await updateIndustryRisk(updates)
        console.log('API响应:', response) // 添加日志
        this.$message.success('风险值已保存')
        this.originalData = JSON.parse(JSON.stringify(this.treeData))
      } catch (error) {
        console.error('保存错误详情:', error) // 添加详细错误日志
        this.$message.error('保存失败: ' + (error.response?.data?.message || error.message))
      }
    },
    
    resetChanges() {
      this.treeData = this.buildTree(JSON.parse(JSON.stringify(this.originalData)))
      this.$message.success('已重置为初始值')
    },
    
    getModifiedRisks() {
      const updates = []
      // 遍历树结构找出修改过的风险值
      const traverse = (nodes) => {
        nodes.forEach(node => {
          const originalNode = this.originalData.find(item => item.code === node.code)
          if (originalNode && originalNode.valuationRisk !== node.valuationRisk) {
            updates.push({
              code: node.code,
              valuationRisk: node.valuationRisk
            })
          }
          if (node.children) {
            traverse(node.children)
          }
        })
      }
      traverse(this.treeData)
      return updates
    }
  }
}
</script>

<style scoped>
.industry-settings-container {
  padding: 20px;
}
.custom-node {
  display: flex;
  align-items: center;
  width: 100%;
}

/* 添加在style部分 */
.small-input {
  height: 22px;
}
.small-input ::v-deep .el-input__inner {
  height: 22px;
  line-height: 22px;
  padding-top: 0;
  padding-bottom: 0;
  font-size: 12px;
}
</style>
