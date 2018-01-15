import React, {Component} from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Form, Input, InputNumber, Tooltip, Icon, Select, Row, Col, Button, TreeSelect, Cascader, Switch, Radio } from 'antd'
import { RuleTransFrom } from '../../../../../components/ruleTransform/RuleTransFrom.js'
const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group

class AddForm extends Component {

  static propTypes = {
    form: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    records: PropTypes.object,
    channel: PropTypes.object.isRequired,
    login: PropTypes.object.isRequired,
    onLoading: PropTypes.func.isRequired,
    addMail: PropTypes.func.isRequired,
    fetchChannels: PropTypes.func.isRequired,
    itemsActionCreator: PropTypes.func.isRequired
  }

  state = {  // 默认选中
    productID: '',
    typeSwitch: 1, // 1(true)：昵称 2(false): 人群
    serverTypeSwitch: 1,  // 2(false)：区间 1(true)：多选
    ruleTransFrom: 0
  }

  uuid = 0

  recordType = !!this.props.records

  products = []

  keys = []

  remove = (k) => {
    const { form } = this.props
    const keys = form.getFieldValue('keys')

    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    })

    // console.log(keys)
  }
  add = () => {

    const { form } = this.props
    // 获取一个输入控件的值
    const keys = form.getFieldValue('keys')

    // 限定道具个数
    // if (keys.length >= 4) {
    //   notification.warn({
    //     message: '警告',
    //     description: '每封邮件最多发送4件道具！'
    //   })
    //   return
    // }

    this.uuid++
    console.log(this.uuid)

    // important! 设置一组输入控件的值
    const nextKeys = keys.concat(this.uuid)

    console.log(nextKeys)

    form.setFieldsValue({
      keys: nextKeys
    })
  }
  handleReset = () => {
    this.props.form.resetFields()
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.product = this.state.productID
        this.props.onLoading()
        this.props.addMail(values)
      }
    })
  }
  productSelect = (value) => {
    this.props.itemsActionCreator(value, 0)
    this.setState({
      productID: value
    })
    this.handleReset()
  }

  _itemReduce = (options) => {
    return _.reduce(options, (result, option, key) => {
      result.push({ value: _.toNumber(key), label: `${option}(${key})` })
      return result
    }, [])
  }

  _channelReduce = (options) => {
    return _.reduce(options, (result, option, key) => {
      result.push({
        label: `${option}(${key})`,
        value: key,
        key: key
      })

      return result
    }, [])
  }

  onTypeSwitch = (checked) => {
    console.log(`switch to ${checked}`, checked ? 1 : 2)
    this.setState({
      typeSwitch: checked ? 1 : 2
    })
  }

  onServerTypeSwitch = (checked) => {
    console.log(`switch to ${checked}`, checked ? 1 : 2)
    this.setState({
      serverTypeSwitch: checked ? 1 : 2
    })
  }

  onRadioGroupChange = (e) => {
    console.log('radio checked', e.target.value)
  }

  componentDidMount() {
    // console.log('componentDidMount')
    // 下拉道具初始化
    const options = this.props.login.admin.data.options
    this.props.itemsActionCreator(options[0].value, 0)

    // 产品
    _.map(options, (value, index) => {
      this.products.push(
        <Option key={value.value} value={value.value}>{value.label}</Option>
      )
    })
    this.setState({
      productID: options[0].value
    })

    // 渠道
    this.props.fetchChannels()

    // isCopy
    if (this.recordType) {
      console.log('isCopy', this.props.records)
      this.productSelect(this.props.records.productId)
    }

    this.uuid = this.recordType ? this.props.records.itemList.length : this.uuid
    if (this.recordType) {
      _.map(this.props.records.itemList, (value, index, collection) => {
        this.keys.push(index + 1)
      })
    }
  }

  handleFormatter = (value) => {
    return value
    // return String.prototype.replace.call(value, /\B(?=(\d{3})+(?!\d))/g, ',')
  }
  handleParser = (value) => {
    return value
    // return String.prototype.replace.call(value, /\$\s?|(,*)/g, '')
  }

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
    // console.log(this.recordType)
    // const { getFieldDecorator, getFieldValue } = this.props.form
    // onst options = this.props.login.admin.data.options

    const { form: { getFieldDecorator, getFieldValue }, login: { admin: { data: {options} } } } = this.props
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

    // 服务下拉
    let productsIndex = 0
    let id = this.state.productID || 0
    _.map(options, (value, index) => {
      if (_.toNumber(id) === _.toNumber(value.value)) {
        productsIndex = index
      }
    })

    // let servers = []
    let treeData = []
    _.map(options[productsIndex].children, (value, index) => {
      // servers.push(
      //   <Option key={value.value} value={value.value}>{value.label}</Option>
      // )
      treeData.push({
        label: value.label,
        value: value.value,
        key: index
      })
    })

    // 道具下拉
    let itemOPt = this._itemReduce(this.props.item.data)

    // 用于和表单进行双向绑定
    // 创建keys 的 names
    let initialKeys = this.keys

    getFieldDecorator('keys', { initialValue: initialKeys })
    const keys = getFieldValue('keys')

    const formItems = keys.map((k, index) => {
      // console.log(k, index)
      // console.log(this.uuid)
      if (this.recordType && this.props.records.itemList.length === this.uuid) {
        return (
          <Row key={k}>
            <Col span='12' offset={3}>
              <FormItem
                {...itemsLayout}
                label={`我的道具${k}`}
              >
                {getFieldDecorator(`item-${k}`, {
                  initialValue: this.recordType ? [_.toNumber(this.props.records.itemList[index].itemId)] : [],
                  rules: [{
                    required: true,
                    message: '必须选择道具！若不发送，请删除此条目'
                  }]
                })(
                  <Cascader
                    placeholder='请选择道具'
                    showSearch
                    options={itemOPt}
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
                  initialValue: this.recordType ? this.props.records.itemList[index].num : 1,
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
                    formatter={this.handleFormatter}
                    parser={this.handleParser}
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
      } else {
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
                    options={itemOPt}
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
                    formatter={this.handleFormatter}
                    parser={this.handleParser}
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
      }
    })

    // 渠道下拉
    let channelOPt = this._channelReduce(this.props.channel)

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label='选择产品'
        >
          {getFieldDecorator('productName', {
            initialValue: this.recordType ? this.props.records.productId : options[0].label
          })(
            <Select onChange={this.productSelect}>
              {this.products}
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='目标服务器'
        >
          {getFieldDecorator('serverType', {
            initialValue: this.state.serverTypeSwitch === 1,
            valuePropName: 'checked'
          })(
            <Switch onChange={this.onServerTypeSwitch} checkedChildren={'多选'} unCheckedChildren={'区间'} />
          )}
        </FormItem>

        {
          this.state.serverTypeSwitch === 1
          ?
            <FormItem
              {...formItemLayout}
              label='选择服务器'
            >
              {getFieldDecorator('servers', {
                // initialValue: this.recordType ? this.props.records.serverIds.split(',') : [],
                rules: [
                  { required: true, message: '必须要选择产品才能匹配道具!' }
                ]
              })(
                <TreeSelect
                  treeData={[{
                    label: '全选',
                    value: null,
                    key: '全选',
                    children: [...treeData]
                  }]}
                  showSearch
                  allowClear
                  treeDefaultExpandAll
                  multiple
                  treeCheckable
                  treeNodeFilterProp='label'
                  style={{ maxHeight: 100, overflow: 'auto' }}
                  dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                  // showCheckedStrategy={TreeSelect.SHOW_CHILD}
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
                  <Tooltip title='区间用 (-) 区分. 例：app_001-app_100'>
                    <Icon type='question-circle-o' />
                  </Tooltip>
                  <Tooltip title='多段区间用 (,) 分割. 例：app_001-app_002,app_100-app_102'>
                    <Icon type='question-circle-o' />
                  </Tooltip>
                </span>
              )}
            >
              {getFieldDecorator('serversStr', {
                rules: [
                  { required: true, message: '必须要选择产品才能匹配道具!' }
                ]
              })(
                <Input placeholder='输入区间数值' />
              )}
            </FormItem>
        }

        <FormItem
          {...formItemLayout}
          label='邮件标题'
        >
          {getFieldDecorator('title', {
            initialValue: this.recordType ? this.props.records.title : null,
            rules: [{ required: true, message: '必填!', whitespace: true }]
          })(
            <Input />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='发件人'
        >
          {getFieldDecorator('senderName', {
            initialValue: this.recordType ? this.props.records.senderName : '运营团队',
            rules: [{ required: true, message: '必填!', whitespace: true }]
          })(
            <Input />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={(
            <span>
              等级&nbsp;
              <Tooltip title='例：50,表示对大于等于50级以上玩家生效！'>
                <Icon type='question-circle-o' />
              </Tooltip>
            </span>
          )}
        >
          {getFieldDecorator('level', {
            // initialValue: this.recordType ? this.props.records.level : 1
            initialValue: 1,
            rules: [{
              pattern: /^\d+$/,
              message: '非负整数'
            }]
          })(
            <InputNumber
              min={1}
              formatter={this.handleFormatter}
              parser={this.handleParser}
            />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={'渠道'}
        >
          {getFieldDecorator('channels', {
            // initialValue: this.recordType ? this.props.records.channelList : []
          })(
            <TreeSelect
              treeData={[{
                label: '全选',
                value: null,
                key: '全选',
                children: [...channelOPt]
              }]}
              showSearch
              allowClear
              treeDefaultExpandAll
              multiple
              treeCheckable
              treeNodeFilterProp='label'
              // showCheckedStrategy={TreeSelect.SHOW_CHILD}
              style={{ maxHeight: 100, overflow: 'auto' }}
              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
              searchPlaceholder='多选渠道'
            />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='面对人群'
        >
          {getFieldDecorator('type', {
            initialValue: this.state.typeSwitch === 1,
            valuePropName: 'checked'
          })(
            <Switch onChange={this.onTypeSwitch} checkedChildren={'用户'} unCheckedChildren={'联盟'} />
          )}
        </FormItem>

        {
          this.state.typeSwitch === 1
          ?
            <div>
              <FormItem
                {...formItemLayout}
                label='玩家格式'
              >
                {getFieldDecorator('userType', {
                  // initialValue: this.recordType ? _.toString(this.props.records.userType) : '1',
                  initialValue: '1',
                  rules: [{ required: true, message: '必填!', whitespace: true }]
                })(
                  <RadioGroup options={userTypeOptions} onChange={this.onRadioGroupChange} />
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label={(
                  <span>
                    玩家&nbsp;
                    <Tooltip title='多个昵称用(,)分隔,全部用(*)号表示'>
                      <Icon type='question-circle-o' />
                    </Tooltip>
                    <Tooltip title='多个服务器发送邮件时，只能全服发送，收件人只能是*'>
                      <Icon type='question-circle-o' />
                    </Tooltip>
                  </span>
                )}
              >
                {getFieldDecorator('receiveName', {
                  // initialValue: this.recordType ? this.props.records.receiveName : '',
                  rules: [{ required: true, message: '必填!', whitespace: true }]
                })(
                  <Input type='textarea' placeholder='多个昵称用(,)分隔,全部用(*)号表示' autosize={{ minRows: 3, maxRows: 6 }} />
                )}
              </FormItem>
            </div>
          :
            <FormItem
              {...formItemLayout}
              label={(
                <span>
                  联盟&nbsp;
                  <Tooltip title='多个联盟用(,)分隔'>
                    <Icon type='question-circle-o' />
                  </Tooltip>
                </span>
              )}
            >
              {getFieldDecorator('receiveName_2', {
                // initialValue: this.recordType ? this.props.records.receiveName : '',
                rules: [{ required: true, message: '必填!', whitespace: true }]
              })(
                <Input type='textarea' placeholder='多个联盟用(,)分隔' autosize={{ minRows: 3, maxRows: 6 }} />
              )}
            </FormItem>
        }

        <FormItem
          {...formItemLayout}
          label='邮件内容'
        >
          {getFieldDecorator('content', {
            initialValue: this.recordType ? this.props.records.content : '',
            rules: [{ required: true, message: '必填!', whitespace: true }]
          })(
            <Input type='textarea' placeholder='邮件内容' autosize={{ minRows: 3, maxRows: 6 }} />
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
        </FormItem>
      </Form>
    )
  }
}

const DialogAdd = Form.create()(AddForm)

export default DialogAdd
