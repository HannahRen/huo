import { connect } from 'react-redux'

import { clearUpdate, updateServerEmail } from './../modules/Module'

import Update from './../components/Update'

const mapDispatchtoProps = {
  clearUpdate,
  updateServerEmail
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  serverMail: state.serverMail
})

export default connect(mapStateToProps, mapDispatchtoProps)(Update)
