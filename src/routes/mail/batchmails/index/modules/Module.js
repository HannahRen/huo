/* global SANGO2_API_HOST */
import axios from 'axios'
import _ from 'lodash'

import openNotificationWithIcon from '../../../../../../components/notification'

// ------------------------------------
// Constants
// ------------------------------------
const BATCHMAIL_FETCH_REQUEST = 'BATCHMAIL_FETCH_REQUEST'
const BATCHMAIL_FETCH_RECEIVE = 'BATCHMAIL_FETCH_RECEIVE'
const BATCHMAIL_FETCH_CLEAR = 'BATCHMAIL_FETCH_CLEAR'

const BATCHMAIL_ADD_REQUEST = 'BATCHMAIL_ADD_REQUEST'
const BATCHMAIL_ADD_RECEIVE = 'BATCHMAIL_ADD_RECEIVE'
const BATCHMAIL_ADD_CLEAR = 'BATCHMAIL_ADD_CLEAR'

const BATCHMAIL_UPDATE_RECEIVE = 'BATCHMAIL_UPDATE_RECEIVE'

const BATCHMAIL_ERR = 'BATCHMAIL_ERR'

// const BATCHMAIL_KEEPING = 'BATCHMAIL_KEEPING'

// ------------------------------------
// Actions
// ------------------------------------

function requestBatchmailFetch() {
  return {
    type: BATCHMAIL_FETCH_REQUEST
  }
}

function receiveBatchmailFetch(data) {
  return {
    type: BATCHMAIL_FETCH_RECEIVE,
    payload: data
  }
}

function clearBatchmailFetch() {
  return {
    type: BATCHMAIL_FETCH_CLEAR
  }
}

function requestBatchmailAdd() {
  return {
    type: BATCHMAIL_ADD_REQUEST
  }
}

function receiveBatchmailAdd(data) {
  return {
    type: BATCHMAIL_ADD_RECEIVE,
    payload: data
  }
}

function clearBatchmailAdd() {
  return {
    type: BATCHMAIL_ADD_CLEAR
  }
}

function receiveBatchmailUpdate(data) {
  return {
    type: BATCHMAIL_UPDATE_RECEIVE,
    payload: data
  }
}

function requestBatchmailErr(data) {
  return {
    type: BATCHMAIL_ERR,
    payload: data
  }
}

function fetchBatchmail(value = {}) {
  return (dispatch, getState) => {

    dispatch(requestBatchmailFetch())
    let url = `${SANGO2_API_HOST}/products/batchmails`
    return axios({
      method: 'GET',
      url: url,
      params: value,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(response => {
      dispatch(receiveBatchmailFetch(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestBatchmailErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function addBatchmail(value) {
  return (dispatch, getState) => {
    dispatch(requestBatchmailAdd())
    let url = `${SANGO2_API_HOST}/products/batchmails`
    return axios({
      method: 'POST',
      url: url,
      data: value,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(response => {
      dispatch(receiveBatchmailAdd(response))
      openNotificationWithIcon('success', '添加成功')
    }).catch(error => {
      if (error.response) {
        dispatch(requestBatchmailErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function updateBatchmail(value) {
  return (dispatch, getState) => {
    let url = `${SANGO2_API_HOST}/products/batchmails/${value.id}`
    return axios({
      method: 'PUT',
      url: url,
      data: value,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(response => {
      dispatch(receiveBatchmailUpdate(response))
      openNotificationWithIcon('success', '修改成功')
    }).catch(error => {
      if (error.response) {
        dispatch(requestBatchmailErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export {
  fetchBatchmail,
  clearBatchmailFetch,
  addBatchmail,
  clearBatchmailAdd,
  updateBatchmail
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [BATCHMAIL_FETCH_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: null
    })
  },
  [BATCHMAIL_FETCH_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      batchmails: action.payload.data.batchMails
    })
  },
  [BATCHMAIL_FETCH_CLEAR]: (state) => {
    return ({
      ...state,
      fetching: false,
      err: null,
      batchmails: []
    })
  },
  [BATCHMAIL_ADD_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: null
    })
  },
  [BATCHMAIL_ADD_RECEIVE]: (state, action) => {
    if (state.batchmails.length > 0 && state.batchmails[0].id === action.payload.data.batchMail.id) {
      state.batchmails.shift()
    }
    state.batchmails.unshift(action.payload.data.batchMail)

    return ({
      ...state,
      fetching: false,
      add: action.payload.data.batchMail
    })
  },
  [BATCHMAIL_ADD_CLEAR]: (state) => {
    return ({
      ...state,
      fetching: false,
      err: null,
      add: {}
    })
  },
  [BATCHMAIL_UPDATE_RECEIVE]: (state, action) => {
    const itemNum = _.findIndex(state.batchmails, _.find(state.batchmails, {id: action.payload.data.batchMail.id}))
    state.batchmails[itemNum] = action.payload.data.batchMail

    return ({
      ...state,
      fetching: false,
      update: action.payload.data.batchMail
    })
  },
  [BATCHMAIL_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: action.payload.response.data.tips
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { // 数据结构
  fetching: false,
  err: null,
  batchmails: [],
  add: {},
  update: {}
}

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
