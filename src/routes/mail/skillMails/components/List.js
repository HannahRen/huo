import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment'

export default class List extends Component {

  static propTypes = {
    data: PropTypes.array.isRequired
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
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname'
    }, {
      title: '技能id',
      dataIndex: 'skillId',
      key: 'skillId'
    }, {
      title: '技能名称',
      dataIndex: 'skillName',
      key: 'skillName'
    }, {
      title: '操作人/管理员',
      dataIndex: 'adminUserName',
      key: 'adminUserName'
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text, record) => {
        return moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')
      }
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        if (record.status === 0) { return <div style={{color: '#d7390f'}}>失败</div> }
        if (record.status === 1) { return <div>成功</div> }
      }
    }]
  }

  render() {
    return (
      <div>
        <Table
          rowKey='id'
          bordered
          dataSource={this.props.data}
          columns={this.columns}
          pagination={{
            showSizeChanger: true,
            defaultPageSize: 50,
            pageSizeOptions: ['20', '50', '100', '200', '500']
          }}
        />
      </div>
    )
  }
}
