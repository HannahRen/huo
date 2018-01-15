import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Cascader, Button } from 'antd'
import _ from 'lodash'

const FormItem = Form.Item

class SkillForm extends Component {
  static propTypes = {
    login: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    onLoading: PropTypes.func.isRequired,
    itemsActionCreator: PropTypes.func.isRequired,
    sendSkill: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired
  }

  state = {

  }

  _itemReduce = (options) => {
    return _.reduce(options, (result, option, key) => {
      result.push({ value: _.toNumber(key), label: `${option}(${key})` })
      return result
    }, [])
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { validateFieldsAndScroll } = this.props.form
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.sendSkill(values)
        this.props.onLoading()
      }
    })
  }

  componentDidMount() {
    // console.log('componentDidMount')
    // 下拉道具初始化
    const options = this.props.login.admin.data.options
    this.props.itemsActionCreator(options[0].value, 4)
  }

  render() {
    const { form: { getFieldDecorator }, login: { admin: { data: {options} } } } = this.props

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

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    }

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 14,
          offset: 6
        }
      }
    }

    let skillPt = this._itemReduce(this.props.item.data)

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...itemsLayout}
          label='产品/服务'
        >
          {getFieldDecorator('products', {
            initialValue: [options[0].value, options[0].children[0].value],
            rules: [{ required: true, message: '必填!' }]
          })(
            <Cascader
              showSearch
              placeholder='请选择产品与服务器(必选)'
              options={options}
              expandTrigger='hover'
            />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='玩家昵称'
        >
          {getFieldDecorator('nickname', {
            rules: [{ required: true, message: '必填!', whitespace: true }]
          })(
            <Input placeholder='玩家昵称' />
          )}
        </FormItem>

        <FormItem
          {...itemsLayout}
          label='技能下拉'
        >
          {getFieldDecorator('skillId', {
            rules: [{
              required: true,
              message: '必须选择道具！若不发送，请删除此条目'
            }]
          })(
            <Cascader
              // style={ width:'50%' }
              placeholder='请选择技能'
              showSearch
              options={skillPt}
            />
          )}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit' >提交表单</Button>
        </FormItem>
      </Form>
    )
  }
}

const DialogSkill = Form.create()(SkillForm)

export default DialogSkill
