import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Row, Col, Button, Icon, Form, Input, TreeSelect } from 'antd'
import _ from 'lodash'

import RoleModal from './Modal.jsx'

const FormItem = Form.Item

const _treeRemove = (valus, options) => {
  options.map(function(option) {
    option.subMenus.map(function(opt) {
      opt.subMenus.map(function(o) {
        if (!valus.includes(o.id) && valus.includes(opt.id)) {
          _.remove(valus, function(v) { return v === opt.id })
        }
      })
      if (!valus.includes(opt.id) && valus.includes(option.id)) {
        _.remove(valus, function(v) { return v === option.id })
      }
    })
  })
  return valus
}

const CollectionScopeForm = Form.create()(
  (props) => {
    const { form: { getFieldDecorator }, options, visible, title, onCancel, onBundle } = props
    const { currentItem, modalType } = props.onModalLoad()

    const detail = currentItem
    const check = modalType === 'menu'
    let menus = []
    if (options.permission.roleMenus.length) {
      menus = _treeRemove(options.permission.roleMenus.filter(o => o).map(o => o.id), options.permission.menus).map(o => `${o}`)
    }

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    }

    return (
      <Modal
        width={800}
        key='role_menu'
        visible={visible}
        title={title}
        okText='提交'
        onCancel={onCancel}
        onOk={onBundle}
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label='id'
          >
            {getFieldDecorator('id', {
              initialValue: detail.id || '',
              rules: [{ required: true, message: '请填写 ID!' }]
            })(
              <Input placeholder='请填写 ID' disabled={check} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='名称'
          >
            {getFieldDecorator('name', {
              initialValue: detail.name || '',
              rules: [{ required: true, message: '请填写名称!' }]
            })(
              <Input placeholder='请填写名称' disabled={check} />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='权限'
            key='menuList'
          >
            {getFieldDecorator('menuList', {
              initialValue: menus,
              rules: [{ required: false, message: '请选择权限!' }]
            })(
              <TreeSelect
                treeData={[{
                  label: '全选',
                  value: 'all',
                  key: 'all',
                  children: options.menu.list
                }]}
                showSearch
                allowClear
                treeDefaultExpandAll={false}
                multiple
                treeCheckable
                treeNodeFilterProp='label'
                placeholder='请选择权限'
                showCheckedStrategy={TreeSelect.SHOW_ALL}
                searchPlaceholder='请搜索权限'
                className='hoolai-gm-user-tree-select'
                dropdownStyle={{
                  height: '20rem',
                  overflowY: 'auto'
                }}
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
)

export default class List extends Component {
  state = {
    data: {
      dataSource: [],
      count: 0
    },
    modal: {
      editing: {},
      currentItem: {},
      modalType: '',
      modalTitle: '',
      visible: false
    }
  }

  constructor(props) {
    super(props)
    this.columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id'
      }, {
        title: '名称',
        dataIndex: 'name',
        key: 'name'
      }, {
        title: '描述',
        dataIndex: 'description',
        key: 'description'
      }, {
        title: '限制产品',
        dataIndex: 'limitProduct',
        key: 'limitProduct'
      }, {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: 400,
        render: (text, record) => {
          const { options } = this.props
          return (
            <Row gutter={32}>
              {
                options.authorize.includes(10202) &&
                <Col span={5}>
                  <Button onClick={() => this.handleClick({...record}, {handle: 'MOD'})}>修改角色</Button>
                </Col>
              }
              {
                options.authorize.includes(10203) &&
                <Col span={5}>
                  <Button onClick={() => this.handleClick({...record}, {handle: 'DEL'})}>删除角色</Button>
                </Col>
              }
              {
                options.authorize.includes(10204) &&
                <Col span={5}>
                  <Button onClick={() => this.handleClick({...record}, {handle: 'MENU'})}>分配权限</Button>
                </Col>
              }
            </Row>
          )
        }
      }
    ]
  }

  componentWillReceiveProps(nextProps) {
    const permission = nextProps.options.permission
    let dataSource = []
    permission.roles.map(function(elem, index) {
      dataSource.push({key: index, ...elem})
    })
    this.setState({
      data: {
        dataSource: [...dataSource],
        count: dataSource.length
      }
    })
  }

  handleClick = (option, action) => {
    switch (action.handle) {
      case 'MENU':
        this.onMenuAction(option)
        break
      case 'MOD':
        this.onModAction(option)
        break
      case 'DEL':
        this.onDelAction(option)
        break
      default:
        console.log('Error')
    }
  }

  onMenuAction = (data) => {
    const dataSource = this.state.data.dataSource
    const flag = dataSource.some(val => val.key === data.key)
    if (flag) {
      this.props.onSearch({
        path: { roleId: data.id },
        handle: 'menu'
      })
      this.setState({
        modal: {
          currentItem: data,
          modalType: 'menu',
          modalTitle: '分配权限',
          visible: true,
          editing: {}
        }
      })
    }
  }

  onModAction = (data) => {
    const dataSource = this.state.data.dataSource
    const flag = dataSource.some(val => val.key === data.key)
    if (flag) {
      this.setState({
        modal: {
          currentItem: data,
          modalType: 'update',
          modalTitle: '修改角色',
          visible: true,
          editing: {}
        }
      })
    }
  }

  onDelAction = (data) => {
    this.setState({
      modal: {
        currentItem: data,
        modalType: 'delete',
        modalTitle: '删除提示',
        visible: true,
        editing: {}
      }
    })
  }

  handleCancel = (e) => {
    this.setState({
      modal: {
        currentItem: {},
        modalType: '',
        modalTitle: '',
        visible: false,
        editing: {}
      }
    })
  }

  onOK = () => {
    const deleteItem = this.state.modal.currentItem
    const dataSource = [...this.state.data.dataSource]
    dataSource.splice(_.findIndex(dataSource, function(o) { return o.key === deleteItem.key }), 1)
    this.setState({
      ...this.state,
      data: {
        dataSource: [...dataSource],
        count: dataSource.length
      },
      modal: {
        currentItem: {},
        modalType: '',
        modalTitle: '',
        visible: false,
        editing: {}
      }
    })
    this.props.onDelete({
      path: {
        roleId: deleteItem.id
      }
    })
  }

  onModalLoad = () => {
    return this.state.modal
  }

  handleBundle = () => {
    const form = this.form
    form.validateFieldsAndScroll((err, values) => {
      const { permission } = this.props.options
      if (err) {
        return
      }
      let data = {}
      data.id = values.id
      data.paramList = []
      if (values.menuList.length) {
        data.paramList = this._treeReduce(values.menuList.map(o => Number(o)), permission.menus)
      }

      let posts = {
        form: data,
        path: { roleId: data.id },
        handle: 'menu'
      }

      this.props.onUpdate(posts)

      form.resetFields()
      this.setState({
        modal: {
          currentItem: {},
          modalType: '',
          modalTitle: '',
          visible: false,
          editing: {}
        }
      })
    })
  }

  _treeReduce = (valus, options) => {
    options.map(function(option) {
      option.subMenus.map(function(opt) {
        opt.subMenus.map(function(o) {
          if (valus.includes(o.id) && !valus.includes(opt.id)) {
            valus.push(opt.id)
            return
          }
        })
        if (valus.includes(opt.id) && !valus.includes(option.id)) {
          valus.push(option.id)
          return
        }
      })
    })
    return valus.sort((m, n) => m - n)
  }

  saveFormRef = (form) => {
    this.form = form
  }

  render() {
    let pagination = {
      showSizeChanger: true,
      defaultPageSize: 50,
      pageSizeOptions: ['20', '50', '100', '200', '500'],
      total: this.state.data.count
    }
    const modalType = this.state.modal.modalType
    return (
      <div>
        <Table
          dataSource={this.state.data.dataSource}
          columns={this.columns}
          rowKey='id'
          pagination={pagination}
        />

        <Modal
          width={800}
          key='update_role'
          title={modalType === 'update' && this.state.modal.modalTitle}
          visible={modalType === 'update' && this.state.modal.visible}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
        >
          <RoleModal
            options={this.props.options}
            initials={this.props.initials}
            onUpdate={this.props.onUpdate}
            onModalLoad={this.onModalLoad}
            onSubmitting={this.handleCancel}
          />
        </Modal>

        <Modal
          title={modalType === 'delete' && this.state.modal.modalTitle}
          visible={modalType === 'delete' && this.state.modal.visible}
          onOk={this.onOK}
          onCancel={this.handleCancel}
          okText='确认'
          cancelText='取消'
        >
          <p><Icon type='question-circle-o' style={{ fontSize: 24, color: '#f00' }} /> 确定删除此条记录吗? ...</p>
        </Modal>

        <CollectionScopeForm
          ref={this.saveFormRef}
          visible={modalType === 'menu' && this.state.modal.visible}
          title={modalType === 'menu' && this.state.modal.modalTitle}
          onCancel={this.handleCancel}
          onBundle={this.handleBundle}
          onCreate={this.handels}
          onModalLoad={this.onModalLoad}
          options={this.props.options}
        />
      </div>
    )
  }
}

List.propTypes = {
  options: PropTypes.object,
  initials: PropTypes.object,
  onSearch: PropTypes.func,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func
}

List.contextTypes = {
  router: PropTypes.object
}
