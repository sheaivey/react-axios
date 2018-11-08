import React from 'react'
import _ from 'lodash'
import axios from 'axios'
import PropTypes from 'prop-types'

export const withAxios = (options = {}) => (Component) => class AxiosExtracter extends React.PureComponent {
  
  get axios() {
    return this.context.axios || options.axios || axios
  }

  static contextTypes = {
    axios: PropTypes.func,
  }

  state = {
    error: null,
    response: { data: options.initialData || null },
    isLoading: false,
  };

  requestDoneHandler = (response, error = null) => {
    this.setState({ isLoading: false, response, error })
  }

  /***
   * doRequest('/some-api') // get request 
   * doRequest('/some-api', 'get') 
   * doRequest('/some-api', 'post', {foo: 'bar'}) 
   * doRequest('/some-api', 'post', {foo: 'bar'}, {headers: {'custom': 'header'}}) 
   */
  makeRequest = (urlOrRequestParams, method = 'get', data = {}, config = {}) => {
    this.setState({ isLoading: true })
    const promise = _.isObject(urlOrRequestParams) ?
         this.axios.request(urlOrRequestParams) :
         this.axios[method](urlOrRequestParams, data, config)

    promise.then( this.requestDoneHandler )
    promise.catch( error => this.requestDoneHandler(error.response, error ))

    return promise
  }

  get computedProps() {
    const { response, ...restState } = this.state
    const props = {
      axios: this.axios,
      makeRequest: this.makeRequest,
    }
    return options.spreadResponse ? { ...props,...restState, ...response } : { ...props, ...this.state } 
  }

  get mappedProps() {
    const { computedProps } = this
    const { mapping } = options
    return mapping ? mapping(computedProps) : computedProps
  }

  render() {
    return <Component {...this.mappedProps} {...this.props} />
  }
} 
