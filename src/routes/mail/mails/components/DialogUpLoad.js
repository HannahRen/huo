/* global SANGO2_API_HOST */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Form, Cascader, Upload, Icon } from 'antd'
import _ from 'lodash'

import openNotificationWithIcon from '../../../../../components/notification'

const FormItem = Form.Item
const Dragger = Upload.Dragger

class UpLoadForm extends Component {
  static propTypes = {
    login: PropTypes.object.isRequired,
    options: PropTypes.array.isRequired,
    form: PropTypes.object.isRequired
  }

  state = {  // 默认选中
    productId: [this.props.options[0].value]
  }

  handleChange = (value, selectedOptions) => {
    // console.log(value.slice())
    this.setState({
      productId: value.slice()
    })
  }

  render() {
    const { form: { getFieldDecorator }, options } = this.props

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

    const proOptions = _.map(options, (val, index) => {
      return {
        label: val.label,
        value: val.value
      }
    })

    const props = {
      disabled: options.length === 0,
      name: 'file',
      showUploadList: false,
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

    return (
      <Form>
        <FormItem
          {...itemsLayout}
          label='产品'
        >
          {getFieldDecorator('products', {
            initialValue: [options[0].value]
          })(
            <Cascader
              showSearch
              placeholder='请选择产品(必选)'
              options={proOptions}
              onChange={this.handleChange}
              expandTrigger='hover'
            />
          )}
        </FormItem>

        <FormItem
          {...itemsLayout}
          label='上传数据'
        >
          {getFieldDecorator('upload')(
            <Dragger {...props} >
              <p className='ant-upload-drag-icon'>
                <Icon type='inbox' style={options.length > 0 ? {} : {color: 'red'}} />
              </p>
              <h2 className='ant-upload-text'>请先选择产品!再上传EXCEL文件</h2>
              <p className='ant-upload-hint'>点击此区域选择文件或拖拽文件进入该区域进行上传，仅支持单个文件上传</p>
            </Dragger>
          )}
        </FormItem>
      </Form>
    )
  }
}

const DialogUpLoad = Form.create()(UpLoadForm)

export default DialogUpLoad
