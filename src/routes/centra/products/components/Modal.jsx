import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button } from 'antd'
const FormItem = Form.Item
const TextArea = Input.TextArea


class ProductModal extends Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values.modalType === 'create') {
          this.props.onCreate(values)
        } else {
          this.props.onUpdate(values)
        }
        this.props.onSubmitting()
      }
    })
  }

  render() {
    const { form: { getFieldDecorator } } = this.props
    const { currentItem, modalType } = this.props.onModalLoad()
    const check = modalType !== 'create'
    const item = modalType === 'create' ? {} : currentItem

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
        <FormItem {...formItemLayout} label='产品 ID' hasFeedback>
          {getFieldDecorator('productId', {
            initialValue: item.productId,
            rules: [{ required: true, message: '请填写产品 ID!', whitespace: true }]
          })(
            <Input disabled={check} placeholder='填写产品 ID' />
          )
          }
        </FormItem>

        <FormItem {...formItemLayout} label='产品描述' hasFeedback>
          {getFieldDecorator('description', {
            initialValue: item.description,
            rules: [{ required: true, message: '请填写产品描述!', whitespace: true }]
          })(
            <TextArea autosize='true' placeholder='填写产品描述' />
          )}
        </FormItem>


        <FormItem {...formItemLayout} label='充值链接' hasFeedback>
          {getFieldDecorator('paymentUrl', {
            initialValue: item.paymentUrl,
            rules: [{ required: false, message: '请填写充值链接!', whitespace: true }]
          })(
            <Input placeholder='填写充值链接' />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label='支付密钥' hasFeedback>
          {getFieldDecorator('paymentKey', {
            initialValue: item.paymentKey,
            rules: [{ required: false, message: '请填写支付密钥!', whitespace: false }]
          })(
            <Input placeholder='填写支付密钥' />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label='数据库用户名' hasFeedback>
          {getFieldDecorator('dbUser', {
            initialValue: item.dbUser,
            rules: [{ required: false, message: '请填写数据库用户名!', whitespace: true }]
          })(
            <Input placeholder='填写数据库用户名' />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label='数据库密码' hasFeedback>
          {getFieldDecorator('dbPass', {
            initialValue: item.dbPass,
            rules: [{ required: false, message: '请填写数据库密码!', whitespace: true }]
          })(
            <Input placeholder='填写数据库密码' />
          )}
        </FormItem>

        <FormItem>
          {getFieldDecorator('modalType', {
            initialValue: modalType
          })(
            <Input type='hidden' />
        )}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit' >提交</Button>
        </FormItem>
      </Form>
    )
  }
}

ProductModal.propTypes = {
  form: PropTypes.object,
  onModalLoad: PropTypes.func,
  onSubmitting: PropTypes.func,
  onUpdate: PropTypes.func,
  onCreate: PropTypes.func
}

const Modal = Form.create()(ProductModal)

export default Modal
