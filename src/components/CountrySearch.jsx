import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CountrySearch() {
  const [query, setQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef();

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then(res => res.json())
      .then(data => {
        // Sort countries by name
        const sorted = data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        setCountries(sorted);
      });
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      const q = query.toLowerCase();
      setFiltered(
        countries.filter(c => c.name.common.toLowerCase().includes(q)).slice(0, 8)
      );
      setShowDropdown(true);
    } else {
      setFiltered([]);
      setShowDropdown(false);
    }
  }, [query, countries]);

  function handleSelect(country) {
    setQuery('');
    setShowDropdown(false);
    navigate(`/country/${country.cca3}`);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (filtered.length > 0) {
      handleSelect(filtered[0]);
    }
  }

  return (
    <div style={{width:'100%', marginBottom: 32, position:'relative'}}>
      <form onSubmit={handleSubmit} autoComplete="off">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for a country..."
          style={{
            width: '100%',
            padding: '14px 18px',
            borderRadius: 14,
            border: '1.5px solid #b6eaff',
            fontSize: '1.1rem',
            outline: 'none',
            background: 'rgba(44, 20, 80, 0.85)',
            color: '#fff',
            boxShadow: '0 2px 16px #b6eaff33',
            marginBottom: 0
          }}
          onFocus={() => { if (filtered.length > 0) setShowDropdown(true); }}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        />
        <button type="submit" style={{
          position: 'absolute',
          right: 10,
          top: 10,
          padding: '8px 16px',
          borderRadius: 10,
          border: 'none',
          background: 'linear-gradient(90deg, #ffb6ea 0%, #b6eaff 100%)',
          color: '#2d0b4e',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 2px 16px #ffb6ea55',
          fontSize: '1rem',
        }}>Search</button>
      </form>
      {showDropdown && filtered.length > 0 && (
        <div style={{
          position: 'absolute',
          top: 54,
          left: 0,
          width: '100%',
          background: 'rgba(44, 20, 80, 0.98)',
          borderRadius: 12,
          boxShadow: '0 2px 16px #b6eaff33',
          zIndex: 10,
          maxHeight: 320,
          overflowY: 'auto',
        }}>
          {filtered.map(country => (
            <div
              key={country.cca3}
              onMouseDown={() => handleSelect(country)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 18px',
                cursor: 'pointer',
                color: '#fff',
                fontWeight: 500,
                fontSize: '1.05rem',
                borderBottom: '1px solid #b6eaff22',
                background: 'none',
                transition: 'background 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(182,234,255,0.10)'}
              onMouseOut={e => e.currentTarget.style.background = 'none'}
            >
              <img src={country.flags?.svg || country.flags?.png} alt={country.name.common + ' flag'} style={{width:28, height:18, objectFit:'cover', borderRadius:3, boxShadow:'0 1px 4px #0002'}} />
              {country.name.common}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 