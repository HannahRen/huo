import { connect } from 'react-redux'
import { mailsSearchActionCreator, fetchMail, keepMails } from './../modules/Mails'
import { fetchProductsMap } from '../../../../../modules/products'
import MailsPage from './../components/MailsPage'

const mapDispatchtoProps = {
  mailsSearchActionCreator,
  fetchMail,
  fetchProductsMap,
  keepMails
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  products: state.products,
  mail: state.mails
})

export default connect(mapStateToProps, mapDispatchtoProps)(MailsPage)
