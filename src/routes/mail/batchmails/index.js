export default (store) => ({
  path: 'batchmail',
  breadcrumbName: '批量上传发邮件',
  getChildRoutes (location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./index/index').default(store),
        require('./batchmailPlayers').default(store)
      ])
    })
  }
})
