import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import createSagaMiddleware from 'redux-saga'
import { configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'

import { App } from '@/containers/App'
import rootSaga from '@/sagas'
import rootReducer from '@/slices'

import '@/styles/index.scss'

// Create Saga Middleware
const sagaMiddleware = createSagaMiddleware()

// Create Store with custom middleware configuration
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(sagaMiddleware, logger), // Add logger after sagaMiddleware
  devTools: process.env.NODE_ENV !== 'production',
})

// Run the saga
sagaMiddleware.run(rootSaga)

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)
