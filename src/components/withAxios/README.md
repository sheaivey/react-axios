
## How to use

`withAxios` [hoc](https://reactjs.org/docs/higher-order-components.html) passes `axios`, `makeRequest()`, `isLoading`, `response` and `error` props to the wrapped component:

```
{
  makeRequest: (urlOrRequestParams, method = 'get', data = {}, config = {}) => Promise,
  isLoading: boolean,  // whether request is in progress
  response: Object,    // Axios response object, see https://github.com/axios/axios#response-schema
  error: null | Error, // Axios error if any
}
```
However, you can [specify you own mapping](#-`mapping`-key) for those props

### Very Basic exapmple

```
  import { withAxios } from 'react-axios';

  class SomeComponent extends React.PureComponent {

    componentDidMount() {
      this.props.makeRequest('/some-api')
    }
    render() {
       const { response: { data }, isLoading, error } = this.props;
       if (isLoading) {
         return '...loading';
       }
       if (error) {
         return 'An error occurred: ' + error;
       }
       return 'Got this data: ' + JSON.stringify(data);
    }
  }

  export default withAxios()(SomeComponent);
``` 
### Availabe params for `makeRequest(url, method, data, config)`

`POST` example: 
```
this.props.makeRequest(
  '/some-url',
  'post',
  {data: 'payload', 'for': 'post'}
)
```
`PUT` example with additional headers:
```
const headers = {
  Authorization: 'Bearer some-token'
}

this.props.makeRequest(
  '/some-url',
  'put',
  {data: 'payload', 'for': 'post'},
  { headers }
)
```

last param `config` is a [request config](https://github.com/axios/axios#request-config)

You can also specify [full request config](https://github.com/axios/axios#request-config) as the only param of `makeRequest`: 

```
  const requestObj = {
    url: '/some/url',
    method: 'put',
    headers: {
    'Accept': 'json',
    'Authorization': 'Bearer some-oauth2-key'
    }
  }
  this.props.makeRequest(requestObj)
```

# HOC options

`withAxios` accepts the list of options to configure component behavior: `withAxios(options)(SomeComponent);`

`options` is an object which tracks the next keys:

```
{
    axios: CustomAxiosInstance,
    initialData: any,        // null by default
    spreadResponse: boolean, // false by default, spread the response into data, status, headers e.t.c. props
    mapping: object,         // custom props mapping
}
```
#### `axios` key

If you wish to use custom axios instance, this option is exactly for that. Note, that context.axios have higher priority.

#### `initialData` key

The initial `response.data` value. At very first load your component won't have any data loaded, so this is useful to not do additional check in your component, i.e. without `initialData` you'll need to write something like:

```
  class SomeComponent extends React.PureComponent {
    render() {
      const { response } = this.props;
      if (response.data && response.data.length) {
        // omg we finally got the data, let's render it
        ...
      } else {
        // either, the very first mount or loading
        ...
      }
    }
  }

  withAxios()(SomeComponent)
```

If you define initial data, then it'll be something like this:

```
  class SomeComponent extends React.PureComponent {
    render() {
      const { response } = this.props;
      // we're sure that response.data is always array
      // as either initialData is an array
      // or server returns the array
      return response.data.map( ... );
    }
  }

  withAxios({ initialData: [] })(SomeComponent)
```

#### `spreadResponse` key

If `true` your component will accept spreaded [reponse props](https://github.com/axios/axios#response-schema)
`data`, `status`, `headers`, `config` & `request`. (instead of one prop `response`)  I.e.:

```
class SomeComponent extends React.PureComponent {
    render() {
      // no 'response' prop here anymore
      const { data, status } = this.props;
      if (status === 200)
      return <div>{JSON.stringify(data)</div>;
    }
  }

  withAxios({ spreadResponse: true })(SomeComponent)
```

#### `mapping` key

You can use your own mapping for passed props, it should be a callback function which accepts original props and returns the desired mapping:

```
class SomeComponent extends React.PureComponent {
    render() {
      // no 'response' prop here anymore
      const { requestInProgress, serverResponse, requestError } = this.props;
      if (requestInProgress)
        return <div>...loading</div>;
      ...
    }
  }
  const mapping = (originalProps) => ({
    serverResponse: orinalProps.response,
    requestInProgress: originalProps.isLoading,
    requestError: originalProps.error
  })

  withAxios({ mapping })(SomeComponent)
```
Note, that your `mapping` should specify all props your component needed! As, for example above, the component wont'have `makeRequest` or `axios` props, cuz no mapping specified for them.
