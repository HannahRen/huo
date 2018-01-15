import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Icon, Button, Row, Col, Cascader } from 'antd'
import _ from 'lodash'

import { RuleTransFrom } from '../../../../../../components/ruleTransform/RuleTransFrom.js'


const FormItem = Form.Item
const { TextArea } = Input

let uuid = 0

class CopyMail extends Component {

  static propTypes = {
    form: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    goods: PropTypes.array,
    options: PropTypes.array,
    onAdd: PropTypes.func,
    handleCancel: PropTypes.func
  }

  state = {
    ruleTransFrom: 0,
    num: []
  }

  componentWillMount() {
    uuid = this.props.data.rewards.length
    let numbers = []
    for (let i = 0 ; i < this.props.data.rewards.length ; i++) {
      numbers.push(i + 1)
    }
    this.setState({
      num: numbers
    })
  }

  componentWillUnmount() {
    uuid = 0
  }

  handleSubmit = (e) => {
    e.preventDefault()
    // 校验并获取一组输入域的值与 Error，若 fieldNames 参数为空，则校验全部组件
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        let values = {}
        values.productId = fieldsValue.products[0]
        values.serverIds = fieldsValue.products[1]
        values.title = fieldsValue.title
        values.senderName = fieldsValue.senderName
        values.context = fieldsValue.context
        values.receivers = fieldsValue.receivers
        values.description = fieldsValue.description
        values.rewards = []
        _.map(fieldsValue.keys, (val, idx) => {
          values.rewards.push({
            itemId: fieldsValue[`itemId-${val}`][0],
            count: fieldsValue[`count-${val}`]
          })
        })

        this.props.onAdd(values)
        this.props.handleCancel()
      }
    })
  }

  remove = (k) => {
    const { form } = this.props
    const keys = form.getFieldValue('keys')
    if (keys.length === 0) {
      return
    }

    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    })
  }

  add = () => {
    const { form } = this.props
    const keys = form.getFieldValue('keys')
    if (keys.length >= 10) { return }
    uuid++
    const nextKeys = keys.concat(uuid)
    form.setFieldsValue({
      keys: nextKeys
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


  render() {
    const {getFieldDecorator, getFieldValue} = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    }
    const formItemLayoutWithOutLabel = {
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

    // 添加模块
    getFieldDecorator('keys', { initialValue: this.props.data.rewards ? this.state.num : [] })
    const keys = getFieldValue('keys')
    const formItems = keys.map((k, index) => {
      if (this.props.data.rewards
        && this.props.data.rewards.length > 0
        && k <= this.props.data.rewards.length
      ) {
        return (
          <Row key={k}>
            <Col span='12' offset={3}>
              <FormItem
                {...formItemLayout}
                label={'奖励道具' + k}
                required={false}
              >
                {getFieldDecorator(`itemId-${k}`, {
                  rules: [{
                    required: true,
                    message: '请选择道具'
                  }],
                  initialValue: [String(this.props.data.rewards[index].itemId)]
                })(
                  <Cascader
                    options={this.props.goods}
                    placeholder='请选择道具'
                    showSearch
                  />
                )}
              </FormItem>
            </Col>
            <Col span='8'>
              <FormItem
                {...formItemLayout}
                label={'数量' + k}
                required={false}
              >
                {getFieldDecorator(`count-${k}`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  initialValue: this.props.data.rewards[index].count,
                  rules: [{
                    required: true,
                    message: '请输入数量(整数)',
                    pattern: /^\d+$/
                  }]
                })(
                  <InputNumber
                    placeholder='请输入数量'
                    onChange={this.handlerRoleTransFrom}
                    onFocus={this.handlerRoleTransFromFocus}
                  />
                )}
                <Icon
                  style={{marginLeft: '20px'}}
                  type='minus-circle-o'
                  onClick={() => this.remove(k)}
                />
              </FormItem>
            </Col>
          </Row>
        )
      } else {
        return (
          <Row key={k}>
            <Col span='12' offset={3}>
              <FormItem
                {...formItemLayout}
                label={'道具' + k}
                required={false}
              >
                {getFieldDecorator(`itemId-${k}`, {
                  rules: [{
                    required: true,
                    message: '请选择道具'
                  }]
                })(
                  <Cascader
                    options={this.props.goods}
                    placeholder='请选择道具'
                    showSearch
                  />
                )}
              </FormItem>
            </Col>
            <Col span='8'>
              <FormItem
                {...formItemLayout}
                label={'数量' + k}
                required={false}
              >
                {getFieldDecorator(`count-${k}`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [{
                    required: true,
                    message: '请输入数量(整数)',
                    pattern: /^\d+$/
                  }]
                })(
                  <InputNumber
                    placeholder='请输入数量'
                    onChange={this.handlerRoleTransFrom}
                    onFocus={this.handlerRoleTransFromFocus}
                  />
                )}
                <Icon
                  style={{marginLeft: '20px'}}
                  type='minus-circle-o'
                  onClick={() => this.remove(k)}
                />
              </FormItem>
            </Col>
          </Row>
        )
      }
    })

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label='选择产品'
        >
          {getFieldDecorator('products', {
            rules: [{ required: true, message: '请选择产品与服务器(必选)' }],
            initialValue: this.props.data ? [this.props.data.productId, this.props.data.serverIds] : []
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
          { getFieldDecorator('title', {
            rules: [{ required: true, message: '请输入邮件标题' }],
            initialValue: this.props.data.title
          })(
            <Input placeholder='邮件标题' />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='(邮件内)发件人名字'
        >
          {getFieldDecorator('senderName', {
            rules: [{ required: true, message: '请输入发件人名字' }],
            initialValue: this.props.data.senderName
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='邮件内容'
        >
          { getFieldDecorator('context', {
            rules: [{ required: true, message: '请输入邮件内容' }],
            initialValue: this.props.data.context
          })(
            <TextArea
              autosize={{ minRows: 3, maxRows: 6 }}
              placeholder='邮件内容'
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='原始收件人(联盟)'
        >
          {getFieldDecorator('receivers', {
            initialValue: this.props.data.receivers
          })(
            <TextArea
              autosize={{ minRows: 3, maxRows: 6 }}
              placeholder='原始收件人(联盟)'
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='描述(原因说明)'
        >
          { getFieldDecorator('description', {
            rules: [{ required: true, message: '请输入描述' }],
            initialValue: this.props.data.description
          })(
            <TextArea
              autosize={{ minRows: 3, maxRows: 6 }}
              placeholder='描述'
            />
          )}
        </FormItem>
        {formItems}
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type='dashed' onClick={this.add} style={{ width: '60%' }}>
            <Icon type='plus' /> 添加奖励内容
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
        <FormItem>
          <Button type='primary' htmlType='submit' >提交</Button>
        </FormItem>
      </Form>
    )
  }
}

const Copy = Form.create()(CopyMail)

export default Copy
