import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Form, Input, Button, TreeSelect } from 'antd'

import {
  clearRoleMenus
} from '../../permissions/modules/Module'

const FormItem = Form.Item

const mapDispatchToProps = {
  clearRoleMenus
}

const mapStateToProps = (state) => ({
  permission: state.permission,
  login: state.islogin
})

@connect(mapStateToProps, mapDispatchToProps)
class MenuModal extends Component {
  state = {
    select: true,
    currentItem: {},
    modalType: ''
  }

  componentWillMount() {
    const { currentItem, modalType } = this.props.onModalLoad()
    this.props.onRender({ renderState: false })

    this.setState({
      currentItem: currentItem,
      modalType: modalType
    })
  }

  componentWillUnmount() {
    this.props.onRender({ renderState: true })
    this.props.clearRoleMenus()
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      const { permission } = this.props
      if (!err) {
        let data = {}
        data.id = values.id
        data.paramList = []
        if (values.menuList.length) {
          data.paramList = this._treeReduce(values.menuList.map(o => Number(o)), permission.menus)
        }

        let posts = {
          form: data,
          path: { roleId: data.id },
          handle: this.state.modalType
        }

        if (this.state.modalType === 'menu') {
          this.props.onUpdate(posts)
        }
        this.props.onSubmitting()
      }
    })
  }

  _menuMap = (options) => {
    return options.map(opt => `${opt}`)
  }

  _menuReduce = (options) => {
    return options.map(opt => {
      return {label: `${opt.name}`, value: `${opt.id}`}
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

  _treeRemove = (valus, options) => {
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

  render() {
    const { form: { getFieldDecorator }, options, permission } = this.props

    const detail = this.state.currentItem
    const check = this.state.modalType === 'menu'
    let menus = []
    if (permission.roleMenus.length) {
      menus = this._treeRemove(permission.roleMenus.filter(o => o).map(o => o.id), permission.menus).map(o => `${o}`)
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

    const tailFormItemLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 14, offset: 6 }
      }
    }

    return (
      <Form onSubmit={this.handleSubmit}>
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

        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit'>提交</Button>
        </FormItem>
      </Form>
    )
  }
}

MenuModal.propTypes = {
  form: PropTypes.object,
  permission: PropTypes.object,
  options: PropTypes.object,
  onUpdate: PropTypes.func,
  onRender: PropTypes.func,
  clearRoleMenus: PropTypes.func,
  onModalLoad: PropTypes.func,
  onSubmitting: PropTypes.func
}

const Modal = Form.create()(MenuModal)

export default Modal
