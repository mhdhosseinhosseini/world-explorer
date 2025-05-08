import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useNavigate } from 'react-router-dom';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, ChartDataLabels);

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
  { value: 'most-density', label: 'Most Densely Populated Countries' },
  { value: 'least-density', label: 'Least Densely Populated Countries' },
  { value: 'pop-by-continent', label: 'Population Distribution by Continent' },
  { value: 'countries-by-continent', label: 'Number of Countries per Continent' },
];

export default function CountryStatistics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState('largest-area');
  const [count, setCount] = useState(10);
  const [continents, setContinents] = useState([...CONTINENTS]);
  const [totalCountries, setTotalCountries] = useState(null);
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
        } else if (report === 'most-density') {
          sorted = filtered.filter(c => c.population && c.area && c.area > 0)
            .map(c => ({ ...c, density: c.population / c.area }))
            .sort((a, b) => b.density - a.density).slice(0, count);
          setData({
            labels: sorted.map(c => c.name.common),
            datasets: [{
              label: 'Population Density (per km²)',
              data: sorted.map(c => c.density),
              backgroundColor: 'rgba(255, 255, 182, 0.7)',
              borderColor: '#fffeb6',
              borderWidth: 2,
              borderRadius: 8,
            }]
          });
        } else if (report === 'least-density') {
          sorted = filtered.filter(c => c.population && c.area && c.area > 0)
            .map(c => ({ ...c, density: c.population / c.area }))
            .sort((a, b) => a.density - b.density).slice(0, count);
          setData({
            labels: sorted.map(c => c.name.common),
            datasets: [{
              label: 'Population Density (per km²)',
              data: sorted.map(c => c.density),
              backgroundColor: 'rgba(182,255,255,0.7)',
              borderColor: '#b6ffff',
              borderWidth: 2,
              borderRadius: 8,
            }]
          });
        } else if (report === 'pop-by-continent') {
          if (continents.length !== CONTINENTS.length) setContinents([...CONTINENTS]);
          const popByCont = {};
          CONTINENTS.forEach(cont => popByCont[cont] = 0);
          countries.forEach(c => {
            if (c.population && c.continents) {
              c.continents.forEach(cont => {
                if (CONTINENTS.includes(cont)) popByCont[cont] += c.population;
              });
            }
          });
          const labels = CONTINENTS;
          const dataArr = CONTINENTS.map(cont => popByCont[cont]);
          setData({
            labels,
            datasets: [{
              label: 'Population',
              data: dataArr,
              backgroundColor: [
                'rgba(182,234,255,0.7)', // blue
                'rgba(255,182,234,0.7)', // pink
                'rgba(255,255,182,0.7)', // yellow
                'rgba(182,255,255,0.7)', // cyan
                'rgba(200,182,255,0.7)', // purple
                'rgba(182,255,200,0.7)', // green
                'rgba(255,210,182,0.7)', // orange
              ],
              borderColor: '#fff',
              borderWidth: 2,
            }]
          });
        } else if (report === 'countries-by-continent') {
          if (continents.length !== CONTINENTS.length) setContinents([...CONTINENTS]);
          const countByCont = {};
          CONTINENTS.forEach(cont => countByCont[cont] = 0);
          countries.forEach(c => {
            if (c.continents) {
              c.continents.forEach(cont => {
                if (CONTINENTS.includes(cont)) countByCont[cont] += 1;
              });
            }
          });
          const labels = CONTINENTS;
          const dataArr = CONTINENTS.map(cont => countByCont[cont]);
          setData({
            labels,
            datasets: [{
              label: 'Number of Countries',
              data: dataArr,
              backgroundColor: [
                'rgba(182,234,255,0.7)', // blue
                'rgba(255,182,234,0.7)', // pink
                'rgba(255,255,182,0.7)', // yellow
                'rgba(182,255,255,0.7)', // cyan
                'rgba(200,182,255,0.7)', // purple
                'rgba(182,255,200,0.7)', // green
                'rgba(255,210,182,0.7)', // orange
              ],
              borderColor: '#fff',
              borderWidth: 2,
            }]
          });
          setTotalCountries(countries.length);
        } else {
          setTotalCountries(null);
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
        minWidth: 260,
        maxWidth: 280,
        background: 'rgba(10,20,40,0.7)',
        padding: '32px 18px 24px 18px',
        margin: '40px 0 0 24px',
        borderRadius: 18,
        boxShadow: '0 2px 16px #b6eaff33',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        alignItems: 'flex-start',
        zIndex: 2
      }}>
        <button onClick={() => navigate('/')} style={{
          fontSize:16,
          padding:'10px 18px',
          borderRadius:12,
          border:'none',
          background:'linear-gradient(90deg, #ffb6ea 0%, #b6eaff 100%)',
          color:'#2d0b4e',
          fontWeight:700,
          cursor:'pointer',
          boxShadow:'0 2px 16px #ffb6ea55',
          marginBottom: 12,
          width: '100%'
        }}>Go to Home</button>
        <div style={{fontWeight:700, fontSize:18, marginBottom:8, color:'#b6eaff'}}>Continents</div>
        <label style={{display:'flex', alignItems:'center', gap:8, fontWeight:600, color:'#fff'}}>
          <input type="checkbox" checked={continents.length === CONTINENTS.length} onChange={e => handleContinentChange('All', e.target.checked)} disabled={report === 'pop-by-continent'} /> All
        </label>
        {CONTINENTS.map(cont => (
          <label key={cont} style={{display:'flex', alignItems:'center', gap:8, fontWeight:600, color:'#fff'}}>
            <input
              type="checkbox"
              checked={continents.includes(cont)}
              onChange={e => handleContinentChange(cont, e.target.checked)}
              disabled={report === 'pop-by-continent'}
            />
            {cont}
          </label>
        ))}
        <div style={{marginTop: 18, width: '100%'}}>
          <select value={report} onChange={e => setReport(e.target.value)} style={{
            width: '100%',
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
            marginBottom: 12
          }}>
            {REPORTS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, width: '100%'}}>
            <label style={{color: '#fff', fontWeight: 600}}>Count:</label>
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
                outline: 'none',
                textAlign: 'center',
              }}
              disabled={report === 'pop-by-continent'}
            />
          </div>
        </div>
      </div>
      <div style={{
        flex: 1,
        marginLeft: 320,
        padding: '24px 24px 24px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start'
      }}>
        <h2 style={{
          background: 'linear-gradient(90deg, #ffb6ea 0%, #b6eaff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 32,
          fontSize: '2.5rem',
          fontWeight: 700,
          letterSpacing: 1,
          textAlign: 'center',
        }}>Country Statistics: {REPORTS.find(r => r.value === report)?.label} {report === 'countries-by-continent' && totalCountries !== null ? ` (Total: ${totalCountries})` : report !== 'pop-by-continent' ? ` (${count})` : ''}</h2>
        {loading && <p>Loading...</p>}
        {data && (
          report === 'pop-by-continent' ? (
            <div style={{width: '100%', maxWidth: 600, background:'rgba(44,20,80,0.85)', borderRadius: 18, boxShadow:'0 2px 16px #b6eaff33', padding: 24}}>
              <Pie
                data={data}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: true, labels: { color: '#b6eaff', font: { weight: 600 } } },
                    title: { display: false },
                    tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.parsed.toLocaleString()}` } },
                    datalabels: { display: false },
                  },
                }}
              />
            </div>
          ) : report === 'countries-by-continent' ? (
            <div style={{width: '100%', maxWidth: 600, background:'rgba(44,20,80,0.85)', borderRadius: 18, boxShadow:'0 2px 16px #b6eaff33', padding: 24}}>
              <Pie
                data={data}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: true, labels: { color: '#b6eaff', font: { weight: 600 } } },
                    title: { display: false },
                    tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.parsed.toLocaleString()}` } },
                    datalabels: {
                      color: '#fff',
                      font: { weight: 'bold', size: 28 },
                      formatter: (value) => value,
                    },
                  },
                }}
                plugins={[ChartDataLabels]}
              />
            </div>
          ) : (
            <div style={{width: '100%', maxWidth: 800, background:'rgba(44,20,80,0.85)', borderRadius: 18, boxShadow:'0 2px 16px #b6eaff33', padding: 24}}>
              <Bar
                data={data}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    title: { display: false },
                    tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()}${report.includes('area') ? ' km²' : report.includes('density') ? ' per km²' : ''}` } },
                    datalabels: { display: false },
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
          )
        )}
      </div>
    </div>
  );
} 