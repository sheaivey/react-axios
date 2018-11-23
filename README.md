
[![npm](https://img.shields.io/npm/v/react-axios.svg)](https://www.npmjs.com/package/react-axios)
[![Build Status](https://travis-ci.org/sheaivey/react-axios.svg?branch=master)](https://travis-ci.org/sheaivey/react-axios)
[![npm](https://img.shields.io/npm/l/react-axios.svg)](https://github.com/sheaivey/react-axios/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/dt/react-axios.svg)](https://www.npmjs.com/package/react-axios)
# react-axios
Axios Component for React with child function callback.
This is intended to allow in render async requests.

## Features

- Same great features found in [Axios](https://github.com/mzabriskie/axios)
- Component driven
- Child function callback ***(error, response, isLoading, makeRequest, axios) => { }***
- Auto cancel previous requests
- Debounce to prevent rapid calls.
- Request only invoked on prop change and *isReady* state.
- Callback props for ***onSuccess***, ***onError***, and ***onLoading***
- Supports custom axios instances through ***props*** or a ***&lt;AxiosProvider ... &gt;***
- Create your own request components wrapped using the ***withAxios({options})(ComponentToBeWrapped)*** HoC

## Installing

Using npm:

```bash
$ npm install react-axios
```

Also install the required peer dependancies if you have not already done so:

```bash
$ npm install axios
$ npm install react
$ npm install prop-types
```

## Components & Properties

#### Base Request Component
```jsx
<Request
  instance={axios.create({})} /* custom instance of axios - optional */
  method="" /* get, delete, head, post, put and patch - required */
  url="" /*  url endpoint to be requested - required */
  data={} /* post data - optional */
  params={} /* queryString data - optional */
  config={} /* axios config - optional */
  debounce={200} /* minimum time between requests events - optional */
  debounceImmediate={true} /* make the request on the beginning or trailing end of debounce - optional */
  isReady={true} /* can make the axios request - optional */
  onSuccess={(response)=>{}} /* called on success of axios request - optional */
  onLoading={()=>{}} /* called on start of axios request - optional */
  onError=(error)=>{} /* called on error of axios request - optional */
/>
```

#### Helper Components
```jsx
<Get ... />
<Delete ... />
<Head ... />
<Post ... />
<Put ... />
<Patch ... />
```

## Example

Include in your file

```js
import { AxiosProvider, Request, Get, Delete, Head, Post, Put, Patch, withAxios } from 'react-axios'
```

Performing a `GET` request

```js
// Post a request for a user with a given ID
render() {
  return (
    <div>
      <Get url="/api/user" params={{id: "12345"}}>
        {(error, response, isLoading, makeRequest, axios) => {
          if(error) {
            return (<div>Something bad happened: {error.message} <button onClick={() => makeRequest({ params: { reload: true } })}>Retry</button></div>)
          }
          else if(isLoading) {
            return (<div>Loading...</div>)
          }
          else if(response !== null) {
            return (<div>{response.data.message} <button onClick={() => makeRequest({ params: { refresh: true } })}>Refresh</button></div>)
          }
          return (<div>Default message before request is made.</div>)
        }}
      </Get>
    </div>
  )
}
```

### Exposed properties on the child function.
`error` The error object returned by Axios.

`response` The response object returned by Axios.

`isLoading` Boolean flag indicating if Axios is currently making a XHR request.

`makeRequest(props)` Function to invoke another XHR request. This function accepts new temporary props that will be overloaded with the existing props for this request only.

`axios` current instance of axios being used.


## Custom Axios Instance

Create an axios instance
```js
const axiosInstance = axios.create({
  baseURL: '/api/',
  timeout: 2000,
  headers: { 'X-Custom-Header': 'foobar' }
});

```

Pass down through a provider
```jsx
<AxiosProvider instance={axiosInstance}>
  <Get url="test">
    {(error, response, isLoading, makeRequest, axios) => {
      ...
    }}
  </Get>
</AxiosProvider>
```

Or pass down through props
```jsx
<Get url="test" instance={axiosInstance}>
  {(error, response, isLoading, makeRequest, axios) => {
    ...
  }}
</Get>
```

Retrieve from custom provider (when you need to directly use axios).
The default instance will be passed if not inside an `<AxiosProvider/>`.
```jsx
<AxiosProvider instance={axiosInstance}>
  <MyComponent/>
</AxiosProvider>
```

## withAxios(Component) HoC
If you need basic access to the axios instance but don't need anything else you can wrap a component using withAxios() higher order component.
```jsx
const MyComponent = withAxios(class MyComponentRaw extends React.Component {
  componentWillMount() {
    this.props.axios('test').then(result => {
      this.setState({ data: result.data })
    })
  }
  render() {
    const data = (this.state || {}).data
    return <div>{JSON.stringify(data)}</div>
  }
})
```

## withAxios(options)(Component) HoC
If you want to create your own component with the full react-axios request `options`. You can override the initial options supplied to withAxios at any time by passing `options` prop to your wrapped component. See below on how this works.

```jsx
const MyComponent = withAxios({
    url: '/api/user'
    params: {id: "12345"}
  })(class MyComponentRaw extends React.Component {
  render() {
    const {error, response, isLoading, makeRequest, axios} = this.props
    if(error) {
      return (<div>Something bad happened: {error.message}</div>)
    } else if(isLoading) {
      return (<div className="loader"></div>)
    } else if(response !== null) {
      return (<div>{response.data.message}</div>)
    }
    return null
  }
})
```
