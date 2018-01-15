import { connect } from 'react-redux'
import { fetchChannels } from '../../../../../../modules/channels'
import { fetchProductsMap } from '../../../../../../modules/products'
import { fetchGoodsMap } from '../../../../../../modules/goods'
import { checkAllianceMail, updateAllianceEmailPlayer, clearSend, sendAllianceMail } from '../modules/DetailsModule'
import Details from '../components/Details'

const mapDispatchtoProps = {
  fetchChannels,
  fetchProductsMap,
  fetchGoodsMap,
  checkAllianceMail,
  updateAllianceEmailPlayer,
  clearSend,
  sendAllianceMail
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  channel: state.channels.map,
  products: state.products,
  goods: state.goods,
  allianceMailDetail: state.allianceMailDetail
})

export default connect(mapStateToProps, mapDispatchtoProps)(Details)
