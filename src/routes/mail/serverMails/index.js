export default (store) => ({
  path: 'serverMail',
  breadcrumbName: '全服邮件',
  getChildRoutes (location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./index/index').default(store),
        require('./details').default(store)
      ])
    })
  }
})
