/* global SANGO2_API_HOST */
import axios from 'axios'
import _ from 'lodash'
import { notification } from 'antd'

import openNotificationWithIcon from '../../../../../components/Notification'

// ------------------------------------
// Constants
// ------------------------------------
const SERVER_LIST_REQUEST = 'SERVER_LIST_REQUEST'
const SERVER_LIST_REQUEST_ERR = 'SERVER_LIST_REQUEST_ERR'
const SERVER_LIST_RECEIVE = 'SERVER_LIST_RECEIVE'
const SERVER_LIST_CLEAR = 'SERVER_LIST_CLEAR'

const SERVER_CREATE_REQUEST = 'SERVER_CREATE_REQUEST'
const SERVER_CREATE_REQUEST_ERR = 'SERVER_CREATE_REQUEST_ERR'
const SERVER_CREATE_RECEIVE = 'SERVER_CREATE_RECEIVE'

const SERVER_MAP_CELL_REQUEST = 'SERVER_MAP_CELL_REQUEST'
const SERVER_MAP_CELL_RECEIVE = 'SERVER_MAP_CELL_RECEIVE'

const REFRESH_SERVERS_REDUCER = 'REFRESH_SERVERS_REDUCER'

const SERVER_SWITCH_REQUEST = 'SERVER_SWITCH_REQUEST'
const SERVER_SWITCH_REQUEST_ERR = 'SERVER_SWITCH_REQUEST_ERR'
const SERVER_SWITCH_RECEIVE = 'SERVER_SWITCH_RECEIVE'

// ------------------------------------
// Actions
// ------------------------------------

function requestServers() {
  return {
    type: SERVER_LIST_REQUEST
  }
}

function requestServersErr(data) {
  return {
    type: SERVER_LIST_REQUEST_ERR,
    payload: data
  }
}

function receiveServers(data) {
  return {
    type: SERVER_LIST_RECEIVE,
    payload: data
  }
}

function clearServers() {
  return {
    type: SERVER_LIST_CLEAR
  }
}

function requestCreateServer() {
  return {
    type: SERVER_CREATE_REQUEST
  }
}

function requestCreateServerErr(data) {
  return {
    type: SERVER_CREATE_REQUEST_ERR,
    payload: data
  }
}

function receiveCreateServer(data) {
  return {
    type: SERVER_CREATE_RECEIVE,
    payload: data
  }
}

function requestCellsMap() {
  return {
    type: SERVER_MAP_CELL_REQUEST
  }
}

function receiveCellsMap(data) {
  return {
    type: SERVER_MAP_CELL_RECEIVE,
    payload: data
  }
}

function refreshServersReducer(data) {
  return {
    type: REFRESH_SERVERS_REDUCER,
    data: data
  }
}

function requestServerSwitch() {
  return {
    type: SERVER_SWITCH_REQUEST
  }
}

function requestServerSwitchErr(data) {
  return {
    type: SERVER_SWITCH_REQUEST_ERR,
    payload: data
  }
}

function receiveServerSwitch(data) {
  return {
    type: SERVER_SWITCH_RECEIVE,
    payload: data
  }
}

function fetchServers(data) {
  return (dispatch, getState) => {

    dispatch(requestServers())
    let url = `${SANGO2_API_HOST}/products/${data.productId}/servers`
    return axios({
      method: 'GET',
      url: url,
      params: data.status ? { status: data.status } : '',
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(response => {
      dispatch(receiveServers(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestServersErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function createServer(data) {
  return (dispatch, getState) => {

    dispatch(requestCreateServer())
    let url = `${SANGO2_API_HOST}/products/${data.productId}/servers`
    return axios({
      method: 'POST',
      data: data,
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(response => {
      dispatch(receiveCreateServer(response))
      openNotificationWithIcon('success', '添加成功')
    }).catch(error => {
      if (error.response) {
        dispatch(requestCreateServerErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function updateServer(data) {
  return (dispatch, getState) => {

    let url = `${SANGO2_API_HOST}/products/${data.productId}/servers/${data.serverId}`
    return axios({
      method: 'PUT',
      data: data,
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(response => {
      dispatch(refreshServersReducer(response))
      openNotificationWithIcon('success', '更新成功')
    }).catch(error => {
      if (error.response) {
        dispatch(requestServersErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function fetchCellsMap() {
  return (dispatch, getState) => {
    dispatch(requestCellsMap())
    let url = `${SANGO2_API_HOST}/products/cells`
    return axios({
      method: 'GET',
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(response => {
      dispatch(receiveCellsMap(response))
    }).catch(error => {
      if (error.response) {
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function switchServers(data) {
  return (dispatch, getState) => {

    dispatch(requestServerSwitch())
    let url = `${SANGO2_API_HOST}/products/${data.path.productId}/servers`
    return axios({
      method: 'PUT',
      data: data.form,
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(response => {
      dispatch(receiveServerSwitch(response))
      let operation = { 1: '开服', 2: '维护', 3: '不可用' }
      let result = _.reduce(response.data.domainObject, (result, option) => {
        result.push(`服务器：${option.servers}，操作：${operation[option.operation]}，结果：${option.success ? '成功' : '失败'}`)
        return result
      }, [])
      notification.info({
        message: '服务器批量操作结果',
        description: result.join('；'),
        duration: 0
      })
      dispatch(fetchServers({productId: data.path.productId}))
    }).catch(error => {
      if (error.response) {
        dispatch(requestServerSwitchErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export {
  clearServers,
  fetchServers,
  createServer,
  updateServer,
  fetchCellsMap,
  switchServers
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SERVER_LIST_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [SERVER_LIST_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      list: action.payload ? action.payload.data.domainObject : []
    })
  },
  [SERVER_LIST_CLEAR]: (state) => {
    return ({
      ...state,
      fetching: false,
      err: false,
      errMes: {},
      list: []
    })
  },
  [SERVER_LIST_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      errMes: { tips: action.payload.response.data.tips }
    })
  },
  [SERVER_CREATE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {}
    })
  },
  [SERVER_CREATE_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [SERVER_CREATE_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      create: action.payload.data
    })
  },
  [SERVER_MAP_CELL_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {}
    })
  },
  [SERVER_MAP_CELL_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      cells: action.payload.data.productCellMap
    })
  },
  [REFRESH_SERVERS_REDUCER]: (state, action) => {
    const list = [...state.list]
    _.map(list, (val, index) => {
      if (val.serverId === action.data.data.serverId) {
        val = Object.assign(val, action.data.data)
      }
    })
    return ({
      ...state,
      list: [...list]
    })
  },
  [SERVER_SWITCH_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {}
    })
  },
  [SERVER_SWITCH_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [SERVER_SWITCH_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      operation: action.payload.data.domainObject
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
  update: {},
  cells: [],
  operation: {}
}

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
