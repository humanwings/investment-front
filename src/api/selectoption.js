import request from '@/utils/request'

export function getStrategyOption() {
  return request({
    url: '/selectOption/strategyList',
    method: 'get',
    params: null
  })
}
