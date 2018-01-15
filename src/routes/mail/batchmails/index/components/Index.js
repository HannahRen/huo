import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card } from 'antd'
import { withRouter } from 'react-router'
import _ from 'lodash'

import Filter from './Filter'
import List from './List'


class Index extends Component {
  static propTypes = {
    fetchGoodsMap: PropTypes.func,
    login: PropTypes.object.isRequired,
    goods: PropTypes.object,
    batchmail: PropTypes.object,
    fetchBatchmail: PropTypes.func,
    addBatchmail: PropTypes.func,
    // clearBatchmailFetch: PropTypes.func,
    clearBatchmailAdd: PropTypes.func,
    updateBatchmail: PropTypes.func,
    router: PropTypes.object
  }

  static childContextTypes = {
    router: PropTypes.object
  }

  getChildContext() {
    return { router: this.props.router }
  }

  componentWillMount() {
    this.props.fetchGoodsMap({productId: '_'})
    // this.props.clearBatchmailFetch()
  }

  // 查询批量邮件
  onSearch = (value) => {
    this.props.fetchBatchmail(value)
  }

  // 添加批量邮件
  onCreate = (value) => {
    this.props.addBatchmail(value)
  }

  // 修改批量邮件
  onUpdate = (value) => {
    this.props.updateBatchmail(value)
  }

  render() {
    const {login: {curd}} = this.props
    let item = []
    if (this.props.goods.options[0]) {
      _.map(this.props.goods.options[0], (value, key) => {
          item.push(
            {value: key, label: `${value}(${key})`}
          )
      })
    }

    return (
      <Card style={{marginBottom: 6}}>
        <Filter
          curd={curd}
          onSearch={this.onSearch}
          onCreate={this.onCreate}
          clearBatchmailAdd={this.props.clearBatchmailAdd}
          item={item}
        />
        <List
          onUpdate={this.onUpdate}
          data={this.props.batchmail.batchmails}
          login={this.props.login}
          fetching={this.props.batchmail.fetching}
          item={item}
        />
      </Card>
    )
  }
}

export default withRouter(Index)
