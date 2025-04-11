import { BrowserRouter, Route, Routes, Link } from "react-router-dom"
import { useState } from "react"
import { fetchRecords } from "./api/Api"
import { useEffect } from "react"
import Home from "./pages/Home"
import Navigation from "./components/Navigation"
import Transactions from "./pages/Transactions"
import Budget from "./pages/Budget"

function App() {

  const [data, setData] = useState({})
  const [error, setError] = useState("")
  const [activeCategory, setActiveCategory] = useState('');
  const theme = {
    Green: '#277C78',
    Cyan: '#82C9D7',
    Peach: '#F2CDAC',
    Purple: '#626070',
    Voilet: '#826CB0',
    Orange: '#FFA500',
    Blue: '#0000FF',
    Pink: '#FFC0CB',
    Indigo: '#4B0082'
  }

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
      <main className="lg:flex lg:flex-row-reverse lg:justify-between lg:h-full lg:min-h-screen overflow-hidden bg-[#F8f4f0]">
        <Routes>
        
          <Route path="/" element={<Home data={data}/>}/>
          <Route path="/transactions" element={<Transactions data={data} activeCategory={activeCategory} setActiveCategory={setActiveCategory} /> }/>
          <Route path="/budget" element={<Budget data={data} theme={theme} activeCategory={activeCategory} setActiveCategory={setActiveCategory}/>}/>

        </Routes>
        <Navigation/>

      </main>
      
      
    </BrowserRouter>
    
  )
}

export default App
