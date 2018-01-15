import React, {Component} from 'react'
import PropTypes from 'prop-types'

import { Form, Input, Button } from 'antd'

const FormItem = Form.Item


class Modals extends Component {

  static propTypes = {
    data: PropTypes.object,
    form: PropTypes.object,
    handleCancel: PropTypes.func,
    updateServerEmailPlayer: PropTypes.func
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, fieldValues) => {
      if (!err) {
        let values = {}
        values.playerName = fieldValues.playerName
        values.index = this.props.data.index
        values.productId = this.props.data.productId
        values.serverId = this.props.data.serverId
        values.id = this.props.data.mailId

        this.props.updateServerEmailPlayer(values)
        this.props.handleCancel()
      }
    })
  }



  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    }
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 14,
          offset: 6
        }
      }
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label='产品ID'
        >
          {getFieldDecorator('productId', {
            initialValue: this.props.data.productId
          })(
            <Input disabled />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='服务器ID'
        >
          {getFieldDecorator('serverId', {
            initialValue: this.props.data.serverId
          })(
            <Input disabled />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='玩家信息'
        >
          {getFieldDecorator('playerName', {
            rules: [{ required: true, message: '请填写邮件标题' }],
            initialValue: this.props.data.playerName
          })(
            <Input placeholder='邮件标题' />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout} >
          <Button type='primary' htmlType='submit' >提交表单</Button>
        </FormItem>
      </Form>
    )
  }
}

const PlayersModal = Form.create()(Modals)

export default PlayersModal
