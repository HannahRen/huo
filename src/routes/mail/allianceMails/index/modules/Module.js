/* global SANGO2_API_HOST */
import axios from 'axios'
import _ from 'lodash'

import openNotificationWithIcon from '../../../../../../components/notification'
// ------------------------------------
// Constants
// ------------------------------------
const REQUEST_ALLIANCEMAIL = 'REQUEST_ALLIANCEMAIL'
const RECEIVE_ALLIANCEMAIL = 'RECEIVE_ALLIANCEMAIL'
const CLEAR_ALLIANCEMAIL = 'CLEAR_ALLIANCEMAIL'

const REQUEST_ALLIANCEMAIL_ADD = 'REQUEST_ALLIANCEMAIL_ADD'
const RECEIVE_ALLIANCEMAIL_ADD = 'RECEIVE_ALLIANCEMAIL_ADD'
const CLEAR_ALLIANCEMAIL_ADD = 'CLEAR_ALLIANCEMAIL_ADD'

const REQUEST_ALLIANCEMAIL_SEND = 'REQUEST_ALLIANCEMAIL_SEND'
const RECEIVE_ALLIANCEMAIL_SEND = 'RECEIVE_ALLIANCEMAIL_SEND'
const CLEAR_ALLIANCEMAIL_SEND = 'CLEAR_ALLIANCEMAIL_SEND'

const REQUEST_ALLIANCEMAIL_PASS = 'REQUEST_ALLIANCEMAIL_PASS'
const RECEIVE_ALLIANCEMAIL_PASS = 'RECEIVE_ALLIANCEMAIL_PASS'
const CLEAR_ALLIANCEMAIL_PASS = 'CLEAR_ALLIANCEMAIL_PASS'

const REQUEST_ALLIANCEMAIL_UPDATE = 'REQUEST_ALLIANCEMAIL_UPDATE'
const RECEIVE_ALLIANCEMAIL_UPDATE = 'RECEIVE_ALLIANCEMAIL_UPDATE'
const CLEAR_ALLIANCEMAIL_UPDATE = 'CLEAR_ALLIANCEMAIL_UPDATE'

const ALLIANCEMAIL_ERR = 'ALLIANCEMAIL_ERR'

// const KEEP_INITIAL_RANK = 'KEEP_INITIAL_RANK'
// ------------------------------------
// Actions
// ------------------------------------

function requestAllianceMail() {
  return {
    type: REQUEST_ALLIANCEMAIL
  }
}

function receiveAllianceMail(data) {
  return {
    type: RECEIVE_ALLIANCEMAIL,
    payload: data
  }
}

function clearAllianceMail() {
  return {
    type: CLEAR_ALLIANCEMAIL
  }
}

function requestErr(data) {
  return {
    type: ALLIANCEMAIL_ERR,
    payload: data
  }
}

