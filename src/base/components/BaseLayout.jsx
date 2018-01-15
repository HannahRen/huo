import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { browserHistory, IndexLink, Link } from 'react-router'
import _ from 'lodash'
import fp from 'lodash/fp'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import {
  isLoginActionCreator,
  fetchPurview,
  onceLogin,
  receiveLogin,
  signOut
} from './../modules/Login'
import './BaseLayout.less'
// import logoImage from '../../static/hoolai.png'
import myImage from '../../static/admin.png'

import WrappedHorizontalLoginForm from './Login'

import {
  Layout,
  Menu,
  Breadcrumb,
  Icon,
  Dropdown,
  Modal,
  Row,
  Col,
  BackTop,
  message
} from 'antd'

const { SubMenu } = Menu
const {
  Header,
  Sider,
  Content,
  Footer
} = Layout

const mapDispatchToProps = {
  isLoginActionCreator,
  fetchPurview,
  receiveLogin,
  onceLogin,
  signOut
}

const mapStateToProps = (state) => ({
  login: state.islogin
})

@connect(mapStateToProps, mapDispatchToProps)
export default class BaseLayout extends Component {
  static propTypes = {
    login: PropTypes.object.isRequired,
    isLoginActionCreator: PropTypes.func.isRequired,
    fetchPurview: PropTypes.func.isRequired,
    onceLogin: PropTypes.func.isRequired,
    receiveLogin: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      rander: true,
      collapsed: false,
      openKeys: this.getDefaultSelectedKeys(props)
    }
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  menu = (
    <Menu onClick={key => this.handleSingOut(key)}>
      <Menu.Item key='3'><Icon type='logout' />&nbsp;&nbsp;&nbsp;退出</Menu.Item>
      <Menu.Divider />
      <Menu.Item key='0'><Icon type='setting' />&nbsp;&nbsp;&nbsp;修改密码</Menu.Item>
    </Menu>
  )

  static myData = {}

  handleSingOut = ({ key }) => {
    if (key === '3') {
      browserHistory.push('/')
      this.props.signOut()
      this.showModal()
    }
    if (key === '0') {
      browserHistory.push('/pwdchange')
    }
  }

  itemRender = (route, params, routes, paths) => {
    const last = routes.indexOf(route) === routes.length - 1
    if (last) {
      return <span>{route.breadcrumbName}</span>
    } else {
      return paths.join('/') == '' ? (
        <IndexLink to='/'>主页</IndexLink>
      ) : (
        <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
      )
    }
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }

  showModal = () => {
    this.setState({ visible: true })
  }

  handleSubmit = data => {
    this.props.isLoginActionCreator(data)
  }

  handleOpenChange = (openKeys) => {
    const { purview } = this.props.login
    const lastKey = openKeys[openKeys.length - 1]
    const isMainMenu = fp.some(item => item.route === lastKey)(purview)

    this.setState({
      openKeys: isMainMenu ? [lastKey] : [...openKeys]
    })
  }

  getDefaultSelectedKeys(props) {
    const currentSelectedKeys = [...this.getSelectedKeys(props)]
    currentSelectedKeys.splice(-1, 1)
    if (currentSelectedKeys.length === 0) {
      return ['/']
    }
    return currentSelectedKeys
  }

  getSelectedKeys(props) {
    const { location: { pathname } } = props || this.props
    const keys = pathname.split('/').slice(1)
    if (keys.length === 1 && keys[0] === '') {
      return ['/']
    }
    return keys
  }

  componentDidMount() {
    const { fetchPurview, receiveLogin } = this.props
    const hoolai = sessionStorage.getItem('hoolai')
    // 如果sessionStorage有值，就直接登录
    if (hoolai !== null && hoolai !== '') {
      receiveLogin(JSON.parse(hoolai))
      fetchPurview(JSON.parse(hoolai))
    } else {
      this.showModal()
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    const { onceLogin } = this.props

    if (nextProps.login.resolved && nextProps.login.once) {
      message.success('登录成功')
      onceLogin()
      this.handleCancel()
    } else if (nextProps.login.err) {
      message.error(nextProps.login.errMes)
    } else if (!nextProps.login.resolved) {
      this.showModal()
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!nextProps.login.once) {
      return true
    }

    if (nextProps.login.errMes.tips) {
      return false
    }

    if (nextProps.login.fetching) {
      return false
    } else {
      return true
    }
  }

  render() {
    // 此时的routes 不是传进来的了 注意是router index.js里分配来的
    const props = this.props
    let myMenus = []
    const { admin, purview } = this.props.login
    if (_.size(admin) > 0) {
      _.forEach(purview, function(value, key) {
        let subMenus = []
        _.map(value.subMenu, function(v, i) {
          subMenus.push(
            <Menu.Item key={v.route}>
              <Link to={{ pathname: `/${value.route}/${v.route}`, state: { authorize: v.id } }}>
                {v.name}
              </Link>
            </Menu.Item>
          )
        })
        myMenus.push(
          <SubMenu title={<span><Icon type={value.icon} /><span>{value.name}</span></span>} children={subMenus} key={value.route} />
        )
      })
    }

    const menuProps = this.state.collapsed ? {} : { openKeys: this.state.openKeys }

    return (
      <div className='components-layout-demo-top-side-2'>
        <Modal
          width={300}
          key={Math.random()}
          title='登录'
          visible={this.state.visible}
          footer={null}
          onCancel={this.handleCancel}
          closable={false}
          maskClosable={false}
        >
          <WrappedHorizontalLoginForm handleSubmit={this.handleSubmit} />
        </Modal>
        <Layout>
          <Sider
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
            width={256}
          >
            <div className='logo'>
              <Link to='/'>
                <h1>胡莱游戏-霍去病</h1>
              </Link>
            </div>
            <Menu
              mode='inline'
              theme='dark'
              {...menuProps}
              onOpenChange={this.handleOpenChange}
              selectedKeys={this.getSelectedKeys()}
            >
              {myMenus}
            </Menu>
          </Sider>
          <Layout>
            <Header style={{ background: '#fff', padding: 0 }}>
              <Row>
                <Col span={21}>
                  <Icon
                    className='trigger'
                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggle}
                  />
                </Col>
                <Col span={3}>
                  <Dropdown overlay={this.menu}>
                    <div className='menu_img_span_div'>
                      <img alt='' className='my-image' src={myImage} />
                      <span style={{ color: '#314659', position: 'absolute', left: '60px' }}>
                        {_.size(admin) === 0 ? '未登录' : admin.userName}
                      </span>
                    </div>
                  </Dropdown>

                </Col>
              </Row>
            </Header>
            <Content style={{ margin: '0 16px' }}>
              <Breadcrumb
                itemRender={this.itemRender}
                style={{ margin: '16px 0' }}
                routes={props.routes}
                params={props.params}
                separator='/'
              />
              <div style={{ padding: 24, background: '#fff', minHeight: document.documentElement.clientHeight }}>
                {props.children}
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              <div>Copyright <Icon type='copyright' /> 2017 互爱科技出品</div>
            </Footer>
          </Layout>
        </Layout>

        <BackTop />
      </div>
    )
  }
}
