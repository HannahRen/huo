import React, { PureComponent } from 'react'
import { Card } from 'antd'

export default class Index extends PureComponent {

  render() {
    return (
      <Card>
        <p>霍去病游戏管理台</p>
        <span>{document.body.clientHeight}</span><br />
        <span>{document.documentElement.clientHeight}</span>
      </Card>
    )
  }
}
