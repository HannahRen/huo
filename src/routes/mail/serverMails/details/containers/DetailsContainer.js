import { connect } from 'react-redux'
import { fetchChannels } from '../../../../../../modules/channels'
import { fetchProductsMap } from '../../../../../../modules/products'
import { fetchGoodsMap } from '../../../../../../modules/goods'
import { checkServerMail, sendServerMail, clearSend } from '../modules/DetailsModule'
import Details from '../components/Details'

const mapDispatchtoProps = {
  fetchChannels,
  fetchProductsMap,
  fetchGoodsMap,
  checkServerMail,
  clearSend,
  sendServerMail
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  channel: state.channels.map,
  products: state.products,
  goods: state.goods,
  serverMailDetail: state.serverMailDetail
})

export default connect(mapStateToProps, mapDispatchtoProps)(Details)
