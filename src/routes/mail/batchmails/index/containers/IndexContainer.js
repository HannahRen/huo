import { connect } from 'react-redux'

import { fetchBatchmail, clearBatchmailFetch, addBatchmail, clearBatchmailAdd, updateBatchmail, fetchBatchmailPlayer, clearBatchmailPlayer } from '../modules/Module'
import Index from '../components/Index'
import { fetchProductsMap } from '../../../../../../modules/products'
import { fetchGoodsMap } from '../../../../../../modules/goods'


const mapDispatchtoProps = {
  fetchProductsMap,
  fetchGoodsMap,

  fetchBatchmail,
  addBatchmail,
  clearBatchmailFetch,
  clearBatchmailAdd,
  updateBatchmail,
  fetchBatchmailPlayer,
  clearBatchmailPlayer

}

const mapStateToProps = (state) => ({
  login: state.islogin,
  batchmail: state.batchmail,
  products: state.products,
  goods: state.goods
})

export default connect(mapStateToProps, mapDispatchtoProps)(Index)
