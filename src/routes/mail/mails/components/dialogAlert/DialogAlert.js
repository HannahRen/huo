import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import { Modal } from 'antd'

import {mappedForKeys, mappedForType, mappedForStatus} from '../../modules/Mapping'

export function info(data) {
  let arr = []
  _.map(data.data, (value, key, collection) => {
    // console.log(value, key)

    if (key === 'productId') {
      arr.push(
        <li key={key}>
          <span>{mappedForKeys[key]}</span>
          <span>{_.toString(value)}</span>
        </li>
      )
    }

    if (key === 'level') {
      arr.push(
        <li key={key}>
          <span>{mappedForKeys[key]}</span>
          <span>{_.toString(value)}</span>
        </li>
      )
    }

    if (key === 'serverIdList') {
      arr.push(
        <li key={key}>
          <span>{mappedForKeys[key]}</span>
          <span>{_.join(value, '、')}</span>
        </li>
      )
    }

    // if (key === 'title') {
    //   arr.push(
    //     <li key={key}>
    //       <span>{mappedForKeys[key]}</span>
    //       <span>{_.toString(value)}</span>
    //     </li>
    //   )
    // }

    if (key === 'type') {
      arr.push(
        <li key={key}>
          <span>{mappedForKeys[key]}</span>
          <span>{mappedForType[value]}</span>
        </li>
      )
    }

    if (key === 'content') {
      arr.push(
        <li key={key}>
          <span>{mappedForKeys[key]}</span>
          <span>{_.toString(value)}</span>
        </li>
      )
    }

    if (key === 'senderName') {
      arr.push(
        <li key={key}>
          <span>{mappedForKeys[key]}</span>
          <span>{_.toString(value)}</span>
        </li>
      )
    }

    if (key === 'channelList') {
      arr.push(
        <li key={key}>
          <span>{mappedForKeys[key]}</span>
          <span>{_.join(value, '、')}</span>
        </li>
      )
    }

    if (key === 'receiveName') {
      arr.push(
        <li key={key}>
          <span>{mappedForKeys[key]}</span>
          <span>{_.toString(value)}</span>
        </li>
      )
    }

    if (key === 'createTime') {
      arr.push(
        <li key={key}>
          <span>{mappedForKeys[key]}</span>
          <span>{moment(value).format('YYYY-MM-DD HH:mm:ss')}</span>
        </li>
      )
    }

    if (key === 'itemList') {
      let deep = _.flatMap(value, (n) => [`道具名:${n.name}、`, `ID:${n.itemId}、`, `数量:${n.num}`])
      let chunk = _.chunk(deep, 3)
      let arrP = []
      _.map(chunk, (v, k, c) => {
        arrP.push(
          <p key={k}>{v}</p>
        )
      })
      arr.push(
        <li key={key}>
          <span>{mappedForKeys[key]}</span>
          <span>{arrP}</span>
        </li>
      )
    }

    if (key === 'id') {
      arr.push(
        <li key={key}>
          <span>{mappedForKeys[key]}</span>
          <span>{_.toString(value)}</span>
        </li>
      )
    }

    if (key === 'status') {
      arr.push(
        <li key={key}>
          <span>{mappedForKeys[key]}</span>
          <span>{mappedForStatus[value]}</span>
        </li>
      )
    }

  })

  Modal.info({
    title: '查看详细信息',
    width: 600,
    content: (
      <div className='box-large'>
        <ul className='box-list'>
          {arr}
        </ul>
      </div>
    ),
    onOk() {}
  })
}

export function success() {
  Modal.success({
    title: 'This is a success message',
    content: 'some messages...some messages...'
  })
}

export function error() {
  Modal.error({
    title: 'This is an error message',
    content: 'some messages...some messages...'
  })
}

export function warning() {
  Modal.warning({
    title: 'This is a warning message',
    content: 'some messages...some messages...'
  })
}
