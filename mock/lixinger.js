// added by wujian for lixinger api mock
const Mock = require('mockjs')

const company = Mock.mock({
  'items|2': [{
    name : '@cname',
    'exchange' : 'bj',
    'market' : 'a',
    'areaCode' : 'a',
    'stockCode' : '000005',
    'ipoDate': '2023-05-30T16:00:00.000Z',
    'listingStatus' : 'normally_listed',
    'fsType' : 'non_financial'
  }]
})

const nonfin = Mock.mock({
  'items|3': [{
    'date': '2023-09-07T00:00:00+08:00',
    'cmc|800000-100000000' : 1,
    'd_pe_ttm|1-1000.2-2' : 1.11,
    'ecmc_psh|8000-100000' : 1,
    'mc|800000-100000000' : 1,
    'ecmc|800000-100000000' : 1,
    'pb_wo_gw|1-1000.2-2' : 1.11,
    'shn|800-1000000' : 1,
    "stockCode": "600519"
  }]
})

const candlestick = Mock.mock({
  'items|12': [{
    date : '@date',
    'open|8-10.2-2' : 1,
    'close|8-10.2-2' : 1,
    'high|8-10.2-2' : 1,
    'low|8-10.2-2' : 1,
    'volumn|80000-10000000' : 1,
    'amount|800000-100000000' : 1,
    'change|0.4-4' : 1
  }]
})

module.exports = [
  {
    url: '/company/candlestick',
    type: 'post',
    response: config => {
      const candlestickitems = candlestick.items
      return {
        code: 1,
        message:"success",
        data: candlestickitems
      }
    }
  },

  {
    url: '/company/fundamental/non_financial',
    type: 'post',
    response: config => {
      const nonfinitems = nonfin.items
      return {
        code: 1,
        message:"success",
        data: nonfinitems
      }
    }
  },

  {
    url: '/company',
    type: 'post',
    response: config => {
      const companyitems = company.items
      return {
        code: 1,
        message:"success",
        data: companyitems
      }
    }
  }

]
