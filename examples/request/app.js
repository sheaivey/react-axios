import { Request, Get, Post, Put, Delete, Head, Patch } from 'react-axios'
import React from 'react'
import ReactDOM from 'react-dom'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

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
        <code>
          <h2>Request</h2>
          <Request method="get" url="/api/request">
            {this.renderResponse}
          </Request>
          <h2>Get</h2>
          <Get url="/api/get">
            {this.renderResponse}
          </Get>
          <h2>Post</h2>
          <Post url="/api/post" data={{ id: '12345' }}>
            {this.renderResponse}
          </Post>
          <h2>Delete</h2>
          <Delete url="/api/delete" data={{ id: '12345' }}>
            {this.renderResponse}
          </Delete>
          <h2>Put</h2>
          <Put url="/api/put" data={{ id: '12345' }}>
            {this.renderResponse}
          </Put>
          <h2>Patch</h2>
          <Patch url="/api/patch" data={{ id: '12345' }}>
            {this.renderResponse}
          </Patch>
          <h2>Head</h2>
          <Head url="/api/head">
            {this.renderResponse}
          </Head>
        </code>
      </div>
    )
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('app')
)
