export default (store) => ({
  path: 'own-mail',
  breadcrumbName: '个人邮件',
  getChildRoutes (location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./index/index').default(store),
        require('./details').default(store)
      ])
    })
  }
})
