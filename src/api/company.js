import request from '@/utils/request'

export function getCompanyList(query) {
  return request({
    url: '/company/all',
    method: 'get',
    params: query
  })
}

export function getCompany(id) {
  var url  = '/company/{id}'
  url = url.restfulFormat({id});
  return request({
    url,
    method: 'get',
    params: null
  })
}

export function addCompany(data) {
  return request({
    url: '/company/add',
    method: 'post',
    data
  })
}

export function recalculate(data) {
  return request({
    url: '/company/recalculate',
    method: 'post',
    data
  })
}

export function reValuateAll() {
  return request({
    url: '/company/reValuateAll',
    method: 'post',
    data:null
  })
}

export function deleteCompany(id) {
  var url  = '/company/{id}'
  url = url.restfulFormat({id});
  console.log(url);
  return request({
    url,
    method: 'delete',
    params: null
  })
}

export function updatePrice(id) {
  var url  = '/company/{id}'
  url = url.restfulFormat({id});
  return request({
    url,
    method: 'patch',
    params: null
  })
}

export function updatePriceAll() {
  return request({
    url: '/company/updatePriceAll',
    method: 'post',
    data:null
  })
}

export function updateReport(data) {
  return request({
    url: '/company/updateReport',
    method: 'post',
    data
  })
}

export function updateGrowthRate(data) {
  return request({
    url: '/company/updateGrowthRate',
    method: 'post',
    data
  })
}


