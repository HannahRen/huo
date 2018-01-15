/* global SANGO2_API_HOST */
import axios from 'axios'
import _ from 'lodash'

import openNotificationWithIcon from '../../../../../components/Notification'

// ------------------------------------
// Constants
// ------------------------------------
const GROUP_LIST_REQUEST = 'GROUP_LIST_REQUEST'
const GROUP_LIST_REQUEST_ERR = 'GROUP_LIST_REQUEST_ERR'
const GROUP_LIST_RECEIVE = 'GROUP_LIST_RECEIVE'
const GROUP_LIST_CLEAR = 'GROUP_LIST_CLEAR'

const GROUP_CREATE_REQUEST = 'GROUP_CREATE_REQUEST'
const GROUP_CREATE_REQUEST_ERR = 'GROUP_CREATE_REQUEST_ERR'
const GROUP_CREATE_RECEIVE = 'GROUP_CREATE_RECEIVE'

const REFRESH_GROUPS_REDUCER = 'REFRESH_GROUPS_REDUCER'

// ------------------------------------
// Actions
// ------------------------------------

function requestGroups() {
  return {
    type: GROUP_LIST_REQUEST
  }
}

function requestGroupsErr(data) {
  return {
    type: GROUP_LIST_REQUEST_ERR,
    payload: data
  }
}

function receiveGroups(data) {
  return {
    type: GROUP_LIST_RECEIVE,
    payload: data
  }
}

function clearGroups() {
  return {
    type: GROUP_LIST_CLEAR
  }
}

function requestCreateGroup() {
  return {
    type: GROUP_CREATE_REQUEST
  }
}

function requestCreateGroupErr(data) {
  return {
    type: GROUP_CREATE_REQUEST_ERR,
    payload: data
  }
}

function receiveCreateGroup(data) {
  return {
    type: GROUP_CREATE_RECEIVE,
    payload: data
  }
}

function refreshGroupsReducer(data) {
  return {
    type: REFRESH_GROUPS_REDUCER,
    data: data
  }
}


function fetchGroups() {
  return (dispatch, getState) => {

    dispatch(requestGroups())
    let url = `${SANGO2_API_HOST}/groups`
    return axios({
      method: 'GET',
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(response => {
      dispatch(receiveGroups(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestGroupsErr(error.response.data))
        openNotificationWithIcon('error', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function createGroup(data) {
  return (dispatch, getState) => {

    data.verify = data.verify[0]

    dispatch(requestCreateGroup())
    let url = `${SANGO2_API_HOST}/groups`
    return axios({
      method: 'POST',
      data: data,
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(response => {
      dispatch(receiveCreateGroup(response))
      openNotificationWithIcon('success', '添加成功')
    }).catch(error => {
      if (error.response) {
        dispatch(requestCreateGroupErr(error.response.data))
        openNotificationWithIcon('error', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function updateGroup(data) {
  return (dispatch, getState) => {

    data.verify = data.verify[0]
    let url = `${SANGO2_API_HOST}/groups`
    return axios({
      method: 'PUT',
      data: data,
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(response => {
      dispatch(refreshGroupsReducer(response))
      openNotificationWithIcon('success', '更新成功')
    }).catch(error => {
      if (error.response) {
        dispatch(requestGroupsErr(error.response.data))
        openNotificationWithIcon('error', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function deleteGroup(data) {
  return (dispatch, getState) => {

    let url = `${SANGO2_API_HOST}/groups/${data.group}`
    return axios({
      method: 'DELETE',
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(response => {
      openNotificationWithIcon('success', '删除成功')
    }).catch(error => {
      if (error.response) {
        dispatch(requestGroupsErr(error.response.data))
        openNotificationWithIcon('error', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export {
  clearGroups,
  fetchGroups,
  createGroup,
  updateGroup,
  deleteGroup
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GROUP_LIST_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [GROUP_LIST_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      list: action.payload.data.domainObject
    })
  },
  [GROUP_LIST_CLEAR]: (state) => {
    return ({
      ...state,
      fetching: false,
      err: false,
      errMes: {},
      list: []
    })
  },
  [GROUP_LIST_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      errMes: { tips: action.payload.response.data.tips }
    })
  },
  [GROUP_CREATE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {}
    })
  },
  [GROUP_CREATE_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [GROUP_CREATE_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      create: action.payload.data
    })
  },
  [REFRESH_GROUPS_REDUCER]: (state, action) => {
    const list = [...state.list]
    _.map(list, (val, index) => {
      if (val.group === action.data.data.group) {
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
  update: {},
  delete: {}
}

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
