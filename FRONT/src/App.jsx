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
<<<<<<< HEAD
        <h2>
IIT-JAMMU-POST-OFFICE-AUTOMATION-SYSTEM</h2>
        <LoginSelector></LoginSelector>
        
        
=======
        <h1>hii hiii</h1>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
>>>>>>> cff369c5a7ed916a67d3f83e42d3fa5b48e182bb
      </div>
      
    </>
  )
}

export default App
