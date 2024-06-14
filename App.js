import React from 'react'
import { store, persistor } from './app/store'
import Index from './app/Index'
import { Provider} from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

function App() {
  return (
    <Provider store={store} >
      <PersistGate persistor={persistor} loading={null}>
        <Index/>
      </PersistGate>
    </Provider>
  )
}

export default App