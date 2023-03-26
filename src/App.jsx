import { useState } from 'react'
import { WatchListContextProvider } from './context/watchListComponent'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { StockOverviewPage } from './pages/StockOverviewPage'
import { StockDetailPage } from './pages/StockDetailPage'

function App() {
  return (
    <main className="container">
      <WatchListContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<StockOverviewPage />} />
            <Route path="/detail/:symbol" element={<StockDetailPage />} />
          </Routes>
        </BrowserRouter>
      </WatchListContextProvider>
    </main>
  )
}

export default App
