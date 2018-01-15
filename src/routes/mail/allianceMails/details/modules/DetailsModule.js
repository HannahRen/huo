/* global SANGO2_API_HOST */
import axios from 'axios'
import { browserHistory } from 'react-router'
import _ from 'lodash'

import openNotificationWithIcon from '../../../../../../components/notification'

const RECEIVE_ALLIANCEMAIL_CHECK = 'RECEIVE_ALLIANCEMAIL_CHECK'
const CLEAR_ALLIANCEMAIL_CHECK = 'CLEAR_ALLIANCEMAIL_CHECK'

const REQUEST_ALLIANCEMAILPLAYER_UPDATE = 'REQUEST_ALLIANCEMAILPLAYER_UPDATE'
const RECEIVE_ALLIANCEMAILPLAYER_UPDATE = 'RECEIVE_ALLIANCEMAILPLAYER_UPDATE'
const CLEAR_ALLIANCEMAILPLAYER_UPDATE = 'CLEAR_ALLIANCEMAILPLAYER_UPDATE'

const REQUEST_ALLIANCEMAIL_DETAIL_SEND = 'REQUEST_ALLIANCEMAIL_DETAIL_SEND'
const RECEIVE_ALLIANCEMAIL_SEND = 'RECEIVE_ALLIANCEMAIL_SEND'
const CLEAR_ALLIANCEMAIL_DETAIL_SEND = 'CLEAR_ALLIANCEMAIL_DETAIL_SEND'

const ALLIANCEMAIL_CHECK_ERR = 'ALLIANCEMAIL_CHECK_ERR'


// 查看详情接口
function receiveChecked(data) {
  return {
    type: RECEIVE_ALLIANCEMAIL_CHECK,
    payload: data
  }
}

function clearCheck() {
  return {
    type: CLEAR_ALLIANCEMAIL_CHECK
  }
}

function requestErr(data) {
  return {
    type: ALLIANCEMAIL_CHECK_ERR,
    payload: data
  }
}

function checkAllianceMail(value) {
  return (dispatch, getState) => {
    // 验证从复提交
    // if (getState().ownMail.fetching) {
    //   return
    // }
    let url = `${SANGO2_API_HOST}/products/newmails/allianceMails/${value}`
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
    type: REQUEST_ALLIANCEMAILPLAYER_UPDATE
  }
}

function receiveUpdated(data) {
  return {
    type: RECEIVE_ALLIANCEMAILPLAYER_UPDATE,
    payload: data
  }
}

function clearUpdatePlayer() {
  return {
    type: CLEAR_ALLIANCEMAILPLAYER_UPDATE
  }
}
function updateAllianceEmailPlayer(value) {
  return (dispatch, getState) => {
    // 验证从复提交
    if (getState().allianceMailDetail.fetching) {
      return
    }
    dispatch(requestUpdate())
    openNotificationWithIcon('info', '已提交修改，不要重复点击提交')
    let url = `${SANGO2_API_HOST}/products/newmails/${value.id}/players/${value.index}`
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

// 发送邮件接口

function requestSend() {
  return {
    type: REQUEST_ALLIANCEMAIL_DETAIL_SEND
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
    type: CLEAR_ALLIANCEMAIL_DETAIL_SEND
  }
}

function sendAllianceMail(id) {
  return (dispatch, getState) => {
    // 验证从复提交
    if (getState().allianceMailDetail.sending) {
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
      browserHistory.push('/sango2/mail/allianceMail/index')
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
  checkAllianceMail,
  clearUpdatePlayer,
  updateAllianceEmailPlayer,
  clearSend,
  sendAllianceMail
}

const ACTION_HANDLERS = {
  [RECEIVE_ALLIANCEMAIL_CHECK]: (state, action) => {
    return ({
      ...state,
      check: action.payload ? action.payload.data : {}
    })
  },
  [CLEAR_ALLIANCEMAIL_CHECK]: (state) => {
    return ({
      ...state,
      check: {},
      error: null
    })
  },

  [REQUEST_ALLIANCEMAILPLAYER_UPDATE]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_ALLIANCEMAILPLAYER_UPDATE]: (state, action) => {
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
  [CLEAR_ALLIANCEMAILPLAYER_UPDATE]: (state) => {
    return ({
      ...state,
      fetching: false,
      update: {},
      error: null
    })
  },

  [REQUEST_ALLIANCEMAIL_DETAIL_SEND]: (state) => {
    return ({
      ...state,
      sending: true
    })
  },
  [RECEIVE_ALLIANCEMAIL_SEND]: (state, action) => {

    return ({
      ...state,
      sending: false,
      send: action.payload ? action.payload.data : {}
    })
  },
  [CLEAR_ALLIANCEMAIL_DETAIL_SEND]: (state) => {
    return ({
      ...state,
      sending: false,
      send: {},
      error: null
    })
  },

  [ALLIANCEMAIL_CHECK_ERR]: (state, action) => {
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
