import _ from 'lodash'
import { browserHistory } from 'react-router'

import BaseAxiosAPI from './../../../utils/base-axios-api'

// ------------------------------------
// Constants
// ------------------------------------
const RECEIVE_LOGIN = 'RECEIVE_LOGIN'
const REQUEST_LOGIN = 'REQUEST_LOGIN'
const REQUEST_ERR = 'REQUEST_ERR'
const ONCE = 'ONCE'
const SIGN_OUT = 'SIGN_OUT'

const RECEIVE_PURVIEW = 'RECEIVE_PURVIEW'
const REQUEST_PURVIEW = 'REQUEST_PURVIEW'

const BASE_KEEPING = 'BASE_KEEPING'

// ------------------------------------
// Actions
// ------------------------------------
function requestLogin() {
  return { type: REQUEST_LOGIN }
}
function receiveLogin(data) {
  return { type: RECEIVE_LOGIN, data: data }
}
function requestErr(data) {
  return { type: REQUEST_ERR, data: data }
}
function signOut() {
  sessionStorage.removeItem('hoolai')
  browserHistory.push('/')
  return { type: SIGN_OUT }
}
function onceLogin() {
  return { type: ONCE }
}
function requestPurview() {
  return { type: RECEIVE_PURVIEW }
}
function keepBase(data) {
  return {
    type: BASE_KEEPING,
    payload: data
  }
}
/**
 * [receivePurview 权限数据]
 * @param  {[type]} data [object]
 * @return {[type]}      [pbject]
 */
function receivePurview(data) {
  let purviews = {}
  let subMenu = {}
  let subMenus = []
  let curd = {}
  let authorize = []
  let rootMenus = []
  _.forEach(data, function(value, key) {
    // console.log(value)
    if (_.has(value, 'id') && value.level === 1) {
      purviews[value.id] = value
      purviews[value.id].subMenu = []
    }
  })

  _.forEach(data, function(value, key) {
    if (_.has(value, 'parent') && value.level === 2) {
      value.curd = []
      purviews[value.parent].subMenu.push(value)
      subMenus.push(value.id)
      subMenu[value.id] = value
    }
    if (value.level === 1 && value.parent === 0) {
      rootMenus.push(value.id)
    }
  })

  _.forEach(data, function(value, key) {
    if (value.level === 3) {
      curd[value.id] = value
      subMenu[value.parent].curd.push(value)
    }
  })

  _.forEach(data, function(value, key) {
    authorize.push(value.id)
  })

  sessionStorage.setItem('subMenu', JSON.stringify(subMenus))
  sessionStorage.setItem('rootMenu', JSON.stringify(rootMenus))

  return {
    type: REQUEST_PURVIEW,
    data: {
      purviews,
      curd,
      subMenu,
      authorize
    }
  }
}

/**
 * [isLoginActionCreator 登录异步请求]
 * @param  {Object}  [value={}] [表单]
 * @return {Boolean}            [action]
 */
function isLoginActionCreator(value = {}) {
  return (dispatch, getState) => {
    // 验证从复提交
    if (getState().islogin.fetching) return
    dispatch(requestLogin())
    let url = '/signin'
    let data = {
      username: value.userName,
      password: value.password
    }
    BaseAxiosAPI
      .post(url, data)
      .then(result => {
        const { status, data } = result
        if (data.status !== 1) {
          let errTips = {
            0: '登录失败',
            1: '登录成功',
            2: '用户名不存在',
            3: '用户名或密码错误'
          }
          dispatch(requestErr(errTips[data.status]))
        } else if (status >= 200 && status < 300) {
          dispatch(receiveLogin(data))
          dispatch(fetchPurview(data))
          sessionStorage.setItem('hoolai', JSON.stringify(data))
        }
      })
      .catch(function(error) {
        if (error.response) {
          // 请求已经发出，但是服务器响应返回的状态吗不在2xx的范围内
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.header)
        } else {
          // 一些错误是在设置请求的时候触发
          console.log('Error', error.message)
        }
        console.log(error.config)
      })
  }
}

function fetchPurview(value) {
  return (dispatch, getState) => {
    dispatch(requestPurview())
    let url = '/userRoles/user/menus'
    let config = {
      params: {
        adminUserId: value.userId
      },
      headers: {
        adminUserId: value.userId,
        Authorization: `bearer ${value.token}`
      }
    }
    BaseAxiosAPI
      .get(url, config)
      .then(result => {
        const { status, data, code } = result
        if (status >= 200 && status < 300) {
          dispatch(receivePurview(data.plist))
        }

        if (code === 1) {
          dispatch(signOut())
        }
      })
      .catch(function(error) {
        if (error.response) {
          // 请求已经发出，但是服务器响应返回的状态吗不在2xx的范围内
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.header)
        } else {
          // 一些错误是在设置请求的时候触发
          console.log('Error', error.message)
        }
        console.log(error.config)
      })
  }
}

export { receiveLogin, isLoginActionCreator, fetchPurview, signOut, onceLogin, keepBase }

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUEST_LOGIN]: state => {
    return {
      ...state,
      fetching: true,
      err: false,
      errMes: {}
    }
  },
  [RECEIVE_LOGIN]: (state, action) => {
    return {
      ...state,
      admin: Object.assign({}, ...state, action.data),
      fetching: false,
      resolved: true
    }
  },
  [RECEIVE_PURVIEW]: state => {
    return {
      ...state,
      fetching: true
    }
  },
  [REQUEST_PURVIEW]: (state, action) => {
    return {
      ...state,
      purview: Object.assign({}, ...state, action.data.purviews),
      subMenu: Object.assign({}, ...state, action.data.subMenu),
      curd: Object.assign({}, ...state, action.data.curd),
      authorize: action.data.authorize,
      fetching: false
    }
  },
  [REQUEST_ERR]: (state, action) => {
    return {
      ...state,
      errMes: action.data,
      fetching: false,
      resolved: false,
      err: true
    }
  },
  [ONCE]: state => {
    return {
      ...state,
      once: false
    }
  },
  [SIGN_OUT]: state => {
    return {
      ...state,
      fetching: false,
      admin: {},
      resolved: false,
      err: false,
      errMes: '',
      once: true
    }
  },
  [BASE_KEEPING]: (state, action) => {
    return ({
      ...state,
      keeping: {
        ...state.payload,
        ...action.payload
      }
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  fetching: false, // 是否正在请求
  admin: {}, // 登录信息
  purview: {}, // 权限
  subMenu: {}, // 二级菜单
  curd: {}, // 按钮功能
  authorize: [], // 按钮功能
  resolved: false, // 登录是否成功
  err: false, // 是否发生400
  errMes: '', // 登录错误信息（再次请求会清除）
  once: true, // 防止路由信息不停提示
  keeping: {}
}
export default function isLoginReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
