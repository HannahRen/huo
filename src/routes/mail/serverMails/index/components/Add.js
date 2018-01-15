import React, {Component} from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { Form, Input, InputNumber, Icon, Row, Col, Button, Cascader, TreeSelect, Switch, Tooltip } from 'antd'
import { RuleTransFrom } from '../../../../../../components/ruleTransform/RuleTransFrom.js'

const FormItem = Form.Item

class AddForm extends Component {

  static propTypes = {
    options: PropTypes.array,
    goods: PropTypes.array,
    channels: PropTypes.array,
    form: PropTypes.object,
    handleCancel: PropTypes.func,
    addServerMail: PropTypes.func
  }

  uuid = 0

  keys = []

  state = {
    ruleTransFrom: 0,
    serversOptions: [],
    switch: 1
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
        value.productId = fieldValues.productId[0]
        value.serverIds = fieldValues.serverId ? fieldValues.serverId.join(',') : fieldValues.serverBlock
        if (!fieldValues.channels) { fieldValues.channels = [] }
        value.channels = fieldValues.channels.join(',')
        value.title = fieldValues.title
        value.senderName = fieldValues.senderName
        value.context = fieldValues.context
        value.description = fieldValues.description

        value.rewards = []
        _.map(fieldValues.keys, (val, idx) => {
          value.rewards.push({
            itemId: fieldValues[`item-${val}`][0],
            count: fieldValues[`number-${val}`]
          })
        })

        this.props.addServerMail(value)
        this.props.handleCancel()
      }
    })
  }

  handleReset = () => {
    this.props.form.resetFields()
  }

  handleProChange = (e) => {
    _.map(this.props.options, (val, idx) => {
      if (val.value === e[0]) {
        this.setState({
          serversOptions: val.children
        })
      }
    })
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

  // 多选服务器开关切换
  onServerTypeSwitch = (checked) => {

    this.setState({
      switch: checked ? 1 : 2
    })
  }


  render() {

    const { getFieldDecorator, getFieldValue } = this.props.form
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

    // 产品，服务器下拉
    let productsOptions = []
    _.map(this.props.options, (val, idx) => {
      productsOptions.push({
        value: val.value,
        label: val.label
      })
    })

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
          {getFieldDecorator('productId', {
            rules: [{ required: true, message: '请选择产品(必选)' }]
          })(
            <Cascader
              showSearch
              options={productsOptions}
              placeholder='请选择产品(必选)'
              expandTrigger='hover'
              onChange={this.handleProChange}
            />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='服务器选择方式'
        >
          {getFieldDecorator('serverType', {
            initialValue: this.state.switch === 1,
            valuePropName: 'checked'
          })(
            <Switch onChange={this.onServerTypeSwitch} checkedChildren={'多选'} unCheckedChildren={'区间'} />
          )}
        </FormItem>

        {
          this.state.switch === 1 ?
            <FormItem
              {...formItemLayout}
              label='选择服务器'
            >
              {getFieldDecorator('serverId', {
                rules: [{ required: true, message: '选择服务器(可选)' }]
              })(
                <TreeSelect
                  treeData={[{
                    label: '全选',
                    value: null,
                    key: '全选',
                    children: this.state.serversOptions
                  }]}
                  showSearch
                  allowClear
                  treeDefaultExpandAll
                  multiple
                  treeCheckable
                  treeNodeFilterProp='label'
                  style={{ maxHeight: 100, overflow: 'auto' }}
                  dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                  showCheckedStrategy={TreeSelect.SHOW_CHILD}
                  searchPlaceholder='多选服务器'
                />
              )}
            </FormItem>
          :
            <FormItem
              {...formItemLayout}
              label={(
                <span>
                  选择服务器&nbsp;
                  <Tooltip
                    title={
                      <div>连续区间用 (-) 分隔. <i style={{color: '#f11738'}}>例：app_001-app_100</i><p>多段区间用 (,) 分割. <i style={{color: '#f11738'}}>例：app_001-app_002,app_100-app_102</i></p></div>
                    }
                  >
                    <Icon type='question-circle-o' />
                  </Tooltip>
                </span>
              )}
            >
              {getFieldDecorator('serverBlock', {
                rules: [
                  { required: true, message: '输入区间数值!' }
                ]
              })(
                <Input type='textarea' placeholder='输入区间数值' autosize={{ minRows: 1, maxRows: 5 }} />
              )}
            </FormItem>
        }

        <FormItem
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
        <FormItem {...tailFormItemLayout}>
          <Button type='dashed' onClick={this.add} style={{ width: '60%' }}>
            <Icon type='plus' /> 添加道具
          </Button>
        </FormItem>

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
