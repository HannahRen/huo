import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'

// import DetailsContainer from '../containers/DetailsContainer'
import DetailsContainer from './Details'

class Index extends Component {

  constructor(props) {
    super(props)
    this.redirect = this.redirect.bind(this)
  }

  redirect() {
    this.props.router.push('/form')
  }

  render() {
    const { location } = this.props

    return (
      <div>
        <DetailsContainer
          location={location}
        />
      </div>
    )
  }
}

Index.propTypes = {
  location: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired
}

export default withRouter(Index)
