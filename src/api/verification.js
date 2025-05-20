import request from '@/utils/request'

export function getVerification(id) {
  return request({
    url: `/verification/${id}`,
    method: 'get',
    params: null
  })
}

export function getComparison(data) {
  return request({
    url: '/verification/compare',
    method: 'post',
    data
  })
}