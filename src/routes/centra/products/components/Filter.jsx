import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Modal } from 'antd'
import _ from 'lodash'

import ProductModal from './Modal'

class ProductFilter extends Component {
  state = {
    currentItem: {},
    modalType: 'create',
    visible: false
  }

  handleCreateProduct = () => {
    this.setState({
      visible: true
    })
  }
  handleCancel = (e) => {
    this.setState({
      visible: false
    })
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onSearch()
      }
    })
  }

  onModalLoad = () => {
    return this.state
  }

  render() {
    const {curd} = this.props
    return (
      <div>
        <Form layout='inline' onSubmit={this.handleSearch}>
          <Row gutter={20} style={{ marginBottom: 6 }}>
            {
              _.has(curd, '20103') &&
              <Col className='gutter-row' span={2}>
                <Button type='primary' htmlType='submit'>查询</Button>
              </Col>
            }
            {
              _.has(curd, '20101') &&
              <Col className='gutter-row' span={2}>
                <Button type='ghost' onClick={this.handleCreateProduct}>添加</Button>
              </Col>
            }
          </Row>
        </Form>

        <Modal
          width={1000}
          key={Math.random()}
          title='添加产品'
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
        >
          <ProductModal
            onModalLoad={this.onModalLoad}
            onCreate={this.props.onCreate}
            onSubmitting={this.handleCancel}
          />
        </Modal>
      </div>
    )
  }
}

ProductFilter.propTypes = {
  curd: PropTypes.object.isRequired,
  onCreate: PropTypes.func,
  onSearch: PropTypes.func,
  form: PropTypes.object
}

const Filter = Form.create()(ProductFilter)

export default Filter
