import request from '@/utils/request'

export function getMacroSettings() {
  return request({
    url: '/settings/macrosettings',
    method: 'get'
  })
}

export function updateMacroSettings(data) {
  return request({
    url: '/settings/macrosettings',
    method: 'post',
    data: {
      usdToCny: data.usdToCny,
      hkdToCny: data.hkdToCny,
      marketRisk: data.marketRisk,
      discountRate: data.discountRate,
      perpetualGrowth: data.perpetualGrowth,
      netAssetRatio: data.netAssetRatio,
      hkDiscount: data.hkDiscount
    }
  })
}

// 新增：获取行业风险列表（包含valuationRisk和parent字段）
export function getIndustryRiskList() {
  return request({
    url: '/settings/industry-risk',  // 假设后台接口路径
    method: 'get'
  })
}

export function updateIndustryRisk(updates) {
  return request({
    url: '/settings/industry-risk',
    method: 'post',
    data: updates
  })
}