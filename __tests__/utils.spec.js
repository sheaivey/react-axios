import axios from 'axios'
import axiosSettle from 'axios/lib/core/settle';
import React from 'react'
import renderer from 'react-test-renderer'
import ReactDOM from 'react-dom';
import { debounce } from '../src/utils'
import { AxiosProvider, Request, Get, Delete, Head, Post, Put, Patch, withAxios } from '../src/index'

const debounceTest = new Promise(
  (resolve) => {
    let val = 0
    let count = 0
    // create a debounce function
    const debounceFunc = debounce((arg)=>{val = arg; count++}, 3)
    debounceFunc(1) // ignored val=1, count=0
    debounceFunc(2) // ignored val=2, count=0
    debounceFunc(3) // ignored val=3, count=0
    debounceFunc(4) // called  val=4, count=1
    //setTimeout(debounceFunc, 5) // called count=2
    setTimeout(() => {
      resolve(count) // val should be 4, count should be 1
    }, 50)
  }
)

const debounceTestImmediate = new Promise(
  (resolve) => {
    let val = 0
    let count = 0
    // create a debounce function
    const debounceFunc = debounce((arg)=>{val = arg; count++}, 3, true)
    debounceFunc(1) // called val=1, count=1
    debounceFunc(2) // ignored val=2, count=1
    debounceFunc(3) // ignored val=3, count=1
    debounceFunc(4) // called val=4, count=2
    setTimeout(() => {
      resolve(count) // val should be 4, count should be 2
    }, 50)
  }
)


describe('utils', () => {
  describe('#debounce', () => {
    test('is a function...', () => {
      expect(typeof debounce).toBe('function')
    })

    test('debounce test', () => {
      return debounceTest.then((res)=> {
        expect(res).toBe(1)
      })
    })
    test('debounce test immediate', () => {
      return debounceTestImmediate.then((res)=> {
        expect(res).toBe(2)
      })
    })
  })
})

