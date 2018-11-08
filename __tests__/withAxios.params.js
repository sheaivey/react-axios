import React from 'react'
import { shallow } from 'enzyme'
import { withAxios } from '../src/index'
import { axiosMock } from './axiosMock'

const FakeComponent = () => <div>test</div>
const ConnectedComponent = withAxios()(FakeComponent)
const wrapper = shallow(<ConnectedComponent />)

module.exports = () => {
  
  test('have props: makeRequest, error, response, isLoading', () => {
    expect(wrapper.prop('makeRequest')).toBeDefined()
    expect(wrapper.prop('error')).toBeNull()
    expect(wrapper.prop('response')).toBeDefined()
    expect(wrapper.prop('isLoading')).toBeFalsy()
  })

  test('not spread response by default', () => {
    expect(wrapper.prop('data')).toBeUndefined()
  })

  test('use custom axios instance if provided', () => {
    const passedAxiosMock = {
      get: jest.fn( () => Promise.resolve('test')),
    }

    const Connected = withAxios({ axios: passedAxiosMock })(FakeComponent)
    const wrapper = shallow(<Connected />)
    wrapper.prop('makeRequest')('/some-url')
    expect(passedAxiosMock.get).toHaveBeenCalledWith('/some-url', {}, {})
  })

  test('use initial data if provided', () => {
    const initialData = [ 1,2,3 ]
    const Connected = withAxios({ initialData })(FakeComponent)
    const wrapper = shallow(<Connected />)
    expect(wrapper.prop('response').data).toEqual(initialData)
  })

  test('spread response if requested', (done) => {
    const Connected = withAxios({ spreadResponse: true })(FakeComponent)
    const wrapper = shallow(<Connected />)
  
    const responseOnGet = { 'some': 'json' }
    axiosMock.onGet('/').replyOnce(200, responseOnGet)
    wrapper.prop('makeRequest')('/').then( () => {
      expect(wrapper.prop('data')).toEqual(responseOnGet)
      expect(wrapper.prop('status')).toEqual(200)
      done()
    })
  })

  test('use mapping if provided', (done) => {
    const mapping = (originalProps) => ({
      requestInProgress: originalProps.isLoading,
      responseData: originalProps.data,
      makeRequest: originalProps.makeRequest,
    })
    const Connected = withAxios({ mapping, spreadResponse: true })(FakeComponent)
    const wrapper = shallow(<Connected />)

    expect(wrapper.prop('isLoading')).toBeUndefined()
    expect(wrapper.prop('requestInProgress')).toBeFalsy()
    expect(wrapper.prop('data')).toBeUndefined()

    const responseOnGet = { 'some': 'json' }
    axiosMock.onGet('/').replyOnce(200, responseOnGet)
    const promise = wrapper.prop('makeRequest')('/')
    expect(wrapper.prop('requestInProgress')).toBeTruthy()
    expect(wrapper.prop('data')).toBeUndefined()
    expect(wrapper.prop('responseData')).toBeDefined()
    promise.then( () => {
      expect(wrapper.prop('isLoading')).toBeUndefined()
      expect(wrapper.prop('responseData')).toEqual(responseOnGet)
      expect(wrapper.prop('requestInProgress')).toBeFalsy()
      done()
    })
  })
}
