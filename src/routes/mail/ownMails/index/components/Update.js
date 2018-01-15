import React, {Component} from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Icon, Button, Row, Col, Cascader } from 'antd'
import _ from 'lodash'

import { RuleTransFrom } from '../../../../../base/modules/ruleTransform/RuleTransFrom.js'
import { clearUpdate, updateOwnMail } from './../modules/Module'

const FormItem = Form.Item
const { TextArea } = Input
const RadioGroup = Radio.Group

const mapDispatchtoProps = {
  clearUpdate,
  updateOwnMail
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  ownMail: state.ownMail
})

let uuid = 0

@connect(mapStateToProps, mapDispatchtoProps)

class UpdateMail extends Component {

  static propTypes = {
    curd: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    goods: PropTypes.array,
    options: PropTypes.array,
    updateOwnMail: PropTypes.func,
    handleCancel: PropTypes.func
  }

  state = {
    num: [],
    ruleTransFrom: 0
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
        values.id = this.props.data.id
        values.productId = fieldsValue.productId[0]
        values.serverIds = fieldsValue.serverIds[0]
        values.title = fieldsValue.title
        values.senderName = fieldsValue.senderName
        values.context = fieldsValue.context
        values.receiverType = fieldsValue.receiverType
        values.receivers = fieldsValue.receivers
        values.description = fieldsValue.description
        values.rewards = []
        _.map(fieldsValue.keys, (val, idx) => {
          values.rewards.push({
            itemId: fieldsValue[`itemId-${val}`][0],
            count: fieldsValue[`count-${val}`]
          })
        })

        this.props.updateOwnMail(values)
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
    const { curd } = this.props

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

    // 处理状态数据显示格式
    let statusItem = ''
    if (this.props.data.status === 0) { statusItem = '未发送' }
    if (this.props.data.status === 1) { statusItem = '发送成功' }
    if (this.props.data.status === 2) { statusItem = '发送失败' }
    if (this.props.data.status === 3) { statusItem = '审核中' }
    if (this.props.data.status === 4) { statusItem = '审核通过' }
    if (this.props.data.status === 5) { statusItem = '审核未通过' }

    // 服务器下拉列表
    let serverItems = []
    _.map(this.props.options, (val, idx) => {
      if (val.value === this.props.data.productId) {
        serverItems = val.children
      }
    })

    // 玩家格式
    const userTypeOptions = [
      { label: '用户昵称', value: '1' },
      { label: '玩家Id', value: '2' },
      { label: '平台ID', value: '3' }
    ]

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
          label='产品'
        >
          {getFieldDecorator('productId', {
            initialValue: [this.props.data.productId]
          })(
            <Cascader
              options={this.props.options}
              disabled
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='服务器'
        >
          {getFieldDecorator('serverIds', {
            rules: [{ required: true, message: '请选择服务器' }],
            initialValue: [this.props.data.serverIds]
          })(
            <Cascader
              disabled
              options={serverItems}
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
          label='原始收件人'
        >
          {getFieldDecorator('receivers', {
            initialValue: this.props.data.receivers
          })(
            <TextArea
              autosize={{ minRows: 3, maxRows: 6 }}
              placeholder='原始收件人'
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
        <FormItem
          {...formItemLayout}
          label='邮件状态'
        >
          {getFieldDecorator('status', {
            initialValue: statusItem
          })(
            <Input disabled />
          )}
        </FormItem>
        {formItems}
        <FormItem {...formItemLayoutWithOutLabel}>
          {
            _.has(curd, '50308')
            ?
              <Button type='dashed' onClick={this.add} style={{ width: '60%' }}>
                <Icon type='plus' /> 添加奖励内容
              </Button>
            :
              ''
          }
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='友情提示'
        >
          <RuleTransFrom
            value={this.state.ruleTransFrom}
          />
        </FormItem>

        {
          _.has(curd, '50308')
          ?
            <FormItem>
              <Button type='primary' htmlType='submit' >提交</Button>
            </FormItem>
          :
            ''
        }

      </Form>
    )
  }
}

const Update = Form.create()(UpdateMail)

export default Update
