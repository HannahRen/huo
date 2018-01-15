import _ from 'lodash'

import AxiosAPI from '../../../../../utils/axios-api'
import openNotificationWithIcon from '../../../../base/components/Notification'
import { singOut } from '../../../../base/modules/Login'

// ------------------------------------
// Constants
// ------------------------------------
const PRODUCT_LIST_REQUEST = 'PRODUCT_LIST_REQUEST'
const PRODUCT_LIST_REQUEST_ERR = 'PRODUCT_LIST_REQUEST_ERR'
const PRODUCT_LIST_RECEIVE = 'PRODUCT_LIST_RECEIVE'
const PRODUCT_LIST_CLEAR = 'PRODUCT_LIST_CLEAR'

const PRODUCT_CREATE_REQUEST = 'PRODUCT_CREATE_REQUEST'
const PRODUCT_CREATE_REQUEST_ERR = 'PRODUCT_CREATE_REQUEST_ERR'
const PRODUCT_CREATE_RECEIVE = 'PRODUCT_CREATE_RECEIVE'

const PRODUCT_RELOAD_RECEIVE = 'PRODUCT_RELOAD_RECEIVE'

const REFRESH_PRODUCTS_REDUCER = 'REFRESH_PRODUCTS_REDUCER'

// ------------------------------------
// Actions
// ------------------------------------

function requestProducts() {
  return {
    type: PRODUCT_LIST_REQUEST
  }
}

function requestProductsErr(data) {
  return {
    type: PRODUCT_LIST_REQUEST_ERR,
    payload: data
  }
}

function receiveProducts(data) {
  return {
    type: PRODUCT_LIST_RECEIVE,
    payload: data
  }
}

function clearProducts() {
  return {
    type: PRODUCT_LIST_CLEAR
  }
}

function requestCreateProduct() {
  return {
    type: PRODUCT_CREATE_REQUEST
  }
}

function requestCreateProductErr(data) {
  return {
    type: PRODUCT_CREATE_REQUEST_ERR,
    payload: data
  }
}

function receiveCreateProduct(data) {
  return {
    type: PRODUCT_CREATE_RECEIVE,
    payload: data
  }
}

function refreshProductsReducer(data) {
  return {
    type: REFRESH_PRODUCTS_REDUCER,
    data: data
  }
}


function fetchProducts() {
  return (dispatch, getState) => {

    dispatch(requestProducts())
    let url = '/huo/products'
    AxiosAPI({
      method: 'GET',
      url: url
    }).then(result => {
      const { status, code } = result
      if (status >= 200 && status < 300) {
        dispatch(receiveProducts(result))
      }

      if (code === 1) {
        dispatch(singOut())
      }
    }).catch(error => {
      if (error.response) {
        dispatch(requestProductsErr(error.response.data))
        // 请求已经发出，但是服务器响应返回的状态吗不在2xx的范围内
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.header)
      } else {
        // 一些错误是在设置请求的时候触发
        console.log('Error', error.message)
      }
      console.log(error)
    })
  }
}

function receiveReload(data) {
  return {
    type: PRODUCT_RELOAD_RECEIVE,
    payload: data
  }
}

function createProduct(data) {
  return (dispatch, getState) => {

    dispatch(requestCreateProduct())
    let url = '/huo/products'
    AxiosAPI({
      method: 'POST',
      url: url,
      data: data
    }).then(result => {
      const { status, code } = result
      if (status >= 200 && status < 300) {
        dispatch(receiveCreateProduct(result))
        openNotificationWithIcon('success', '添加成功')
      }

      if (code === 1) {
        dispatch(singOut())
      }
    }).catch(error => {
      if (error.response) {
        dispatch(requestCreateProductErr(error.response.data))
        // 请求已经发出，但是服务器响应返回的状态吗不在2xx的范围内
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.header)
      } else {
        // 一些错误是在设置请求的时候触发
        console.log('Error', error.message)
      }
      console.log(error)
    })
  }
}

function updateProduct(data) {
  return (dispatch, getState) => {
    let url = `/huo/products/${data.productId}`
    AxiosAPI({
      method: 'PUT',
      url: url,
      data: data
    }).then(result => {
      const { status, code } = result
      if (status >= 200 && status < 300) {
        dispatch(refreshProductsReducer(result))
        openNotificationWithIcon('success', '更新成功')
      }

      if (code === 1) {
        dispatch(singOut())
      }
    }).catch(error => {
      if (error.response) {
        dispatch(requestProductsErr(error.response.data))
        // 请求已经发出，但是服务器响应返回的状态吗不在2xx的范围内
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.header)
      } else {
        // 一些错误是在设置请求的时候触发
        console.log('Error', error.message)
      }
      console.log(error)
    })
  }
}

function reloadProduct(data) {
  return (dispatch, getState) => {
    let url = `/huo/products/${data.productId}/reload`
    AxiosAPI({
      method: 'POST',
      url: url
    }).then(response => {
      const { status, code } = response
      if (status >= 200 && status < 300) {
        dispatch(receiveReload(response))
        if (response.data.result === 'success!') {
          openNotificationWithIcon('success', '重新加载成功')
        }
      }

      if (code === 1) {
        dispatch(singOut())
      }
    }).catch(error => {
      if (error.response) {
        dispatch(requestProductsErr(error.response.data))
        // 请求已经发出，但是服务器响应返回的状态吗不在2xx的范围内
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.header)
      } else {
        // 一些错误是在设置请求的时候触发
        console.log('Error', error.message)
      }
      console.log(error)
    })
  }
}

export {
  clearProducts,
  fetchProducts,
  createProduct,
  updateProduct,
  reloadProduct
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [PRODUCT_LIST_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [PRODUCT_LIST_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      list: action.payload.data.domainObject
    })
  },
  [PRODUCT_LIST_CLEAR]: (state) => {
    return ({
      ...state,
      fetching: false,
      err: false,
      errMes: {},
      list: []
    })
  },
  [PRODUCT_LIST_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      errMes: { tips: action.payload.response.data.tips }
    })
  },
  [PRODUCT_CREATE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {}
    })
  },
  [PRODUCT_CREATE_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [PRODUCT_CREATE_RECEIVE]: (state, action) => {
    const list = [...state.list]
    const curr = action.payload.data
    return ({
      ...state,
      fetching: false,
      create: {...curr},
      list: [...list, {...curr}]
    })
  },
  [PRODUCT_RELOAD_RECEIVE]: (state, action) => {
    return ({
      ...state,
      reload: action.payload ? action.payload.data : {}
    })
  },
  [REFRESH_PRODUCTS_REDUCER]: (state, action) => {
    const list = [...state.list]
    _.map(list, (val, index) => {
      if (val.productId === action.data.data.productId) {
        val = Object.assign(val, action.data.data)
      }
    })
    return ({
      ...state,
      list: [...list]
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { // 数据结构
  fetching: false,
  err: false,
  errMes: {},
  list: [],
  create: {},
  reload: {},
  update: {}
}

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
