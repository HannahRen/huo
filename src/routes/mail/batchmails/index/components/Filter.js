import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Modal, DatePicker, Input } from 'antd'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

import Add from './Add'
import _ from 'lodash'


const RangePicker = DatePicker.RangePicker

export class BatchmailFilter extends Component {

  static propTypes = {
    curd: PropTypes.object.isRequired,
    form: PropTypes.object,
    item: PropTypes.array,
    onSearch: PropTypes.func,
    onCreate: PropTypes.func,
    clearBatchmailAdd: PropTypes.func
  }

  state = {
    visible: false
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        let value = {}
        if (fieldsValue.time.length > 0) {
          value.startDate = fieldsValue.time[0].format('YYYY-MM-DD')
          value.endDate = fieldsValue.time[1].format('YYYY-MM-DD')
        }
        if (fieldsValue.context) {
          value.context = fieldsValue.context
        }
        this.props.onSearch(value)
      }
    })
  }

  handleCreate = (fieldsValue) => {
        this.props.onCreate(fieldsValue)
  }

  _handleVisited = (e) => {
    this.setState({
      visible: true
    })
  }
  _handleCancel = (e) => {
    this.setState({
      visible: false
    })
  }

  _handleOk = (e) => {
    this.setState({
      visible: false
    })
  }

  render() {
    const {curd, form: { getFieldDecorator }} = this.props

    const rangeConfig = {
      rules: [{ type: 'array', required: false, message: '请选择起止日期' }],
      initialValue: [moment('00:00:00', 'HH:mm:ss'), moment('00:00:00', 'HH:mm:ss').subtract({days: -1})]
    }

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

    return (
      <div>
        <Form
          className='ant-advanced-search-form'
          onSubmit={this.handleSearch}
        >
          {
            _.has(curd, '50204')
            ?
              <Row gutter={20}>
                <Col {...TwoColProps} xl={{ span: 6 }} md={{ span: 12 }} sm={{ span: 24 }}>
                  {getFieldDecorator('time', rangeConfig)(
                    <RangePicker format='YYYY-MM-DD' />
                  )}
                </Col>
                <Col {...TwoColProps} xl={{ span: 8 }} md={{ span: 12 }} sm={{ span: 24 }}>
                  {getFieldDecorator('context', {
                    rules: [{ required: false, message: '请输入筛选条件!', whitespace: true }]
                  })(
                    <Input placeholder='请输入内容' />
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
                    _.has(curd, '50204')
                    ?
                      <Button type='primary' className='margin-right' htmlType='submit'>查询</Button>
                    :
                      ''
                  }
                </div>
                <div>
                  {
                    _.has(curd, '50201')
                    ?
                      <Button type='danger' className='margin-right' onClick={this._handleVisited}>添加</Button>
                    :
                      ''
                  }
                </div>
              </div>
            </Col>
          </Row>
        </Form>
        <Modal
          key={Math.random()}
          title='添加批量邮件配置'
          width={1000}
          footer={null}
          maskClosable={false}
          // onChange={this.onChange}
          visible={this.state.visible}
          onCancel={this._handleCancel}
        >
          <Add
            item={this.props.item}
            onAdd={this._handleOk}
            handleCreate={this.handleCreate}
            clearBatchmailAdd={this.props.clearBatchmailAdd}
          />
        </Modal>
      </div>
    )
  }
}

const Filter = Form.create()(BatchmailFilter)

export default Filter
