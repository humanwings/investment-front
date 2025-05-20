import request from '@/utils/request'

export function getStrategyList(query) {
  return request({
    url: '/strategy',
    method: 'get',
    params: query
  })
}

export function getStrategy(id) {
  var url  = '/strategy/{id}'
  url = url.restfulFormat({id});
  console.log(url);
  return request({
    url,
    method: 'get',
    params: null
  })
}

export function createStrategy(data) {
  return request({
    url: '/strategy/add',
    method: 'post',
    data
  })
}

export function updateStrategy(data) {
  return request({
    url: '/strategy/update',
    method: 'post',
    data
  })
}

export function updateStrategyName(data) {
  return request({
    url: '/strategy/updateName',
    method: 'post',
    data
  })
}

export function deleteSelectedStrategies(data) {
  return request({
    url: '/strategy/deleteSelected',
    method: 'post',
    data
  })
}

export function deleteStrategy(id) {
  var url  = '/strategy/{id}'
  url = url.restfulFormat({id});
  return request({
    url,
    method: 'delete',
    params: null
  })
}

export function calculateStrategy(id) {
  var url  = '/strategy/{id}'
  url = url.restfulFormat({id});
  return request({
    url,
    method: 'patch',
    params: null
  })
}