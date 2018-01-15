import { connect } from 'react-redux'

import { fetchBatchmailPlayer, clearBatchmailPlayer, sendBatchmailPlayers, sendSingleBatchmailPlayer } from '../modules/PlayerModule'
import Search from '../components/Search'
import { fetchProductsMap } from '../../../../../../modules/products'
import { fetchGoodsMap } from '../../../../../../modules/goods'


const mapDispatchtoProps = {
  fetchProductsMap,
  fetchGoodsMap,
  fetchBatchmailPlayer,
  clearBatchmailPlayer,
  sendBatchmailPlayers,
  sendSingleBatchmailPlayer

}

const mapStateToProps = (state) => ({
  login: state.islogin,
  batchmailPlayer: state.batchmailPlayer,
  products: state.products,
  goods: state.goods
})

export default connect(mapStateToProps, mapDispatchtoProps)(Search)
