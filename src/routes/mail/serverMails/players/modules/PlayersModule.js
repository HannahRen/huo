/* global SANGO2_API_HOST */
import axios from 'axios'
import _ from 'lodash'

import openNotificationWithIcon from '../../../../../../components/notification'


const RECEIVE_SERVERMAILPLAYER_CHECK = 'RECEIVE_OWNMAILPLAYER_CHECK'
const CLEAR_SERVERMAILPLAYER_CHECK = 'CLEAR_OWNMAILPLAYER_CHECK'

const REQUEST_SERVERMAILPLAYER_UPDATE = 'REQUEST_OWNMAILPLAYER_UPDATE'
const RECEIVE_SERVERMAILPLAYER_UPDATE = 'RECEIVE_OWNMAILPLAYER_UPDATE'
const CLEAR_SERVERMAILPLAYER_UPDATE = 'CLEAR_OWNMAILPLAYER_UPDATE'

const SERVERMAILPLAYER_ERR = 'SERVERMAILPLAYER_ERR'


// 查看详情接口
function receiveChecked(data) {
  return {
    type: RECEIVE_SERVERMAILPLAYER_CHECK,
    payload: data
  }
}

function clearCheck() {
  return {
    type: CLEAR_SERVERMAILPLAYER_CHECK
  }
}

function requestErr(data) {
  return {
    type: SERVERMAILPLAYER_ERR,
    payload: data
  }
}

function checkServerMail(value) {
  return (dispatch, getState) => {
    // 验证从复提交
    // if (getState().ownMail.fetching) {
    //   return
    // }
    let url = `${SANGO2_API_HOST}/products/newmails/${value}`
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
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

// 提交接口

function requestUpdate() {
  return {
    type: REQUEST_SERVERMAILPLAYER_UPDATE
  }
}

function receiveUpdated(data) {
  return {
    type: RECEIVE_SERVERMAILPLAYER_UPDATE,
    payload: data
  }
}

function clearUpdatePlayer() {
  return {
    type: CLEAR_SERVERMAILPLAYER_UPDATE
  }
}
function updateServerEmailPlayer(value) {
  return (dispatch, getState) => {
    // 验证从复提交
    if (getState().serverMailPlayer.fetching) {
      return
    }
    dispatch(requestUpdate())
    openNotificationWithIcon('warning', '已提交修改，不要重复点击提交')
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

export {
  clearCheck,
  checkServerMail,
  clearUpdatePlayer,
  updateServerEmailPlayer
}

const ACTION_HANDLERS = {
  [RECEIVE_SERVERMAILPLAYER_CHECK]: (state, action) => {
    return ({
      ...state,
      check: action.payload ? action.payload.data : {}
    })
  },
  [CLEAR_SERVERMAILPLAYER_CHECK]: (state) => {
    return ({
      ...state,
      check: {},
      error: null
    })
  },

  [REQUEST_SERVERMAILPLAYER_UPDATE]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_SERVERMAILPLAYER_UPDATE]: (state, action) => {
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
  [CLEAR_SERVERMAILPLAYER_UPDATE]: (state) => {
    return ({
      ...state,
      fetching: false,
      update: {},
      error: null
    })
  },

  [SERVERMAILPLAYER_ERR]: (state, action) => {
    return ({
      ...state,
      error: { tips: action.payload.tips }
    })
  }
}

const initialState = { // 数据结构
  fetching: false,
  check: {},
  update: {},
  error: null
}

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
