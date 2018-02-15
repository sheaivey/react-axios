import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { debounce } from '../utils'

class Request extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      response: null,
      error: null,
    }
    // create debounce function
    this.setupDebounce(props)
  }

  componentWillReceiveProps(newProps) {
    if (this.props.debounce !== newProps.debounce) {
      this.setupDebounce(newProps)
    }

    // quick and dirty prop compare
    let oldPropStr = JSON.stringify(this.props)
    let newPropStr = JSON.stringify(newProps)
    if (oldPropStr != newPropStr && newProps.isReady) {
      this.debounceMakeRequest(this.getConfig(newProps))
    }
  }

  componentDidMount() {
    this._mounted = true
    if (this.props.isReady) {
      this.debounceMakeRequest(this.getConfig(this.props))
    }
  }

  onReload(props) {
    if (!this.state.isLoading) {
      this.debounceMakeRequest(this.getConfig(props ? Object.assign({}, this.props, props) : this.props))
    }
  }

  componentWillUnmount() {
    this._mounted = false
    if (this.source && typeof this.source.cancel === 'function') {
      this.source.cancel('Canceling last request.')
    }
  }

  setupDebounce(props) {
    this.debounceMakeRequest = debounce(this.makeRequest, props.debounce, props.debounceImmediate)
  }

  getConfig(props) {
    return Object.assign({ url: props.url, method: props.method, data: props.data, params: props.params }, props.config)
  }

  makeRequest(config) {
    const _axios = this.props.instance || this.context.axios || axios
    if (!this._mounted) {
      return
    }
    // setup cancel tokens
    if (this.source) {
      this.source.cancel('Canceling previous request.')
    }
    this.source = axios.CancelToken.source()

    // set the isLoading flag
    this.setState({ isLoading: true, error: null  })
    if (typeof this.props.onLoading === 'function') {
      this.props.onLoading()
    }

    // time to make the axios request
    _axios.request(Object.assign({ cancelToken: this.source.token }, config )).then((res) => {
      if (!this._mounted) {
        return
      }
      this.setState({ isLoading: false, response: res })
      if (typeof this.props.onSuccess === 'function') {
        this.props.onSuccess(res)
      }
    }, (err) => {
      if (!this._mounted) {
        return
      }
      if (!axios.isCancel(err)) {
        this.setState({ isLoading: false, response: err.response, error: err })
        if (typeof this.props.onError === 'function') {
          this.props.onError(err)
        }
      }
    })
  }

  render() {
    if (typeof this.props.children === 'function') {
      return this.props.children(this.state.error, this.state.response, this.state.isLoading, (props) => this.onReload(props))
    }
    return null
  }
}

Request.contextTypes = {
  axios: PropTypes.func,
}

Request.defaultProps = {
  url: '',
  method: 'get',
  data: {},
  config: {},
  debounce: 200,
  debounceImmediate: true,
  isReady: true,
}

Request.propTypes = {
  instance: PropTypes.func,
  url: PropTypes.string.isRequired,
  method: PropTypes.string.isRequired,
  data: PropTypes.object,
  params: PropTypes.object,
  config: PropTypes.object,
  isReady: PropTypes.bool,
  debounce: PropTypes.number,
  debounceImmediate: PropTypes.bool,
  onSuccess: PropTypes.func,
  onLoading: PropTypes.func,
  onError: PropTypes.func,
  children: PropTypes.func,
}

export default Request
