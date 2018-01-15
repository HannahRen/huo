import React from 'react'
import PropTypes from 'prop-types'
import { Cascader } from 'antd'

let CentraCascaderProductId = 1

function changeCentraCascaderProductId(productId) {
  CentraCascaderProductId = productId
}

function getCentraCascaderProductId() {
  return CentraCascaderProductId
}

const CentraProductCascader = ({getFieldDecorator, options}) => (
  <div style={{ display: 'inline-block', width: '96%' }}>
    {getFieldDecorator('products', {
      initialValue: [`${CentraCascaderProductId}`],
      rules: [{ type: 'array', required: true, message: '请选择产品!' }]
    })(
      <Cascader
        placeholder='请选择产品(必选)'
        showSearch
        options={options}
      />
    )}
  </div>
)

CentraProductCascader.propTypes = {
  getFieldDecorator: PropTypes.func,
  options: PropTypes.array
}

export {
  CentraProductCascader,
  changeCentraCascaderProductId,
  getCentraCascaderProductId
}
