/* global SANGO2_API_HOST */
import axios from 'axios'

import openNotificationWithIcon from '../../../../../components/notification'


// ------------------------------------
// Constants
// ------------------------------------
const REQUEST_FETCH_SKILL = 'REQUEST_FETCH_SKILL'
const RECEIVE_FETCH_SKILL = 'RECEIVE_FETCH_SKILL'
const CLEAR_FETCH_SKILL = 'CLEAR_FETCH_SKILL'

const REQUEST_SKILL = 'REQUEST_SKILL'
const RECEIVE_SKILL = 'RECEIVE_SKILL'
const SKILL_ERR = 'SKILL_ERR'

// ------------------------------------
// Actions
// ------------------------------------
function requestSkillFetch () {
  return {
    type: REQUEST_FETCH_SKILL
  }
}

function receiveSkillFetch (data) {
  return {
    type: RECEIVE_FETCH_SKILL,
    payload: data
  }
}

function clearSkillFetch () {
  return {
    type: CLEAR_FETCH_SKILL
  }
}

function requestSkill () {
  return {
    type: REQUEST_SKILL
  }
}

function receiveSkill () {
  return {
    type: RECEIVE_SKILL
  }
}

function requestErr(data) {
  return {
    type: SKILL_ERR,
    payload: data
  }
}

function fetchSkill(value) {
  return (dispatch, getState) => {
    const { products, nickname, times } = value

    dispatch(requestSkillFetch())
    let url = `${SANGO2_API_HOST}/products/${products[0]}/mails/skills`
    axios({
      method: 'GET',
      url: url,
      params: {
        nickname,
        serverId: products[1],
        startTime: times[0],
        endTime: times[1]
      },
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(response => {
      dispatch(receiveSkillFetch(response))
    }).catch(error => {
      if (error.response) {
        dispatch(requestErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function sendSkill(value) {
  return (dispatch, getState) => {

    const { products, nickname, skillId } = value

    dispatch(requestSkill())
    let url = `${SANGO2_API_HOST}/products/${products[0]}/mails/servers/${products[1]}/sendskill`
    axios({
      method: 'POST',
      url: url,
      data: {
        nickname,
        skillId: skillId[0]
      },
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      }
    }).then(response => {
      dispatch(receiveSkill())
      openNotificationWithIcon('success', '发送成功!', response.data.msg)
    }).catch(error => {
      if (error.response) {
        dispatch(requestErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export {
  sendSkill,
  fetchSkill,
  clearSkillFetch
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUEST_FETCH_SKILL]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_FETCH_SKILL]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      skills: action.payload ? action.payload.data.domainObject : []
    })
  },
  [CLEAR_FETCH_SKILL]: (state) => {
    return ({
      ...state,
      fetching: false,
      skills: [],
      err: null
    })
  },
  [REQUEST_SKILL]: (state) => {
    return ({
      ...state,
      sending: true
    })
  },
  [RECEIVE_SKILL]: (state, action) => {
    return ({
      ...state,
      sending: false
    })
  },
  [SKILL_ERR]: (state, action) => {
    return ({
      ...state,
      sending: false,
      error: { tips: action.data.tips }
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  sending: false,
  fetching: false,
  err: false,
  skills: []
}
export default function mailsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