describe('components', () => {
  function buildConfig(status, statusText, data) {
    return {
      adapter: (config) => new Promise((resolve, reject) => {
        const response = {
          data: data,
          status: status,
          statusText: statusText,
          headers: {
            'content-type': 'text/plain',
         },
          config: config,
        }
        // Must call settle() to properly turn the response into an
        // error if, e.g., status is outside the expected range.
        axiosSettle(resolve, reject, response)
      }),
    }
  }

  function buildNoResponseConfig() {
    return {
      adapter: (config) => {
        throw new Error('Failed to make request!')
      },
    }
  }

  describe('#Request', () => {
    const component = (<Request method="get" url="http://www.example.com/">
      {(error, results, isLoading) => {
        if(error) {
          return <div>error</div>
        }
        if(isLoading) {
          return <div>loading</div>
        }
        else if(results) {
          return <div>results</div>
        }
        return <div>default</div>
      }}
    </Request>)
    test('is a function...', () => {
      expect(typeof Request).toBe('function')
    })
    test('is default...', () => {
      expect(component.props.children(false, false, false).props.children).toBe('default')
    })
    test('is loading...', () => {
      expect(component.props.children(false, false, true).props.children).toBe('loading')
    })
    test('is results...', () => {
      expect(component.props.children(false, true, false).props.children).toBe('results')
    })
    test('is error...', () => {
      expect(component.props.children(true, false, false).props.children).toBe('error')
    })

    it('can load data…', () => new Promise(
      (resolve) => {
        ReactDOM.render(
          <Request config={buildConfig(200, 'OK', 'data')} method="get" url="http://www.example.com/">
          {(error, results, isLoading) => {
            if (results) {
              expect(results.status).toBe(200)
              expect(results.data).toBe('data')
              resolve()
            }
            return <div/>
          }}
          </Request>,
          document.createElement('div')
        )
      }
    ))

    it('can see response for error…', () => new Promise(
      (resolve) => {
        ReactDOM.render(
          <Request config={buildConfig(403, 'Forbidden', 'data')} method="get" url="http://www.example.com/">
          {(error, response, isLoading) => {
            if (response) {
              expect(response).toBeDefined()
              expect(response.status).toBe(403)
              expect(response.data).toBe('data')
              expect(error).toBeTruthy()
              resolve()
            }
            return <div/>
          }}
          </Request>,
          document.createElement('div')
        )
      }
    ))

    it('can’t see response for error with no response…', () => new Promise(
      (resolve) => {
        ReactDOM.render(
          <Request config={buildNoResponseConfig()} method="get" url="http://www.example.com/">
          {(error, response, isLoading) => {
            if (error) {
              expect(response).toBe(null)
              resolve()
            }
            return <div/>
          }}
          </Request>,
          document.createElement('div')
        )
      }
    ))

    it('can unmount safely after debounce is triggered…', () => {
      function MyRender(props) {
        return <Request config={buildConfig(200, 'OK', 'pointless data')} debounce={200} method="get" url={`http://www.example.com/?p=${encodeURIComponent(props.query.p)}`}>
          {(error, results, isLoading) => {
            return <div/>
          }}
        </Request>;
      }
      // the warnings from React won’t fail the test in jest
      // unless you make them manually.
      return new Promise((resolveConsoleWarning, rejectConsoleWarning) => {
        const originalConsoleError = console.error
        console.error = function () {
          originalConsoleError.apply(this, arguments)
          rejectConsoleWarning(new Error(`console.error: ${[].join.call(arguments, ' ')}`))
        }

        const div = document.createElement('div')
        new Promise((resolve) => {
          ReactDOM.render(
            <MyRender query={{p: 1}} ref={resolve}/>,
            div
          )
        }).then(() => new Promise((resolve) => {
          ReactDOM.render(
            <MyRender query={{p: 2}} ref={resolve}/>,
            div
          )
        })).then(() => new Promise((resolve) => {
          // Now unmount and wait out the debounce time.
          ReactDOM.render(
            <div ref={resolve}/>,
            div
          )
        })).then(() => {
          // Successful if we make it to debounce without
          // getting any console warnings.
          setTimeout(resolveConsoleWarning, 400)
        })
      })
    })
  })

  describe('#Get', () => {
    const component = Get({ url: 'http://www.example.com/' })
    test('is a function...', () => {
      expect(typeof Get).toBe('function')
    })
    test('is method=get', () => {
      expect(component.props.method).toBe('get')
    })
  })

  describe('#Delete', () => {
    const component = Delete({ url: 'http://www.example.com/' })
    test('is a function...', () => {
      expect(typeof Delete).toBe('function')
    })
    test('is method=delete', () => {
      expect(component.props.method).toBe('delete')
    })
  })

  describe('#Head', () => {
    const component = Head({ url: 'http://www.example.com/' })
    test('is a function...', () => {
      expect(typeof Head).toBe('function')
    })
    test('is method=head', () => {
      expect(component.props.method).toBe('head')
    })
  })

  describe('#Post', () => {
    const component = Post({ url: 'http://www.example.com/' })
    test('is a function...', () => {
      expect(typeof Post).toBe('function')
    })
    test('is method=post', () => {
      expect(component.props.method).toBe('post')
    })
  })

  describe('#Put', () => {
    const component = Put({ url: 'http://www.example.com/' })
    test('is a function...', () => {
      expect(typeof Put).toBe('function')
    })
    test('is method=put', () => {
      expect(component.props.method).toBe('put')
    })
  })

  describe('#Patch', () => {
    const component = Patch({ url: 'http://www.example.com/' })
    test('is a function...', () => {
      expect(typeof Patch).toBe('function')
    })
    test('is method=patch', () => {
      expect(component.props.method).toBe('patch')
    })
  })

  describe('#withAxios', () => {
    const Component = withAxios(props => {
      props.onRendered(props.axios)
      return <div/>
    })
    test('provides default instance', () => {
      let seenAxios
      renderer(
        <Component onRendered={passedAxios => {
          seenAxios = passedAxios
        }}/>
      )
      expect(typeof seenAxios).toBe('function')
    })
    test('respects AxiosProvider', () => {
      const axiosInstance = axios.create()
      let seenAxios
      renderer(
        <AxiosProvider instance={axiosInstance}>
          <Component onRendered={passedAxios => {
            seenAxios = passedAxios
          }}/>
        </AxiosProvider>
      )
      expect(seenAxios).toBe(axiosInstance)
    })
  })
})
