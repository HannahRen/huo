import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Input, Button, Cascader, DatePicker, Modal } from 'antd'
import moment from 'moment'
import _ from 'lodash'
import SkillModal from './Modal'

const RangePicker = DatePicker.RangePicker


class SkillMailFilter extends Component {

  static propTypes = {
    curd: PropTypes.object.isRequired,
    options: PropTypes.array.isRequired,
    item: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    onSend: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired
  }

  state = {
    visible: false
  }

  handleShow = () => {
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
      if (!err) {
        let value = {}
        if (fieldsValue.nickname) { value.nickname = fieldsValue.nickname }
        value.products = fieldsValue.products
        value.times = [fieldsValue.times[0].format('YYYY-MM-DD HH:mm:ss'), fieldsValue.times[1].format('YYYY-MM-DD HH:mm:ss')]

        this.props.onSearch(value)
      }
    })
  }

  render() {
    const { form: { getFieldDecorator }, curd } = this.props
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
      rules: [{ type: 'array', required: true, message: '请选择起止时间' }],
      initialValue: [moment('00:00:00', 'HH:mm:ss').subtract({days: 1}), moment('00:00:00', 'HH:mm:ss')]
    }

    return (
      <div>
        <Form
          className='ant-advanced-search-form'
          onSubmit={this.handleSearch}
        >
          <Row gutter={24}>
            {
              _.has(curd, '50102')
              ?
                <Col {...ColProps} xl={{ span: 8 }} md={{ span: 20 }}>
                  {getFieldDecorator('products', {
                    rules: [{ required: true, message: '必填!' }]
                  })(
                    <Cascader
                      popupClassName='cascaderMenu'
                      showSearch
                      placeholder='请选择产品与服务器(必选)'
                      options={this.props.options}
                      expandTrigger='hover'
                    />
                  )}
                </Col>
              :
                ''
            }
            {
              _.has(curd, '50102')
              ?
                <Col {...ColProps} xl={{ span: 6 }} md={{ span: 6 }}>
                  {getFieldDecorator('nickname', {
                    rules: [{ required: false, message: '请填写玩家昵称(非必填)' }],
                    initialValue: ''
                  })(
                    <Input placeholder='请填写玩家昵称' />
                  )}
                </Col>
              :
                ''
            }
            {
              _.has(curd, '50102')
              ?
                <Col {...ColProps} xl={{ span: 6 }} md={{ span: 6 }}>
                  {getFieldDecorator('times', rangeConfig)(
                    <RangePicker showTime format='YYYY-MM-DD HH:mm:ss' />
                  )}
                </Col>
              :
                ''
            }

            <Col {...TwoColProps} xl={{ span: 4 }} md={{ span: 24 }} sm={{ span: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  {
                    _.has(curd, '50102')
                    ?
                      <Button type='primary' className='margin-right' htmlType='submit'>查询</Button>
                    :
                      ''
                  }
                </div>
                <div>
                  {
                    _.has(curd, '50101')
                    ?
                      <Button type='ghost' onClick={this.handleShow}>发技能</Button>
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
          key={Math.random()}
          title='发技能'
          visible={this.state.visible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <SkillModal
            options={this.props.options}
            onSend={this.props.onSend}
            item={this.props.item}
            handleCancel={this.handleCancel}
          />
        </Modal>
      </div>
    )
  }
}

const Filter = Form.create()(SkillMailFilter)

export default Filter
