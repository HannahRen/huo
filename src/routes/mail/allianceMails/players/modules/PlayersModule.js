/* global SANGO2_API_HOST */
import axios from 'axios'
import _ from 'lodash'

import openNotificationWithIcon from '../../../../../../components/notification'


const RECEIVE_ALLIANCEMAILPLAYER_CHECK = 'RECEIVE_ALLIANCEMAILPLAYER_CHECK'
const CLEAR_ALLIANCEMAILPLAYER_CHECK = 'CLEAR_ALLIANCEMAILPLAYER_CHECK'

const REQUEST_ALLIANCEMAILPLAYER_UPDATE = 'REQUEST_ALLIANCEMAILPLAYER_UPDATE'
const RECEIVE_ALLIANCEMAILPLAYER_UPDATE = 'RECEIVE_ALLIANCEMAILPLAYER_UPDATE'
const CLEAR_ALLIANCEMAILPLAYER_UPDATE = 'CLEAR_ALLIANCEMAILPLAYER_UPDATE'

const ALLIANCEMAILPLAYER_ERR = 'ALLIANCEMAILPLAYER_ERR'


// 查看详情接口
function receiveChecked(data) {
  return {
    type: RECEIVE_ALLIANCEMAILPLAYER_CHECK,
    payload: data
  }
}

function clearCheck() {
  return {
    type: CLEAR_ALLIANCEMAILPLAYER_CHECK
  }
}

function requestErr(data) {
  return {
    type: ALLIANCEMAILPLAYER_ERR,
    payload: data
  }
}

function checkAllianceMail(value) {
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
    if (getState().allianceMailPlayer.fetching) {
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

export {
  clearCheck,
  checkAllianceMail,
  clearUpdatePlayer,
  updateAllianceEmailPlayer
}

const ACTION_HANDLERS = {
  [RECEIVE_ALLIANCEMAILPLAYER_CHECK]: (state, action) => {
    return ({
      ...state,
      check: action.payload ? action.payload.data : {}
    })
  },
  [CLEAR_ALLIANCEMAILPLAYER_CHECK]: (state) => {
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

  [ALLIANCEMAILPLAYER_ERR]: (state, action) => {
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
