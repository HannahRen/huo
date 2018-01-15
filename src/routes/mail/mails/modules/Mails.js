/* global SANGO2_API_HOST */
import axios from 'axios'
import _ from 'lodash'

import openNotificationWithIcon from '../../../../../components/notification'
import alertInfo from '../components/dialogAlert'

import {singOut} from '../../../../../modules/login'

// ------------------------------------
// Constants
// ------------------------------------
const REQUEST_MAILS = 'REQUEST_MAILS'
const RECEIVE_MAILS = 'RECEIVE_MAILS'
const REQUEST_ADD_MAIL = 'REQUEST_ADD_MAIL'
const RECEIVE_ADD_MAIL = 'RECEIVE_ADD_MAIL'
const ERR_ADD_MAIL = 'ERR_ADD_MAIL'
const REQUEST_FIND_MAIL = 'REQUEST_FIND_MAIL'
const RECEIVE_FIND_MAIL = 'RECEIVE_FIND_MAIL'
const REQUEST_SKILL = 'REQUEST_SKILL'
const RECEIVE_SKILL = 'RECEIVE_SKILL'

const KEEPING_MAILS = 'KEEPING_MAILS'

// ------------------------------------
// Actions
// ------------------------------------

function requestMails () {
  return {
    type: REQUEST_MAILS
  }
}
function receiveMails (data) {
  return {
    type: RECEIVE_MAILS,
    list: data
  }
}
function requestAddMail () {
  return {
    type: REQUEST_ADD_MAIL
  }
}
function receiveAddMail (data) {
  return {
    type: RECEIVE_ADD_MAIL,
    data: data
  }
}
// function receiveAddErr(data) {
//   return {
//     type: ERR_ADD_MAIL,
//     data: data
//   }
// }
function requestFindMails () {
  return {
    type: REQUEST_FIND_MAIL
  }
}
function receiveFindMails (data) {
  return {
    type: RECEIVE_FIND_MAIL,
    data: data
  }
}
function requestSkill () {
  return {
    type: REQUEST_SKILL
  }
}
// function receiveSkill () {
//   return {
//     type: RECEIVE_SKILL
//   }
// }
function keepMails(data) {
  return {
    type: KEEPING_MAILS,
    payload: data
  }
}

