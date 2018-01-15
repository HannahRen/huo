import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Filter from './Filter'
import List from './List'
import {
  fetchProducts,
  clearProducts,
  createProduct,
  reloadProduct,
  updateProduct
} from '../modules/Module'

const mapDispatchtoProps = {
  fetchProducts,
  clearProducts,
  createProduct,
  reloadProduct,
  updateProduct
}

const mapStateToProps = (state) => ({
  product: state.product,
  login: state.islogin
})

@connect(mapStateToProps, mapDispatchtoProps)
export default class Products extends Component {

  componentWillMount() {
    this.props.fetchProducts()
  }

  onSearch = () => {
    this.props.fetchProducts()
  }

  onClear = () => {
    this.props.clearProducts()
  }

  onReloadItem = (fields) => {
    this.props.reloadProduct(fields)
  }

  onCreate = (fields) => {
    this.props.createProduct(fields)
  }

  onUpdate = (fields) => {
    this.props.updateProduct(fields)
  }

  render() {
    const {login: {curd}} = this.props
    return (
      <div>
        <Filter
          curd={curd}
          onSearch={this.onSearch}
          onCreate={this.onCreate}
          onClear={this.onClear}
        />
        <List
          curd={curd}
          onUpdate={this.onUpdate}
          onReloadItem={this.onReloadItem}
          data={this.props.product}
         />
      </div>
    )
  }
}

Products.propTypes = {
  login: PropTypes.object,
  product: PropTypes.object,
  fetchProducts: PropTypes.func,
  clearProducts: PropTypes.func,
  createProduct: PropTypes.func,
  updateProduct: PropTypes.func,
  reloadProduct: PropTypes.func,
}
