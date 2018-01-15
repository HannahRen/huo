import _ from 'lodash'

import AxiosAPI from '../../../../../utils/axios-api'
import openNotificationWithIcon from '../../../../base/components/Notification'

// ------------------------------------
// Constants
// ------------------------------------
const CELL_LIST_REQUEST = 'CELL_LIST_REQUEST'
const CELL_LIST_REQUEST_ERR = 'CELL_LIST_REQUEST_ERR'
const CELL_LIST_RECEIVE = 'CELL_LIST_RECEIVE'
const CELL_LIST_CLEAR = 'CELL_LIST_CLEAR'

const CELL_TYPES_REQUEST = 'CELL_TYPES_REQUEST'
const CELL_TYPES_RECEIVE = 'CELL_TYPES_RECEIVE'

const CELL_CREATE_REQUEST = 'CELL_CREATE_REQUEST'
const CELL_CREATE_REQUEST_ERR = 'CELL_CREATE_REQUEST_ERR'
const CELL_CREATE_RECEIVE = 'CELL_CREATE_RECEIVE'

const REFRESH_CELLS_REDUCER = 'REFRESH_CELLS_REDUCER'

// ------------------------------------
// Actions
// ------------------------------------

function requestCells() {
  return {
    type: CELL_LIST_REQUEST
  }
}

function requestErr(data) {
  return {
    type: CELL_LIST_REQUEST_ERR,
    payload: data
  }
}

function receiveCells(data) {
  return {
    type: CELL_LIST_RECEIVE,
    payload: data
  }
}

function clearCells() {
  return {
    type: CELL_LIST_CLEAR
  }
}

function requestCellTypes() {
  return {
    type: CELL_TYPES_REQUEST
  }
}

function receiveCellTypes(data) {
  return {
    type: CELL_TYPES_RECEIVE,
    payload: data
  }
}

function requestCreate() {
  return {
    type: CELL_CREATE_REQUEST
  }
}

function requestCreateErr(data) {
  return {
    type: CELL_CREATE_REQUEST_ERR,
    payload: data
  }
}

function receiveCreate(data) {
  return {
    type: CELL_CREATE_RECEIVE,
    payload: data
  }
}

function refreshCellsReducer(data) {
  return {
    type: REFRESH_CELLS_REDUCER,
    data: data
  }
}


function fetchCells(data) {
  return (dispatch, getState) => {
    dispatch(requestCells())
    let url = `/huo/products/${data.productId}/cells`
    AxiosAPI({
      method: 'GET',
      url: url
    }).then(response => {
      dispatch(receiveCells(response))
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

function fetchCellTypes(data) {
  return (dispatch, getState) => {
    dispatch(requestCellTypes())
    let url = `/huo/products/${data.productId}/cells/types`
    AxiosAPI({
      method: 'GET',
      url: url
    }).then(response => {
      dispatch(receiveCellTypes(response))
    }).catch(error => {
      if (error.response) {
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function createCell(data) {
  return (dispatch, getState) => {

    data.productId = data.products[0]
    data.cellType = data.cellTypes[0]
    data.serverPort = data.cellTypes[1]

    dispatch(requestCreate())
    let url = `/huo/products/${data.productId}/cells`
    AxiosAPI({
      method: 'POST',
      url: url,
      data: data,
    }).then(response => {
      dispatch(receiveCreate(response))
      openNotificationWithIcon('success', '添加成功')
    }).catch(error => {
      if (error.response) {
        dispatch(requestCreateErr(error.response.data))
        openNotificationWithIcon('error', error.response.status, error.response.data.tips)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function updateCell(data) {
  return (dispatch, getState) => {

    data.productId = data.products[0]
    data.cellType = data.cellTypes[0]
    data.serverPort = data.cellTypes[1]
    data.status = data.status[0]

    let url = `/huo/products/${data.productId}/cells/${data.serverId}`
    AxiosAPI({
      method: 'PUT',
      url: url,
      data: data,
    }).then(response => {
      dispatch(refreshCellsReducer(response))
      openNotificationWithIcon('success', '更新成功')
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
  fetchCells,
  clearCells,
  fetchCellTypes,
  createCell,
  updateCell
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [CELL_LIST_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {}
    })
  },
  [CELL_LIST_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      list: action.payload.data ? action.payload.data.domainObject : []
    })
  },
  [CELL_LIST_CLEAR]: (state) => {
    return ({
      ...state,
      fetching: false,
      err: false,
      errMes: {},
      list: []
    })
  },
  [CELL_LIST_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: { tips: action.payload.response.data.tips }
    })
  },
  [CELL_TYPES_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [CELL_TYPES_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      types: action.payload.data.cellTypes
    })
  },
  [CELL_CREATE_REQUEST]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {}
    })
  },
  [CELL_CREATE_REQUEST_ERR]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      err: true,
      errMes: action.payload ? { tips: action.payload.response.data.tips } : {}
    })
  },
  [CELL_CREATE_RECEIVE]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      create: action.payload.data
    })
  },
  [REFRESH_CELLS_REDUCER]: (state, action) => {
    const list = [...state.list]
    _.map(list, (val, index) => {
      if (val.serverId === action.data.data.serverId) {
        val = Object.assign(val, action.data.data)
      }
    })
    return ({
      ...state,
      list: [...list]
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { // 数据结构
  fetching: false,
  err: false,
  errMes: {},
  list: [],
  types: [],
  create: {},
  update: {}
}

export default function(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler
    ? handler(state, action)
    : state
}
