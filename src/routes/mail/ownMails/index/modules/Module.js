/* global API_HOST */
import axios from 'axios'
import _ from 'lodash'

import openNotificationWithIcon from '../../../../../base/components/Notification'
// ------------------------------------
// Constants
// ------------------------------------
const REQUEST_OWNMAIL = 'REQUEST_OWNMAIL'
const RECEIVE_OWNMAIL = 'RECEIVE_OWNMAIL'
const CLEAR_OWNMAIL = 'CLEAR_OWNMAIL'

const REQUEST_OWNMAIL_ADD = 'REQUEST_OWNMAIL_ADD'
const RECEIVE_OWNMAIL_ADD = 'RECEIVE_OWNMAIL_ADD'
const CLEAR_OWNMAIL_ADD = 'CLEAR_OWNMAIL_ADD'

const REQUEST_OWNMAIL_SEND = 'REQUEST_OWNMAIL_SEND'
const RECEIVE_OWNMAIL_SEND = 'RECEIVE_OWNMAIL_SEND'
const CLEAR_OWNMAIL_SEND = 'CLEAR_OWNMAIL_SEND'

const REQUEST_OWNMAIL_PASS = 'REQUEST_OWNMAIL_PASS'
const RECEIVE_OWNMAIL_PASS = 'RECEIVE_OWNMAIL_PASS'
const CLEAR_OWNMAIL_PASS = 'CLEAR_OWNMAIL_PASS'

const REQUEST_OWNMAIL_UPDATE = 'REQUEST_OWNMAIL_UPDATE'
const RECEIVE_OWNMAIL_UPDATE = 'RECEIVE_OWNMAIL_UPDATE'
const CLEAR_OWNMAIL_UPDATE = 'CLEAR_OWNMAIL_UPDATE'

const OWNMAIL_ERR = 'OWNMAIL_ERR'

// const KEEP_INITIAL_RANK = 'KEEP_INITIAL_RANK'
// ------------------------------------
// Actions
// ------------------------------------

function requestOwnMail() {
  return {
    type: REQUEST_OWNMAIL
  }
}

function receiveOwnMail(data) {
  return {
    type: RECEIVE_OWNMAIL,
    payload: data
  }
}

function clearOwnMail() {
  return {
    type: CLEAR_OWNMAIL
  }
}

function requestErr(data) {
  return {
    type: OWNMAIL_ERR,
    payload: data
  }
}

