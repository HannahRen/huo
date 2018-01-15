import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Row, Col, Cascader, InputNumber, Input, Card, TreeSelect, Table } from 'antd'
import _ from 'lodash'
import { Link } from 'react-router'

const FormItem = Form.Item


class DetailsForm extends Component {

  static propTypes = {
    login: PropTypes.object,
    form: PropTypes.object,
    location: PropTypes.object,
    products: PropTypes.object,
    fetchProductsMap: PropTypes.func,
    goods: PropTypes.object,
    fetchGoodsMap: PropTypes.func,
    channel: PropTypes.object,
    fetchChannels: PropTypes.func,
    sendServerMail: PropTypes.func,
    checkServerMail: PropTypes.func,
    serverMailDetail: PropTypes.object
  }

  state = {
    options: []
  }

  constructor(props) {
    super(props)
    this.columns = [{
      title: '产品ID',
      dataIndex: 'productId',
      key: 'productId'
    }, {
      title: '服务器ID',
      dataIndex: 'serverId',
      key: 'serverId'
    }, {
      title: '收件人',
      dataIndex: 'playerName',
      key: 'playerName'
    }, {
      title: '奖励',
      dataIndex: 'rewards',
      key: 'rewards'
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        if (record.status === 0) {
          return <div style={{color: '#f90b16'}}>未成功</div>
        }
        if (record.status === 1) {
          return <div style={{color: '#16d021'}}>已成功</div>
        }
      }
    }, {
      title: '操作时间',
      dataIndex: 'operateTime',
      key: 'operateTime'
    }]
  }

  componentWillMount() {
    this.props.fetchProductsMap()
    this.props.fetchChannels()
    this.props.fetchGoodsMap({productId: '_'})
    this.props.checkServerMail(this.props.location.query.id)
  }

  componentDidMount() {
    let options = []
    if (this.props.products.options) {
      options = this.props.products.options
    }
    this.setState({
      options: options
    })
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        let id = this.props.serverMailDetail.check.sango2Mails.id
        this.props.sendServerMail(id)
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { curd } = this.props.login

    const { check } = this.props.serverMailDetail

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 16 },
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

    // 获取产品 道具 渠道下拉列表
    let options = []
    if (this.props.products.options) {
      options = this.props.products.options
    }

    let channels = []
    if (this.props.channel) {
      _.map(this.props.channel, (value, key) => {
        channels.push(
          {value: key, label: `${value}(${key})`, key: key}
        )
      })
    }

    let goods = []
    if (this.props.goods.options[0]) {
      _.map(this.props.goods.options[0], (value, key) => {
        goods.push(
          {value: key, label: `${value}(${key})`}
        )
      })
    }

    // 产品，服务器下拉
    let productsOptions = []
    _.map(options, (val, idx) => {
      productsOptions.push({
        value: val.value,
        label: val.label
      })
    })

    // let serverOptions = []
    // if (check.sango2Mails) {
    //   _.map(options, (val, idx) => {
    //     if (val.value === check.sango2Mails.productId) {
    //       serverOptions = val.children
    //     }
    //   })
    // }

    // 处理状态数据显示格式
    let statusItem = ''
    if (check.sango2Mails && check.sango2Mails.status === 0) { statusItem = '未发送' }
    if (check.sango2Mails && check.sango2Mails.status === 1) { statusItem = '发送成功' }
    if (check.sango2Mails && check.sango2Mails.status === 2) { statusItem = '发送失败' }
    if (check.sango2Mails && check.sango2Mails.status === 3) { statusItem = '审核中' }
    if (check.sango2Mails && check.sango2Mails.status === 4) { statusItem = '审核通过' }
    if (check.sango2Mails && check.sango2Mails.status === 5) { statusItem = '审核未通过' }

    // let serversItem = []
    // if (check.sango2Mails) { serversItem = check.sango2Mails.serverIds.split(',') }

    let channelsItem = []
    if (check.sango2Mails && check.sango2Mails.channels) { channelsItem = check.sango2Mails.channels.split(',') }

    let rewardsItem = check.sango2Mails ? check.sango2Mails.rewards : []
    const formItems = rewardsItem.map((val, idx) => {
      return (
        <Row key={idx}>
          <Col span='12' offset={3}>
            <FormItem
              {...itemsLayout}
              label={`我的道具${idx + 1}`}
            >
              {getFieldDecorator(`itemId${idx}`, {
                initialValue: [String(val.itemId)]
              })(
                <Cascader
                  disabled
                  options={goods}
                />
              )}
            </FormItem>
          </Col>
          <Col span='8'>
            <FormItem
              {...itemsLayout}
            >
              {getFieldDecorator(`number${idx}`, {
                initialValue: val.count
              })(
                <InputNumber
                  disabled
                />
              )}
            </FormItem>
          </Col>
        </Row>
      )
    })

    return (
      <div>
        <Card>
          <Form>
            <FormItem
              {...formItemLayout}
              label='产品'
            >
              {getFieldDecorator('productId', {
                initialValue: check.sango2Mails ? [check.sango2Mails.productId] : ['']
              })(
                <Cascader
                  disabled
                  options={options}
                />
              )}
            </FormItem>

            {/* <FormItem
              {...formItemLayout}
              label='服务器'
            >
              {getFieldDecorator('serverId', {
                initialValue: serversItem
              })(
                <TreeSelect
                  treeData={[{
                    label: '全选',
                    value: null,
                    key: '全选',
                    children: serverOptions
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
                  disabled
                />
              )}
            </FormItem> */}

            <FormItem
              {...formItemLayout}
              label='服务器'
            >
              {getFieldDecorator('serverId', {
                initialValue: check.sango2Mails ? check.sango2Mails.serverIds : ''
              })(
                <Input disabled />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='渠道'
            >
              {getFieldDecorator('channels', {
                rules: [{ required: false, message: '请选择渠道' }],
                initialValue: channelsItem
              })(
                <TreeSelect
                  treeData={[{
                    label: '全选',
                    value: null,
                    key: '全选',
                    children: channels
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
                  disabled
                />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='id'
            >
              {getFieldDecorator('id', {
                initialValue: check.sango2Mails ? check.sango2Mails.id : ''
              })(
                <Input disabled />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='邮件标题'
            >
              {getFieldDecorator('title', {
                initialValue: check.sango2Mails ? check.sango2Mails.title : ''
              })(
                <Input disabled />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='(邮件内)发件人名字'
            >
              {getFieldDecorator('senderName', {
                initialValue: check.sango2Mails ? check.sango2Mails.senderName : ''
              })(
                <Input type='textarea' autosize={{ minRows: 2 }} disabled />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='邮件内容'
            >
              {getFieldDecorator('context', {
                initialValue: check.sango2Mails ? check.sango2Mails.context : ''
              })(
                <Input type='textarea' autosize={{ minRows: 2 }} disabled />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='描述(原因说明)'
            >
              {getFieldDecorator('description', {
                initialValue: check.sango2Mails ? check.sango2Mails.description : ''
              })(
                <Input type='textarea' autosize={{ minRows: 2 }} disabled />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='创建人'
            >
              {getFieldDecorator('creator', {
                initialValue: check.sango2Mails ? check.sango2Mails.creator : ''
              })(
                <Input disabled />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='创建时间'
            >
              {getFieldDecorator('createTime', {
                initialValue: check.sango2Mails ? check.sango2Mails.createTime : ''
              })(
                <Input disabled />
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

            { formItems }

          </Form>
        </Card>
        <Card
          title='邮件收件人信息'
          noHovering
        >
          <Form>
            <Table
              rowKey='index'
              bordered
              dataSource={check.mailPlayers}
              columns={this.columns}
              pagination={{
                showSizeChanger: true,
                defaultPageSize: 50,
                pageSizeOptions: ['20', '50', '100', '200', '500']
              }}
            />
          </Form>
          {
            _.has(curd, '50506') &&
            <Button type='primary' onClick={this.handleSearch} style={{marginRight: '20px'}}>发送</Button>
          }
          <Button type='primary'>
            <Link to='/sango2/mail/serverMail/index'>返回</Link>
          </Button>
        </Card>
      </div>
    )
  }
}

const Details = Form.create()(DetailsForm)
export default Details
