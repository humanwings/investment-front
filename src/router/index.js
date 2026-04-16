import Vue from 'vue'
import Router from 'vue-router'

console.log('----------router/index.js start ----------')
Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '/barginhunting',
    component: Layout,
    // redirect: '/Barginhunting/analyte',
    name: 'Barginhunting',
    meta: { title: 'Bargin Hunting', icon: 'el-icon-s-help' },
    children: [
      {
        path: '/analyte',
        name: 'Analyte',
        component: () => import('@/views/dami'),
        meta: { title: '数据分析' },
        children: [
          {
            path: 'waitlist',
            component: () => import('@/views/analyte/waitlist'),
            name: 'waitlist',
            meta: { title: '新数据' }
          },
          {
            path: 'donelist',
            component: () => import('@/views/analyte/donelist'),
            name: 'donelist',
            meta: { title: '历史数据' }
          },
          {
            path: 'verification/:id',
            component: () => import('@/views/analyte/verification'),
            name: 'verificationById',
            hidden: true,
            meta: { title: '数据验证' }
          },
          {
            path: 'verification/compare',
            component: () => import('@/views/analyte/verificationcomparison'),
            name: 'verificationCompare',
            hidden: true,
            meta: { title: '验证结果比较' }
          }
        ]
      },
      {
        path: '/strategy',
        name: 'Strategy',
        component: () => import('@/views/dami'),
        meta: { title: '策略设置' },
        children: [
          {
            path: 'strategylist',
            component: () => import('@/views/strategy/strategylist'),
            name: 'strategylist',
            meta: { title: '策略一览' }
          },
          {
            path: 'strategyadd',
            component: () => import('@/views/strategy/strategyedit'),
            name: 'strategyadd',
            meta: { title: '策略建立' }
          },
          {
            path: 'strategyedit/:id',
            component: () => import('@/views/strategy/strategyedit'),
            name: 'strategyedit',
            hidden: true,
            meta: { title: '策略编辑' }
          }
        ]
      }
    ]
  },

  {
    path: '/companyvaluation',
    component: Layout,
    name: 'CompanyValuation',
    meta: { title: 'Company Valuation', icon: 'el-icon-s-help' },
    children: [
      {
        path: '/valuation',
        name: 'valuation',
        component: () => import('@/views/dami'),
        meta: { title: 'Company Valuation' },
        children: [
          {
            path: 'company',
            component: () => import('@/views/valuation/companylist'),
            name: 'company',
            meta: { title: '公司列表' }
          },
          {
            path: 'profit-discount',
            component: () => import('@/views/valuation/profitdiscountlist'),
            name: 'profitdiscountlist',
            meta: { title: '利润贴现一览' }
          },
          {
            path: 'dcf',
            component: () => import('@/views/valuation/dcflist'),
            name: 'dcflist',
            meta: { title: 'DCF一览' }
          },
          {
            path: 'company/:id',
            component: () => import('@/views/valuation/companydetail'),
            name: 'companydetail',
            hidden: true,
            meta: { title: '公司总览' }
          },
          {
            path: 'recommend',
            component: () => import('@/views/recommend/rank'),
            name: 'recommendrank',
            meta: { title: '大V推荐排行' }
          },
          {
            path: 'recommend/:stockCode',
            component: () => import('@/views/recommend/detail'),
            name: 'recommenddetail',
            hidden: true,
            meta: { title: '推荐详情' }
          }
        ]
      },
      {
        path: '/settings',
        name: 'Settings',
        component: () => import('@/views/dami'),
        meta: { title: '参数设置' },
        children: [
          {
            path: 'macrosettings',
            component: () => import('@/views/valuation/macrosettings'),
            name: 'macrosettings',
            meta: { title: '宏观参数' }
          },
          {
            path: 'industrysettings',
            component: () => import('@/views/valuation/industrysettings'),
            name: 'industrysettings',
            meta: { title: '行业参数' }
          },
          {
            path: 'recommendauthors',
            component: () => import('@/views/settings/kvmanage'),
            name: 'recommendauthors',
            meta: { title: '大V管理' }
          },
          {
            path: 'recommendrules',
            component: () => import('@/views/settings/kvrules'),
            name: 'recommendrules',
            meta: { title: '推荐权重规则' }
          }
        ]
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
