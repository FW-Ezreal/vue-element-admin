import { getCookie, getQueryString, setCookie } from '@/utils/utils'
import { get } from '../../utils/request'
const state = {
  userInfo: {}
}

const mutations = {
  setUserInfo(state, data) {
    state.userInfo = data || {}
  }
}
const actions = {
  async checkSession(state) {
    const sessionId = getQueryString('sessionId') || getCookie('sessionId')
    if (sessionId) {
      setCookie('sessionId', sessionId)
      await state.dispatch('getUserInfo', sessionId)
    } else {
      const appid = process.env.VUE_APP_appid // 必要参数，会校验 appid 是否已经在权限后台配置；
      const redirectUrl = process.env.VUE_APP_redirectUrl // 必要参数，而且会对授权域名进行校验
      const callbackUrl = process.env.VUE_APP_callbackUrl // 该参数不是必要
      const url = `http://ucenter.kuwo-inc.com/authorize?appid=${appid}&redirectUrl=${redirectUrl}&callbackUrl=${callbackUrl}`
      // console.log(process.env, url)
      window.location.href = url
    }
  },
  async getUserInfo(state, sessionId) {
    const res = await get('/openapi/v1/fmcms/sys/userInfo', {}, {
      headers: {
        Authorization: `Bearer ${sessionId}`
      }
    })
    if (res.code === 200) {
      state.commit('setUserInfo', res.data)
    }
  }
}

export default {
  state,
  mutations,
  actions
}
