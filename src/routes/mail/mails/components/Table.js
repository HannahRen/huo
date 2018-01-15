import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import _ from 'lodash'
import moment from 'moment'

import DropOption from './../../../../../components/DropOption/DropOption'
import DialogContainer from '../containers/DialogContainer'

export default class EditableTable extends Component {

  static propTypes = {
    data: PropTypes.array.isRequired,
    fetchMail: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.columns = [{
      title: 'ID',
      dataIndex: 'id',
      width: '5%'
    }, {
      title: '标题',
      dataIndex: 'title'
    }, {
      title: '发件人',
      dataIndex: 'senderName'
    }, {
      title: 'GM管理员',
      dataIndex: 'adminUserName'
    }, {
      title: '状态',
      dataIndex: 'status'
    }, {
      title: '时间',
      width: 140,
      dataIndex: 'createTime'
    }, {
      title: '产品ID',
      dataIndex: 'productId',
      className: 'column-hide'
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record, index) => {
        // console.log(record)
        return (
          <DropOption
            onMenuClick={e => this.handleMenuClick(text, record, index, e)}
            menuOptions={
              [
                { key: '1', name: '查看' },
                { key: '2', name: '复制' }
              ]
            }
            dropdownProps={{
              trigger: ['hover']
            }}
          />
        )
      }
    }]

    this.data = {
      dataSource: []
    }

    this.state = {
      visible: false,
      record: {}
    }
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

  handleMenuClick = (text, record, index, e) => {
    if (e.key === '1') {
      const dataSource = [...this.data.dataSource]
      const target = dataSource.slice(index, ++index)
      // console.log(target[0].id)
      // console.log(target[0])
      this.props.fetchMail(target[0].id, target[0].productId)
    } else if (e.key === '2') {
      const dataSource = this.props.data
      const target = _.find(dataSource, function(o) {
        return o.id === record.id
      })
      this.setState({
        record: target
      })
      this.showModal()
    }
  }

  render() {
    const list = this.props.data
    let dataSource = []
    // console.log(list)
    list.map(function(elem, index) {
      dataSource.push({
        key: index,
        id: elem.id,
        title: elem.title,
        senderName: elem.senderName,
        adminUserName: elem.adminUserName,
        status: elem.status == 0 ? '失败' : '成功',
        createTime: moment(elem.createTime).format('YYYY-MM-DD HH:mm:ss'),
        productId: elem.productId
      })
    })

    this.data = {
      dataSource: [...dataSource]
    }

    return (
      <div>
        <Table
          bordered
          dataSource={this.data.dataSource}
          columns={this.columns}
          pagination={{
            showSizeChanger: true,
            defaultPageSize: 50,
            pageSizeOptions: ['20', '50', '100', '200', '500']
          }}
        />
        <Modal
          width={700}
          maskClosable={false}
          key={Math.random()}
          title='写邮件'
          visible={this.state.visible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <DialogContainer records={this.state.record} onLoading={this.handleCancel} />
        </Modal>
      </div>
    )
  }
  componentDidUpdate() {  // 可以修改DOM

  }
}
