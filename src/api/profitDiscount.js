import request from '@/utils/request'

export function getProfitDiscountList() {
  return request({
    url: '/profitDiscount/list',
    method: 'get'
  })
}

export function updateProfitDiscountGrowthRate(data) {
  return request({
    url: '/profitDiscount/growthRate',
    method: 'post',
    data
  })
}

export function batchUpdateProfitDiscountGrowthRate(data) {
  return request({
    url: '/profitDiscount/growthRate/batch',
    method: 'post',
    data
  })
}

export function resetProfitDiscountGrowthRate(data) {
  return request({
    url: '/profitDiscount/growthRate/reset',
    method: 'post',
    data
  })
}
