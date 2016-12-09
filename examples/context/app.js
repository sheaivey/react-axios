import { Get } from 'react-axios'
import axios from 'axios'
import React from 'react'
import ReactDOM from 'react-dom'

const axiosContext = axios.create({
  baseURL: '/api/context/',
  timeout: 2000,
  headers: { 'X-Custom-Header': 'foobar' }
})

const axiosProp = axios.create({
  baseURL: '/api/prop/',
  timeout: 2000,
  headers: { 'X-Custom-Header': 'foobar' }
})

class App extends React.Component {
  getChildContext() {
    return { axios: axiosContext }
  }

  render() {
    return (
      <div>
        <h2>Axios Instance from Props</h2>
        <code>
          <Get url="test" axios={axiosProp}>
            {(error, response, isLoading) => {
              if(error) {
                return (<div>Something bad happened: {error.message}</div>)
              } else if(isLoading) {
                return (<div className="loader"></div>)
              } else if(response !== null) {
                return (<div>{response.data.message}</div>)
              }
              return null
            }}
          </Get>
        </code>

        <h2>Axios Instance from Context</h2>
        <code>
          <Get url="test">
            {(error, response, isLoading) => {
              if(error) {
                return (<div>Something bad happened: {error.message}</div>)
              } else if(isLoading) {
                return (<div className="loader"></div>)
              } else if(response !== null) {
                return (<div>{response.data.message}</div>)
              }
              return null
            }}
          </Get>
        </code>

      </div>
    )
  }
}

App.childContextTypes = {
  axios: React.PropTypes.func
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
