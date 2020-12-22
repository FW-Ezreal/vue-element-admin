import Vue from 'vue'
import axios from 'axios'
import { getCookie } from './utils'

// let httpCode = {        //这里我简单列出一些常见的http状态码信息，可以自己去调整配置
//   400: '请求参数错误',
//   401: '权限不足, 请重新登录',
//   403: '服务器拒绝本次访问',
//   404: '请求资源未找到',
//   500: '内部服务器错误',
//   501: '服务器不支持该请求中使用的方法',
//   502: '网关错误',
//   504: '网关超时'
// }
let curLoginState = true;

const toLogin = () => {
  const appid = process.env.VUE_APP_appid; // 必要参数，会校验 appid 是否已经在权限后台配置；
  const redirectUrl = process.env.VUE_APP_redirectUrl; // 必要参数，而且会对授权域名进行校验
  const callbackUrl = process.env.VUE_APP_callbackUrl; // 该参数不是必要
  const url = `http://ucenter.kuwo-inc.com/authorize?appid=${ appid }&redirectUrl=${ redirectUrl }&callbackUrl=${ callbackUrl }`
  window.location.href = url;
}

function generateUrlWithParams(url, params) {
  var urlParams = [];
  for (var key in params) {
    if (params[key]) {
      urlParams.push(`${key}=${params[key]}`)
    }
  }
  url += '?' + urlParams.join('&');
  return url
}

export const get = (url, params, config = {defaultMsg: true}) => {
  return new Promise((resolve, reject) => {
    const sessionId = getCookie('sessionId')
    const headers = Object.assign({
      Authorization: `Bearer ${sessionId}`
    }, config.headers);
    axios({
      method: config.method || 'get',
      url,
      params,
      ...config,
      headers
    }).then(res => {
      const notLogin = [4000, 4001, 404].indexOf(res.data.code) > -1;
      // 什么时候登录成功，在设置全局状态
      if (!notLogin) {
        curLoginState = true;
      }
      // 未登录拦截
      if (!curLoginState) return;

      if (res.data && notLogin && curLoginState) {
        curLoginState = false;
        Vue.prototype.$message.error('登录状态失效，请重新登录~');
        toLogin()
      } else if (res.status === 200) {
        if (res.data.code != 200 && config.defaultMsg) {
          Vue.prototype.$message.error( res.data && res.data.msg || '请求失败，请稍后再试~');
        }
        resolve(res.data)
      } else {
        Vue.prototype.rrouter.push('/error')
      }
    }).catch(error => {
      Vue.prototype.$message.error( error.msg || '请求失败，请稍后再试~');
      reject(error)
    })
  })
}

const disposeRequire = (config, conf, data, resolve, reject) => {
  if (config.paramsInUrl) {
    conf.url = generateUrlWithParams(conf.url, data)
  } else {
    conf.data = data
  }

  axios(conf).then(res => {
    const notLogin = [4000, 4001].indexOf(res.data.code) > -1;
    if (notLogin) {
      toLogin()
    }
    if (res.status === 200) {
      if (res.data.code != 200) {
        Vue.prototype.$message.error( res.data && res.data.msg || '请求失败，请稍后再试~');
      }
      resolve(res.data)
    } else {
      //跳往错误页面
    }
  }).catch(error => {
    Vue.prototype.$message.error( error.msg || '请求失败，请稍后再试~');
    reject(error)
  })
}

export const post = (url, data, config = {}) => {
  return new Promise((resolve, reject) => {
    const sessionId = getCookie('sessionId');
    const headers = Object.assign({
      Authorization: `Bearer ${sessionId}`
    }, config.headers);
    const conf = {
      method: config.method || 'post',
      url,
      ...config,
      headers
    }
    disposeRequire(config, conf, data, resolve, reject);
  })
}

export const put = (url, data, config = {}) => {
  return new Promise((resolve, reject) => {
    const sessionId = getCookie('sessionId');
    const headers = Object.assign({
      Authorization: `Bearer ${sessionId}`
    }, config.headers);
    const conf = {
      method: config.method || 'put',
      url,
      ...config,
      headers
    }
    disposeRequire(config, conf, data, resolve, reject);
  })
}

export const deleteAxios = (url, data, config = {}) => {
  return new Promise((resolve, reject) => {
    const sessionId = getCookie('sessionId');
    const headers = Object.assign({
      Authorization: `Bearer ${sessionId}`
    }, config.headers);
    const conf = {
      method: config.method || 'delete',
      url,
      ...config,
      headers
    }
    disposeRequire(config, conf, data, resolve, reject);
  })
}
