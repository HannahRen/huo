import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Row, Col, Cascader, InputNumber, Input, Table, Card, Modal } from 'antd'
import _ from 'lodash'
import { Link } from 'react-router'

import { connect } from 'react-redux'
import { fetchChannels } from '../../../../../base/modules/channels'
import { fetchProductsMap } from '../../../../../base/modules/products'
import { fetchGoodsMap } from '../../../../../base/modules/goods'
import { checkOwnMail, updateOwnEmailPlayer, sendOwnMail } from '../modules/DetailsModule'

import PlayersModal from './Modal'

const FormItem = Form.Item

const mapDispatchtoProps = {
  fetchChannels,
  fetchProductsMap,
  fetchGoodsMap,
  checkOwnMail,
  updateOwnEmailPlayer,
  sendOwnMail
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  channel: state.channels.map,
  products: state.products,
  goods: state.goods,
  ownMailDetail: state.ownMailDetail
})

@connect(mapStateToProps, mapDispatchtoProps)

class DetailsForm extends Component {

  static propTypes = {
    login: PropTypes.object,
    form: PropTypes.object,
    location: PropTypes.object,
    products: PropTypes.object,
    fetchProductsMap: PropTypes.func,
    goods: PropTypes.object,
    fetchGoodsMap: PropTypes.func,
    checkOwnMail: PropTypes.func,
    updateOwnEmailPlayer: PropTypes.func,
    sendOwnMail: PropTypes.func,
    ownMailDetail: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.columns = [{
      title: '玩家信息',
      dataIndex: 'playerName',
      key: 'playerName'
    }, {
      title: '已得到奖励',
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
      }, {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        const { curd } = this.props.login

        return (
          _.has(curd, '50307') ?
            <Button onClick={e => this.handleOk(record)}>
              修改收件人
            </Button>
          :
            ''
        )
      }
    }]
  }

  state = {
    visible: false,
    record: {},
    options: []
  }

  handleOk = (value) => {
    this.setState({
      visible: true,
      record: value
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  componentWillMount() {
    this.props.fetchProductsMap()
    this.props.fetchGoodsMap({productId: '_'})
    this.props.checkOwnMail(this.props.location.query.id)
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
        let id = this.props.ownMailDetail.check.sango2Mails.id
        this.props.sendOwnMail(id)
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { curd } = this.props.login

    const { check } = this.props.ownMailDetail

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

    let goods = []
    if (this.props.goods.options[0]) {
      _.map(this.props.goods.options[0], (value, key) => {
        goods.push(
          {value: key, label: `${value}(${key})`}
        )
      })
    }

    // 处理状态数据显示格式
    let statusItem = ''
    if (check.sango2Mails && check.sango2Mails.status === 0) { statusItem = '未发送' }
    if (check.sango2Mails && check.sango2Mails.status === 1) { statusItem = '发送成功' }
    if (check.sango2Mails && check.sango2Mails.status === 2) { statusItem = '发送失败' }
    if (check.sango2Mails && check.sango2Mails.status === 3) { statusItem = '审核中' }
    if (check.sango2Mails && check.sango2Mails.status === 4) { statusItem = '审核通过' }
    if (check.sango2Mails && check.sango2Mails.status === 5) { statusItem = '审核未通过' }

    let userTypeOptions = ''
    if (check.sango2Mails && check.sango2Mails.receiverType === 1) { userTypeOptions = '用户昵称' }
    if (check.sango2Mails && check.sango2Mails.receiverType === 2) { userTypeOptions = '玩家Id' }
    if (check.sango2Mails && check.sango2Mails.receiverType === 3) { userTypeOptions = '平台ID' }

    let productIdOpt = ''
    if (check.sango2Mails && check.sango2Mails.productId) { productIdOpt = check.sango2Mails.productId }

    let serverIdOpt = ''
    if (check.sango2Mails && check.sango2Mails.serverIds) { serverIdOpt = check.sango2Mails.serverIds }

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
              label='产品/服务器id'
            >
              {getFieldDecorator('products', {
                initialValue: check.sango2Mails ? [check.sango2Mails.productId, check.sango2Mails.serverIds] : ['', '']
              })(
                <Cascader
                  disabled
                  options={options}
                />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='原始收件人格式'
            >
              {getFieldDecorator('receiverType', {
                initialValue: userTypeOptions
              })(
                <Input disabled />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='原始收件人'
            >
              {getFieldDecorator('receivers', {
                initialValue: check.sango2Mails ? check.sango2Mails.receivers : ''
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
          title={
            <div>
            邮件收件人信息，产品: <i style={{color: '#d50b10'}}>{productIdOpt}</i>&nbsp;&nbsp;服务器: <i style={{color: '#d50b10'}}>{serverIdOpt}</i>,&nbsp;&nbsp;玩家信息格式为: <i style={{color: '#d61'}}>{userTypeOptions}</i>
            </div>
          }
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
            _.has(curd, '50306') &&
            <Button type='primary' onClick={this.handleSearch} style={{marginRight: '20px'}}>发送</Button>
          }

          <Button type='primary'>
            <Link to='/mail/own-mail/index'>返回</Link>
          </Button>
          <Modal
            width={1000}
            maskClosable={false}
            key='update_player_ownMail'
            title='修改邮件目标玩家'
            visible={this.state.visible}
            footer={null}
            onCancel={this.handleCancel}
          >
            <PlayersModal
              handleCancel={this.handleCancel}
              data={this.state.record}
              updateOwnEmailPlayer={this.props.updateOwnEmailPlayer}
            />
          </Modal>
        </Card>
      </div>
    )
  }
}

const Details = Form.create()(DetailsForm)
export default Details
