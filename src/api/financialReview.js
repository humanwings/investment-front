import request from '@/utils/request'

export function getFinancialReview(companyId) {
  return request({
    url: `/financialReview/${companyId}`,
    method: 'get'
  })
}
