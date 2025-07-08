import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import OrderForm from './OrderForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <OrderForm />
    </>
  )
}

export default App
