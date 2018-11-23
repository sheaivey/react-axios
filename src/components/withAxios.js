import React from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import Request from './Request'

export const withAxios = (mixed = {}) => {
  if(typeof mixed === 'function') {
    // basic axios provider HoC
    const WrappedComponent = mixed
    const AxiosExtracter = (props, context) => {
      return <WrappedComponent axios={context.axios || axios} {...props}/>
    }

    AxiosExtracter.contextTypes = {
      axios: PropTypes.func,
    }
    return AxiosExtracter
  }
  // advanced Request provider HoC
  const options = { ...Request.defaultProps, ...mixed }
  return (WrappedComponent) => {
    // validate the options passed in are valid request propTypes.
    PropTypes.checkPropTypes({
      ...Request.propTypes,
      method: PropTypes.string, // not required if the user just wants access to the axios instance
    }, options, 'option', `withAxios()(${WrappedComponent.name})`)
    class ReactAxiosExtracter extends React.PureComponent {
      render() {
        // allow overriding the config initial options
        const newOptions = { ...options, ...this.props.options }
        return (
          <Request {...newOptions}>
            {(error, response, isLoading, makeRequest, axios) => (
              <WrappedComponent
                {...this.props}
                error={error}
                response={response}
                isLoading={isLoading}
                makeRequest={makeRequest}
                axios={axios}
                options={newOptions}
              />
            )}
          </Request>
        )
      }
    }
    ReactAxiosExtracter.propTypes = {
      options: PropTypes.object,
    }
    return ReactAxiosExtracter
  }
}

export default withAxios
