import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Form, Input, Cascader, Button } from 'antd'

import { fetchCellTypes, createCell } from '../modules/Module'

const FormItem = Form.Item

function _hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

const mapDispatchtoProps = {
  fetchCellTypes,
  createCell
}

const mapStateToProps = (state, props) => ({
  enum: props.enum,
  cell: state.cell,
  login: state.islogin
})

@connect(mapStateToProps, mapDispatchtoProps)
class CellModal extends Component {
  state = {
    productId: '',
    cellType: '',
    serverPort: '',
    currentItem: {},
    modalType: ''
  }

  componentWillMount() {
    const { currentItem, modalType } = this.props.onModalLoad()

    this.setState({
      productId: currentItem ? currentItem.productId : this.props.options.products.list[0].value,
      currentItem: modalType === 'create' ? {} : currentItem,
      modalType: modalType
    })
  }

  componentDidMount() {
    this.props.form.validateFields(['products'])
  }

  handleProductSelect = (productId) => {
    this.props.fetchCellTypes({ productId: productId })
    this.setState({
      productId: productId
   })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.state.modalType === 'create') {
          this.props.createCell(values)
        } else {
          this.props.onUpdate(values)
        }
        this.props.onSubmitting()
      }
    })
  }


  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form

    const check = this.state.modalType !== 'create'
    const productsError = isFieldTouched('productId') && getFieldError('productId')

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    }

    const tailFormItemLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 14, offset: 6 }
      }
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          validateStatus={productsError ? 'error' : ''}
          label='产品'
        >
          {getFieldDecorator('products', {
            initialValue: this.state.productId ? [this.state.productId] : [],
            rules: [{ type: 'array', required: true, message: '请选择产品!' }],
            onChange: this.handleProductSelect
          })(
            <Cascader
              options={this.props.options.products.list}
              showSearch
              expandTrigger='hover'
              placeholder='选择产品'
              disabled={check}
            />
          )}
        </FormItem>
        {
          !_hasErrors(getFieldsError(['products'])) &&
          <div>
            <FormItem
              {...formItemLayout}
              label='节点 ID'
            >
              {getFieldDecorator('serverId', {
                initialValue: this.state.currentItem.serverId,
                rules: [{ required: true, message: '请填写节点 ID!', whitespace: true }]
              })(
                <Input disabled={check} placeholder='填写节点 ID' />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='服务器主机 (外网IP)'
            >
              {getFieldDecorator('serverHost', {
                initialValue: this.state.currentItem.serverHost,
                rules: [{ required: true, message: '请填写服务器主机 外网 IP!', whitespace: true }]
              })(
                <Input placeholder='填写服务器主机 外网 IP' />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='服务器主机 (内网IP)'
            >
              {getFieldDecorator('serverLocal', {
                initialValue: this.state.currentItem.serverLocal,
                rules: [{ required: true, message: '请填写服务器主机 内网 IP!', whitespace: true }]
              })(
                <Input placeholder='填写服务器主机 内网 IP' />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label='节点类型/服务器端口/WEB端口'>
              {getFieldDecorator('cellTypes', {
                initialValue: this.state.currentItem.cellType ? [`${this.state.currentItem.cellType}`, `${this.state.currentItem.serverPort}`, `${this.state.currentItem.webPort}`] : ['0'],
                rules: [{ type: 'array', required: true, message: '请选择节点类型、服务器端口、Web 端口!' }]
              })(
                <Cascader
                  options={this.props.options.cell.types}
                  showSearch
                  expandTrigger='hover'
                  placeholder='选择节点类型、服务器端口、Web 端口'
                  // disabled={_hasErrors(getFieldsError(['products']))}
                />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='数据库主机'
            >
              {getFieldDecorator('dbHost', {
                initialValue: this.state.currentItem.dbHost,
                rules: [{ required: true, message: '请填写数据库主机 IP!', whitespace: true }]
              })(
                <Input placeholder='填写数据库主机 IP' />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='数据库端口'
            >
              {getFieldDecorator('dbPort', {
                initialValue: this.state.currentItem.dbPort ? this.state.currentItem.dbPort : '3306',
                rules: [{ required: true, message: '请填写数据库端口，默认3306!', whitespace: true }]
              })(
                <Input placeholder='填写数据库端口，默认3306' />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='跨服ID'
            >
              {getFieldDecorator('crossServerId', {
                initialValue: this.state.currentItem.crossServerId ? this.state.currentItem.crossServerId : '',
                rules: [{ message: '请填写跨服 ID!', whitespace: true }]
              })(
                <Input placeholder='填写跨服 ID' />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='媒体服务器ID'
            >
              {getFieldDecorator('audioServerId', {
                initialValue: this.state.currentItem.audioServerId ? this.state.currentItem.audioServerId : '',
                rules: [{ message: '请填写媒体服务器 ID!', whitespace: true }]
              })(
                <Input placeholder='填写媒体服务器 ID' />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='合服主服务器ID'
            >
              {getFieldDecorator('combineServerId', {
                initialValue: this.state.currentItem.combineServerId ? this.state.currentItem.combineServerId : '',
                rules: [{ message: '请填写合服主服务器 ID!', whitespace: true }]
              })(
                <Input disabled={check} placeholder='填写合服主服务器 ID' />
              )}
            </FormItem>
            {
              this.state.modalType === 'update' &&
              <FormItem
                {...formItemLayout}
                label='状态'
              >
                {getFieldDecorator('status', {
                  initialValue: this.state.currentItem.status ? [this.state.currentItem.status] : [0],
                  rules: [{ type: 'array', required: true, message: '请选择状态!' }]
                })(
                  <Cascader
                    options={this.props.initials.enum.cellStatus}
                    showSearch
                    expandTrigger='hover'
                    placeholder='选择状态'
                  />
                )}
              </FormItem>
            }
          </div>
        }

        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit' >提交</Button>
        </FormItem>
      </Form>
    )
  }
}

CellModal.propTypes = {
  form: PropTypes.object,
  options: PropTypes.object,
  initials: PropTypes.object,
  onModalLoad: PropTypes.func,
  onSubmitting: PropTypes.func,
  onUpdate: PropTypes.func,
  createCell: PropTypes.func,
  fetchCellTypes: PropTypes.func
}

const Modal = Form.create()(CellModal)

export default Modal
