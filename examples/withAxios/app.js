import { withAxios } from 'react-axios'
import React from 'react'
import ReactDOM from 'react-dom'

class App extends React.Component {
  render() {
    return (
      <div>
        <code>
          <h2>Basic withAxios HoC</h2>
          <DemoComponentHoC />

          <h2>Custom props withAxios HoC</h2>
          <DemoComponentHoC customProp={'Custom Prop'} />

          <h2>Overloading withAxios HoC config options</h2>
          <DemoComponentHoC options={{ method: 'post', url: '/api/overloaded' }} />

          <h2>Children withAxios HoC</h2>
          <DemoComponentHoC><div className="success">children</div></DemoComponentHoC>
        </code>
      </div>
    )
  }
}
/* eslint react/prop-types: 0 */
class DemoComponent extends React.Component {
  render() {
    const { error, response, isLoading, children, customProp, onRendered } = this.props
    if(error) {
      return (<div>Something bad happened: {error.message}</div>)
    } else if(isLoading) {
      return (<div className="loader"></div>)
    } else if(response !== null) {
      return (<div>{response.data.message} {customProp} {children}</div>)
    }
    return customProp || null
  }
}

const DemoComponentHoC = withAxios({
  method:'get',
  url: '/api/request',
})(DemoComponent)

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
