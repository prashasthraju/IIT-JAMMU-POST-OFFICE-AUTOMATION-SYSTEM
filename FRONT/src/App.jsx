import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import LoginSelector from './LoginSelector'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h2>
IIT-JAMMU-POST-OFFICE-AUTOMATION-SYSTEM</h2>
        <LoginSelector></LoginSelector>
        
        
      </div>
      
    </>
  )
}

export default App
