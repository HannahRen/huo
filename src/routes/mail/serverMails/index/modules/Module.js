/* global SANGO2_API_HOST */
import axios from 'axios'
import _ from 'lodash'

import openNotificationWithIcon from '../../../../../../components/notification'
// ------------------------------------
// Constants
// ------------------------------------
const REQUEST_SERVERMAIL = 'REQUEST_SERVERMAIL'
const RECEIVE_SERVERMAIL = 'RECEIVE_SERVERMAIL'
const CLEAR_SERVERMAIL = 'CLEAR_SERVERMAIL'

const REQUEST_SERVERMAIL_ADD = 'REQUEST_SERVERMAIL_ADD'
const RECEIVE_SERVERMAIL_ADD = 'RECEIVE_SERVERMAIL_ADD'
const CLEAR_SERVERMAIL_ADD = 'CLEAR_SERVERMAIL_ADD'

const REQUEST_SERVERMAIL_SEND = 'REQUEST_SERVERMAIL_SEND'
const RECEIVE_SERVERMAIL_SEND = 'RECEIVE_SERVERMAIL_SEND'
const CLEAR_SERVERMAIL_SEND = 'CLEAR_SERVERMAIL_SEND'

const REQUEST_SERVERMAIL_PASS = 'REQUEST_SERVERMAIL_PASS'
const RECEIVE_SERVERMAIL_PASS = 'RECEIVE_SERVERMAIL_PASS'
const CLEAR_SERVERMAIL_PASS = 'CLEAR_SERVERMAIL_PASS'

const REQUEST_SERVERMAIL_UPDATE = 'REQUEST_SERVERMAIL_UPDATE'
const RECEIVE_SERVERMAIL_UPDATE = 'RECEIVE_SERVERMAIL_UPDATE'
const CLEAR_SERVERMAIL_UPDATE = 'CLEAR_SERVERMAIL_UPDATE'

const SERVERMAIL_ERR = 'SERVERMAIL_ERR'

// const KEEP_INITIAL_RANK = 'KEEP_INITIAL_RANK'
// ------------------------------------
// Actions
// ------------------------------------

function requestServerMail() {
  return {
    type: REQUEST_SERVERMAIL
  }
}

function receiveServerMail(data) {
  return {
    type: RECEIVE_SERVERMAIL,
    payload: data
  }
}

function clearServerMail() {
  return {
    type: CLEAR_SERVERMAIL
  }
}

function requestErr(data) {
  return {
    type: SERVERMAIL_ERR,
    payload: data
  }
}

