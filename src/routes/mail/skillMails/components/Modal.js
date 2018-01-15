import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Cascader, Button } from 'antd'
import _ from 'lodash'

const FormItem = Form.Item

class Modal extends Component {
  static propTypes = {
    handleCancel: PropTypes.func,
    onSend: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
    options: PropTypes.array.isRequired,
    item: PropTypes.object.isRequired
  }

  _itemReduce = (options) => {
    return _.reduce(options, (result, option, key) => {
      result.push({ value: _.toNumber(key), label: `${option}(${key})` })
      return result
    }, [])
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onSend(values)
        this.props.handleCancel()
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form

    const itemsLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 }
      }
    }

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

    let skillPt = this._itemReduce(this.props.item.data)

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...itemsLayout}
          label='产品/服务'
        >
          {getFieldDecorator('products', {
            rules: [{ required: true, message: '必填!' }]
          })(
            <Cascader
              showSearch
              placeholder='请选择产品与服务器(必选)'
              options={this.props.options}
              expandTrigger='hover'
            />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='玩家昵称'
        >
          {getFieldDecorator('nickname', {
            rules: [{ required: true, message: '必填!', whitespace: true }]
          })(
            <Input placeholder='玩家昵称' />
          )}
        </FormItem>

        <FormItem
          {...itemsLayout}
          label='技能列表'
        >
          {getFieldDecorator('skillId', {
            rules: [{
              required: true,
              message: '必须选择道具'
            }]
          })(
            <Cascader
              placeholder='请选择技能'
              showSearch
              options={skillPt}
            />
          )}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit' >提交</Button>
        </FormItem>
      </Form>
    )
  }
}

const SkillModal = Form.create()(Modal)

export default SkillModal
