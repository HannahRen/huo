import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card } from 'antd'
import _ from 'lodash'

import Filter from './Filter'
import List from './List'


export default class Index extends Component {
  static propTypes = {
    login: PropTypes.object.isRequired,
    allianceMail: PropTypes.object,
    fetchAllianceMail: PropTypes.func,
    addAllianceMail: PropTypes.func,
    passAllianceEmail: PropTypes.func,
    sendAllianceMail: PropTypes.func,
    products: PropTypes.object,
    fetchProductsMap: PropTypes.func,
    goods: PropTypes.object,
    fetchGoodsMap: PropTypes.func
  }

  onSearch = (fieldsValue) => {
    this.props.fetchAllianceMail(fieldsValue)
  }

  onPass = (fieldsValue) => {
    this.props.passAllianceEmail(fieldsValue)
  }

  onSend = (fieldsValue) => {
    this.props.sendAllianceMail(fieldsValue)
  }

  onAdd = (fieldsValue) => {
    this.props.addAllianceMail(fieldsValue)
  }

  componentWillMount() {
    this.props.fetchProductsMap()
    this.props.fetchGoodsMap({productId: '_'})
  }

  render() {
    const {login: {curd}} = this.props
    let options = []
    if (this.props.products.options) {
      options = this.props.products.options
    }
    //
    // let channels = []
    // if (this.props.channel) {
    //   _.map(this.props.channel, (value, key) => {
    //     channels.push(
    //       {value: key, label: `${value}(${key})`, key: key}
    //     )
    //   })
    // }
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
        <Card style={{marginBottom: 6}}>
          <Filter
            curd={curd}
            options={options}
            goods={goods}
            onSearch={this.onSearch}
          />
          <List
            curd={curd}
            data={this.props.allianceMail}
            options={options}
            goods={goods}
            onPass={this.onPass}
            onSend={this.onSend}
            onAdd={this.onAdd}
          />
        </Card>
      </div>
    )
  }

}
