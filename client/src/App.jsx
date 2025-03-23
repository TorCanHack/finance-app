import { BrowserRouter, Route, Routes, Link } from "react-router-dom"
import { useState } from "react"
import { fetchRecords } from "./api/Api"
import { useEffect } from "react"
import Home from "./pages/Home"
import Navigation from "./components/Navigation"
import Transactions from "./pages/Transactions"

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
      <main className="lg:flex lg:flex-row-reverse lg:justify-between lg:h-full lg:min-h-screen">
        <Routes>
        
          <Route path="/" element={<Home data={data}/>}/>
          <Route path="/transactions" element={<Transactions data={data}/>}/>

        </Routes>
        <Navigation/>

      </main>
      
      
    </BrowserRouter>
    
  )
}

export default App
