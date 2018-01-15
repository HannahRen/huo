/* global API_HOST */
import axios from 'axios'
import { browserHistory } from 'react-router'
import _ from 'lodash'

import openNotificationWithIcon from '../../../../../base/components/Notification'


const RECEIVE_OWNMAIL_CHECK = 'RECEIVE_OWNMAIL_CHECK'
const CLEAR_OWNMAIL_CHECK = 'CLEAR_OWNMAIL_CHECK'

const REQUEST_OWNMAILPLAYER_UPDATE = 'REQUEST_OWNMAILPLAYER_UPDATE'
const RECEIVE_OWNMAILPLAYER_UPDATE = 'RECEIVE_OWNMAILPLAYER_UPDATE'
const CLEAR_OWNMAILPLAYER_UPDATE = 'CLEAR_OWNMAILPLAYER_UPDATE'

const REQUEST_OWNMAIL_DETAIL_SEND = 'REQUEST_OWNMAIL_DETAIL_SEND'
const RECEIVE_OWNMAIL_SEND = 'RECEIVE_OWNMAIL_SEND'
const CLEAR_OWNMAIL_DETAIL_SEND = 'CLEAR_OWNMAIL_DETAIL_SEND'

const OWNMAIL_CHECK_ERR = 'OWNMAIL_CHECK_ERR'


// 查看详情接口
function receiveChecked(data) {
  return {
    type: RECEIVE_OWNMAIL_CHECK,
    payload: data
  }
}

function clearCheck() {
  return {
    type: CLEAR_OWNMAIL_CHECK
  }
}

function requestErr(data) {
  return {
    type: OWNMAIL_CHECK_ERR,
    payload: data
  }
}

function checkOwnMail(value) {
  return (dispatch, getState) => {
    // 验证从复提交
    // if (getState().ownMail.fetching) {
    //   return
    // }
    let url = `${API_HOST}/products/newmails/${value}`
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

// 提交接口

function requestUpdate() {
  return {
    type: REQUEST_OWNMAILPLAYER_UPDATE
  }
}

function receiveUpdated(data) {
  return {
    type: RECEIVE_OWNMAILPLAYER_UPDATE,
    payload: data
  }
}

function clearUpdatePlayer() {
  return {
    type: CLEAR_OWNMAILPLAYER_UPDATE
  }
}

function updateOwnEmailPlayer(value) {
  return (dispatch, getState) => {
    // 验证从复提交
    if (getState().ownMailDetail.fetching) {
      return
    }
    dispatch(requestUpdate())
    openNotificationWithIcon('warning', '已提交修改，不要重复点击提交')
    let url = `${API_HOST}/products/newmails/${value.id}/players/${value.index}`
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

// 发送

function requestSend() {
  return {
    type: REQUEST_OWNMAIL_DETAIL_SEND
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
    type: CLEAR_OWNMAIL_DETAIL_SEND
  }
}

function sendOwnMail(id) {
  return (dispatch, getState) => {
    // 验证从复提交
    if (getState().ownMailDetail.sending) {
      return
    }
    dispatch(requestSend())
    openNotificationWithIcon('info', '正在提交发送，请不要重复点击')
    let url = `${API_HOST}/products/newmails/${id}`
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
      browserHistory.push('/sango2/mail/ownMail/index')
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
  checkOwnMail,
  clearSend,
  clearUpdatePlayer,
  updateOwnEmailPlayer,
  sendOwnMail
}

const ACTION_HANDLERS = {
  [RECEIVE_OWNMAIL_CHECK]: (state, action) => {
    return ({
      ...state,
      check: action.payload ? action.payload.data : {}
    })
  },
  [CLEAR_OWNMAIL_CHECK]: (state) => {
    return ({
      ...state,
      check: {},
      error: null
    })
  },

  [REQUEST_OWNMAILPLAYER_UPDATE]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_OWNMAILPLAYER_UPDATE]: (state, action) => {
    _.map(state.check.mailPlayers, (val, idx) => {
      if (val.index === action.payload.data.player.index) {
        state.check.mailPlayers[idx] = action.payload.data.player
      }
    })
    return ({
      ...state,
      fetching: false,
      update: action.payload ? action.payload.data.player : {}
    })
  },
  [CLEAR_OWNMAILPLAYER_UPDATE]: (state) => {
    return ({
      ...state,
      fetching: false,
      update: {},
      error: null
    })
  },

  [REQUEST_OWNMAIL_DETAIL_SEND]: (state) => {
    return ({
      ...state,
      sending: true
    })
  },
  [RECEIVE_OWNMAIL_SEND]: (state, action) => {

    return ({
      ...state,
      sending: false,
      send: action.payload ? action.payload.data : {}
    })
  },
  [CLEAR_OWNMAIL_DETAIL_SEND]: (state) => {
    return ({
      ...state,
      sending: false,
      send: {},
      error: null
    })
  },

  [OWNMAIL_CHECK_ERR]: (state, action) => {
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
  check: {},
  update: {},
  send: {},
  error: null
}

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
