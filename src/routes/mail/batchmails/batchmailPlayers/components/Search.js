import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Card } from 'antd'
import { Link } from 'react-router'
import _ from 'lodash'

export default class Search extends Component {

  static propTypes = {
    login: PropTypes.object.isRequired,
    batchmailPlayer: PropTypes.object.isRequired,
    location: PropTypes.object,
    fetchBatchmailPlayer: PropTypes.func.isRequired,
    sendBatchmailPlayers: PropTypes.func.isRequired,
    sendSingleBatchmailPlayer: PropTypes.func.isRequired,
    fetching: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.columns = [{
      title: '邮件id',
      dataIndex: 'mailId',
      key: 'mailId'
    }, {
      title: '产品id',
      dataIndex: 'productId',
      key: 'productId'
    }, {
      title: '服务器id',
      dataIndex: 'serverId',
      key: 'serverId'
    }, {
      title: '玩家名称',
      dataIndex: 'playerName',
      key: 'playerName'
    }, {
      title: '玩家id',
      dataIndex: 'playerId',
      key: 'playerId'
    }, {
      title: '用户id',
      dataIndex: 'uid',
      key: 'uid'
    }, {
      title: '奖励id',
      dataIndex: 'rewards',
      key: 'rewards'
    }, {
      title: '操作时间',
      dataIndex: 'operateTime',
      key: 'operateTime'
    }, {
      title: '发送状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        return (
          <div style={{color: `${record.status === 0 ? 'red' : 'black'}`}}>
            {record.status === 0 ? '失败' : '成功'}
          </div>
        )
      }
    }, {
      title: '补发操作',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => {
        if (_.has(record.curd, '50207')) {
          return (
            <div>
              <Button
                type='primary'
                disabled={record.status === 1}
                onClick={() => this.onSingleSend(record)}
              >
                补发
              </Button>
            </div>
          )
        } else {
          return (
            <span>无补发权限</span>
          )
        }
      }
    }]
  }

  componentWillMount() {
    this.props.fetchBatchmailPlayer(this.props.location.query.id)
  }


  // 批量发送
  onSend = () => {
    let value = {
      id: this.props.location.query.id,
      list: this.props.batchmailPlayer.players
    }

    this.props.sendBatchmailPlayers(value)
  }

  // 单独发送
  onSingleSend = (record) => {

    const value = {
      id: record.mailId,
      list: record
    }
    this.props.sendSingleBatchmailPlayer(value)
  }

  render() {
    const {login: {curd}, batchmailPlayer: {players}} = this.props
    let list = _.forEach(players, function(value, index, collection) {
      value.curd = curd
    })
    return (
      <Card>
        <Table
          bordered
          rowKey='index'
          dataSource={list}
          columns={this.columns}
          pagination={{
            showSizeChanger: true,
            defaultPageSize: 50,
            pageSizeOptions: ['20', '50', '100', '200', '500']
          }}
          loading={this.props.fetching}
          title={() => { return this.props.location.query.title }}
        />
        {
          _.has(curd, '50206')
          ?
            <Button
              type='primary'
              onClick={this.onSend}
              style={{marginRight: 30}}
            >
              全部发送
            </Button>
          :
            ''
        }

        <Button type='default'>
          <Link to={{ pathname: '/sango2/mail/batchmail/index' }}>
            返回
          </Link>
        </Button>
      </Card>
    )
  }
}
