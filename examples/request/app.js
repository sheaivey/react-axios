import { Request } from 'react-axios'
import React from 'react'
import ReactDOM from 'react-dom'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div>
        <code>
          <Request method="get" url="/api/request">
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
          </Request>
        </code>
      </div>
    )
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('app')
)
