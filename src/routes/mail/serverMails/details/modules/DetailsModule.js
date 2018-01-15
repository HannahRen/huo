/* global SANGO2_API_HOST */
import axios from 'axios'
import { browserHistory } from 'react-router'

import openNotificationWithIcon from '../../../../../../components/notification'

const RECEIVE_SERVERMAIL_CHECK = 'RECEIVE_SERVERMAIL_CHECK'
const CLEAR_SERVERMAIL_CHECK = 'CLEAR_SERVERMAIL_CHECK'

const REQUEST_SERVERMAIL_DETAIL_SEND = 'REQUEST_SERVERMAIL_SEND'
const RECEIVE_SERVERMAIL_SEND = 'RECEIVE_SERVERMAIL_SEND'
const CLEAR_SERVERMAIL_DETAIL_SEND = 'CLEAR_SERVERMAIL_SEND'

const SERVERMAIL_CHECK_ERR = 'SERVERMAIL_CHECK_ERR'


// 查看详情接口
function receiveChecked(data) {
  return {
    type: RECEIVE_SERVERMAIL_CHECK,
    payload: data
  }
}

function clearCheck() {
  return {
    type: CLEAR_SERVERMAIL_CHECK
  }
}

function requestErr(data) {
  return {
    type: SERVERMAIL_CHECK_ERR,
    payload: data
  }
}

function checkServerMail(value) {
  return (dispatch, getState) => {
    // 验证从复提交
    // if (getState().ownMail.fetching) {
    //   return
    // }
    let url = `${SANGO2_API_HOST}/products/newmails/serverMails/${value}`
    return axios({
      method: 'GET',
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(response => {
      dispatch(receiveChecked(response))
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

// 发送邮件接口

function requestSend() {
  return {
    type: REQUEST_SERVERMAIL_DETAIL_SEND
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
    type: CLEAR_SERVERMAIL_DETAIL_SEND
  }
}

function sendServerMail(id) {
  return (dispatch, getState) => {
    // 验证从复提交
    if (getState().serverMailDetail.sending) {
      return
    }
    dispatch(requestSend())
    openNotificationWithIcon('info', '正在提交发送，请不要重复点击')
    let url = `${SANGO2_API_HOST}/products/newmails/${id}`
    return axios({
      method: 'POST',
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(response => {
      dispatch(receiveSent(response))
      openNotificationWithIcon('success', '发送成功')
      browserHistory.push('/sango2/mail/serverMail/index')
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
export {
  clearCheck,
  clearSend,
  checkServerMail,
  sendServerMail
}

const ACTION_HANDLERS = {
  [RECEIVE_SERVERMAIL_CHECK]: (state, action) => {
    return ({
      ...state,
      check: action.payload ? action.payload.data : {}
    })
  },
  [CLEAR_SERVERMAIL_CHECK]: (state) => {
    return ({
      ...state,
      check: {},
      error: null
    })
  },

  [REQUEST_SERVERMAIL_DETAIL_SEND]: (state) => {
    return ({
      ...state,
      sending: true
    })
  },
  [RECEIVE_SERVERMAIL_SEND]: (state, action) => {

    return ({
      ...state,
      sending: false,
      send: action.payload ? action.payload.data : {}
    })
  },
  [CLEAR_SERVERMAIL_DETAIL_SEND]: (state) => {
    return ({
      ...state,
      sending: false,
      send: {},
      error: null
    })
  },

  [SERVERMAIL_CHECK_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      sending: false,
      error: { tips: action.payload.tips }
    })
  }
}

const initialState = { // 数据结构
  fetching: false,
  sending: false,
  send: {},
  check: {},
  error: null
}

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
