import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'
import store from './store'
import { Message } from 'element-ui'


NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // 第一种登录方式
  // token 授权协议接入
  // store.dispatch('checkSession');


  // 第二种登录方式
  // 采用泛域名共享session的登录方式

  // 校验权限开始
  const userInfo = await store.dispatch('checkLogin')
  if (to.path === '/401') {
    next()
  } else if (userInfo && userInfo._id) {
    if (userInfo.sudo == 1 || userInfo.access.includes(10021)) {
      next()
    } else {
      Message.error('暂无权限');
      next('/401')
    }
  } else {
    const redirectUrl = encodeURIComponent(window.location.href);
    window.location.href = `http://ucenter.kuwo-inc.com/login?redirectUrl=${redirectUrl}`;
  }

})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
