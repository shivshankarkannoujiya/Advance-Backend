
import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {

  const [socket, setSocket] = useState<WebSocket | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  //TODO: Send data to `Server` 
  const sendMessage = () => {
      if (!socket) {
        return
      }
    
    if (!inputRef.current) {
      return
    }
    
    const msg = inputRef.current.value
    socket.send(msg)
  }
  
  // NOTE: Want to make persisntent connection only once 
  // when the `component` mount first time, so `useEffect with [] dependency array`
  // TODO: Receive data from backend
  useEffect(() => {

    const ws = new WebSocket("ws://localhost:8000");
    setSocket(ws)

    ws.onmessage = (event) => {
      console.log(event.data)
    }

  }, [])

  return (
    <>
      <h1>CHAT APPLICATION</h1>
      <div>
        
        <input
          ref={inputRef}
          type="text"
          placeholder='messages...'
        />

        <button
          onClick={sendMessage}
        >Send</button>
      </div>
    </>
  )
}

export default App
