import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Icon, Button, Row, Col, Cascader } from 'antd'
import _ from 'lodash'

const FormItem = Form.Item
const { TextArea } = Input

let uuid = 0

class AddBatchmail extends Component {

  static propTypes = {
    form: PropTypes.object.isRequired,
    item: PropTypes.array,
    handleCreate: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired
  }

  state = {

  }

  componentWillMount() {
    // this.props.clearBatchmailAdd()
  }

  componentWillUnmount() {
    uuid = 0
  }

  handleSubmit = (e) => {
    e.preventDefault()
    // 校验并获取一组输入域的值与 Error，若 fieldNames 参数为空，则校验全部组件
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        let value = {}
        value.title = fieldsValue.title
        value.context = fieldsValue.context
        value.description = fieldsValue.description
        value.rewards = []
        _.map(fieldsValue.keys, (val, idx) => {
          value.rewards.push({
            itemId: fieldsValue[`itemId-${val}`][0],
            count: fieldsValue[`count-${val}`]
          })
        })
        this.props.handleCreate(value)
        this.props.onAdd()
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
    if (uuid >= 4) { return }
    uuid++
    const { form } = this.props
    const keys = form.getFieldValue('keys')
    const nextKeys = keys.concat(uuid)
    form.setFieldsValue({
      keys: nextKeys
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
    getFieldDecorator('keys', { initialValue: [] })
    const keys = getFieldValue('keys')
    const formItems = keys.map((k, index) => {
      return (
        <Row key={k}>
          <Col span='12'>
            <FormItem
              {...formItemLayout}
              label={'奖励道具' + k}
              required={false}
            >
              {getFieldDecorator(`itemId-${k}`, {
                rules: [{
                  required: true,
                  message: '请选择道具'
                }]
              })(
                <Cascader
                  options={this.props.item}
                  placeholder='请选择道具'
                  showSearch
                />
              )}
            </FormItem>
          </Col>
          <Col span='12'>
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
    })

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          label='邮件标题'
        >
          { getFieldDecorator('title', {
            rules: [{ required: true, message: '请输入邮件标题' }]
          })(
            <Input placeholder='邮件标题' />
          )}
        </FormItem>
        <FormItem
          label='邮件内容'
        >
          { getFieldDecorator('context', {
            rules: [{ required: true, message: '请输入邮件内容' }]
          })(
            <TextArea
              rows={4}
              placeholder='邮件内容'
            />
          )}
        </FormItem>
        <FormItem
          label='描述(仅管理台可见)'
        >
          { getFieldDecorator('description', {
            rules: [{ required: true, message: '请输入描述' }]
          })(
            <TextArea
              rows={4}
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
        <FormItem>
          <Button type='primary' htmlType='submit' >提交</Button>
        </FormItem>
      </Form>
    )
  }
}

const Add = Form.create()(AddBatchmail)

export default Add
