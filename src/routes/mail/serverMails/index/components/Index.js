import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card, Alert } from 'antd'
import _ from 'lodash'

import Filter from './Filter'
import List from './List'


export default class Index extends Component {
  static propTypes = {
    login: PropTypes.object.isRequired,
    serverMail: PropTypes.object,
    fetchServerMail: PropTypes.func,
    addServerMail: PropTypes.func,
    passServerEmail: PropTypes.func,
    sendServerMail: PropTypes.func,
    products: PropTypes.object,
    fetchProductsMap: PropTypes.func,
    channel: PropTypes.object,
    fetchChannels: PropTypes.func,
    goods: PropTypes.object,
    fetchGoodsMap: PropTypes.func
  }

  onSearch = (fieldsValue) => {
    this.props.fetchServerMail(fieldsValue)
  }

  onPass = (fieldsValue) => {
    this.props.passServerEmail(fieldsValue)
  }

  onSend = (fieldsValue) => {
    this.props.sendServerMail(fieldsValue)
  }

  onAdd = (fieldsValue) => {
    this.props.addServerMail(fieldsValue)
  }

  componentWillMount() {
    this.props.fetchProductsMap()
    this.props.fetchChannels()
    this.props.fetchGoodsMap({productId: '_'})
  }

  render() {
    const {login: {curd}} = this.props
    // 处理产品，渠道，道具列表
    let options = []
    if (this.props.products.options) {
      options = this.props.products.options
    }

    let channels = []
    if (this.props.channel) {
      _.map(this.props.channel, (value, key) => {
        channels.push(
          {value: key, label: `${value}(${key})`, key: key}
        )
      })
    }

    let goods = []
    if (this.props.goods.options[0]) {
      _.map(this.props.goods.options[0], (value, key) => {
        goods.push(
          {value: key, label: `${value}(${key})`}
        )
      })
    }

    return (
      <div>
        <Alert message='全服邮件发送过程较慢，请耐心等待发送结果，请勿重复发送！'
          type='info'
          showIcon
          closable
          banner
        />
        <Card style={{marginBottom: 6}}>
          <Filter
            curd={curd}
            options={options}
            goods={goods}
            channels={channels}
            onSearch={this.onSearch}
          />
          <List
            curd={curd}
            data={this.props.serverMail}
            options={options}
            goods={goods}
            channels={channels}
            onPass={this.onPass}
            onSend={this.onSend}
            onAdd={this.onAdd}
          />
        </Card>
      </div>
    )
  }

}
