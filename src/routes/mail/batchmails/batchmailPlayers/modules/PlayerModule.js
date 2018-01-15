/* global SANGO2_API_HOST */
import axios from 'axios'
import _ from 'lodash'

import openNotificationWithIcon from '../../../../../../components/notification'

// ------------------------------------
// Constants
// ------------------------------------
const BATCHMAIL_PLAYER_REQUEST = 'BATCHMAIL_PLAYER_REQUEST'
const BATCHMAIL_PLAYER_RECEIVE = 'BATCHMAIL_PLAYER_RECEIVE'
const BATCHMAIL_PLAYER_CLEAR = 'BATCHMAIL_PLAYER_CLEAR'

const BATCHMAILS_SEND_RECEIVE = 'BATCHMAILS_SEND_RECEIVE'

const BATCHMAIL_SEND_RECEIVE = 'BATCHMAIL_SEND_RECEIVE'

const BATCHMAIL_PLAYER_ERR = 'BATCHMAIL_PLAYER_ERR'

// const BATCHMAIL_KEEPING = 'BATCHMAIL_KEEPING'

// ------------------------------------
// Actions
// ------------------------------------

function requestBatchmailPlayer() {
  return {
    type: BATCHMAIL_PLAYER_REQUEST
  }
}

function receiveBatchmailPlayer(data) {
  return {
    type: BATCHMAIL_PLAYER_RECEIVE,
    payload: data
  }
}

function clearBatchmailPlayer() {
  return {
    type: BATCHMAIL_PLAYER_CLEAR
  }
}

function receiveBatchmailsSend(data) {
  return {
    type: BATCHMAILS_SEND_RECEIVE,
    payload: data
  }
}

function receiveSingleBatchmailSend(data) {
  return {
    type: BATCHMAIL_SEND_RECEIVE,
    payload: data
  }
}

function requestBatchmailErr(data) {
  return {
    type: BATCHMAIL_PLAYER_ERR,
    payload: data
  }
}

function fetchBatchmailPlayer(value) {
  return (dispatch, getState) => {
    dispatch(requestBatchmailPlayer())
    let url = `${SANGO2_API_HOST}/products/batchmails/${value}/players`
    return axios({
      method: 'GET',
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(response => {
      dispatch(receiveBatchmailPlayer(response))
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

function sendBatchmailPlayers(value) {
  return (dispatch, getState) => {
    let url = `${SANGO2_API_HOST}/products/batchmails/${value.id}/sendall`
    return axios({
      method: 'POST',
      url: url,
      data: value.list,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(response => {
      dispatch(receiveBatchmailsSend(response))
      openNotificationWithIcon('success', '批量发送已提交', '发送成功')
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

function sendSingleBatchmailPlayer(value) {
  return (dispatch, getState) => {
    let url = `${SANGO2_API_HOST}/products/batchmails/${value.id}/send/${value.list.index}`
    return axios({
      method: 'POST',
      url: url,
      data: value.list,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(response => {
      dispatch(receiveSingleBatchmailSend(response))
      if (response.data.batchMailPlayer.status === 1) {
        openNotificationWithIcon('success', '单独补发已提交', '补发成功')
      }
      if (response.data.batchMailPlayer.status === 0) {
        openNotificationWithIcon('warning', '单独补发已提交', '补发失败')
      }

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
  fetchBatchmailPlayer,
  clearBatchmailPlayer,
  sendBatchmailPlayers,
  sendSingleBatchmailPlayer
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [BATCHMAIL_PLAYER_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: null
    })
  },
  [BATCHMAIL_PLAYER_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      players: action.payload.data.batchMailPlayers
    })
  },
  [BATCHMAIL_PLAYER_CLEAR]: (state) => {
    return ({
      ...state,
      fetching: false,
      err: null,
      players: []
    })
  },
  [BATCHMAILS_SEND_RECEIVE]: (state, action) => {
    state.players = action.payload.data.batchMailPlayers
    return ({
      ...state,
      fetching: false,
      sends: action.payload.data.batchMailPlayers
    })
  },
  [BATCHMAIL_SEND_RECEIVE]: (state, action) => {
    const itemNum = _.findIndex(state.players, _.find(state.players, {index: action.payload.data.batchMailPlayer.index}))
    state.players[itemNum] = action.payload.data.batchMailPlayer

    return ({
      ...state,
      fetching: false,
      send: action.payload.data.batchMailPlayer
    })
  },
  [BATCHMAIL_PLAYER_ERR]: (state, action) => {
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
  players: [],
  sends: [],
  send: []
}

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
