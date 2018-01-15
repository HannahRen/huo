import React, {Component} from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { Form, Input, InputNumber, Tooltip, Icon, Radio, Row, Col, Button, Cascader } from 'antd'
import { RuleTransFrom } from '../../../../../base/modules/ruleTransform/RuleTransFrom.js'

const FormItem = Form.Item
const RadioGroup = Radio.Group

class AddForm extends Component {

  static propTypes = {
    curd: PropTypes.object.isRequired,
    options: PropTypes.array,
    goods: PropTypes.array,
    form: PropTypes.object,
    handleCancel: PropTypes.func,
    onAdd: PropTypes.func
  }

  uuid = 0

  products = []

  keys = []

  state = {
    ruleTransFrom: 0,
    products: []
  }

  remove = (k) => {
    const { form } = this.props
    const keys = form.getFieldValue('keys')

    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    })
  }
  add = () => {
    const { form } = this.props
    const keys = form.getFieldValue('keys')
    if (keys.length >= 10) { return }
    this.uuid++
    const nextKeys = keys.concat(this.uuid)

    form.setFieldsValue({
      keys: nextKeys
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, fieldValues) => {
      if (!err) {
        let value = {}
        value.productId = fieldValues.products[0]
        value.serverIds = fieldValues.products[1]
        if (!fieldValues.products[1]) { value.serverIds = '' }
        value.title = fieldValues.title
        value.senderName = fieldValues.senderName
        value.receiverType = fieldValues.receiverType
        value.receivers = fieldValues.receivers
        value.context = fieldValues.context
        value.description = fieldValues.description
        value.type = 1

        value.rewards = []
        _.map(fieldValues.keys, (val, idx) => {
          value.rewards.push({
            itemId: fieldValues[`item-${val}`][0],
            count: fieldValues[`number-${val}`]
          })
        })
        console.log(fieldValues)
        this.props.onAdd(value)
        this.props.handleCancel()
      }
    })
  }

  handleReset = () => {
    this.props.form.resetFields()
  }

  // 验证
  handlerRoleTransFrom = (value) => {
    this.setState({
      ruleTransFrom: _.toNumber(value)
    })
  }
  handlerRoleTransFromFocus = (event) => {
    event.preventDefault()
    this.setState({
      ruleTransFrom: _.toNumber(event.target.value)
    })
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { curd } = this.props

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

    const userTypeOptions = [
      { label: '用户昵称', value: '1' },
      { label: '玩家Id', value: '2' },
      { label: '平台ID', value: '3' }
    ]

    let initialKeys = this.keys

    getFieldDecorator('keys', { initialValue: initialKeys })
    const keys = getFieldValue('keys')

    const formItems = keys.map((k, index) => {
        return (
          <Row key={k}>
            <Col span='12' offset={3}>
              <FormItem
                {...itemsLayout}
                label={`我的道具${k}`}
              >
                {getFieldDecorator(`item-${k}`, {
                  rules: [{
                    required: true,
                    message: '必须选择道具！若不发送，请删除此条目'
                  }]
                })(
                  <Cascader
                    placeholder='请选择道具'
                    showSearch
                    options={this.props.goods}
                  />
                )}
              </FormItem>
            </Col>
            <Col span='8'>
              <FormItem
                {...itemsLayout}
              >
                {getFieldDecorator(`number-${k}`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  initialValue: 1,
                  rules: [{
                    required: true,
                    message: '请填写数量'
                  }, {
                    pattern: /^\d+$/,
                    message: '非负整数'
                  }]
                })(
                  <InputNumber
                    min={1}
                    placeholder='个数'
                    onChange={this.handlerRoleTransFrom}
                    onFocus={this.handlerRoleTransFromFocus}
                  />
                )}
                <Icon
                  className='dynamic-delete-button'
                  type='minus-circle-o'
                  disabled={keys.length === 1}
                  onClick={() => this.remove(k)}
                />
              </FormItem>
            </Col>
          </Row>
        )
    })


    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label='选择产品'
        >
          {getFieldDecorator('products', {
            rules: [{ required: true, message: '请选择产品与服务器(必选)' }]
          })(
            <Cascader
              showSearch
              options={this.props.options}
              placeholder='请选择产品与服务器(必选)'
              expandTrigger='hover'
            />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='邮件标题'
        >
          {getFieldDecorator('title', {
            rules: [{ required: true, message: '请填写邮件标题' }]
          })(
            <Input placeholder='邮件标题' />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='发件人'
        >
          {getFieldDecorator('senderName', {
            rules: [{ required: true, message: '请填写发件人' }],
            initialValue: '运营团队'
          })(
            <Input />
          )}
        </FormItem>

        {/* <FormItem
          {...formItemLayout}
          label='渠道'
        >
          {getFieldDecorator('channels', {
            rules: [{ required: false, message: '请选择渠道' }]
          })(
            <TreeSelect
              treeData={[{
                label: '全选',
                value: null,
                key: '全选',
                children: this.props.channels
              }]}
              showSearch
              allowClear
              treeDefaultExpandAll
              multiple
              treeCheckable
              treeNodeFilterProp='label'
              showCheckedStrategy={TreeSelect.SHOW_CHILD}
              style={{ maxHeight: 100, overflow: 'auto' }}
              dropdownStyle={{ maxHeight: 300 }}
              searchPlaceholder='多选渠道'
            />
          )}
        </FormItem> */}

        <FormItem
          {...formItemLayout}
          label='玩家格式'
        >
          {getFieldDecorator('receiverType', {
            initialValue: '1',
            rules: [{ required: true, message: '必填!', whitespace: true }]
          })(
            <RadioGroup options={userTypeOptions} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={(
            <span>
              玩家&nbsp;
              <Tooltip title='多个昵称用(,)分隔'>
                <Icon type='question-circle-o' />
              </Tooltip>
            </span>
          )}
        >
          {getFieldDecorator('receivers', {
            rules: [{ required: true, message: '必填!', whitespace: true }]
          })(
            <Input type='textarea' placeholder='多个昵称用(,)分隔' autosize={{ minRows: 3, maxRows: 10 }} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='邮件内容'
        >
          {getFieldDecorator('context', {
            rules: [{ required: true, message: '必填!', whitespace: true }]
          })(
            <Input type='textarea' placeholder='邮件内容' autosize={{ minRows: 3, maxRows: 10 }} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='描述'
        >
          {getFieldDecorator('description', {
            rules: [{ required: true, message: '必填!', whitespace: true }]
          })(
            <Input type='textarea' placeholder='描述' autosize={{ minRows: 3, maxRows: 10 }} />
          )}
        </FormItem>

        {formItems}

        {
          _.has(curd, '50308')
          ?
            <FormItem {...tailFormItemLayout}>
              <Button type='dashed' onClick={this.add} style={{ width: '60%' }}>
                <Icon type='plus' /> 添加道具
              </Button>
            </FormItem>
          :
            ''
        }


        <FormItem
          {...formItemLayout}
          label='友情提示'
        >
          <RuleTransFrom
            value={this.state.ruleTransFrom}
          />
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit' >提交表单</Button>
          <Button type='default' onClick={this.handleReset} style={{marginLeft: '10px'}}>重置</Button>
        </FormItem>

      </Form>
    )
  }
}

const Add = Form.create()(AddForm)

export default Add
