import { debounce } from '../src/utils'

describe('utils', () => {
  describe('#debounce', () => {
    test('is a function... this is a dumby test', () => {
      expect(typeof debounce).toBe('function')
    })
  })
})
