<template>
  <div class="industries-settings-container">
    <h2>行业风险系数设置</h2>
    <el-tree
      :data="industries"
      node-key="code"
      :props="treeProps"
      :expand-on-click-node="false"
      :default-expanded-keys="expandedKeys"
      style="width: 33%">
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span :class="{'text-blue': Number(data.valuationRisk) > 1.00, 'text-red': Number(data.valuationRisk) < 1.00}">
            {{ node.label }}
          </span>
          <el-input
            v-model="data.valuationRisk"
            size="small"
            :class="{'text-blue-input': Number(data.valuationRisk) > 1.00, 'text-red-input': Number(data.valuationRisk) < 1.00}"
            style="width: 50px; margin-left: 10px; height: 24px; margin-top: 2px; margin-bottom: 2px;"
            @change="handleChange(data); $forceUpdate()"/>
        </span>
      </template>
    </el-tree>

    <div class="button-group">
      <el-button type="primary" @click="handleConfirm">保存</el-button>
      <el-button @click="handleReset" plain style="background-color: #fff8e6">重置</el-button>
    </div>
  </div>
</template>

<script>
import { getIndustriesWithRisk, updateIndustriesRisk } from '@/api/settings'

export default {
  name: 'IndustriesSettings',
  data() {
    return {
      industries: [],
      originalData: [],
      expandedKeys: [],
      treeProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  methods: {
    fetchData() {
      getIndustriesWithRisk().then(response => {
        // Build tree structure from flat data
        const industriesMap = {}
        const tree = []
        
        // Create map of all industries
        response.data.list.forEach(industry => {
          industriesMap[industry.code] = {...industry, children: []}
        })
        
        // Build tree structure
        response.data.list.forEach(industry => {
          if (industry.parent && industriesMap[industry.parent]) {
            industriesMap[industry.parent].children.push(industriesMap[industry.code])
          } else {
            tree.push(industriesMap[industry.code])
          }
        })
        
        this.industries = tree
        this.originalData = JSON.parse(JSON.stringify(tree))
        this.expandedKeys = this.calculateExpandedKeys(tree)
      })
    },
    handleChange(row) {
      // Mark the row as modified
      row.modified = true
    },
    handleConfirm() {
      const modifiedIndustries = []
      
      const traverse = (nodes) => {
        nodes.forEach(node => {
          if (node.modified || node.valuationRisk === null) {
            modifiedIndustries.push({
              code: node.code,
              valuationRisk: node.valuationRisk
            })
          }
          if (node.children && node.children.length) {
            traverse(node.children)
          }
        })
      }
      
      traverse(this.industries)
      
      updateIndustriesRisk(modifiedIndustries).then(() => {
        this.$message.success('行业风险系数保存成功')
        this.fetchData()
      })
    },
    handleReset() {
      this.industries = JSON.parse(JSON.stringify(this.originalData))
    },
    calculateExpandedKeys(nodes) {
      let keys = []
      nodes.forEach(node => {
        // Check if any child has non-null risk value
        const hasChildrenWithRisk = node.children &&
          node.children.some(child => child.valuationRisk !== null ||
            (child.children && this.hasChildrenWithRisk(child.children)))
        
        if (hasChildrenWithRisk) {
          keys.push(node.code)
          if (node.children) {
            keys = keys.concat(this.calculateExpandedKeys(node.children))
          }
        }
      })
      return keys
    },
    
    hasChildrenWithRisk(nodes) {
      return nodes.some(node =>
        node.valuationRisk !== null ||
        (node.children && this.hasChildrenWithRisk(node.children))
      )
    }
  },
  created() {
    this.fetchData()
  }
}
</script>

<style scoped>
.industries-settings-container {
  padding: 20px;
}
.button-group {
  margin-top: 20px;
  text-align: left;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding: 4px 8px 4px 0;
  min-height: 32px;
}
.node-info {
  display: flex;
  align-items: center;
}
.code {
  color: #909399;
  margin: 0 10px;
  font-size: 12px;
}
.level {
  color: #67c23a;
  font-weight: bold;
  margin-right: 10px;
}
</style>