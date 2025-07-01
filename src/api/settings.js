import request from '@/utils/request'

export function getMacroSettings() {
  return request({
    url: '/api/settings/macro/all',
    method: 'get'
  })
}

export function updateMacroSettings(settings) {
  return request({
    url: '/api/settings/macro/batch',
    method: 'post',
    data: settings
  })
}

export function getIndustriesWithRisk() {
  return request({
    url: '/api/settings/industries/all',
    method: 'get'
  })
}

export function updateIndustriesRisk(industries) {
  return request({
    url: '/api/settings/industries/batch',
    method: 'post',
    data: industries
  })
}