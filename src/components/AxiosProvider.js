import React from 'react'

class AxiosProvider extends React.Component {
  constructor(props) {
    super(props)
  }

  getChildContext() {
    return { axios: this.props.instance }
  }

  render() {
    return this.props.children
  }
}

AxiosProvider.childContextTypes = {
  axios: React.PropTypes.func
}

AxiosProvider.defaultProps = {
}

AxiosProvider.propTypes = {
  instance: React.PropTypes.func.isRequired,
  children: React.PropTypes.any.isRequired
}

export default AxiosProvider