function fetchAllianceMail(value) {
  return (dispatch, getState) => {
    // 验证从复提交
    if (getState().allianceMail.fetching) {
      return
    }
    dispatch(requestAllianceMail())
    let url = `${SANGO2_API_HOST}/products/newmails/allianceMails`
    return axios({
      method: 'GET',
      url: url,
      params: value,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(response => {
      dispatch(receiveAllianceMail(response))
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
    type: REQUEST_ALLIANCEMAIL_ADD
  }
}

function receiveAdded(data) {
  return {
    type: RECEIVE_ALLIANCEMAIL_ADD,
    payload: data
  }
}

function clearAdd() {
  return {
    type: CLEAR_ALLIANCEMAIL_ADD
  }
}

function addAllianceMail(value) {
  return (dispatch, getState) => {
    // 验证从复提交
    if (getState().allianceMail.adding) {
      return
    }
    dispatch(requestAdd())
    openNotificationWithIcon('warning', '正在添加,请不要重复点击提交')
    let url = `${SANGO2_API_HOST}/products/newmails/allianceMails`
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
    type: REQUEST_ALLIANCEMAIL_SEND
  }
}

function receiveSent(data) {
  return {
    type: RECEIVE_ALLIANCEMAIL_SEND,
    payload: data
  }
}

function clearSend() {
  return {
    type: CLEAR_ALLIANCEMAIL_SEND
  }
}

function sendAllianceMail(value) {
  return (dispatch, getState) => {
    // 验证从复提交
    if (getState().allianceMail.sending) {
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
    type: REQUEST_ALLIANCEMAIL_PASS
  }
}

function receivePassed(data) {
  return {
    type: RECEIVE_ALLIANCEMAIL_PASS,
    payload: data
  }
}

function clearPass() {
  return {
    type: CLEAR_ALLIANCEMAIL_PASS
  }
}

function passAllianceEmail(value) {
  return (dispatch, getState) => {
    // 验证从复提交
    if (getState().allianceMail.acrossing) {
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
    type: REQUEST_ALLIANCEMAIL_UPDATE
  }
}

function receiveUpdated(data) {
  return {
    type: RECEIVE_ALLIANCEMAIL_UPDATE,
    payload: data
  }
}

function clearUpdate() {
  return {
    type: CLEAR_ALLIANCEMAIL_UPDATE
  }
}

function updateAllianceEmail(value) {
  return (dispatch, getState) => {
    // 验证从复提交
    if (getState().allianceMail.submitting) {
      return
    }
    dispatch(requestUpdated())
    openNotificationWithIcon('info', '正在提交修改，请不要重复点击!')
    let url = `${SANGO2_API_HOST}/products/newmails/allianceMails/${value.id}`
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
  clearAllianceMail,
  fetchAllianceMail,
  clearAdd,
  addAllianceMail,
  clearSend,
  sendAllianceMail,
  clearPass,
  passAllianceEmail,
  clearUpdate,
  updateAllianceEmail
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [REQUEST_ALLIANCEMAIL]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_ALLIANCEMAIL]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      ownMails: action.payload ? action.payload.data.mailList : []
    })
  },
  [CLEAR_ALLIANCEMAIL]: (state) => {
    return ({
      ...state,
      fetching: false,
      ownMails: [],
      error: null
    })
  },

  [REQUEST_ALLIANCEMAIL_ADD]: (state) => {
    return ({
      ...state,
      adding: true
    })
  },
  [RECEIVE_ALLIANCEMAIL_ADD]: (state, action) => {
    return ({
      ...state,
      adding: false,
      add: action.payload ? action.payload.data : {}
    })
  },
  [CLEAR_ALLIANCEMAIL_ADD]: (state) => {
    return ({
      ...state,
      adding: false,
      add: {},
      error: null
    })
  },

  [REQUEST_ALLIANCEMAIL_UPDATE]: (state) => {
    return ({
      ...state,
      submitting: true
    })
  },
  [RECEIVE_ALLIANCEMAIL_UPDATE]: (state, action) => {
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
  [CLEAR_ALLIANCEMAIL_UPDATE]: (state) => {
    return ({
      ...state,
      submitting: false,
      update: {},
      error: null
    })
  },

  [REQUEST_ALLIANCEMAIL_SEND]: (state) => {
    return ({
      ...state,
      sending: true
    })
  },
  [RECEIVE_ALLIANCEMAIL_SEND]: (state, action) => {
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
  [CLEAR_ALLIANCEMAIL_SEND]: (state) => {
    return ({
      ...state,
      sending: false,
      send: {},
      error: null
    })
  },

  [REQUEST_ALLIANCEMAIL_PASS]: (state) => {
    return ({
      ...state,
      acrossing: true
    })
  },
  [RECEIVE_ALLIANCEMAIL_PASS]: (state, action) => {
    return ({
      ...state,
      acrossing: false,
      pass: action.payload ? action.payload.data : {}
    })
  },
  [CLEAR_ALLIANCEMAIL_PASS]: (state) => {
    return ({
      ...state,
      acrossing: false,
      pass: {},
      error: null
    })
  },

  [ALLIANCEMAIL_ERR]: (state, action) => {
    return ({
      ...state,
      submitting: false,
      adding: false,
      fetching: false,
      acrossing: false,
      sending: false,
      error: { tips: action.payload.tips }
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = { // 数据结构
  fetching: false,
  submitting: false,
  adding: false,
  acrossing: false,
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
