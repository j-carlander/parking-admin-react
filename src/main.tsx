import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Home } from './Pages/Home/Home.tsx'
import { Login } from './Pages/Login/Login.tsx'
import { BookingForm } from './Pages/BookingForm/BookingForm.tsx'

export const pages = [
  {
    path: '/',
    element: <Home />,
    label: 'Bokningar'
  },
  {
    path: '/logga-in',
    element: <Login />
  },
  {
    path:'/ordrar',
    element: <h2>Ordrar</h2>,
    label: 'Ordrar'
  },
  {
    path:'/garage',
    element: <h2>Garage</h2>,
    label: 'Garage'
  },
  {
    path: '/ny-bokning',
    element: <BookingForm />
  }
]

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: pages
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
