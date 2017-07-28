import AxiosProvider, { withAxios } from './components/AxiosProvider'
import Request from './components/Request'
import RequestWrapper from './components/RequestWrapper'

module.exports = {
  AxiosProvider: AxiosProvider,
  Request: Request,
  Get: RequestWrapper('get'),
  Delete: RequestWrapper('delete'),
  Head: RequestWrapper('head'),
  Post: RequestWrapper('post'),
  Put: RequestWrapper('put'),
  Patch: RequestWrapper('patch'),
  withAxios: withAxios,
}
