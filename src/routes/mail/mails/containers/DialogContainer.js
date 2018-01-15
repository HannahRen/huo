import { connect } from 'react-redux'
import { itemsActionCreator } from '../../../../../modules/items'
import { fetchChannels } from '../../../../../modules/channels'
import { addMail } from '../modules/Mails'

import DialogAdd from '../components/DialogAdd'

const mapDispatchtoProps = {
  itemsActionCreator,
  fetchChannels,
  addMail
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  item: state.items,
  channel: state.channels.map
})

export default connect(mapStateToProps, mapDispatchtoProps)(DialogAdd)
