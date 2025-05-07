import { Routes, Route } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { InteractiveSphere } from './components/InteractiveSphere'
import './App.css'
import Home from './components/Home'
import Continent from './components/Continent'
import CountryDetail from './components/CountryDetail'
import CountryStatistics from './components/LargestCountries'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/continent/:continentName" element={<Continent />} />
      <Route path="/country/:countryCode" element={<CountryDetail />} />
      <Route path="/statistics" element={<CountryStatistics />} />
      {/* 3D Earth stays on Home page for now */}
    </Routes>
  )
}

export default App
