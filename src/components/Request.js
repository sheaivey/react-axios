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
      this.debounceMakeRequest(newProps, this.getConfig(newProps))
    }
  }

  componentDidMount() {
    this._mounted = true
    if (this.props.isReady) {
      this.debounceMakeRequest(this.props, this.getConfig(this.props))
    }
  }

  onMakeReload(props) {
    this.debounceMakeRequest(props || this.props, this.getConfig(props ? Object.assign({}, this.props, props) : this.props))
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

  makeRequest(props, config) {
    const _axios = props.instance || this.context.axios || axios
    if (!this._mounted || config.url === undefined) {
      return
    }
    // setup cancel tokens
    if (this.source) {
      this.source.cancel('Canceling previous request.')
    }
    this.source = axios.CancelToken.source()

    // set the isLoading flag
    this.setState({ isLoading: true, error: null  })
    if (typeof props.onLoading === 'function') {
      props.onLoading()
    }

    // time to make the axios request
    _axios.request(Object.assign({ cancelToken: this.source.token }, config )).then((res) => {
      if (!this._mounted) {
        return
      }
      this.setState({ isLoading: false, response: res })
      if (typeof props.onSuccess === 'function') {
        props.onSuccess(res)
      }
    }, (err) => {
      if (!this._mounted) {
        return
      }
      if (!axios.isCancel(err)) {
        this.setState({ isLoading: false, response: err.response, error: err })
        if (typeof props.onError === 'function') {
          props.onError(err)
        }
      }
    })
  }

  render() {
    if (typeof this.props.children === 'function') {
      const _axios = this.props.instance || this.context.axios || axios
      return this.props.children(
        this.state.error,
        this.state.response,
        this.state.isLoading,
        (props) => this.onMakeReload(props),
        _axios
      )
    }
    return null
  }
}

Request.contextTypes = {
  axios: PropTypes.func,
}

Request.defaultProps = {
  url: undefined,
  method: 'get',
  data: {},
  config: {},
  debounce: 200,
  debounceImmediate: true,
  isReady: true,
}

Request.propTypes = {
  instance: PropTypes.func,
  url: PropTypes.string,
  method: PropTypes.oneOf([ 'get', 'delete', 'head','post','put','patch', 'options' ]).isRequired,
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
