import { useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { InteractiveSphere } from './InteractiveSphere'
import CountrySearch from './CountrySearch'

const continents = [
  { name: 'Africa' },
  { name: 'Asia' },
  { name: 'Europe' },
  { name: 'North America' },
  { name: 'South America' },
  { name: 'Oceania' },
  { name: 'Antarctica' }
]

export default function Home() {
  const navigate = useNavigate();
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #2d0b4e 0%, #1a1446 100%)',
      overflow: 'hidden'
    }}>
      <div style={{
        width: '340px',
        minWidth: '220px',
        background: 'rgba(10,20,40,0.7)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '40px 24px',
        zIndex: 2
      }}>
        <CountrySearch />
        <h1 style={{
          background: 'linear-gradient(90deg, #ffb6ea 0%, #b6eaff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '2.5rem',
          fontWeight: 700,
          marginBottom: 32,
          letterSpacing: 1
        }}>Select a Continent</h1>
        <div style={{display:'flex', flexDirection:'column', gap: '18px', width:'100%'}}>
          {continents.map(cont => (
            <button
              key={cont.name}
              className="continent-btn"
              style={{
                width: '100%',
                padding: '18px 24px',
                fontSize: '1.1rem',
                borderRadius: '18px',
                border: '1.5px solid #b6eaff',
                background: 'rgba(44, 20, 80, 0.85)',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 16px #b6eaff33',
                minWidth: 160,
                transition: 'background 0.2s, box-shadow 0.2s',
                outline: 'none',
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(182,234,255,0.15)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(44, 20, 80, 0.85)'}
              onClick={() => navigate(`/continent/${encodeURIComponent(cont.name)}`)}
            >
              {cont.name}
            </button>
          ))}
        </div>
      </div>
      <div style={{flex: 1, position: 'relative', height: '100vh'}}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[3, 5, 7]} intensity={2.5} castShadow />
          <pointLight position={[-5, -5, -5]} intensity={0.5} />
          <pointLight position={[0, 0, 5]} intensity={0.4} />
          <InteractiveSphere />
          <OrbitControls enableZoom={true} minDistance={3} maxDistance={10} enablePan={false} />
        </Canvas>
      </div>
    </div>
  )
} 