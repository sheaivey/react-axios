import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

export const AxiosContext = React.createContext(axios)

const AxiosProvider = ({ instance, children }) => (
  <AxiosContext.Provider value={instance}>
    {children}
  </AxiosContext.Provider>
)

AxiosProvider.defaultProps = {
}

AxiosProvider.propTypes = {
  instance: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired,
}

export default AxiosProvider
