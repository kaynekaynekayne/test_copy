import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'root',
      component: require('@/components/LoginPage').default
    },
    {
      path: '/loginPage',
      name: 'loginPage',
      component: require('@/components/LoginPage').default
    },
    {
      path: '/homePage',
      name: 'homePage',
      component: require('@/components/HomePage').default,
      children: [
        {
          path: 'test',
          component: require('@/components/TabPages/TestPage').default
        },
        {
          path: 'result',
          component: require('@/components/TabPages/ResultPage').default
        },
        {
          path: 'resultClassification/:orderNo',
          name: 'resultClassification',
          component: require('@/components/TabPages/resultClassification').default,
          children: [
            {
              path: 'finalReport',
              component: require('@/components/TabPages/result/FinalReport').default
            },
            {
              path: 'rbcReport',
              component: require('@/components/TabPages/result/RbcReport').default
            },
            {
              path: 'wbcReport',
              component: require('@/components/TabPages/result/WbcReport').default
            },
            {
              path: 'wholeSlideReport',
              component: require('@/components/TabPages/result/WholeSlideReport').default
            }
          ]
        },
        {
          path: 'settings',
          component: require('@/components/TabPages/SettingsPage').default
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
