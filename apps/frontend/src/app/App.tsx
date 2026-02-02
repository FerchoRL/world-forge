import { router } from './router'
import '../styles/index.css'
import { RouterProvider } from 'react-router-dom'

function App() {
  return <RouterProvider router={router} />
}

export default App
