import React from 'react'
import Request from '../components/Request'

let RequestWrapper = (method) => {
  return (props) => {
    return (<Request {... props} method={method}>{props.children}</Request>)
  }
}

export default RequestWrapper
