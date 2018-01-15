import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import _ from 'lodash'

import GroupModal from './Modal'
import DropOption from '../../../../base/components/DropOption'

export default class List extends Component {
  state = {
    dataSource: [],
    count: 0,
    editing: {},
    currentItem: {},
    modalType: 'update',
    visible: false,
    reloadVisible: false
  }
  constructor(props) {
    super(props)
    this.columns = [
      {
        title: '产品 ID',
        dataIndex: 'productId',
        key: 'productId'
      }, {
        title: ' 描述',
        dataIndex: 'description',
        key: 'description'
      }, {
        title: '支付密钥',
        dataIndex: 'paymentKey',
        key: 'paymentKey'
      }, {
        title: '充值链接',
        dataIndex: 'paymentUrl',
        key: 'paymentUrl'
      }, {
        title: '操作',
        dataIndex: 'action',
        render: (text, record) => {
          let menuOptions = []
          _.forEach(record.curd, (value, key, collection) => {
            switch (key) {
              case '20102':
                menuOptions.push({key: 'UPDATE', name: '编辑'})
                break
              case '20104':
                menuOptions.push({key: 'RELOAD', name: '合服重加载'})
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
    const product = nextProps.data
    let dataSource = []
    product.list.map(function(elem, index) {
      dataSource.push({key: index, ...elem})
    })
    this.setState({
      dataSource: [...dataSource],
      count: dataSource.length
    })
  }

  onEditItem = (record) => {
    _.map(this.state.dataSource, (val, index) => {
      if (val.key === record.key) {
        this.setState({
          currentItem: record,
          visible: true,
          editing: val
        })
      }
    })
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
    } else if (e.key === 'RELOAD') {
      this.reloadModalShow(record)
    }
  }

  reloadModalShow = (reloadItem) => {
    this.setState({
      reloadVisible: true,
      reloadItem: reloadItem
    })
  }

  reloadOnOk = () => {
    const reloadItem = { productId: this.state.reloadItem.productId }
    this.setState({
      reloadVisible: false
    })
    this.props.onReloadItem(reloadItem)
  }

  reloadOnCancel = () => {
    this.setState({
      reloadVisible: false,
      reloadItem: {}
    })
  }

  render() {
    const {curd} = this.props
    let pagination = {
      showSizeChanger: true,
      defaultPageSize: 50,
      pageSizeOptions: ['20', '50', '100', '200', '500'],
      total: this.state.count
    }
    let list = _.forEach(this.state.dataSource, function(value, index, collection) {
      value.curd = curd
    })
    return (
      <div>
        <Table bordered dataSource={list} columns={this.columns} rowKey='productId' pagination={pagination} />
        <Modal
          width={1000}
          key={Math.random()}
          title='编辑产品'
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
        >
          <GroupModal
            data={this.props.data}
            onModalLoad={this.onModalLoad}
            onUpdate={this.onUpdate}
            onSubmitting={this.handleCancel}
          />
        </Modal>
        <Modal
          title='合服后重新加载'
          visible={this.state.reloadVisible}
          onOk={this.reloadOnOk}
          onCancel={this.reloadOnCancel}
          okText='确认'
          cancelText='取消'
        >
          <p>确定重新加载吗?</p>
        </Modal>
      </div>
    )
  }

}

List.propTypes = {
  onUpdate: PropTypes.func,
  curd: PropTypes.object.isRequired,
  data: PropTypes.object,
  onReloadItem: PropTypes.func
}
