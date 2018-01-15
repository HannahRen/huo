import { connect } from 'react-redux'

import { addServerMail } from '../modules/Module'
import Add from '../components/Add'


const mapDispatchtoProps = {
  addServerMail
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  serverMail: state.serverMail
})

export default connect(mapStateToProps, mapDispatchtoProps)(Add)
