import { connect } from 'react-redux'

import {
  fetchPermissionmap,
  fetchUsermap,
  fetchAdminLog,
  clearAdminLog
} from '../modules/Module'
import Index from '../components/Index'


const mapDispatchToProps = {
  fetchPermissionmap,
  fetchUsermap,
  fetchAdminLog,
  clearAdminLog
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  adminLog: state.adminLog
})

export default connect(mapStateToProps, mapDispatchToProps)(Index)
