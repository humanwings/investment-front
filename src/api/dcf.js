import request from '@/utils/request'

export function getDcfList() {
  return request({
    url: '/dcf/list',
    method: 'get'
  })
}

export function getDcfDetail(companyId) {
  return request({
    url: `/dcf/${companyId}`,
    method: 'get'
  })
}

export function updateDcfAssumption(data) {
  return request({
    url: '/dcf/assumption',
    method: 'post',
    data
  })
}
