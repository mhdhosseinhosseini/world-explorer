import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ThemeToggle from './ThemeToggle'

export default function Continent() {
  const { continentName } = useParams();
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('https://restcountries.com/v3.1/all')
      .then(res => res.json())
      .then(data => {
        // Filter countries by continent (region or subregion)
        let filtered = data.filter(
          c => c.region === continentName || c.continents?.includes(continentName)
        );
        // Sort alphabetically by name
        filtered = filtered.sort((a, b) => a.name.common.localeCompare(b.name.common));
        setCountries(filtered);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch countries');
        setLoading(false);
      });
  }, [continentName]);

  return (
    <div className="continent-container" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      minHeight: '100vh',
      background: 'var(--gradient-primary)',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      overflow: 'auto',
      boxSizing: 'border-box'
    }}>
      <div style={{position:'absolute', left: 24, top: 24, display:'flex', gap:'12px'}}>
        <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
          <ThemeToggle />
          <span style={{color:'var(--text-primary)', fontWeight:600}}>Theme</span>
        </div>
        <button onClick={() => navigate('/')} style={{
          fontSize:16,
          padding:'8px 16px',
          borderRadius:12,
          border:'none',
          background:'var(--gradient-accent)',
          color:'#2d0b4e',
          fontWeight:700,
          cursor:'pointer',
          boxShadow:'0 2px 16px #ffb6ea55'
        }}>Go to Home</button>
      </div>
      <h2 style={{
        color:'var(--text-primary)',
        background: 'var(--gradient-accent)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        margin:'32px 0 24px 0',
        padding:0,
        fontSize: '2.5rem',
        fontWeight: 700,
        letterSpacing: 1
      }}>Countries in {continentName}</h2>
      {loading && <p style={{color:'var(--text-primary)'}}>Loading...</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '14px',
        justifyContent: 'center',
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%',
        padding: '0 12px',
      }}>
        {countries.map(country => (
          <button
            key={country.cca3}
            onClick={() => navigate(`/country/${country.cca3}`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '18px 24px',
              fontSize: '1.1rem',
              borderRadius: '18px',
              border: '1.5px solid var(--accent-primary)',
              background: 'var(--card-bg)',
              color: 'var(--text-primary)',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 16px var(--accent-primary)33',
              minWidth: 160,
              transition: 'background 0.2s, box-shadow 0.2s',
              outline: 'none',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'var(--button-hover)'}
            onMouseOut={e => e.currentTarget.style.background = 'var(--card-bg)'}
          >
            <img src={country.flags?.svg || country.flags?.png} alt={country.name.common + ' flag'} style={{width:32, height:20, objectFit:'cover', borderRadius:4, boxShadow:'0 1px 4px #0004'}} />
            {country.name.common}
          </button>
        ))}
      </div>
    </div>
  )
} 