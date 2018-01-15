import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Table, Cascader, Dropdown, Button, Icon, Menu, Modal, Popconfirm } from 'antd'
import { Link } from 'react-router'

import UpdateContainer from './Update'
import Copy from './Copy'


export default class List extends Component {
  static propTypes = {
    curd: PropTypes.object.isRequired,
    onSend: PropTypes.func,
    onPass: PropTypes.func,
    onAdd: PropTypes.func,
    data: PropTypes.object,
    goods: PropTypes.array,
    options: PropTypes.array
  }

  constructor(props) {
    super(props)
    this.columns = [{
        title: 'id',
        dataIndex: 'id',
        key: 'id'
      }, {
        title: '产品ID',
        dataIndex: 'productId',
        key: 'productId'
      }, {
        title: '服务器ID',
        dataIndex: 'serverIds',
        key: 'serverIds'
      }, {
        title: '邮件标题',
        dataIndex: 'title',
        key: 'title'
      }, {
        title: '邮件内容',
        dataIndex: 'context',
        key: 'context'
      }, {
        title: '操作时间',
        dataIndex: 'createTime',
        key: 'createTime'
      }, {
        title: '邮件状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record, index) => {
          if (record.status === 0) { return <div>未发送</div> }
          if (record.status === 1) { return <div style={{color: '#0fd233'}}>发送成功</div> }
          if (record.status === 2) { return <div style={{color: '#ce1c40'}}>发送失败</div> }
          if (record.status === 3) { return <div style={{color: '#cec21c'}}>审核中</div> }
          if (record.status === 4) { return <div style={{color: '#9907d5'}}>审核通过</div> }
          if (record.status === 5) { return <div style={{color: '#ce1c40'}}>审核未通过</div> }
        }
      }, {
        title: '操作',
        key: 'action',
        render: (text, record, index, e) => {
          let menus = []
          _.forEach(record.curd, (value, key, collection) => {
            switch (key) {
              // case '50304':
              //   menus.push(
              //     <Menu.Item key='1'>
              //       <Link
              //         to={{
              //           pathname: '/sango2/mail/ownMail/details',
              //           query: {
              //             id: record.id
              //           }
              //         }}>
              //         详情
              //       </Link>
              //     </Menu.Item>
              //   )
              //   break
              case '50305':
                menus.push(<Menu.Item key='7'>拷贝</Menu.Item>)
                break
              case '50302':
                menus.push(
                  record.status !== 3 && <Menu.Item key='2'>修改</Menu.Item>
                )
                break
              case '50507':
                menus.push(
                  record.status === 3 && <Menu.Item key='3'>审核通过</Menu.Item>
                )
                menus.push(
                  record.status === 3 && <Menu.Item key='4'>审核拒绝</Menu.Item>
                )
                break
              case '50306/TEST_REFUSE':
                menus.push(
                  <Menu.Item key='6'>
                    <Popconfirm
                      title='确认要发送吗?'
                      onConfirm={() => this._handleConfirm(record)}
                    >
                      发送
                    </Popconfirm>
                  </Menu.Item>
                )
                break
              default:

            }
          })
          menus.push(
            <Menu.Item key='1'>
              <Link
                to={{
                  pathname: '/mail/own-mail/details',
                  query: {
                    id: record.id
                  }
                }}>
                详情
              </Link>
            </Menu.Item>
          )
          return (
            <Dropdown overlay={
              <Menu onClick={e => this._handleMenuClick(record, e)}>
                {/* <Menu.Item key='1'>
                  <Link
                    to={{
                      pathname: '/sango2/mail/ownMail/details',
                      query: {
                        id: record.id
                      }
                    }}>
                    详情
                  </Link>
                </Menu.Item>
                <Menu.Item key='7'>拷贝</Menu.Item>
                {
                  record.status !== 3 && <Menu.Item key='2'>修改</Menu.Item>
                }
                {
                  record.status === 3 && <Menu.Item key='3'>审核通过</Menu.Item>
                }
                {
                  record.status === 3 && <Menu.Item key='4'>审核拒绝</Menu.Item>
                }
                <Menu.Item key='6'>
                  <Popconfirm
                    title='确认要发送吗?'
                    onConfirm={() => this._handleConfirm(record)}
                  >
                    发送
                  </Popconfirm>
                </Menu.Item> */}
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
            options={this.props.goods}
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
    }]
  }

  state = {
    visible: false,
    id: null,
    mail: {},
    copyVisible: false,
    copy: {}
  }

  _handleConfirm = (value) => {
    this.props.onSend(value)
  }

  _handleMenuClick = (record, e) => {
    if (e.key === '2') {
      this.setState({
        visible: true,
        mail: record
      })
    }
    if (e.key === '3') {
      this.props.onPass({id: record.id, status: 4})
    }
    if (e.key === '4') {
      this.props.onPass({id: record.id, status: 5})
    }
    if (e.key === '7') {
      this.setState({
        copyVisible: true,
        copy: record
      })
    }
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      id: null
    })
  }

  _handleCancel = () => {
    this.setState({
      copyVisible: false
    })
  }

  _expandedMenus = (e) => {
    return (
      <Table
        rowKey='index'
        size='small'
        columns={this.expandedColumns}
        dataSource={e.rewards}
        pagination={false}
        scroll={{ y: 400 }}
      />
    )
  }

  render() {
    const {curd} = this.props
    let dataSource = this.props.data.ownMails
    dataSource = [{id: 1}]
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
          loading={this.props.data.fetching}
        />
        <Modal
          width={1000}
          maskClosable={false}
          key='update_ownMail'
          title='修改邮件信息'
          visible={this.state.visible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <UpdateContainer
            curd={this.props.curd}
            data={this.state.mail}
            goods={this.props.goods}
            options={this.props.options}
            handleCancel={this.handleCancel}
          />
        </Modal>
        <Modal
          width={1000}
          maskClosable={false}
          key='add_ownMail'
          title='复制邮件信息'
          visible={this.state.copyVisible}
          footer={null}
          onCancel={this._handleCancel}
        >
          <Copy
            curd={this.props.curd}
            data={this.state.copy}
            goods={this.props.goods}
            options={this.props.options}
            handleCancel={this._handleCancel}
            onAdd={this.props.onAdd}
          />
        </Modal>
      </div>
    )
  }

}
