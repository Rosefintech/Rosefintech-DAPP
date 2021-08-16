import Vue from 'vue';
import Router from 'vue-router';
import { pending } from '@/tool/http';

Vue.use(Router);

const routes = [
  {
    path: '/',
    redirect: '/index',
  },
  {
    path: '/index', 
    name: 'Index',
    component:  () => import(/* webpackChunkName: "home" */'@/views/index.vue'),
  },
  {
    path: '/asset', 
    name: 'Asset',
    meta: {
      whiteList: ['Falco', 'rFalco', 'ROS', 'Swift']
    },
    component: () =>
      import(/* webpackChunkName: "asset" */ '@/views/assets/assetDetail.vue'),
  },
  {
    path: '/swap', 
    name: 'Swap',
    meta: {
      whiteList: ['ROS']
    },
    component: () =>
      import(/* webpackChunkName: "asset" */ '@/views/assets/assetSwap.vue'),
  },
  {
    path: '/mining', 
    name: 'Mining',
    meta: {
      whiteList: ['ROS']
    },
    component: () =>
      import(
        /* webpackChunkName: "asset" */ '@/views/assets/assetMining.vue'
      ),
  },
  {
    path: '/mining-withdraw', 
    name: 'MiningWithdraw',
    component: () =>
      import(
        /* webpackChunkName: "asset" */ '@/views/assets/assetMiningWithdraw.vue'
      ),
  },
  {
    path: '/transfer', 
    name: 'Transfer',
    meta: {
      whiteList: ['Falco', 'rFalco', 'ROS']
    },
    component: () =>
      import(
        /* webpackChunkName: "asset" */ '@/views/assets/assetTransfer.vue'
      ),
  },
  {
    path: '/receipt', 
    name: 'Receipt',
    meta: {
      whiteList: ['Falco', 'rFalco', 'ROS', 'Swift']
    },
    component: () =>
      import(
        /* webpackChunkName: "asset" */ '@/views/assets/assetReceipt.vue'
      ),
  },
  {
    path: '/finance-list', 
    name: 'FinanceList',
    component: () =>
      import(
        /* webpackChunkName: "home" */ '@/views/financial/financeList.vue'
      ),
  },
  {
    path: '/falco-mine', 
    name: 'FalcoMine',
    component: () =>
      import(
        /* webpackChunkName: "falco" */ '@/views/financial/falcoMine.vue'
      ),
  },
  {
    path: '/falco-detail', 
    name: 'FalcoDetail',
    component: () =>
      import(
        /* webpackChunkName: "falco" */ '@/views/financial/falcoDetail.vue'
      ),
  },
  {
    path: '/swift-mine', 
    name: 'SwiftMine',
    component: () =>
      import(
        /* webpackChunkName: "rose" */ '@/views/financial/swiftMine.vue'
      ),
  },
  {
    path: '/swift-detail', 
    name: 'SwiftDetail',
    component: () =>
      import(
        /* webpackChunkName: "rose" */ '@/views/financial/swiftDetail.vue'
      ),
  },
  {
    path: '/auto-fund', 
    name: 'AutoFund',
    component: () =>
      import(
        /* webpackChunkName: "rose" */ '@/views/financial/autoFund.vue'
      ),
  },
  {
    path: '/redemption', 
    name: 'Redemption',
    component: () =>
      import(
        /* webpackChunkName: "rose" */ '@/views/financial/redemption.vue'
      ),
  },
  {
    path: '/guide', 
    name: 'Guide',
    component: () =>
      import(/* webpackChunkName: "guide" */ '@/views/guide.vue'),
  },
  {
    path: '/message', 
    name: 'Message',
    component: () =>
      import(/* webpackChunkName: "guide" */ '@/views/message.vue'),
  },
  {
    path: '*',
    redirect: '/index',
  },
]

const router = new Router({
  mode: 'history',
  
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
  routes,
});


router.beforeEach((to, from, next) => {
  
  if (pending.length > 0) {
    pending.forEach((http) => {
      http.cancel('Canceled');
    });
  }
  
  const whiteList = ['/guide', '/index']
  const address = localStorage.getItem('address');
  if (whiteList.includes(to.path) || address) {
    next();
  } else {
    next({ path: '/index' });
  }
});

export default router;
