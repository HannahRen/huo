import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Cascader, DatePicker, Modal, notification } from 'antd'
import _ from 'lodash'
import moment from 'moment'
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

import AddContainer from '../containers/AddContainer'


const { RangePicker } = DatePicker

class OwnMailFilter extends Component {

  static propTypes = {
    curd: PropTypes.object.isRequired,
    options: PropTypes.array,
    channels: PropTypes.array,
    goods: PropTypes.array,
    form: PropTypes.object,
    onSearch: PropTypes.func
  }

  state = {
    visible: false,
    serversOptions: []
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

  openNotificationWithIcon = (type, msg) => {
    notification[type]({
      message: msg,
      description: '邮件状态空选为查询所有状态邮件'
    })
  }

  handleVisible = () => {
    this.setState({
      visible: true
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, fieldsValue) => {
      if (err && err.productId.errors[0].message === '请选择产品(必选)') {
        this.openNotificationWithIcon('warning', err.productId.errors[0].message)
      }
      if (!err) {
        if (!fieldsValue.productId) {
          fieldsValue.productId = []
        }
        if (!fieldsValue.serverId) {
          fieldsValue.serverId = []
        }
        if (!fieldsValue.times) {
          fieldsValue.times = []
        }
        if (!fieldsValue.status) {
          fieldsValue.status = []
        }

        let value = {}
        if (fieldsValue.productId.length > 0) {
          value.productId = fieldsValue.productId[0]
        }
        if (fieldsValue.serverId.length > 0) {
          value.serverId = fieldsValue.serverId[0]
        }
        if (fieldsValue.times.length > 0) {
          value.startDate = fieldsValue.times[0].format('YYYY-MM-DD')
          value.endDate = fieldsValue.times[1].format('YYYY-MM-DD')
        }
        if (fieldsValue.nickname) {
          value.nickName = fieldsValue.nickname
        }
        if (fieldsValue.status.length > 0) {
          value.mailStatus = fieldsValue.status[0]
        }

        this.props.onSearch(value)
      }
    })
  }

  render() {
    const { form: { getFieldDecorator }, curd } = this.props

    // 产品，服务器下拉
    let productsOptions = []
    _.map(this.props.options, (val, idx) => {
      productsOptions.push({
        value: val.value,
        label: val.label
      })
    })

    let statusItem = [
      {value: '0', label: '未发送'},
      {value: '1', label: '发送成功'},
      {value: '2', label: '发送失败'},
      {value: '3', label: '审核中'},
      {value: '4', label: '审核通过'},
      {value: '5', label: '审核未通过'}
    ]

    const ColProps = {
      xs: 24,
      sm: 12,
      style: {
        marginBottom: 6
      }
    }

    const TwoColProps = {
      ...ColProps,
      xl: 96
    }
    const rangeConfig = {
      rules: [{ type: 'array', required: false, message: '请选择起止日期' }],
      initialValue: [moment('00:00:00', 'HH:mm:ss'), moment('00:00:00', 'HH:mm:ss').subtract({days: -1})]
      // initialValue: [moment('00:00:00', 'HH:mm:ss').subtract({days: 1}), moment('00:00:00', 'HH:mm:ss')]
    }

    return (
      <div>
        <Form
          className='ant-advanced-search-form'
          onSubmit={this.handleSearch}
        >
          {
            _.has(curd, '50503')
            ?
              <Row gutter={20}>
                <Col {...ColProps} xl={{ span: 5 }} md={{ span: 6 }}>
                  {getFieldDecorator('productId', {
                    rules: [{ required: false, message: '请选择产品(可选)' }]
                  })(
                    <Cascader
                      showSearch
                      options={productsOptions}
                      placeholder='请选择产品'
                      expandTrigger='hover'
                      onChange={this.handleProChange}
                    />
                  )}
                </Col>
                <Col {...ColProps} xl={{ span: 5 }} md={{ span: 6 }}>
                  {getFieldDecorator('serverId', {
                    rules: [{ required: false, message: '选择服务器(可选)' }]
                  })(
                    <Cascader
                      showSearch
                      options={this.state.serversOptions}
                      placeholder='选择服务器'
                      expandTrigger='hover'
                    />
                  )}
                </Col>
                <Col {...ColProps} xl={{ span: 6 }} md={{ span: 6 }}>
                  {getFieldDecorator('times', rangeConfig)(
                    <RangePicker
                      showTime
                      format='YYYY-MM-DD'
                    />
                  )}
                </Col>
                <Col {...ColProps} xl={{ span: 5 }} md={{ span: 6 }}>
                  {getFieldDecorator('status', {
                    rules: [{ required: false, message: '请选择邮件状态' }]
                  })(
                    <Cascader
                      showSearch
                      options={statusItem}
                      placeholder='请选择查看某种状态的邮件'
                      expandTrigger='hover'
                    />
                  )}
                </Col>
              </Row>
            :
              ''
          }

          <Row gutter={20}>
            <Col {...TwoColProps} xl={{ span: 3 }} md={{ span: 24 }} sm={{ span: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  {
                    _.has(curd, '50503')
                    ?
                      <Button type='primary' className='margin-right' htmlType='submit'>查询</Button>
                    :
                      ''
                  }
                </div>
                <div>
                  {
                    _.has(curd, '50501')
                    ?
                      <Button type='danger' onClick={this.handleVisible}>写邮件</Button>
                    :
                      ''
                  }
                </div>
              </div>
            </Col>
          </Row>
        </Form>

        <Modal
          width={1000}
          maskClosable={false}
          title='新建全服邮件'
          footer={null}
          visible={this.state.visible}
          onCancel={this.handleCancel}
        >
          <AddContainer
            options={this.props.options}
            goods={this.props.goods}
            channels={this.props.channels}
            handleCancel={this.handleCancel}
          />
        </Modal>
      </div>
    )
  }
}

const Filter = Form.create()(OwnMailFilter)

export default Filter