function fetchOwnMail(value) {
  return (dispatch, getState) => {
    // 验证从复提交
    if (getState().ownMail.fetching) {
      return
    }
    dispatch(requestOwnMail())
    let url = `${API_HOST}/huo/mails`
    return axios({
      method: 'GET',
      url: url,
      params: value,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(response => {
      dispatch(receiveOwnMail(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestErr(error.response.data))
        openNotificationWithIcon('error', '获取列表失败', error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

// 添加邮件接口

function requestAdd() {
  return {
    type: REQUEST_OWNMAIL_ADD
  }
}

function receiveAdded(data) {
  return {
    type: RECEIVE_OWNMAIL_ADD,
    payload: data
  }
}

function clearAdd() {
  return {
    type: CLEAR_OWNMAIL_ADD
  }
}

function addOwnMail(value) {
  return (dispatch, getState) => {
    // 验证从复提交
    if (getState().ownMail.adding) {
      return
    }
    dispatch(requestAdd())
    openNotificationWithIcon('warning', '正在添加,请不要重复点击提交')
    let url = `${API_HOST}/huo/mails`
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
    type: REQUEST_OWNMAIL_SEND
  }
}

function receiveSent(data) {
  return {
    type: RECEIVE_OWNMAIL_SEND,
    payload: data
  }
}

function clearSend() {
  return {
    type: CLEAR_OWNMAIL_SEND
  }
}

function sendOwnMail(value) {
  return (dispatch, getState) => {
    // 验证从复提交
    if (getState().ownMail.sending) {
      return
    }
    dispatch(requestSend())
    openNotificationWithIcon('info', '正在提交发送，请不要重复点击')
    let url = `${API_HOST}/huo/mails/${value.id}`
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
    type: REQUEST_OWNMAIL_PASS
  }
}

function receivePassed(data) {
  return {
    type: RECEIVE_OWNMAIL_PASS,
    payload: data
  }
}

function clearPass() {
  return {
    type: CLEAR_OWNMAIL_PASS
  }
}

function passOwnMail(value) {
  return (dispatch, getState) => {
    // 验证从复提交
    if (getState().ownMail.acrossing) {
      return
    }
    dispatch(requestPass())
    openNotificationWithIcon('info', '正在提交审核，请不要重复点击')
    let url = `${API_HOST}/products/newmails/${value.id}/approve/${value.status}`
    return axios({
      method: 'POST',
      url: url,
      data: value,
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
    type: REQUEST_OWNMAIL_UPDATE
  }
}

function receiveUpdated(data) {
  return {
    type: RECEIVE_OWNMAIL_UPDATE,
    payload: data
  }
}

function clearUpdate() {
  return {
    type: CLEAR_OWNMAIL_UPDATE
  }
}

function updateOwnMail(value) {
  return (dispatch, getState) => {
    // 验证从复提交
    if (getState().ownMail.submitting) {
      return
    }
    dispatch(requestUpdated())
    openNotificationWithIcon('info', '正在提交修改，请不要重复点击!')
    let url = `${API_HOST}/products/newmails/${value.id}`
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
  clearOwnMail,
  fetchOwnMail,
  clearAdd,
  addOwnMail,
  clearSend,
  sendOwnMail,
  clearPass,
  passOwnMail,
  clearUpdate,
  updateOwnMail
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [REQUEST_OWNMAIL]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_OWNMAIL]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      ownMails: action.payload ? action.payload.data.sango2Mails : []
    })
  },
  [CLEAR_OWNMAIL]: (state) => {
    return ({
      ...state,
      fetching: false,
      ownMails: [],
      error: null
    })
  },

  [REQUEST_OWNMAIL_ADD]: (state) => {
    return ({
      ...state,
      adding: true
    })
  },
  [RECEIVE_OWNMAIL_ADD]: (state, action) => {
    return ({
      ...state,
      adding: false,
      add: action.payload ? action.payload.data : {}
    })
  },
  [CLEAR_OWNMAIL_ADD]: (state) => {
    return ({
      ...state,
      adding: false,
      add: {},
      error: null
    })
  },

  [REQUEST_OWNMAIL_UPDATE]: (state) => {
    return ({
      ...state,
      submitting: true
    })
  },
  [RECEIVE_OWNMAIL_UPDATE]: (state, action) => {
    if (action.payload) {
      const items = action.payload.data.sango2Mail
      _.map(state.ownMails, (val, idx) => {
        if (val.id === action.payload.data.sango2Mail.id) {
          state.ownMails[idx]['title'] = items.title
          state.ownMails[idx]['senderName'] = items.senderName
          state.ownMails[idx]['context'] = items.context
          state.ownMails[idx]['receivers'] = items.receivers
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
  [CLEAR_OWNMAIL_UPDATE]: (state) => {
    return ({
      ...state,
      submitting: false,
      update: {},
      error: null
    })
  },

  [REQUEST_OWNMAIL_SEND]: (state) => {
    return ({
      ...state,
      sending: true
    })
  },
  [RECEIVE_OWNMAIL_SEND]: (state, action) => {
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
  [CLEAR_OWNMAIL_SEND]: (state) => {
    return ({
      ...state,
      sending: false,
      send: {},
      error: null
    })
  },

  [REQUEST_OWNMAIL_PASS]: (state) => {
    return ({
      ...state,
      acrossing: true
    })
  },
  [RECEIVE_OWNMAIL_PASS]: (state, action) => {
    return ({
      ...state,
      acrossing: false,
      pass: action.payload ? action.payload.data : {}
    })
  },
  [CLEAR_OWNMAIL_PASS]: (state) => {
    return ({
      ...state,
      acrossing: false,
      pass: {},
      error: null
    })
  },

  [OWNMAIL_ERR]: (state, action) => {
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
