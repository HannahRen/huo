import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Modal, Cascader } from 'antd'
import _ from 'lodash'

import ModalContainer from './Modal'

class CellFilter extends Component {
  state = {
    currentItem: {},
    modalType: 'create',
    visible: false
  }

  handleCreateCell = () => {
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
        values.productId = values.products ? values.products[0] : this.props.products.value[0]
        this.props.onSearch({
          productId: values.productId,
          handle: 'SEARCH'
        })
      }
    })
  }

  onModalLoad = () => {
    return this.state
  }

  render() {
    const { form: { getFieldDecorator }, options, curd } = this.props

    return (
      <div>
        <Form layout='inline' onSubmit={this.handleSearch}>
          <Row gutter={20} style={{ marginBottom: 8 }}>
            {
              _.has(curd, '20203') &&
              <Col className='gutter-row' span={6}>
                {getFieldDecorator('products', {
                  rules: [{ type: 'array', required: true, message: '请选择产品!' }]
                })(
                  <Cascader
                    placeholder='请选择产品(必选)'
                    showSearch
                    options={options.products.list}
                  />
                )}
              </Col>
            }
            {
              _.has(curd, '20203') &&
              <Col className='gutter-row' span={2}>
                <Button type='primary' htmlType='submit'>查询</Button>
              </Col>
            }
            {
              _.has(curd, '20201') &&
              <Col className='gutter-row' span={2}>
                <Button type='ghost' onClick={this.handleCreateCell}>添加</Button>
              </Col>
            }
          </Row>
        </Form>

        <Modal
          width={1000}
          key='create-cell'
          title='添加节点'
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
        >
          <ModalContainer
            options={options}
            onModalLoad={this.onModalLoad}
            onSubmitting={this.handleCancel}
          />
        </Modal>
      </div>
    )
  }
}

CellFilter.propTypes = {
  curd: PropTypes.object.isRequired,
  form: PropTypes.object,
  options: PropTypes.object,
  products: PropTypes.object,
  onSearch: PropTypes.func,
}

const Filter = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields)
  },
  mapPropsToFields(props) {
    return {
      products: Form.createFormField({
        ...props.products,
        value: props.products.value
      })
    }
  },
  onValuesChange(_, values) {
  }
})(CellFilter)

export default Filter
