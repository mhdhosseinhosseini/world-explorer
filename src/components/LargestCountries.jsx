import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CONTINENTS = [
  'Africa',
  'Asia',
  'Europe',
  'North America',
  'South America',
  'Oceania',
  'Antarctica',
];

const REPORTS = [
  { value: 'largest-area', label: 'Largest Countries by Area' },
  { value: 'smallest-area', label: 'Smallest Countries by Area' },
  { value: 'most-pop', label: 'Most Populous Countries' },
  { value: 'least-pop', label: 'Least Populous Countries' },
];

export default function CountryStatistics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState('largest-area');
  const [count, setCount] = useState(10);
  const [continents, setContinents] = useState([...CONTINENTS]);
  const navigate = useNavigate();

  function handleContinentChange(cont, checked) {
    if (cont === 'All') {
      setContinents(checked ? [...CONTINENTS] : []);
    } else {
      setContinents(prev => {
        if (checked) return Array.from(new Set([...prev, cont]));
        return prev.filter(c => c !== cont);
      });
    }
  }

  useEffect(() => {
    setLoading(true);
    fetch('https://restcountries.com/v3.1/all')
      .then(res => res.json())
      .then(countries => {
        let filtered = countries.filter(c =>
          c.name && c.name.common &&
          ((c.continents && c.continents.some(cont => continents.includes(cont))) ||
           (c.region && continents.includes(c.region)))
        );
        let sorted;
        if (report === 'largest-area') {
          sorted = filtered.filter(c => c.area)
            .sort((a, b) => b.area - a.area).slice(0, count);
          setData({
            labels: sorted.map(c => c.name.common),
            datasets: [{
              label: 'Area (km²)',
              data: sorted.map(c => c.area),
              backgroundColor: 'rgba(79, 195, 247, 0.7)',
              borderColor: '#b6eaff',
              borderWidth: 2,
              borderRadius: 8,
            }]
          });
        } else if (report === 'smallest-area') {
          sorted = filtered.filter(c => c.area)
            .sort((a, b) => a.area - b.area).slice(0, count);
          setData({
            labels: sorted.map(c => c.name.common),
            datasets: [{
              label: 'Area (km²)',
              data: sorted.map(c => c.area),
              backgroundColor: 'rgba(255,182,234,0.7)',
              borderColor: '#ffb6ea',
              borderWidth: 2,
              borderRadius: 8,
            }]
          });
        } else if (report === 'most-pop') {
          sorted = filtered.filter(c => c.population)
            .sort((a, b) => b.population - a.population).slice(0, count);
          setData({
            labels: sorted.map(c => c.name.common),
            datasets: [{
              label: 'Population',
              data: sorted.map(c => c.population),
              backgroundColor: 'rgba(182,234,255,0.7)',
              borderColor: '#b6eaff',
              borderWidth: 2,
              borderRadius: 8,
            }]
          });
        } else if (report === 'least-pop') {
          sorted = filtered.filter(c => c.population)
            .sort((a, b) => a.population - b.population).slice(0, count);
          setData({
            labels: sorted.map(c => c.name.common),
            datasets: [{
              label: 'Population',
              data: sorted.map(c => c.population),
              backgroundColor: 'rgba(255,182,234,0.7)',
              borderColor: '#ffb6ea',
              borderWidth: 2,
              borderRadius: 8,
            }]
          });
        }
        setLoading(false);
      });
  }, [report, count, continents]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2d0b4e 0%, #1a1446 100%)',
      color: '#fff',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      padding: 0,
      margin: 0,
      boxSizing: 'border-box',
    }}>
      <div style={{
        minWidth: 200,
        maxWidth: 220,
        background: 'rgba(10,20,40,0.7)',
        padding: '40px 18px',
        margin: '40px 0 0 24px',
        borderRadius: 18,
        boxShadow: '0 2px 16px #b6eaff33',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        alignItems: 'flex-start',
        zIndex: 2
      }}>
        <div style={{fontWeight:700, fontSize:18, marginBottom:8, color:'#b6eaff'}}>Continents</div>
        <label style={{display:'flex', alignItems:'center', gap:8, fontWeight:600, color:'#fff'}}>
          <input type="checkbox" checked={continents.length === CONTINENTS.length} onChange={e => handleContinentChange('All', e.target.checked)} /> All
        </label>
        {CONTINENTS.map(cont => (
          <label key={cont} style={{display:'flex', alignItems:'center', gap:8, fontWeight:600, color:'#fff'}}>
            <input
              type="checkbox"
              checked={continents.includes(cont)}
              onChange={e => handleContinentChange(cont, e.target.checked)}
            />
            {cont}
          </label>
        ))}
      </div>
      <div style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-start', position:'relative'}}>
        <div style={{position:'absolute', left: 0, top: 24, right: 0, display:'flex', gap: '12px', alignItems:'center', justifyContent:'center'}}>
          <button onClick={() => navigate('/')} style={{fontSize:16, padding:'8px 16px', borderRadius:12, border:'none', background:'linear-gradient(90deg, #ffb6ea 0%, #b6eaff 100%)', color:'#2d0b4e', fontWeight:700, cursor:'pointer', boxShadow:'0 2px 16px #ffb6ea55'}}>Go to Home</button>
          <select value={report} onChange={e => setReport(e.target.value)} style={{
            fontSize:16,
            padding:'8px 16px',
            borderRadius:12,
            border:'none',
            background:'linear-gradient(90deg, #b6eaff 0%, #ffb6ea 100%)',
            color:'#2d0b4e',
            fontWeight:700,
            cursor:'pointer',
            boxShadow:'0 2px 16px #b6eaff55',
            outline:'none',
          }}>
            {REPORTS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          <input
            type="number"
            min={2}
            max={20}
            value={count}
            onChange={e => setCount(Math.max(2, Math.min(20, Number(e.target.value))))}
            style={{
              width: 60,
              fontSize: 16,
              padding: '8px 8px',
              borderRadius: 12,
              border: '1.5px solid #b6eaff',
              background: 'rgba(44, 20, 80, 0.85)',
              color: '#fff',
              fontWeight: 700,
              marginLeft: 8,
              outline: 'none',
              textAlign: 'center',
            }}
          />
        </div>
        <h2 style={{
          background: 'linear-gradient(90deg, #ffb6ea 0%, #b6eaff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginTop: 100,
          marginBottom: 32,
          fontSize: '2.5rem',
          fontWeight: 700,
          letterSpacing: 1,
          textAlign: 'center',
        }}>Country Statistics: {REPORTS.find(r => r.value === report)?.label} ({count})</h2>
        {loading && <p>Loading...</p>}
        {data && (
          <div style={{width: '100%', maxWidth: 800, background:'rgba(44,20,80,0.85)', borderRadius: 18, boxShadow:'0 2px 16px #b6eaff33', padding: 24}}>
            <Bar
              data={data}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  title: { display: false },
                  tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()}${report.includes('area') ? ' km²' : ''}` } }
                },
                scales: {
                  x: {
                    ticks: { color: '#b6eaff', font: { weight: 600 } },
                    grid: { color: '#b6eaff22' }
                  },
                  y: {
                    ticks: { color: '#b6eaff', font: { weight: 600 } },
                    grid: { color: '#b6eaff22' }
                  }
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
} 