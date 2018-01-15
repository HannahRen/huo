import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Card } from 'antd'

import Filter from './Filter'
import List from './List'


export default class Index extends Component {

  static propTypes = {
    login: PropTypes.object.isRequired,
    skillMail: PropTypes.object.isRequired,
    sendSkill: PropTypes.func.isRequired,
    fetchSkill: PropTypes.func.isRequired,
    products: PropTypes.object.isRequired,
    fetchProductsMap: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    itemsActionCreator: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.fetchProductsMap()
    this.props.itemsActionCreator('_', 4)
  }

  onSearch = (fieldsValue) => {
    this.props.fetchSkill(fieldsValue)
  }

  onSend = (fieldsValue) => {
    this.props.sendSkill(fieldsValue)
  }

  render() {
    const {login: {curd}} = this.props
    let options = []
    if (this.props.products.options) {
      options = this.props.products.options
    }

    return (
      <div>
        <Card style={{marginBottom: 6}}>
          <Filter
            curd={curd}
            options={options}
            onSend={this.onSend}
            onSearch={this.onSearch}
            item={this.props.item}
          />
          <List
            data={this.props.skillMail.skills}
          />
        </Card>
      </div>
    )
  }
}
