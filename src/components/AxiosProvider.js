import axios from 'axios'
import React from 'react'
import PropTypes from 'prop-types'

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
  axios: PropTypes.func,
}

AxiosProvider.defaultProps = {
}

AxiosProvider.propTypes = {
  instance: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired,
}

export default AxiosProvider

export const withAxios = (WrappedComponent) => {
  const AxiosExtracter = (props, context) => {
    return <WrappedComponent axios={context.axios || axios} {...props}/>
  }

  AxiosExtracter.contextTypes = {
    axios: PropTypes.func,
  }

  return AxiosExtracter
}