function fetchServerMail(value) {
  return (dispatch, getState) => {
    // 验证从复提交
    if (getState().serverMail.fetching) {
      return
    }
    dispatch(requestServerMail())
    let url = `${SANGO2_API_HOST}/products/newmails/serverMails`
    return axios({
      method: 'GET',
      url: url,
      params: value,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(response => {
      dispatch(receiveServerMail(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestErr(error.response.data))
        openNotificationWithIcon('error', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

// 添加邮件接口

function requestAdd() {
  return {
    type: REQUEST_SERVERMAIL_ADD
  }
}

function receiveAdded(data) {
  return {
    type: RECEIVE_SERVERMAIL_ADD,
    payload: data
  }
}

function clearAdd() {
  return {
    type: CLEAR_SERVERMAIL_ADD
  }
}

function addServerMail(value) {
  return (dispatch, getState) => {
    // 验证从复提交
    if (getState().serverMail.adding) {
      return
    }
    dispatch(requestAdd())
    openNotificationWithIcon('warning', '正在添加,请不要重复点击提交')
    let url = `${SANGO2_API_HOST}/products/newmails/serverMails`
    return axios({
      method: 'POST',
      url: url,
      data: value,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(response => {
      dispatch(receiveAdded(response))
      openNotificationWithIcon('success', '添加成功')
    }).catch(error => {
      if (error.response) {
        dispatch(requestErr(error.response.data))
        openNotificationWithIcon('error', '添加失败', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

// 发送邮件接口

function requestSend() {
  return {
    type: REQUEST_SERVERMAIL_SEND
  }
}

function receiveSent(data) {
  return {
    type: RECEIVE_SERVERMAIL_SEND,
    payload: data
  }
}

function clearSend() {
  return {
    type: CLEAR_SERVERMAIL_SEND
  }
}

function sendServerMail(value) {
  return (dispatch, getState) => {
    // 验证从复提交
    if (getState().serverMail.sending) {
      return
    }
    dispatch(requestSend())
    openNotificationWithIcon('info', '正在提交发送，请不要重复点击')
    let url = `${SANGO2_API_HOST}/products/newmails/${value.id}`
    return axios({
      method: 'POST',
      url: url,
      data: value,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(response => {
      dispatch(receiveSent(response))
      openNotificationWithIcon('success', '发送成功')
    }).catch(error => {
      if (error.response) {
        dispatch(requestErr(error.response.data))
        openNotificationWithIcon('error', '发送失败', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

// 通过审核接口

function requestPass() {
  return {
    type: REQUEST_SERVERMAIL_PASS
  }
}

function receivePassed(data) {
  return {
    type: RECEIVE_SERVERMAIL_PASS,
    payload: data
  }
}

function clearPass() {
  return {
    type: CLEAR_SERVERMAIL_PASS
  }
}

function passServerEmail(value) {
  return (dispatch, getState) => {
    // 验证从复提交
    if (getState().serverMail.acrossing) {
      return
    }
    dispatch(requestPass(value))
    openNotificationWithIcon('info', '正在提交审核，请不要重复点击')
    let url = `${SANGO2_API_HOST}/products/newmails/${value.id}/approve/${value.status}`
    return axios({
      method: 'POST',
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(response => {
      dispatch(receivePassed(response))
      openNotificationWithIcon('success', '审核通过')
    }).catch(error => {
      if (error.response) {
        dispatch(requestErr(error.response.data))
        openNotificationWithIcon('error', '审核通过失败', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

// 修改详情接口

function requestUpdated() {
  return {
    type: REQUEST_SERVERMAIL_UPDATE
  }
}

function receiveUpdated(data) {
  return {
    type: RECEIVE_SERVERMAIL_UPDATE,
    payload: data
  }
}

function clearUpdate() {
  return {
    type: CLEAR_SERVERMAIL_UPDATE
  }
}

function updateServerEmail(value) {
  return (dispatch, getState) => {
    // 验证从复提交
    if (getState().serverMail.submitting) {
      return
    }
    dispatch(requestUpdated())
    openNotificationWithIcon('info', '正在提交修改，请不要重复点击!')
    let url = `${SANGO2_API_HOST}/products/newmails/serverMails/${value.id}`
    return axios({
      method: 'PUT',
      url: url,
      data: value,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(response => {
      dispatch(receiveUpdated(response))
      openNotificationWithIcon('success', '修改成功')
    }).catch(error => {
      if (error.response) {
        dispatch(requestErr(error.response.data))
        openNotificationWithIcon('error', '修改失败', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}


export {
  clearServerMail,
  fetchServerMail,
  clearAdd,
  addServerMail,
  clearPass,
  passServerEmail,
  clearUpdate,
  updateServerEmail,
  clearSend,
  sendServerMail
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [REQUEST_SERVERMAIL]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_SERVERMAIL]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      ownMails: action.payload ? action.payload.data.mailList : []
    })
  },
  [CLEAR_SERVERMAIL]: (state) => {
    return ({
      ...state,
      fetching: false,
      ownMails: [],
      error: null
    })
  },

  [REQUEST_SERVERMAIL_ADD]: (state) => {
    return ({
      ...state,
      adding: true
    })
  },
  [RECEIVE_SERVERMAIL_ADD]: (state, action) => {
    return ({
      ...state,
      adding: false,
      add: action.payload ? action.payload.data : {}
    })
  },
  [CLEAR_SERVERMAIL_ADD]: (state) => {
    return ({
      ...state,
      adding: false,
      add: {},
      error: null
    })
  },

  [REQUEST_SERVERMAIL_UPDATE]: (state) => {
    return ({
      ...state,
      submitting: true
    })
  },
  [RECEIVE_SERVERMAIL_UPDATE]: (state, action) => {
    if (action.payload) {
      const items = action.payload.data.sango2Mail
      _.map(state.ownMails, (val, idx) => {
        if (val.id === action.payload.data.sango2Mail.id) {
          state.ownMails[idx]['productId'] = items.productId
          state.ownMails[idx]['channels'] = items.channels
          state.ownMails[idx]['serverIds'] = items.serverIds
          state.ownMails[idx]['title'] = items.title
          state.ownMails[idx]['senderName'] = items.senderName
          state.ownMails[idx]['context'] = items.context
          state.ownMails[idx]['description'] = items.description
          state.ownMails[idx]['rewards'] = items.rewards
        }
      })
    }
    return ({
      ...state,
      submitting: false,
      update: action.payload ? action.payload.data.sango2Mail : {}
    })
  },
  [CLEAR_SERVERMAIL_UPDATE]: (state) => {
    return ({
      ...state,
      submitting: false,
      update: {},
      error: null
    })
  },

  [REQUEST_SERVERMAIL_SEND]: (state) => {
    return ({
      ...state,
      sending: true
    })
  },
  [RECEIVE_SERVERMAIL_SEND]: (state, action) => {
    _.map(state.ownMails, (val, idx) => {
      if (val.id === action.payload.data.mail.id) {
        val.status = action.payload.data.mail.status
      }
    })

    return ({
      ...state,
      sending: false,
      send: action.payload ? action.payload.data : {}
    })
  },
  [CLEAR_SERVERMAIL_SEND]: (state) => {
    return ({
      ...state,
      sending: false,
      send: {},
      error: null
    })
  },

  [REQUEST_SERVERMAIL_PASS]: (state) => {
    return ({
      ...state,
      acrossing: true
    })
  },
  [RECEIVE_SERVERMAIL_PASS]: (state, action) => {
    _.map(state.ownMails, (val, idx) => {
      if (val.id === action.payload.data.sango2Mail.id) {
        val.status = action.payload.data.sango2Mail.status
      }
    })

    return ({
      ...state,
      acrossing: false,
      pass: action.payload ? action.payload.data : {}
    })
  },
  [CLEAR_SERVERMAIL_PASS]: (state) => {
    return ({
      ...state,
      acrossing: false,
      pass: {},
      error: null
    })
  },

  [SERVERMAIL_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      acrossing: false,
      submitting: false,
      sending: false,
      adding: false,
      error: { tips: action.payload.tips }
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = { // 数据结构
  adding: false,
  fetching: false,
  acrossing: false,
  submitting: false,
  sending: false,
  ownMails: [],
  add: {},
  pass: {},
  send: {},
  update: {},
  error: null
}

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
