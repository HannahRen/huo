export default (store) => ({
  path: 'allianceMail',
  breadcrumbName: '联盟邮件',
  getChildRoutes (location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./index/index').default(store),
        require('./details').default(store)
      ])
    })
  }
})
