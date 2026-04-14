import request from '@/utils/request'

export function getRecommendRank(query) {
  return request({
    url: '/recommend/rank',
    method: 'get',
    params: query
  })
}

export function refreshRecommendRank(data) {
  return request({
    url: '/recommend/refresh',
    method: 'post',
    data
  })
}

export function getRecommendDetail(stockCode, query) {
  let url = '/recommend/rank/{stockCode}'
  url = url.restfulFormat({ stockCode })
  return request({
    url,
    method: 'get',
    params: query
  })
}

export function getRecommendAuthors() {
  return request({
    url: '/recommend/author/all',
    method: 'get'
  })
}

export function saveRecommendAuthor(data) {
  return request({
    url: '/recommend/author/save',
    method: 'post',
    data
  })
}

export function getRecommendRawList(query) {
  return request({
    url: '/recommend/raw/all',
    method: 'get',
    params: query
  })
}

export function saveRecommendRaw(data) {
  return request({
    url: '/recommend/raw/save',
    method: 'post',
    data
  })
}

export function deleteRecommendRaw(recId) {
  let url = '/recommend/raw/{recId}'
  url = url.restfulFormat({ recId })
  return request({
    url,
    method: 'delete'
  })
}

export function getRecommendRules() {
  return request({
    url: '/recommend/rule/all',
    method: 'get'
  })
}

export function getRecommendStockByCode(stockCode) {
  let url = '/recommend/stock/{stockCode}'
  url = url.restfulFormat({ stockCode })
  return request({
    url,
    method: 'get'
  })
}

export function saveRecommendRule(data) {
  return request({
    url: '/recommend/rule/save',
    method: 'post',
    data
  })
}
