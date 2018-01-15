/* global API_HOST */
import axios from 'axios'

// ------------------------------------
// Constants
// ------------------------------------
const REQUEST_CHANNELS = 'REQUEST_CHANNELS'
const RECEIVE_CHANNELS = 'RECEIVE_CHANNELS'

const KEEPING_CHANNELS = 'KEEPING_CHANNELS'

// ------------------------------------
// Actions
// ------------------------------------
function requestChannels() {
  return {
    type: REQUEST_CHANNELS
  }
}
function receiveChannels(data) {
  return {
    type: RECEIVE_CHANNELS,
    payload: data
  }
}
function keepChannels(data) {
  return {
    type: KEEPING_CHANNELS,
    payload: data
  }
}

function fetchChannels() {
  return (dispatch, getState) => {
    dispatch(requestChannels())
    let url = `${API_HOST}/products/channels`
    axios({
      method: 'GET',
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receiveChannels(response))
    }).catch(error => {
      if (error.response) {
        console.log(error.response.data)
      } else {
        // 一些错误是在设置请求的时候触发
        console.log('Error', error.message)
      }
    })
  }
}

export {
  fetchChannels,
  keepChannels
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUEST_CHANNELS]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_CHANNELS]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      map: Object.assign({}, ...state, action.payload.data.domainObject)
    })
  },
  [KEEPING_CHANNELS]: (state, action) => {
    // console.log(action.payload)
    return ({
      ...state,
      keeping: Object.assign({}, action.payload)
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  fetching: false, // 是否正在请求
  map: {},
  keeping: {}
}

export default function channelsReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
