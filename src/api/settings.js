import request from '@/utils/request'

export function getMacroSettings() {
  return request({
    url: '/api/macroSettings',
    method: 'get'
  }).then(response => {
    if (response.success) {
      return response.data.settings
    }
    return Promise.reject(new Error(response.message || 'Error'))
  })
}

export function updateMacroSettings(data) {
  return request({
    url: '/api/macroSettings',
    method: 'post',
    data
  }).then(response => {
    if (response.success) {
      return response
    }
    return Promise.reject(new Error(response.message || 'Error'))
  })
}

export function getIndustriesSettings() {
  return request({
    url: '/api/industriesSettings',
    method: 'get'
  })
}

export function updateIndustriesSettings(data) {
  return request({
    url: '/api/industriesSettings',
    method: 'post',
    data
  }).then(response => {
    if (response.success) {
      return response
    }
    return Promise.reject(new Error(response.message || 'Error'))
  })
}
