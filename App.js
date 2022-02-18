import React from 'react'

import { AuthProvider } from './app/contexts/AuthContext';
import Index from './index'

const App = () => {
  return (
    <AuthProvider>
      <Index />
    </AuthProvider>
  )
}

export default App
