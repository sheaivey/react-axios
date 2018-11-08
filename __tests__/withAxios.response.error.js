import React from 'react'
import { shallow } from 'enzyme'
import { withAxios } from '../src/index'
import { axiosMock } from './axiosMock'

const FakeComponent = () => <div>test</div>
const ConnectedComponent = withAxios()(FakeComponent)
const wrapper = shallow(<ConnectedComponent />)

module.exports = () => {
  test('track 404 error', (done) => {
    const promise = wrapper.prop('makeRequest')('/some-not-existed-url')
    expect(wrapper.prop('isLoading')).toBeTruthy()
    promise.catch(
      () => {
        expect(wrapper.prop('response').status).toEqual(404)
        expect(wrapper.prop('error')).not.toBeNull()
        expect(wrapper.prop('isLoading')).toBeFalsy()
        done()
      })
  })
  
  
  test('track network error', (done) => {
    const url = 'some-500-url'
    axiosMock.onGet(url).networkError()
    const promise = wrapper.prop('makeRequest')(url)
    expect(wrapper.prop('isLoading')).toBeTruthy()
    promise.catch(
      () => {
        expect(wrapper.prop('response')).toBeUndefined()
        expect(wrapper.prop('error').toString()).toContain('Network')
        expect(wrapper.prop('isLoading')).toBeFalsy()
        done()
      })
  })
  
  
  test('track network error', (done) => {
    const url = 'some-too-long-to-wait-url'
    axiosMock.onGet(url).timeout()
    const promise = wrapper.prop('makeRequest')(url)
    expect(wrapper.prop('isLoading')).toBeTruthy()
    promise.catch(
      () => {
        expect(wrapper.prop('response')).toBeUndefined()
        expect(wrapper.prop('error').toString()).toContain('timeout')
        expect(wrapper.prop('isLoading')).toBeFalsy()
        done()
      })
  })
}
