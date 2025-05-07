import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function CountryDetail() {
  const { countryCode } = useParams();
  const [country, setCountry] = useState(null);
  const [neighbors, setNeighbors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);
    setNeighbors([]);
    fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
      .then(res => res.json())
      .then(data => {
        const c = data[0];
        setCountry(c);
        setLoading(false);
        // Fetch neighbors
        if (c.borders && c.borders.length > 0) {
          fetch(`https://restcountries.com/v3.1/alpha?codes=${c.borders.join(',')}`)
            .then(res => res.json())
            .then(neighData => setNeighbors(neighData));
        }
      })
      .catch(err => {
        setError('Failed to fetch country details');
        setLoading(false);
      });
  }, [countryCode]);

  if (loading) return <div style={{color:'#fff', padding:40}}>Loading...</div>;
  if (error) return <div style={{color:'red', padding:40}}>{error}</div>;
  if (!country) return <div style={{color:'#fff', padding:40}}>No data found.</div>;

  const {
    name,
    flags,
    maps,
    population,
    languages,
    capital,
    currencies,
    area,
    region,
    subregion,
    timezones,
    latlng,
    continents
  } = country;

  // Determine continent for navigation
  const continentName = continents && continents.length > 0 ? continents[0] : region;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      minHeight: '100vh',
      background: 'radial-gradient(circle at center, #000010 0%, #000033 100%)',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      overflow: 'auto',
      boxSizing: 'border-box',
      padding: '40px 0'
    }}>
      <div style={{position:'absolute', left: 24, top: 24, display:'flex', gap:'12px'}}>
        <button onClick={() => navigate('/')} style={{
          fontSize:16,
          padding:'8px 16px',
          borderRadius:12,
          border:'none',
          background:'linear-gradient(90deg, #ffb6ea 0%, #b6eaff 100%)',
          color:'#2d0b4e',
          fontWeight:700,
          cursor:'pointer',
          boxShadow:'0 2px 16px #ffb6ea55',
          transition:'background 0.2s, box-shadow 0.2s',
          outline:'none'
        }}>Go to Home</button>
        <button onClick={() => navigate(`/continent/${encodeURIComponent(continentName)}`)} style={{
          fontSize:16,
          padding:'8px 16px',
          borderRadius:12,
          border:'none',
          background:'linear-gradient(90deg, #ffb6ea 0%, #b6eaff 100%)',
          color:'#2d0b4e',
          fontWeight:700,
          cursor:'pointer',
          boxShadow:'0 2px 16px #ffb6ea55',
          transition:'background 0.2s, box-shadow 0.2s',
          outline:'none'
        }}>Go to Continent</button>
        <button onClick={() => navigate(-1)} style={{
          fontSize:16,
          padding:'8px 16px',
          borderRadius:12,
          border:'none',
          background:'linear-gradient(90deg, #ffb6ea 0%, #b6eaff 100%)',
          color:'#2d0b4e',
          fontWeight:700,
          cursor:'pointer',
          boxShadow:'0 2px 16px #ffb6ea55',
          transition:'background 0.2s, box-shadow 0.2s',
          outline:'none'
        }}>Back</button>
      </div>
      <h2 style={{marginTop: 0, marginBottom: 24, fontSize: '2.5rem', fontWeight: 700}}>{name.common}</h2>
      <img src={flags?.svg || flags?.png} alt={name.common + ' flag'} style={{width:120, height:80, objectFit:'cover', borderRadius:6, boxShadow:'0 2px 8px #0008', marginBottom: 24}} />
      <div style={{display:'flex', flexWrap:'wrap', gap:'32px', justifyContent:'center', alignItems:'flex-start', maxWidth:900}}>
        <div style={{minWidth:320}}>
          <table style={{width:'100%', color:'#fff', background:'rgba(0,0,0,0.2)', borderRadius:8, borderCollapse:'collapse', fontSize:'1.1rem'}}>
            <tbody>
              <tr><td style={{fontWeight:600, padding:'8px'}}>Population</td><td style={{padding:'8px'}}>{population?.toLocaleString()}</td></tr>
              <tr><td style={{fontWeight:600, padding:'8px'}}>Capital</td><td style={{padding:'8px'}}>{capital?.join(', ')}</td></tr>
              <tr><td style={{fontWeight:600, padding:'8px'}}>Region</td><td style={{padding:'8px'}}>{region}{subregion ? `, ${subregion}` : ''}</td></tr>
              <tr><td style={{fontWeight:600, padding:'8px'}}>Area</td><td style={{padding:'8px'}}>{area?.toLocaleString()} km²</td></tr>
              <tr><td style={{fontWeight:600, padding:'8px'}}>Timezones</td><td style={{padding:'8px'}}>{timezones?.join(', ')}</td></tr>
              <tr><td style={{fontWeight:600, padding:'8px'}}>Languages</td><td style={{padding:'8px'}}>{languages ? Object.values(languages).join(', ') : 'N/A'}</td></tr>
              <tr><td style={{fontWeight:600, padding:'8px'}}>Currency</td><td style={{padding:'8px'}}>{currencies ? Object.values(currencies).map(c => `${c.name} (${c.symbol})`).join(', ') : 'N/A'}</td></tr>
            </tbody>
          </table>
        </div>
        <div style={{minWidth:320}}>
          <p><strong>Map:</strong></p>
          {latlng && latlng.length === 2 && (
            <iframe
              title="map"
              width="320"
              height="200"
              style={{borderRadius:8, border:'none', boxShadow:'0 2px 8px #0008'}}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${latlng[1]-2}%2C${latlng[0]-2}%2C${latlng[1]+2}%2C${latlng[0]+2}&layer=mapnik&marker=${latlng[0]}%2C${latlng[1]}`}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          )}
          {maps?.googleMaps && (
            <div style={{marginTop:8}}>
              <a href={maps.googleMaps} target="_blank" rel="noopener noreferrer" style={{color:'#4fc3f7'}}>View on Google Maps</a>
            </div>
          )}
        </div>
      </div>
      {neighbors.length > 0 && (
        <div style={{marginTop:40, textAlign:'center'}}>
          <h3 style={{color:'#4fc3f7', marginBottom:16}}>Neighboring Countries</h3>
          <div style={{display:'flex', flexWrap:'wrap', gap:'14px', justifyContent:'center'}}>
            {neighbors.map(n => (
              <button
                key={n.cca3}
                onClick={() => navigate(`/country/${n.cca3}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  fontSize: '1rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#fff',
                  color: '#222',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px #0004',
                  minWidth: 120,
                  transition: 'background 0.2s'
                }}
              >
                <img src={n.flags?.svg || n.flags?.png} alt={n.name.common + ' flag'} style={{width:24, height:16, objectFit:'cover', borderRadius:2, boxShadow:'0 1px 4px #0002'}} />
                {n.name.common}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 