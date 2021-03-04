import React from 'react'
import PropTypes from 'prop-types'
import Request from './Request'
import { AxiosContext } from './AxiosProvider'

export const withAxios = (mixed = {}) => {
  if(typeof mixed === 'function') {
    // basic axios provider HoC
    const WrappedComponent = mixed
    return (props) => {
      const axiosInstance = React.useContext(AxiosContext)
      return <WrappedComponent axios={ axiosInstance } { ...props }/>
    }
  }
  // advanced Request provider HoC
  const options = { ...Request.defaultProps, ...mixed }
  return (WrappedComponent) => {
    // validate the options passed in are valid request propTypes.
    PropTypes.checkPropTypes({
      ...Request.propTypes,
      method: PropTypes.string, // not required if the user just wants access to the axios instance
    }, options, 'option', `withAxios()(${WrappedComponent.name})`)
    const ReactAxiosExtracter = (props) => {
      // allow overriding the config initial options
      const newOptions = { ...options, ...props.options }
      return (
        <Request {...newOptions}>
          {(error, response, isLoading, makeRequest, axios) => (
            <WrappedComponent
              {...props}
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
    ReactAxiosExtracter.propTypes = {
      options: PropTypes.object,
    }
    return ReactAxiosExtracter
  }
}

export default withAxios
