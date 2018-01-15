import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { Menu, Dropdown, Icon, Button, Table, Modal, Cascader } from 'antd'

import Update from './Update'
import Upload from './Upload'
import _ from 'lodash'


export default class List extends Component {
  static propTypes = {
    login: PropTypes.object.isRequired,
    data: PropTypes.array,
    item: PropTypes.array,
    fetching: PropTypes.bool,
    onUpdate: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.columns = [{
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      width: 350
    }, {
      title: '邮件标题',
      dataIndex: 'title',
      key: 'title'
    }, {
      title: '邮件内容',
      dataIndex: 'context',
      key: 'context'
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime'
    }, {
      title: '描述(仅管理台可见)',
      dataIndex: 'description',
      key: 'description'
    }, {
      title: '发送状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        return (
          text === 1 ? '已发送' : '未发送'
        )
      }
    }, {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 80,
      render: (text, record) => {
        let menus = []
        _.forEach(record.curd, (value, key, collection) => {
          switch (key) {
            case '50202':
              menus.push(<Menu.Item key='1'>修改</Menu.Item>)
              break
            case '50203':
              menus.push(<Menu.Item key='2'>上传EXCEL</Menu.Item>)
              break
            case '50205':
              menus.push(
                <Menu.Item key='3'>
                  <Link to={{ pathname: '/sango2/mail/batchmail/batchmailPlayers', query: { id: record.id, title: record.title } }}>
                    查询发送玩家
                  </Link>
                </Menu.Item>
              )
              break
            default:

          }
        })
        return (
          <Dropdown overlay={
            <Menu onClick={e => this._handleMenuClick(record, e)}>
              {menus}
            </Menu>}
          >
            <Button type='default'>
              <Icon type='bars' />
              <Icon type='down' />
            </Button>
          </Dropdown>
        )
      }
    }]

    this.expandedColumns = [{
      title: '奖励道具',
      dataIndex: 'itemId',
      key: 'itemId',
      width: 300,
      render: (text, record) => {
        return (
          <Cascader
            options={this.props.item}
            defaultValue={[String(record.itemId)]}
            style={{width: 300}}
            disabled
          />
        )
      }
    }, {
      title: '数量',
      dataIndex: 'count',
      key: 'count',
      width: 200
    }
    ]
  }

  state = {
    updateVisible: false,
    uploadVisible: false,
    mails: {}
  }

  _handleVisited = (e) => {
    if (e.key == 1) {
      this.setState({
        updateVisible: true
      })
    }
    if (e.key == 2) {
      this.setState({
        uploadVisible: true
      })
    }
  }

  _handleCancel1 = (e) => {
    this.setState({
      updateVisible: false
    })
  }

  _handleCancel2 = (e) => {
    this.setState({
      uploadVisible: false
    })
  }

  _handleOk = (e) => {
    if (e.key == 1) {
      this.setState({
        updateVisible: false
      })
    }
    if (e.key == 2) {
      this.setState({
        uploadVisible: false
      })
    }
  }

  _expandedMenus = (e) => {
    return (
      <Table
        rowKey='index'
        size='small'
        columns={this.expandedColumns}
        dataSource={e.rewards}
        pagination={false}
        scroll={{ y: 250 }}
      />
    )
  }

  _handleMenuClick = (record, e) => {
    this.setState({
      mails: record
    })
    this._handleVisited(e)
  }


  render() {
    const dataSource = this.props.data
    const {login: {curd}} = this.props
    let list = _.forEach(dataSource, function(value, index, collection) {
      value.curd = curd
    })
    return (
      <div>
        <Table
          bordered
          rowKey='id'
          dataSource={list}
          columns={this.columns}
          expandedRowRender={record => { return this._expandedMenus(record) }}
          pagination={{
            showSizeChanger: true,
            defaultPageSize: 50,
            pageSizeOptions: ['20', '50', '100', '200', '500']
          }}
          loading={this.props.fetching}
        />
        <Modal
          key={Math.random()}
          title='修改批量邮件配置'
          width={1000}
          footer={null}
          maskClosable={false}
          // onChange={this.onChange}
          visible={this.state.updateVisible}
          onCancel={this._handleCancel1}
        >
          <Update
            item={this.props.item}
            data={this.state.mails}
            onUpdate={this.props.onUpdate}
            _handleOk={this._handleOk}
          />
        </Modal>
        <Modal
          key={Math.random()}
          title='上传批量邮件玩家excel'
          width={1000}
          footer={null}
          maskClosable={false}
          // onChange={this.onChange}
          visible={this.state.uploadVisible}
          onCancel={this._handleCancel2}
        >
          <Upload
            data={this.state.mails}
          />
        </Modal>
      </div>
    )
  }
}
