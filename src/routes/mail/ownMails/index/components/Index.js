import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Card } from 'antd'
import _ from 'lodash'

import { fetchOwnMail, clearPass, passOwnMail, addOwnMail, sendOwnMail } from './../modules/Module'
import { fetchProductsMap } from '../../../../../base/modules/products'
import { fetchGoodsMap } from '../../../../../base/modules/goods'
import { fetchChannels } from '../../../../../base/modules/channels'

import Filter from './Filter'
import List from './List'


const mapDispatchtoProps = {
  fetchChannels,
  fetchProductsMap,
  fetchGoodsMap,
  fetchOwnMail,
  clearPass,
  passOwnMail,
  addOwnMail,
  sendOwnMail
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  ownMail: state.ownMail,
  products: state.products,
  goods: state.goods,
  channel: state.channels.map
})

@connect(mapStateToProps, mapDispatchtoProps)
export default class Index extends Component {
  static propTypes = {
    login: PropTypes.object.isRequired,
    ownMail: PropTypes.object,
    fetchOwnMail: PropTypes.func,
    addOwnMail: PropTypes.func,
    passOwnMail: PropTypes.func,
    sendOwnMail: PropTypes.func,
    products: PropTypes.object,
    // fetchProductsMap: PropTypes.func,
    goods: PropTypes.object
    // fetchGoodsMap: PropTypes.func
  }

  onSearch = (fieldsValue) => {
    this.props.fetchOwnMail(fieldsValue)
  }

  onPass = (fieldsValue) => {
    this.props.passOwnMail(fieldsValue)
  }

  onAdd = (fieldsValue) => {
    this.props.addOwnMail(fieldsValue)
  }

  onSend = (fieldsValue) => {
    this.props.sendOwnMail(fieldsValue)
  }

  componentWillMount() {
    // console.log(this.props.fetchProductsMap())
    // console.log(this.props.fetchGoodsMap({productId: '_'}))
    // this.props.fetchProductsMap()
    // this.props.fetchGoodsMap({productId: '_'})
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
            onAdd={this.onAdd}
          />
          <List
            curd={curd}
            data={this.props.ownMail}
            options={options}
            goods={goods}
            onPass={this.onPass}
            onAdd={this.onAdd}
            onSend={this.onSend}
          />
        </Card>
      </div>
    )
  }

}
