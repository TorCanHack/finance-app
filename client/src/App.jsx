import { BrowserRouter, Route, Routes, Link } from "react-router-dom"
import { useState } from "react"
import { fetchRecords } from "./api/Api"
import { useEffect } from "react"
import Home from "./pages/Home"

function App() {

  const [data, setData] = useState({})
  const [error, setError] = useState("")

  useEffect(() => {
    const getRecord = async () => {
      try {
        const records = await fetchRecords();
        setData(records)
        console.log(data)
      } catch (err) {
        setError("Failed to fetch records")
      }
    }

    getRecord()
  }, [])
  

  return (
    <BrowserRouter>
      <Routes>
        
          <Route path="/" element={<Home data={data}/>}/>

      </Routes>
      
    </BrowserRouter>
    
  )
}

export default App
