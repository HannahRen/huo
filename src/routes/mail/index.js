// import mails from './mails'
// import batchmail from './batchmails'
import ownMail from './ownMails'
// import serverMail from './serverMails'
// import allianceMail from './allianceMails'
// import skillMail from './skillMails'

export default (store) => ({
  path: 'mail',
  breadcrumbName: '邮件',
  childRoutes: [
    ownMail(store),
    // mails(store),
    // batchmail(store),
    // serverMail(store),
    // allianceMail(store),
    // skillMail(store)
  ]
})
