import React from 'react'
import axios from 'axios'
import { debounce } from '../utils'

class Request extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      response: null,
      error: null
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
    if (this.props.isReady) {
      this.debounceMakeRequest(this.getConfig(this.props))
    }
  }

  setupDebounce(props) {
    this.debounceMakeRequest = debounce(this.makeRequest, props.debounce)
  }

  getConfig(props) {
    return Object.assign({ url: props.url, method: props.method, data: props.data }, props.config)
  }

  makeRequest(config) {
    const _axios = this.props.axios || this.context.axios || axios
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
    let _this = this
    _axios.request(Object.assign({ cancelToken: this.source.token }, config )).then((res) => {
      _this.setState({ isLoading: false, response: res })
      if (typeof _this.props.onSuccess === 'function') {
        _this.props.onSuccess(res)
      }
    }, (err) => {
      if (!_axios.isCancel(err)) {
        _this.setState({ isLoading: false, response: null, error: err })
        if (typeof _this.props.onError === 'function') {
          _this.props.onError(err)
        }
      }
    })
  }

  render() {
    if (typeof this.props.children === 'function') {
      return this.props.children(this.state.error, this.state.response, this.state.isLoading)
    }
    return null
  }
}

Request.contextTypes = {
  axios: React.PropTypes.func
}

Request.defaultProps = {
  url: '',
  method: 'get',
  data: {},
  config: {},
  debounce: 200,
  isReady: true
}

Request.propTypes = {
  axios: React.PropTypes.func,
  url: React.PropTypes.string.isRequired,
  method: React.PropTypes.string.isRequired,
  data: React.PropTypes.object,
  config: React.PropTypes.object,
  isReady: React.PropTypes.bool,
  debounce: React.PropTypes.number,
  onSuccess: React.PropTypes.func,
  onLoading: React.PropTypes.func,
  onError: React.PropTypes.func,
  children: React.PropTypes.func
}

export default Request
