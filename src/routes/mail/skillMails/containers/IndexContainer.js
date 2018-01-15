import { connect } from 'react-redux'
import { sendSkill, fetchSkill } from './../modules/Module'
import { fetchProductsMap } from '../../../../../modules/products'
import { itemsActionCreator } from '../../../../../modules/items'
import Index from './../components/Index'

const mapDispatchtoProps = {
  sendSkill,
  fetchSkill,
  itemsActionCreator,
  fetchProductsMap
}

const mapStateToProps = (state) => ({
  login: state.islogin,
  products: state.products,
  item: state.items,
  skillMail: state.skillMail
})

export default connect(mapStateToProps, mapDispatchtoProps)(Index)
