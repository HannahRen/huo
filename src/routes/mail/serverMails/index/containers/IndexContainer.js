import { connect } from 'react-redux'

import { fetchServerMail, clearPass, passServerEmail, sendServerMail, addServerMail } from './../modules/Module'
import { fetchProductsMap } from '../../../../../../modules/products'
import { fetchGoodsMap } from '../../../../../../modules/goods'
import { fetchChannels } from '../../../../../../modules/channels'
import Index from './../components/Index'

const mapDispatchtoProps = {
  fetchChannels,
  fetchProductsMap,
  fetchGoodsMap,
  fetchServerMail,
  clearPass,
  passServerEmail,
  sendServerMail,
  addServerMail
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  serverMail: state.serverMail,
  products: state.products,
  goods: state.goods,
  channel: state.channels.map
})

export default connect(mapStateToProps, mapDispatchtoProps)(Index)
