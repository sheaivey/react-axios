import { AxiosProvider, Get } from 'react-axios'
import axios from 'axios'
import React from 'react'
import ReactDOM from 'react-dom'

const axiosProvider = axios.create({
  baseURL: '/api/provider/',
  timeout: 2000,
  headers: { 'X-Custom-Header': 'foobar' },
})

const axiosProp = axios.create({
  baseURL: '/api/props/',
  timeout: 2000,
  headers: { 'X-Custom-Header': 'foobar' },
})

class App extends React.Component {
  renderResponse(error, response, isLoading) {
    if(error) {
      return (<div>Something bad happened: {error.message}</div>)
    } else if(isLoading) {
      return (<div className="loader"></div>)
    } else if(response !== null) {
      return (<div>{response.data.message}</div>)
    }
    return null
  }

  render() {
    return (
      <div>
        <h2>Default Axios Instance</h2>
        <code>
          <Get url="/api/test">
            {this.renderResponse}
          </Get>
        </code>

        <h2>Axios Instance from Props</h2>
        <code>
          <Get url="test" instance={axiosProp}>
            {this.renderResponse}
          </Get>
        </code>

        <h2>Axios Instance from a Provider</h2>
        <AxiosProvider instance={axiosProvider} >
          <code>
            <Get url="test">
              {this.renderResponse}
            </Get>
          </code>
        </AxiosProvider>
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
