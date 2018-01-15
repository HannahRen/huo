import { connect } from 'react-redux'

import { clearUpdate, updateAllianceEmail } from './../modules/Module'

import Update from './../components/Update'

const mapDispatchtoProps = {
  clearUpdate,
  updateAllianceEmail
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  allianceMail: state.allianceMail
})

export default connect(mapStateToProps, mapDispatchtoProps)(Update)
