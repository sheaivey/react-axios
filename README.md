# react-axios
Axios Component for React with child function callback.
This is intended to allow in render async requests.

## Features

- Same great features found in [Axios](https://github.com/mzabriskie/axios)
- Component driven
- Child function callback **(error, response, isLoading) => { }**
- Auto cancel previous requests
- Debounce to prevent rapid calls.
- Request only invoked on prop change and isReady state.
- Callback props for onSuccess, onError, and onLoading

## Installing

Using npm:

```bash
$ npm install react-axios
```

## Components & Properties

#### Base Request Component
```js
<Request
  method="" /* required */
  url="" /* required */
  data=""
  config="" /* axios config */
  debounce=200
  isReady={true}
  onSuccess={(response)=>{}}
  onLoading={()=>{}}
  onError=(error)=>{}
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
import { Request, Get, Delete, Head, Post, Put, Patch } from 'react-axios'
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
