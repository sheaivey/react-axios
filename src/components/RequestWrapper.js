/* eslint react/prop-types: 0 */
import React from 'react'
import Request from './Request'

const RequestWrapper = (method) => {
  return (props) => (
    <Request {... props} method={method}>{props.children}</Request>
  )
}

export default RequestWrapper
