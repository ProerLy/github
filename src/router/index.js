
import Vue from 'vue'
import Router from 'vue-router'
import { Message } from 'element-ui';

Vue.use(Router);
const router = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/login',
      component: () => import('@/components/login/loginPage'),
      meta: {
        title: '登录'
      }
    },
    {
      path: '/home',
      component: () => import('@/components/home/homePage'),
      redirect: '/house',
      meta: {
        title: '后台管理'
      },
      children: [
        {
          path: '/house',
          component: () => import('@/components/home/item/helloPage'),
          meta: {
            title: '首页'
          }
        },
        {
          path: '/users',
          component: () => import('@/components/home/item/userControl'),
          meta: {
            title: '用户列表'
          }
        },
        {
          path: '/roles',
          component: () => import('@/components/home/item/rolesPage'),
          meta: {
            title: '角色列表'
          }
        },
        {
          path: '/rights',
          component: () => import('@/components/home/item/rightsPage'),
          meta: {
            title: '权限列表'
          }
        },
        {
          path: '/goods',
          component: () => import('@/components/home/item/goodsPage'),
          meta: {
            title: '商品列表'
          },
          children: [
            {
              path: '/goods/add',
              component: () => import('@/components/home/item/item/addPage'),
              meta: {
                title: '添加商品'
              }
            },
            {
              path: '/goods/edit',
              component: () => import('@/components/home/item/item/editPage'),
              meta: {
                title: '编辑商品'
              }
            }
          ]
        },
        {
          path: '/params',
          component: () => import('@/components/home/item/paramsPage'),
          meta: {
            title: '分类参数'
          }
        },
        {
          path: '/categories',
          component: () => import('@/components/home/item/categoriesPage'),
          meta: {
            title: '商品分类'
          }
        },
        {
          path: '/orders',
          component: () => import('@/components/home/item/ordersPage'),
          meta: {
            title: '订单列表'
          }
        },
        {
          path: '/reports',
          component: () => import('@/components/home/item/reportsPage'),
          meta: {
            title: '数据报表'
          }
        }
      ]
    },
    {
      path: '/',
      redirect: '/login'
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  // 判断当前页面地址是否是login，是则通过
  if (to.path === '/login') return next();
  // 获取登录页面保存的token
  const tokener = JSON.parse(window.sessionStorage.getItem('user'))?.token;
  // 判断是否存在token，没有则停止后面的运行，并且跳转到登录页面
  if (!tokener) {
    // 提示
    Message.error('请登录~');
    return next({
      path: '/login'
    });
  }
  // 有token则通过
  next();
})

export default router