import { connect } from 'react-redux'
import { itemsActionCreator } from '../../../../../modules/items'
import { sendSkill } from '../modules/Mails'

import DialogSkill from '../components/DialogSkill'

const mapDispatchtoProps = {
  itemsActionCreator,
  sendSkill
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  item: state.items,
  channel: state.channels.map
})

export default connect(mapStateToProps, mapDispatchtoProps)(DialogSkill)
