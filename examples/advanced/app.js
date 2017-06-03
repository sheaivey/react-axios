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
      url: '',
      unmount: false
    }
  }

  testUnmount() {
    this.setState({ isReady: true, url: '/api/cancel/?t='+new Date().getTime(), debounce: 0, unmount: false })
    setTimeout(()=>{
      this.setState({ unmount: true, isLoading: false, isReady: true })
    }, 500)
  }

  render() {
    return (
      <div>
        <code>
          {!this.state.unmount && <Request
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
          </Request>}
          {this.state.unmount && 'Component unmounted.'}
        </code>
        <button className="info" disabled={this.state.isLoading} onClick={()=>this.setState({ isReady: true, url: '/api/advanced', debounce: 200, unmount: false })}>
          Make API Request
        </button>
        <button className="warning" onClick={()=>this.setState({ isReady: true, url: '/api/debounce/?t='+new Date().getTime(), debounce: 250, unmount: false })}>
          Click rapidly for debounce test
        </button>
        <button className="warning" onClick={()=>this.setState({ isReady: true, url: '/api/cancel/?t='+new Date().getTime(), debounce: 0, unmount: false })}>
          Click rapidly for cancel test
        </button>
        <button className="danger" disabled={this.state.isLoading} onClick={()=>this.setState({ isReady: true, url: '/error', debounce: 200, unmount: false })}>
          Force API Error
        </button>
        <button className="danger" disabled={this.state.isLoading} onClick={()=>this.testUnmount()}>
          Unmount Test
        </button>
      </div>
    )
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('app')
)
