/* global SANGO2_API_HOST */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Form, Upload, Icon } from 'antd'

import openNotificationWithIcon from '../../../../../../components/notification'


const FormItem = Form.Item
const Dragger = Upload.Dragger

class UpLoadForm extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    data: PropTypes.object
  }

  static contextTypes = {
    router: PropTypes.object
  }



  render() {
    const { getFieldDecorator } = this.props.form
    const mailId = this.props.data.id
    const title = this.props.data.title
    const router = this.context.router
    const path = {pathname: '/sango2/mail/batchmail/batchmailPlayers', query: {id: mailId, title: title}}

    const props = {
      name: 'file',
      showUploadList: false,
      action: `${SANGO2_API_HOST}/products/batchmails/${this.props.data.id}`,
      headers: {
        'adminUserId': JSON.parse(sessionStorage.getItem('sango2')).userId,
        'Authorization': `bearer ${JSON.parse(sessionStorage.getItem('sango2')).token}`
      },
      onChange(info) {
        const status = info.file.status
        if (status !== 'uploading') {
          openNotificationWithIcon('info', '正在上传，请稍后')
        }
        if (status === 'done') {
          openNotificationWithIcon('success', '上传成功')
          router.push(path)
        } else if (status === 'error') {
          openNotificationWithIcon('error', '上传失败', info.file.response.tips)
        }
      }
    }

    return (
      <Form>
        <FormItem>
          {getFieldDecorator('upload')(
            <Dragger {...props} >
              <p className='ant-upload-drag-icon'>
                <Icon type='inbox' />
              </p>
              <p className='ant-upload-hint'>点击此区域选择文件或拖拽文件进入该区域进行上传，仅支持单个EXCEL文件上传</p>
            </Dragger>
          )}
        </FormItem>
      </Form>
    )
  }
}

const UploadMail = Form.create()(UpLoadForm)

export default UploadMail
