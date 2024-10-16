import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Logs from './components/Logs/Logs.jsx'
import ContextProvider from './context/ContextProvider.jsx'
import ProtectedRoute from './components/Auth/ProtectedRoute.jsx'
import HomePage from './components/Home/HomePage.jsx'
import ExplorePage from './components/Routes/ExplorePage.jsx'
import BookmarksPage from './components/Routes/BookmarksPage.jsx'
import Error from './components/Routes/Error.jsx'
import UserProfile from './components/Routes/UserProfile.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <HomePage />
      },
      {
        path: 'explore',
        element: <ExplorePage />
      },
      {
        path: 'bookmarks',
        element: <BookmarksPage />
      },
      {
        path: '/:username/profile',
        element: <UserProfile />
      }
    ],
    errorElement: <Error />
  },
  {
    path: '/auth/:logType',
    element: <Logs />
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextProvider>
      <RouterProvider router={router}/>
    </ContextProvider>
  </StrictMode>,
)
