import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Home } from './Pages/Home/Home.tsx'
import { Login } from './Pages/Login/Login.tsx'

const pages = [
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/logga-in",
    element: <Login />
  },
  {
    path:'/ordrar',
    element: <h2>Ordrar</h2>
  },
  {
    path:'/garage',
    element: <h2>Garage</h2>
  }
]

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: pages
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
