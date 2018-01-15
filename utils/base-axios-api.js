/* global API_HOST */
import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import openNotificationWithIcon from '../src/base/components/Notification'

// 默认配置
axios.defaults.withCredentials = true

const reqInterceptors = {
  config: config => {
    NProgress.start()
    return config
  },
  error: error => Promise.reject(error)
}

const resInterceptors = {
  response: response => {
    NProgress.done()
    return {
      data: response.data,
      status: response.status
    }
  },
  error: error => {
    if (error.response) {
      let result = {
        code: 0,
        status: error.response.status,
        message: error.response.data.tips
      }
      if (error.response.data.tips.includes('token失效') || error.response.data.tips.includes('请重新登录')) {
        result.code = 1
      }
      openNotificationWithIcon('error', result.status, result.message, 3)
      return Promise.resolve(result)
    } else {
      return Promise.reject(error)
    }
  }
}

const configs = {
  baseURL: `${API_HOST}`
}

let instance = axios.create(configs)
instance.interceptors.request.use({ ...reqInterceptors })
instance.interceptors.response.use({ ...resInterceptors })

const AxiosAPI = instance
export default AxiosAPI
