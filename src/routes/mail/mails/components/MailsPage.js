import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Card } from 'antd'
import WrappedAdvancedSearchForm from './SearchFrome'
import TableForMails from './Table'

export default class Mails extends Component {

  static propTypes = {
    mail: PropTypes.object.isRequired,
    fetchMail: PropTypes.func.isRequired,
    login: PropTypes.object.isRequired,
    mailsSearchActionCreator: PropTypes.func.isRequired,
    products: PropTypes.object.isRequired,
    fetchProductsMap: PropTypes.func.isRequired,
    keepMails: PropTypes.func.isRequired
  }

  state = {
    fields: {
      products: this.props.mail.keeping,
      nickname: {
        value: ''
      },
      'range-picker': {},
      'range-time-picker': {}
    }
  }

  // 双向数据绑定
  handleFormChange = (changedFields) => {
    this.setState({
      fields: { ...this.state.fields, ...changedFields }
    })
  }

  // 搜索邮件
  handleFormSearch = (data) => {
    // console.log('Search values of form: ', data)
    this.props.mailsSearchActionCreator(data)
  }

  render() {
    const { products: {options}, mail: {keeping} } = this.props

    return (
      <div>
        <Card style={{marginBottom: 6}}>
          <WrappedAdvancedSearchForm
            initialFiler={keeping}
            options={options}
            {...this.state.fields}
            onChange={this.handleFormChange}
            onMails={this.handleFormSearch}
            login={this.props.login}
          />
          <TableForMails fetchMail={this.props.fetchMail} data={this.props.mail.list} />
        </Card>
      </div>
    )
  }

  componentWillMount() {
    this.props.fetchProductsMap()
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    this.props.keepMails(this.state.fields.products)
  }
}
