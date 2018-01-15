/* global SANGO2_API_HOST */
import axios from 'axios'
import _ from 'lodash'

import openNotificationWithIcon from '../../../../../components/Notification'

// ------------------------------------
// Constants
// ------------------------------------
const VERSION_LIST_REQUEST = 'VERSION_LIST_REQUEST'
const VERSION_LIST_REQUEST_ERR = 'VERSION_LIST_REQUEST_ERR'
const VERSION_LIST_RECEIVE = 'VERSION_LIST_RECEIVE'
const VERSION_LIST_CLEAR = 'VERSION_LIST_CLEAR'

const VERSION_CREATE_REQUEST = 'VERSION_CREATE_REQUEST'
const VERSION_CREATE_REQUEST_ERR = 'VERSION_CREATE_REQUEST_ERR'
const VERSION_CREATE_RECEIVE = 'VERSION_CREATE_RECEIVE'

const VERSION_UPDATE_REQUEST = 'VERSION_UPDATE_REQUEST'
const VERSION_UPDATE_REQUEST_ERR = 'VERSION_UPDATE_REQUEST_ERR'
const VERSION_UPDATE_RECEIVE = 'VERSION_UPDATE_RECEIVE'

const REFRESH_VERSIONS_REDUCER = 'REFRESH_VERSIONS_REDUCER'

// ------------------------------------
// Actions
// ------------------------------------

function requestVersions() {
  return {
    type: VERSION_LIST_REQUEST
  }
}

function requestVersionsErr(data) {
  return {
    type: VERSION_LIST_REQUEST_ERR,
    payload: data
  }
}

function receiveVersions(data) {
  return {
    type: VERSION_LIST_RECEIVE,
    payload: data
  }
}

function clearVersions() {
  return {
    type: VERSION_LIST_CLEAR
  }
}

function requestCreateVersion() {
  return {
    type: VERSION_CREATE_REQUEST
  }
}

function requestCreateVersionErr(data) {
  return {
    type: VERSION_CREATE_REQUEST_ERR,
    payload: data
  }
}

function receiveCreateVersion(data) {
  return {
    type: VERSION_CREATE_RECEIVE,
    payload: data
  }
}

function requestUpdateVersion() {
  return {
    type: VERSION_UPDATE_REQUEST
  }
}

function requestUpdateVersionErr(data) {
  return {
    type: VERSION_UPDATE_REQUEST_ERR,
    payload: data
  }
}

function receiveUpdateVersion(data) {
  return {
    type: VERSION_UPDATE_RECEIVE,
    payload: data
  }
}

function refreshVersionReducer(data) {
  return {
    type: REFRESH_VERSIONS_REDUCER,
    data: data
  }
}


function fetchVersions(data) {
  return (dispatch, getState) => {

    dispatch(requestVersions())
    let url = `${SANGO2_API_HOST}/products/${data.productId}/versions`
    return axios({
      method: 'GET',
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(response => {
      dispatch(receiveVersions(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestVersionsErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function createVersion(data) {
  return (dispatch, getState) => {

    data.productId = data.products[0]
    data.group = data.groups[0]
    data.type = data.type[0]
    data.status = data.status[0]

    dispatch(requestCreateVersion())
    let url = `${SANGO2_API_HOST}/products/${data.productId}/versions`
    return axios({
      method: 'POST',
      data: data,
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(response => {
      dispatch(receiveCreateVersion(response))
      openNotificationWithIcon('success', '添加成功')
    }).catch(error => {
      if (error.response) {
        dispatch(requestCreateVersionErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function updateVersion(data) {
  return (dispatch, getState) => {

    data.productId = data.products[0]
    data.group = data.groups[0]
    data.type = data.type[0]
    data.status = data.status[0]

    dispatch(requestUpdateVersion())
    let url = `${SANGO2_API_HOST}/products/${data.productId}/versions/${data.version}`
    return axios({
      method: 'PUT',
      data: data,
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(response => {
      dispatch(receiveUpdateVersion(response))
      dispatch(refreshVersionReducer(response))
      openNotificationWithIcon('success', '更新成功')
    }).catch(error => {
      if (error.response) {
        dispatch(requestUpdateVersionErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}


export {
  clearVersions,
  fetchVersions,
  createVersion,
  updateVersion
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [VERSION_LIST_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [VERSION_LIST_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      list: action.payload.data.domainObject
    })
  },
  [VERSION_LIST_CLEAR]: (state) => {
    return ({
      ...state,
      fetching: false,
      err: false,
      errMes: {},
      list: []
    })
  },
  [VERSION_LIST_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      errMes: { tips: action.payload.response.data.tips }
    })
  },
  [VERSION_CREATE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {}
    })
  },
  [VERSION_CREATE_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [VERSION_CREATE_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      create: action.payload.data
    })
  },
  [VERSION_UPDATE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {}
    })
  },
  [VERSION_UPDATE_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [VERSION_UPDATE_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      update: action.payload.data
    })
  },
  [REFRESH_VERSIONS_REDUCER]: (state, action) => {
    const list = [...state.list]
    _.map(list, (val, index) => {
      if (val.version === action.data.data.version) {
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
  update: {}
}

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
