import React from 'react'
import { Link } from 'react-router'
import PropTypes from 'prop-types'
import PageHeader from 'ant-design-pro/lib/PageHeader'
import styles from './PageHeaderLayout.less'

const PageHeaderLayout = ({ children, wrapperClassName, top, ...restProps }) => (
  <div className={wrapperClassName}>
    {top}
    <PageHeader {...restProps} linkElement={Link} />
    {children ? <div className={styles.content}>{children}</div> : null}
  </div>
)

PageHeaderLayout.propTypes = {
  children: PropTypes.object,
  wrapperClassName: PropTypes.object,
  top: PropTypes.object
}

export default PageHeaderLayout
