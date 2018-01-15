import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import _ from 'lodash'

import ModalContainer from './Modal'
import DropOption from '../../../../base/components/DropOption'

export default class List extends Component {
  state = {
    dataSource: [],
    count: 0,
    editing: {},
    currentItem: {},
    modalType: 'update',
    visible: false
  }

  constructor(props) {
    super(props)
    this.columns = [
      {
        title: '产品ID',
        dataIndex: 'productId'
      }, {
        title: '节点ID',
        dataIndex: 'serverId'
      }, {
        title: '外网IP',
        dataIndex: 'serverHost'
      }, {
        title: '内网IP',
        dataIndex: 'serverLocal'
      }, {
        title: '服务器端口',
        dataIndex: 'serverPort'
      }, {
        title: 'WEB端口',
        dataIndex: 'webPort'
      }, {
        title: '数据库主机',
        dataIndex: 'dbHost'
      }, {
        title: '数据库端口',
        dataIndex: 'dbPort'
      }, {
        title: '合服后主服ID',
        dataIndex: 'masterServerId'
      }, {
        title: '合服次数',
        dataIndex: 'combineNum'
      }, {
        title: '主服合服次数',
        dataIndex: 'masterCombineNum'
      }, {
        title: '是否开启',
        dataIndex: 'isOpen'
      }, {
        title: '媒体服务器ID',
        dataIndex: 'audioServerId'
      }, {
        title: '节点类型',
        dataIndex: 'cellType',
        render: (text, record) => {
          return `${this.props.initials.map.cellTypes[record.cellType]}(${record.cellType})`
        }
      }, {
        title: '联合服务器ID',
        dataIndex: 'combineServerId'
      }, {
        title: '跨服ID',
        dataIndex: 'crossServerId'
      }, {
        title: '状态',
        dataIndex: 'status',
        render: (text, record) => {
          return record.status ? `${this.props.initials.map.cellStatus[record.status]}(${record.status})` : ''
        }
      }, {
        title: '操作',
        dataIndex: 'action',
        render: (text, record) => {
          let menuOptions = []
          _.forEach(record.curd, (value, key, collection) => {
            switch (key) {
              case '20202':
                menuOptions.push({key: 'UPDATE', name: '编辑'})
                break
              default:

            }
          })
          return (
            <DropOption
              onMenuClick={e => this.handleMenuClick(record, e)}
              menuOptions={menuOptions}
              dropdownProps={{
                trigger: ['hover']
              }}
            />
          )
        }
      }
    ]
  }

  componentWillReceiveProps(nextProps) {
    const cell = nextProps.options.cell
    let dataSource = []
    cell.list.map(function(elem, index) {
      dataSource.push({key: index, ...elem})
    })
    this.setState({
      dataSource: [...dataSource],
      count: dataSource.length
    })
  }

  onEditItem = (record) => {
    const dataSource = this.state.data.dataSource
    const flag = dataSource.some(val => val.key === record.key)
    if (flag) {
      this.setState({
        currentItem: record,
        visible: true,
        editing: record
      })
    }
  }

  onUpdate = (fieldsValue) => {
    const dataSource = [...this.state.dataSource]
    _.map(dataSource, (val, index) => {
      if (val.key === this.state.editing.key) {
        val = Object.assign(val, fieldsValue)
      }
    })
    this.setState({
      visible: false,
      dataSource: [...dataSource]
    })
    this.props.onUpdate(fieldsValue)
  }

  handleCancel = (e) => {
    this.setState({
      visible: false
    })
  }

  onModalLoad = () => {
    return this.state
  }

  handleMenuClick = (record, e) => {
    if (e.key === 'UPDATE') {
      this.onEditItem(record)
      this.props.onSearch({
        productId: record.productId,
        handle: 'UPDATE'
      })
    }
  }

  render() {
    let pagination = {
      showSizeChanger: true,
      defaultPageSize: 50,
      pageSizeOptions: ['20', '50', '100', '200', '500'],
      total: this.state.count
    }

    const {curd} = this.props
    let list = _.forEach(this.state.dataSource, function(value, index, collection) {
      value.curd = curd
    })
    return (
      <div>
        <Table bordered dataSource={list} columns={this.columns} rowKey='serverId' pagination={pagination} />
        <Modal
          width={1000}
          key='modify-cell'
          title='编辑节点'
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
        >
          <ModalContainer
            options={this.props.options}
            initials={this.props.initials}
            onModalLoad={this.onModalLoad}
            onUpdate={this.onUpdate}
            onSubmitting={this.handleCancel}
          />
        </Modal>
      </div>
    )
  }
}

List.propTypes = {
  curd: PropTypes.object.isRequired,
  options: PropTypes.object,
  initials: PropTypes.object,
  onSearch: PropTypes.func,
  onUpdate: PropTypes.func,
}
