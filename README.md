
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
- Child function callback ***(error, response, isLoading) => { }***
- Auto cancel previous requests
- Debounce to prevent rapid calls.
- Request only invoked on prop change and *isReady* state.
- Callback props for ***onSuccess***, ***onError***, and ***onLoading***
- Supports custom axios instances through ***props*** or a ***&lt;AxiosProvider ... &gt;***

## Installing

Using npm:

```bash
$ npm install react-axios
```

## Components & Properties

#### Base Request Component
```js
<Request
  instance={axios.create({})} /* custom instance of axios - optional */
  method="" /* get, delete, head, post, put and patch - required */
  url="" /*  url endpoint to be requested - required */
  data="" /* post data - optional */
  config="" /* axios config - optional */
  debounce={200} /* minimum time between requests events - optional */
  debounceImmediate={true} /* make the request on the beginning or trailing end of debounce - optional */
  isReady={true} /* can make the axios request - optional */
  onSuccess={(response)=>{}} /* called on success of axios request - optional */
  onLoading={()=>{}} /* called on start of axios request - optional */
  onError=(error)=>{} /* called on error of axios request - optional */
/>
```

#### Helper Components
```js
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
import { AxiosProvider, Request, Get, Delete, Head, Post, Put, Patch } from 'react-axios'
```

Performing a `GET` request

```js
// Make a request for a user with a given ID
render() {
  return (
    <div>
      <Get url="/api/user?ID=12345">
        {(error, response, isLoading) => {
          if(error) {
            return (<div>Something bad happened: {error.message}</div>)
          }
          else if(isLoading) {
            return (<div>Loading...</div>)
          }
          else if(response !== null) {
            return (<div>{response.data.message}</div>)
          }
          return (<div>Default message before request is made.</div>)
        }}
      </Get>
    </div>
  )
}
```


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
```js
<AxiosProvider instance={axiosInstance}>
  <Get url="test">
    {(error, response, isLoading) => {
      ...
    }}
  </Get>
</AxiosProvider>
```

Or pass down through props
```js
<Get url="test" instance={axiosInstance}>
  {(error, response, isLoading) => {
    ...
  }}
</Get>
```
