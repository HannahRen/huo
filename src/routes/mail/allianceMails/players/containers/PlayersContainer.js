import { connect } from 'react-redux'
import { fetchChannels } from '../../../../../../modules/channels'
import { fetchProductsMap } from '../../../../../../modules/products'
import { fetchGoodsMap } from '../../../../../../modules/goods'
import { checkAllianceMail, updateAllianceEmailPlayer } from '../modules/PlayersModule'
import Players from '../components/Players'

const mapDispatchtoProps = {
  fetchChannels,
  fetchProductsMap,
  fetchGoodsMap,
  checkAllianceMail,
  updateAllianceEmailPlayer
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  channel: state.channels.map,
  products: state.products,
  goods: state.goods,
  allianceMailPlayer: state.allianceMailPlayer
})

export default connect(mapStateToProps, mapDispatchtoProps)(Players)
