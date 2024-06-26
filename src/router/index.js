// Composables
import { createRouter, createWebHistory } from 'vue-router';
import { getToken } from '@/utils/setToken.js';
import { useUserStore } from '@/store/user';
import NavComponentVue from '@/views/NavComponent.vue';
import EsriMapViewVue from '@/components/EsriMapView.vue';

export const staticRoutes = [
  {
    path: '/',
    name: 'home',
    components: {
      nav: NavComponentVue,
      map: EsriMapViewVue,
      default: () => import('@/views/HomeView.vue')
    },
    meta: {
      title: '首页'
    }
  },
  {
    path: '/Navigation',
    name: 'Navigation',
    components: {
      nav: NavComponentVue,
      map: EsriMapViewVue,
      default: () => import('@/views/NavigationView.vue')
    },
    meta: {
      title: '导航'
    }
  },
  {
    path: '/Evaluate',
    name: 'Evaluate',
    components: {
      nav: NavComponentVue,
      map: EsriMapViewVue,
      default: () => import('@/views/EvaluateView.vue')
    },
    meta: {
      title: '评价',
      requiresAuth: true
    },
    children: [
      {
        path: 'ThermalMap',
        name: 'ThermalMap',
        component: () => import('@/views/Evaluate/ThermalMap.vue'),
        meta: {
          title: '热力图分析',
          requiresAuth: true
        }
      },
      {
        path: 'BufferAnalyst',
        name: 'BufferAnalyst',
        component: () => import('@/views/Evaluate/BufferAnalyst.vue'),
        meta: {
          title: '缓冲区分析',
          requiresAuth: true
        }
      },
      {
        path: 'CompareAnalyst',
        name: 'CompareAnalyst',
        component: () => import('@/views/Evaluate/CompareAnalyst.vue'),
        meta: {
          title: '对比分析',
          requiresAuth: true
        }
      },
      {
        path: 'POIAnalysis',
        name: 'POIAnalysis',
        component: () => import('@/views/Evaluate/POIAnalysis.vue'),
        meta: {
          title: 'POI分析',
          requiresAuth: true
        }
      },
      {
        path: 'RegionAnalysis',
        name: 'RegionAnalysis',
        component: () => import('@/views/Evaluate/RegionAnalysis.vue'),
        meta: {
          title: '区域统计',
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/AddFacility',
    name: 'AddFacility',
    components: {
      nav: NavComponentVue,
      map: EsriMapViewVue,
      default: () => import('@/views/AddFacility.vue')
    },
    meta: {
      title: '添加无障碍设施',
      requiresAuth: true
      // isAdmin: true
    }
  },
  {
    path: '/Manage',
    name: 'Manage',
    components: {
      nav: NavComponentVue,
      map: EsriMapViewVue,
      default: () => import('@/views/Manage.vue')
    },
    meta: {
      title: '管理中心',
      requireAuth: true,
      isAdmin: true
    }
  },
  {
    path: '/UserInfo',
    name: 'UserInfo',
    components: {
      nav: NavComponentVue,
      map: EsriMapViewVue,
      default: () => import('@/views/UserInfo.vue')
    },
    meta: {
      title: '用户中心',
      requiresAuth: true
    },
    children: [
      {
        path: 'Info',
        name: 'Info',
        component: () => import('@/views/UserInfo/Info.vue'),
        meta: {
          title: '用户信息',
          requiresAuth: true
        }
      },
      {
        path: 'Feedback',
        name: 'Feedback',
        component: () => import('@/views/UserInfo/Feedback.vue'),
        meta: {
          title: '问题反馈',
          requiresAuth: true
        }
      },
      {
        path: 'History',
        name: 'History',
        component: () => import('@/views/UserInfo/History.vue'),
        meta: {
          title: '反馈记录',
          requiresAuth: true
        }
      }
      // {
      //   path: 'AddFacility',
      //   name: 'AddFacility',
      //   component: () => import('@/views/AddFacility.vue'),
      //   meta: {
      //     title: '添加无障碍设施',
      //     requiresAuth: true
      //   }
      // }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/components/Login.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/components/Register.vue'),
    meta: {
      title: '注册'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    components: {
      // nav: NavComponentVue,
      default: () => import('@/components/NotFound.vue')
    },
    meta: {
      title: 'NotFound'
    }
  }
];

export const dynamicRoutes = [
  {
    path: '/DataCenter',
    name: 'DataCenter',
    components: {
      // nav: NavComponentVue,
      map: EsriMapViewVue,
      default: () => import('@/views/DataCenter.vue')
    },
    meta: {
      title: '数据中心',
      requiresAuth: true,
      isAdmin: true
    }
  },
  {
    path: '/Manage',
    name: 'Manage',
    components: {
      // nav: NavComponentVue,
      map: EsriMapViewVue,
      default: () => import('@/views/Manage.vue')
    },
    meta: {
      title: '管理中心',
      requireAuth: true,
      isAdmin: true
    }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: staticRoutes
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const accessToken = getToken('token');
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // 需要登录的页面，检查是否有token
    if (userStore.isLoggedIn) {
      // 已登录，继续导航
      next();
    } else {
      // 未登录，跳转到登录页面
      next({ name: 'login', query: { redirect: to.name } });
    }
  } else {
    // 不需要登录的页面，继续导航
    next();
  }
});

export default router;
