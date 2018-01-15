import cells from './cells'
// import groups from './groups'
import products from './products'
// import servers from './servers'
// import versions from './versions'

export default (store) => ({
  path: 'centra',
  breadcrumbName: '中控',
  childRoutes: [
    cells(store),
    // groups(store),
    products(store),
    // servers(store),
    // versions(store)
  ]
})