function mailsSearchActionCreator(value = {}) {
  return (dispatch, getState) => {
    let myState = getState()
    console.log('getState():', myState)
    console.log('Search values of form: ', value)
    dispatch(requestMails())
    let url = `${SANGO2_API_HOST}/products/${value.products[0]}/mails?serverId=${value.products[1]}&nickname=${value.nickname}&pageNum=1&pageSize=25&startTime=${value['range-time-picker'][0].format('YYYY-MM-DD HH:mm:ss')}&endTime=${value['range-time-picker'][1].format('YYYY-MM-DD HH:mm:ss')}`
    axios({
      method: 'get',
      url: url,
      headers: {
        'productId': value.products[0],
        'serverId': value.products[1],
        'adminUserId': myState.islogin.admin.data.admin.adminUserId,
        'Authorization': `bearer ${myState.islogin.admin.data.admin.token}`
      }
    }).then(data => {
      dispatch(receiveMails(data.data.domainObject))
    }).catch(error => {
      if (error.response) {
        if (error.response.data.message === 'token异常，请重新登录。') {
          openNotificationWithIcon('warning', '登录过期', error.response.data.message, 3)
          dispatch(singOut())
        }
      } else if (error.request) {
        console.log(error.request)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function addMail(value = {}) {
  return (dispatch, getState) => {
    let url
    let myState = getState()
    console.log('getState():', myState)
    console.log('Search values of form: ', value)

    if (value.keys.length > 0) {
      value.itemList = []
      value.keys.map(function(elem, index) {
        let item = {
          itemId: value['item-' + elem][0],
          num: value['number-' + elem]
        }
        value.itemList.push(item)
      })
      url = `${SANGO2_API_HOST}/products/${value.product}/mails`
    } else {
      url = `${SANGO2_API_HOST}/products/${value.product}/mails/nonitems`
    }

    dispatch(requestAddMail())
    openNotificationWithIcon('info', '发送中！请稍等', '在没有成功前请不要重复点击Dailog')
    axios({
      method: 'post',
      url: url,
      data: {
        content: value.content,
        productId: value.product,
        receiveName: value.receiveName !== undefined ? value.receiveName : value.receiveName_2,
        type: _.toNumber(value.type ? 1 : 2),
        serverType: _.toNumber(value.serverType ? 1 : 2),
        userType: value.userType,
        title: value.title,
        level: value.level,
        senderName: value.senderName,
        serverIdList: value.servers === undefined ? [] : value.servers.filter(elm => elm !== null),
        serverIdStr: value.serversStr,
        itemList: value.itemList,
        channelList: value.channels === undefined ? [] : value.channels.filter(elm => elm !== null)
      },
      headers: {
        'productId': value.product,
        'adminUserId': myState.islogin.admin.data.admin.adminUserId,
        'Authorization': `bearer ${myState.islogin.admin.data.admin.token}`
      }
    }).then(data => {
      if (data.data.fails) {
        openNotificationWithIcon('error', '失败', data.data.fails)
      } else {
        dispatch(receiveAddMail(data))
        openNotificationWithIcon('success', '添加成功')
      }
    }).catch(error => {
      if (error.response) {
        if (error.response.data.message === 'token异常，请重新登录。') {
          openNotificationWithIcon('warning', '登录过期', error.response.data.message, 3)
          dispatch(singOut())
        } else {
          openNotificationWithIcon('error', '失败', error.response.data.tips)
        }
      } else if (error.request) {
        console.log(error.request)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function fetchMail(...value) {
  return (dispatch, getState) => {
    let myState = getState()
    console.log('getState():', myState)
    console.log('Search values of form: ', value)

    dispatch(requestFindMails())
    let url = `${SANGO2_API_HOST}/products/${value[1]}/mails/${value[0]}`
    axios({
      method: 'get',
      url: url,
      headers: {
        'productId': value[1],
        'adminUserId': myState.islogin.admin.data.admin.adminUserId,
        'Authorization': `bearer ${myState.islogin.admin.data.admin.token}`
      }
    }).then(data => {
      dispatch(receiveFindMails(data))
      alertInfo(data)
      // openNotificationWithIcon('info', data.data.id, data.data.title)
    }).catch(error => {
      if (error.response) {
        if (error.response.data.message === 'token异常，请重新登录。') {
          openNotificationWithIcon('warning', '登录过期', error.response.data.message, 3)
          dispatch(singOut())
        }
      } else if (error.request) {
        console.log(error.request)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

function sendSkill(value) {
  return (dispatch, getState) => {
    let myState = getState()
    console.log('getState():', myState)
    console.log('Search values of form: ', value)

    const { products, nickname, skillId } = value

    dispatch(requestSkill())
    let url = `${SANGO2_API_HOST}/products/${products[0]}/mails/servers/${products[1]}/sendskill`
    axios({
      method: 'post',
      url: url,
      data: {
        nickname,
        skillId: skillId[0]
      },
      headers: {
        'adminUserId': myState.islogin.admin.data.admin.adminUserId,
        'Authorization': `bearer ${myState.islogin.admin.data.admin.token}`
      }
    }).then(data => {
      dispatch(requestSkill())
      openNotificationWithIcon('success', data.data.msg)
    }).catch(error => {
      if (error.response) {
        if (error.response.data.message === 'token异常，请重新登录。') {
          openNotificationWithIcon('warning', '登录过期', error.response.data.message, 3)
          dispatch(singOut())
        }
      } else if (error.request) {
        console.log(error.request)
      } else {
        console.log('Error', error.message)
      }
    })
  }
}

export {
  mailsSearchActionCreator,
  addMail,
  fetchMail,
  sendSkill,
  keepMails
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUEST_MAILS]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_MAILS]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      list: [...action.list]
    })
  },
  [REQUEST_ADD_MAIL]: (state) => {
    return ({
      ...state,
      fetching: true,
      err: false,
      errMes: {}
    })
  },
  [RECEIVE_ADD_MAIL]: (state, action) => {
    return ({
      ...state,
      addMail: Object.assign({}, ...state, action.data),
      fetching: false
    })
  },
  [ERR_ADD_MAIL]: (state, action) => {
    return ({
      ...state,
      errMes: Object.assign({}, ...state, action.data),
      fetching: false,
      err: true
    })
  },
  [REQUEST_FIND_MAIL]: (state, action) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_FIND_MAIL]: (state, action) => {
    return ({
      ...state,
      fetching: false,
      read: Object.assign({}, ...state, action.data)
    })
  },
  [REQUEST_SKILL]: (state) => {
    return ({
      ...state,
      fetching: true
    })
  },
  [RECEIVE_SKILL]: (state) => {
    return ({
      ...state,
      fetching: false
    })
  },
  [KEEPING_MAILS]: (state, action) => {
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
  fetching: false,
  err: false,
  errMes: {},
  addMail: {},
  list: [],
  read: {},
  keeping: {}
}
export default function mailsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
