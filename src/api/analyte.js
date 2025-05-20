import request from '@/utils/request'

export function getAnalyteList(query) {
  return request({
    url: '/analyte/all',
    method: 'get',
    params: query
  })
}

export function getDonePage(query) {
  return request({
    url: '/analyte/done',
    method: 'get',
    params: query
  })
}

export function getWaitList(query) {
  return request({
    url: '/analyte/wait',
    method: 'get',
    params: query
  })
}

export function getAnalyte(id) {
  var url  = '/analyte/{id}'
  url = url.restfulFormat({id});
  return request({
    url,
    method: 'get',
    params: null
  })
}

export function createAnalyte(data) {
  return request({
    url: '/analyte/add',
    method: 'post',
    data
  })
}

export function updateAnalyte(data) {
  return request({
    url: '/analyte/update',
    method: 'post',
    data
  })
}

export function updateSpecial(data) {
  return request({
    url: '/analyte/updateSpecial',
    method: 'post',
    data
  })
}

export function deleteAnalyte(id) {
  var url  = '/analyte/{id}'
  url = url.restfulFormat({id});
  console.log(url);
  return request({
    url,
    method: 'delete',
    params: null
  })
}
