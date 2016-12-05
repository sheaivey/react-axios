import { Request } from 'react-axios'
import React from 'react'
import ReactDOM from 'react-dom'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isReady: false,
      isLoading: false,
      debounce: 200,
      url: ''
    }
  }

  render() {
    return (
      <div>
        <code>
          <Request
            isReady={this.state.isReady}
            method="get"
            debounce={this.state.debounce}
            url={this.state.url}
            onSuccess={()=>this.setState({ isReady: false, isLoading: false })}
            onLoading={()=>this.setState({ isLoading: true })}
            onError={()=>this.setState({ isReady: false, isLoading: false })}
          >
            {(error, response, isLoading) => {
              if(error) {
                return (<div>Something bad happened: {error.message}</div>)
              } else if(isLoading) {
                return (<div className="loader"></div>)
              } else if(response !== null) {
                return (<div>{response.data.message}</div>)
              }
              return <div>Click a button to test its action.</div>
            }}
          </Request>
        </code>
        <button className="info" disabled={this.state.isLoading} onClick={()=>this.setState({ isReady: true, url: '/api/advanced', debounce: 200 })}>
          Make API Request
        </button>
        <button className="warning" onClick={()=>this.setState({ isReady: true, url: '/api/debounce/?t='+new Date().getTime(), debounce: 250 })}>
          Click rapidly for debounce test
        </button>
        <button className="warning" onClick={()=>this.setState({ isReady: true, url: '/api/cancel/?t='+new Date().getTime(), debounce: 0 })}>
          Click rapidly for cancel test
        </button>
        <button className="danger" disabled={this.state.isLoading} onClick={()=>this.setState({ isReady: true, url: '/error', debounce: 200 })}>
          Force API Error
        </button>
      </div>
    )
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('app')
)
