<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>行业风险系数设置</span>
      </div>

      <el-tree
        :data="industriesTree"
        node-key="code"
        :props="treeProps"
        :expand-on-click-node="false"
        :default-expanded-keys="defaultExpandedKeys"
        style="width: 50%"
      >
        <template #default="{ data }">
          <span class="custom-tree-node">
            <span :style="{ color: getRiskColor(data.valuationRisk) }">{{ data.name }}</span>
            <span style="margin-left: 7px" :style="{ color: getRiskColor(data.valuationRisk) }">
              <el-input-number
                v-model="data.valuationRisk"
                :precision="2"
                :step="0.1"
                :min="0"
                size="mini"
                style="width: 120px"
              ></el-input-number>
            </span>
          </span>
        </template>
      </el-tree>

      <div style="margin-top: 20px; text-align: center">
        <el-button type="primary" @click="handleSubmit">保存</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getIndustriesSettings, updateIndustriesSettings } from '@/api/settings'

export default {
  name: 'IndustriesSettings',
  data() {
    return {
      industries: [],
      defaultExpandedKeys: [],
      treeProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  computed: {
    industriesTree() {
      // 构建树形结构
      const industriesMap = {}
      this.industries.forEach(item => {
        industriesMap[item.code] = { ...item }
      })

      const tree = []
      this.industries.forEach(item => {
        if (item.level === 1) {
          tree.push(industriesMap[item.code])
        } else if (industriesMap[item.parent]) {
          if (!industriesMap[item.parent].children) {
            industriesMap[item.parent].children = []
          }
          industriesMap[item.parent].children.push(industriesMap[item.code])
        }
      })

      return tree
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    getRiskColor(risk) {
      if (risk === null || risk === undefined || risk === 1) {
        return 'inherit'
      }
      return risk > 1 ? '#409EFF' : '#F56C6C'
    },
    hasNonDefaultRisk(node) {
      if (!node.children) {
        return false
      }
      return node.children.some(child => {
        if (child.valuationRisk !== 1 && child.valuationRisk !== null) {
          return true
        }
        return this.hasNonDefaultRisk(child)
      })
    },
    setDefaultExpandedKeys() {
      const expandedKeys = new Set()
      
      // Build tree structure for easier traversal
      const industriesMap = {}
      this.industries.forEach(item => {
        industriesMap[item.code] = { ...item }
      })
      
      // Build parent-child relationships
      this.industries.forEach(item => {
        if (item.level !== 1 && industriesMap[item.parent]) {
          if (!industriesMap[item.parent].children) {
            industriesMap[item.parent].children = []
          }
          industriesMap[item.parent].children.push(industriesMap[item.code])
        }
      })
      
      // Find nodes to expand
      this.industries.forEach(item => {
        const node = industriesMap[item.code]
        if (this.hasNonDefaultRisk(node)) {
          expandedKeys.add(item.code)
        }
      })
      
      // Expand parent nodes of expanded nodes
      this.industries.forEach(item => {
        if (expandedKeys.has(item.code) && item.parent) {
          expandedKeys.add(item.parent)
        }
      })
      
      this.defaultExpandedKeys = Array.from(expandedKeys)
    },
    fetchData() {
      getIndustriesSettings().then(response => {
        if (response && response.data && response.data.industries) {
          this.industries = response.data.industries.map(item => {
            if (item.valuationRisk === null || item.valuationRisk === undefined) {
              item.valuationRisk = 1.00
            }
            return item
          })
          this.setDefaultExpandedKeys()
        } else {
          this.$message.error('获取行业数据为空')
        }
      }).catch(error => {
        console.error('Failed to fetch industries settings:', error)
        this.$message.error('获取行业设置失败')
      })
    },
    handleSubmit() {
      // 从 industriesTree 收集实际修改过的行业
      const collectModifiedIndustries = (nodes, originalData) => {
        let result = [];
        nodes.forEach(node => {
          const original = originalData.find(item => item.code === node.code);
          // 只收集风险值有变化的行业
          if (node.valuationRisk !== null && 
              (original?.valuationRisk !== node.valuationRisk)) {
            result.push({
              code: node.code,
              valuationRisk: node.valuationRisk
            });
          }
          if (node.children) {
            result = result.concat(collectModifiedIndustries(node.children, originalData));
          }
        });
        return result;
      };
      
      const industriesToUpdate = collectModifiedIndustries(this.industriesTree, this.industries);
      console.log('准备更新的数据:', JSON.stringify(industriesToUpdate, null, 2));

      updateIndustriesSettings(industriesToUpdate).then(() => {
        this.$message.success('保存成功')
        // 保存成功后刷新数据
        this.fetchData()
      }).catch((error) => {
        console.error('保存失败:', error)
        this.$message.error('保存失败: ' + (error.message || '未知错误'))
      })
    },
    handleReset() {
      this.fetchData()
    }
  }
}
</script>

<style scoped>
.box-card {
  margin: 20px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 20px;
}
</style>
