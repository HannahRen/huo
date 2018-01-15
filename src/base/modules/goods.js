/* global API_HOST */
import axios from 'axios'

// ------------------------------------
// Constants
// ------------------------------------
const GOODS_MAP_REQUEST = 'GOODS_MAP_REQUEST'
const GOODS_MAP_RECEIVE = 'GOODS_MAP_RECEIVE'


// ------------------------------------
// Actions
// ------------------------------------
function requestGoodsMap() {
  return {
    type: GOODS_MAP_REQUEST
  }
}
function receiveGoodsMap(data) {
  return {
    type: GOODS_MAP_RECEIVE,
    payload: data
  }
}


function fetchGoodsMap(data) {
  return (dispatch, getState) => {
    dispatch(requestGoodsMap())
    let url = `${API_HOST}/products/${data.productId}/items/options`
    axios({
      method: 'GET',
      url: url,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('hoolai')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('hoolai')).token}`
      }
    }).then(response => {
      dispatch(receiveGoodsMap(response))
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
  fetchGoodsMap
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GOODS_MAP_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [GOODS_MAP_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      options: action.payload.data.domainObject
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  fetching: false, // 是否正在请求
  options: {}
}

export default function goodsReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
