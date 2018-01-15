import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Input, Button, Cascader, DatePicker, Modal } from 'antd'
import moment from 'moment'
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

const RangePicker = DatePicker.RangePicker

import DialogContainer from '../containers/DialogContainer'
import DialogUpLoad from '../components/DialogUpLoad'
// import SkillContainer from '../containers/SkillContainer'

export class AdvancedSearchForm extends Component {

  static propTypes = {
    options: PropTypes.array.isRequired,
    form: PropTypes.object.isRequired,
    login: PropTypes.object.isRequired,
    onMails: PropTypes.func.isRequired,
    initialFiler: PropTypes.object
  }

  state = {
    visible: false,
    upLoadVisible: false,
    skillVisible: false
  }

  showModal = () => {
    this.setState({
      visible: true
    })
  }
  handleCancel = (e) => {
    this.setState({
      visible: false
    })
  }
  showUpLoadModal = () => {
    this.setState({
      upLoadVisible: true
    })
  }
  handleUpLoadCancel = (e) => {
    this.setState({
      upLoadVisible: false
    })
  }
  // showSkillModal = () => {
  //   this.setState({
  //     skillVisible: true
  //   })
  // }
  // handleSkillCancel = (e) => {
  //   this.setState({
  //     skillVisible: false
  //   })
  // }
  handleSearch = (e) => {
    e.preventDefault()
    // 校验并获取一组输入域的值与 Error，若 fieldNames 参数为空，则校验全部组件
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        this.props.onMails(fieldsValue)
      }
    })
  }

  render() {
    const { form: {getFieldDecorator}, initialFiler } = this.props
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
      // initialValue: [moment('00:00:00', 'HH:mm:ss').subtract({days: 1}), moment('00:00:00', 'HH:mm:ss').add({days: 1})]
    }

    return (
      <div>
        <Form
          className='ant-advanced-search-form'
          onSubmit={this.handleSearch}
        >
          <Row gutter={16}>
            <Col {...ColProps} xl={{ span: 6 }} md={{ span: 6 }}>
              {getFieldDecorator('products', {
                initialValue: initialFiler.value ? [this.props.initialFiler.value[0], this.props.initialFiler.value[1]] : [],
                rules: [{ required: true, message: '必填!' }]
              })(
                <Cascader
                  showSearch
                  placeholder='请选择产品与服务器(必选)'
                  options={this.props.options}
                  expandTrigger='hover'
                />
              )}
            </Col>
            <Col {...ColProps} xl={{ span: 6 }} md={{ span: 6 }}>
              {getFieldDecorator('nickname')(
                <Input placeholder='玩家昵称' />
              )}
            </Col>
            <Col {...ColProps} xl={{ span: 6 }} md={{ span: 6 }}>
              {getFieldDecorator('range-time-picker', rangeConfig)(
                <RangePicker showTime format='YYYY-MM-DD HH:mm:ss' />
              )}
            </Col>
            {/* <FormItem
              {...ColProps}
              label='RangePicker（用于案例使用）'
            >
              {getFieldDecorator('range-picker', rangeConfig)(
                <RangePicker/>
              )}
            </FormItem> */}
            <Col {...TwoColProps} xl={{ span: 6 }} md={{ span: 24 }} sm={{ span: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <Button type='primary' className='margin-right' htmlType='submit'>查询</Button>
                </div>
                <div>
                  <Button type='ghost' onClick={this.showModal}>写邮件</Button>
                </div>
                {/* <div>
                  <Button type='ghost' onClick={this.showUpLoadModal}>上传文件</Button>
                </div> */}
                {/* <div>
                  <Button type='ghost' onClick={this.showSkillModal}>发技能</Button>
                </div> */}
              </div>
            </Col>
          </Row>
        </Form>

        <Modal
          width={700}
          maskClosable={false}
          key={Math.random()}
          title='写邮件'
          visible={this.state.visible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <DialogContainer
            onLoading={this.handleCancel}
          />
        </Modal>

        <Modal
          width={700}
          maskClosable={false}
          key={Math.random()}
          title='上传文件'
          visible={this.state.upLoadVisible}
          footer={null}
          onCancel={this.handleUpLoadCancel}
        >
          <DialogUpLoad
            onLoading={this.handleUpLoadCancel}
            options={this.props.options}
            login={this.props.login}
          />
        </Modal>

        {/* <Modal
          width={700}
          maskClosable={false}
          key={Math.random()}
          title='发技能'
          visible={this.state.skillVisible}
          footer={null}
          onCancel={this.handleSkillCancel}
        >
          <SkillContainer
            onLoading={this.handleSkillCancel}
          />
        </Modal> */}
      </div>
    )
  }
}

const WrappedAdvancedSearchForm = Form.create({
  // 当 Form.Item 子节点的值发生改变时触发，可以把对应的值转存到 Redux store
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields)
  },
  // 把 props 转为对应的值，可用于把 Redux store 中的值读出 {...this.state.fields}
  mapPropsToFields(props) {
    return {
      nickname: {
        ...props.nickname
      },
      'range-picker': {
        ...props['range-picker']
      },
      'range-time-picker': {
        ...props['range-time-picker']
      },
      'products': {
        ...props.products
      }
    }
  },
  // 任一表单域的值发生改变时的回调
  onValuesChange(_, values) {
    console.log('Form.create.onValuesChange', values)
  }
})(AdvancedSearchForm)

export default WrappedAdvancedSearchForm
