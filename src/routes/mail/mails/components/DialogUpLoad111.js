/* global SANGO2_API_HOST */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Form, Upload, Icon, Cascader } from 'antd'
import _ from 'lodash'
// const FormItem = Form.Item
// import PropTypes from 'prop-types'
import openNotificationWithIcon from '../../../../../components/notification'

const Dragger = Upload.Dragger


class UpLoadForm extends Component {

  static propTypes = {
    login: PropTypes.object.isRequired,
    options: PropTypes.array
  //   form: PropTypes.object.isRequired,
  //   item: PropTypes.object.isRequired,
  //   records: PropTypes.object,
  //   channel: PropTypes.object.isRequired,
  //   login: PropTypes.object.isRequired,
  //   onLoading: PropTypes.func.isRequired,
  //   addMail: PropTypes.func.isRequired,
  //   fetchChannels: PropTypes.func.isRequired,
  //   itemsActionCreator: PropTypes.func.isRequired
  }

  state = {  // 默认选中
    productId: []
  }

  handleChange = (value, selectedOptions) => {
    console.log(value)
    this.setState({
      productId: [value[0]]
    })
  }

  componentWillUnmount() {
    this.setState({
      productId: []
    })
  }

  render() {
    let proOptions = []
    _.map(this.props.options, (val, index) => {
      proOptions.push({label: val.label, value: val.value})
    })
    const props = {
      disabled: !(this.state.productId.length > 0),
      name: 'file',
      action: `${SANGO2_API_HOST}/products/${this.state.productId[0]}/mails/upload`,
      headers: {
        'adminUserId': this.props.login.admin.data.admin.adminUserId,
        'Authorization': `bearer ${this.props.login.admin.data.admin.token}`
      },
      onChange(info) {
        const status = info.file.status
        if (status !== 'uploading') {
          openNotificationWithIcon('info', '正在上传，请稍后')
        }
        if (status === 'done') {
          openNotificationWithIcon('success', '上传成功')
        } else if (status === 'error') {
          openNotificationWithIcon('error', '上传失败')
        }
      }
    }
    console.log(props)
    // const { form: { getFieldDecorator } } = this.props
    // const getFieldDecorator = this.props.form
    // const formItemLayout = {
    //   labelCol: {
    //     xs: { span: 24 },
    //     sm: { span: 6 }
    //   },
    //   wrapperCol: {
    //     xs: { span: 24 },
    //     sm: { span: 14 }
    //   }
    // }
    // const tailFormItemLayout = {
    //   wrapperCol: {
    //     xs: {
    //       span: 24,
    //       offset: 0
    //     },
    //     sm: {
    //       span: 14,
    //       offset: 6
    //     }
    //   }
    // }
    return (
      <div style={{textAlign: 'center'}}>
        <span>
          请选择产品:&nbsp;&nbsp;&nbsp;&nbsp;
        </span>
        <Cascader
          showSearch
          placeholder='请选择产品(必选)'
          options={proOptions}
          defaultValue={this.state.productId}
          expandTrigger='hover'
          onChange={this.handleChange}
          style={{width: 200, height: 30}}
        />
        <div style={{ marginTop: 16, height: 180 }}>
          <Dragger {...props} >
            <p className='ant-upload-drag-icon'>
              <Icon type='inbox' style={this.state.productId.length > 0 ? {} : {color: 'red'}} />
            </p>
            <h2 className='ant-upload-text'>请先选择产品!再上传EXCEL文件</h2>
            <p className='ant-upload-hint'>点击此区域选择文件或拖拽文件进入该区域进行上传，仅支持单个文件上传</p>
          </Dragger>
        </div>
      </div>
    )
  }
}

const DialogUpLoad = Form.create()(UpLoadForm)

export default DialogUpLoad
