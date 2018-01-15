import { connect } from 'react-redux'

import { fetchAllianceMail, clearPass, passAllianceEmail, sendAllianceMail, addAllianceMail } from './../modules/Module'
import { fetchProductsMap } from '../../../../../../modules/products'
import { fetchGoodsMap } from '../../../../../../modules/goods'
import { fetchChannels } from '../../../../../../modules/channels'
import Index from './../components/Index'

const mapDispatchtoProps = {
  fetchChannels,
  fetchProductsMap,
  fetchGoodsMap,
  fetchAllianceMail,
  clearPass,
  passAllianceEmail,
  sendAllianceMail,
  addAllianceMail
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  allianceMail: state.allianceMail,
  products: state.products,
  goods: state.goods,
  channel: state.channels.map
})

export default connect(mapStateToProps, mapDispatchtoProps)(Index)
