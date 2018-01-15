import { connect } from 'react-redux'
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserPass,
  updateUserRole,
  fetchRoles,
  keepPermission
} from '../../permissions/modules/Module'
import Page from '../components/Page'

const mapDispatchToProps = {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserPass,
  updateUserRole,
  fetchRoles,
  keepPermission
}

const mapStateToProps = (state) => ({
  permission: state.permission,
  login: state.islogin
})

export default connect(mapStateToProps, mapDispatchToProps)(Page)
