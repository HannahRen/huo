import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { fetchProductsMap } from '../../../../base/modules/products'
import { fetchCells, fetchCellTypes, updateCell } from '../modules/Module'

import {getCentraCascaderProductId} from '../../form/CentraProductCascader'
import Filter from './Filter.jsx'
import List from './List.jsx'

const mapDispatchtoProps = {
  fetchCells,
  fetchCellTypes,
  fetchProductsMap,
  updateCell
}

const mapStateToProps = (state) => ({
  cell: state.cell,
  products: state.products,
  login: state.islogin
})

@connect(mapStateToProps, mapDispatchtoProps)
export default class Cells extends Component {
  state = {
    fields: {
      products: {
        value: [ '1' ]
      }
    },
    initials: {
      map: {
        cellStatus: { 1: '开启', 2: '维护', 3: '不可用', 4: '初置阶段', 5: '部署完成', 6: '测试' },
        cellTypes: { 'cross': '国战服', 'sango': 'RPG服', 'audio': '语音服' }
      },
      enum: {
        cellStatus: [
          { label: '开启', value: 1 },
          { label: '维护', value: 2 },
          { label: '不可用', value: 3 },
          { label: '初置阶段', value: 4 },
          { label: '部署完成', value: 5 },
          { label: '测试', value: 6 }
        ]
      }
    }
  }

  _reduce = (options) => {
    return _.reduce(options, (result, option) => {
      result.push({ value: option.value, label: option.label })
      return result
    }, [])
  }

  onChange = (changedFields) => {
    this.setState({
      fields: { ...this.state.fields, ...changedFields }
    })
  }

  onSearch = (fields) => {
    if (fields.handle === 'SEARCH') {
      this.props.fetchCells(fields)
    } else if (fields.handle === 'UPDATE') {
      this.props.fetchCellTypes(fields)
    }
  }

  onUpdate = (fields) => {
    this.props.updateCell(fields)
  }

  componentWillMount() {
    this.props.fetchProductsMap()
    let fields = {}
    fields.productId = getCentraCascaderProductId()
    this.props.fetchCells(fields)
  }

  render() {
    const { cell, products, login } = this.props
    let options = {
      products: {
        list: this._reduce(products.options)
      },
      cell: cell,
      login: login
    }
    let initials = this.state.initials
    const {login: {curd}} = this.props
    return (
      <div>
        <Filter
          curd={curd}
          options={options}
          initials={initials}
          {...this.state.fields}
          onChange={this.onChange}
          onSearch={this.onSearch}
        />
        <List
          curd={curd}
          options={options}
          initials={initials}
          onSearch={this.onSearch}
          onUpdate={this.onUpdate}
         />
      </div>
    )
  }
}

Cells.propTypes = {
  login: PropTypes.object,
  cell: PropTypes.object,
  products: PropTypes.object,
  fetchCells: PropTypes.func,
  fetchCellTypes: PropTypes.func,
  fetchProductsMap: PropTypes.func,
  updateCell: PropTypes.func,
}
