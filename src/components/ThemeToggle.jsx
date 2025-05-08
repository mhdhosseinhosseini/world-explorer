import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: 'relative',
        width: '60px',
        height: '30px',
        borderRadius: '15px',
        background: isDarkMode ? '#2d0b4e' : '#e6e6ff',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        transition: 'background 0.3s ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: isDarkMode ? '32px' : '2px',
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          background: isDarkMode ? '#b6eaff' : '#ffb6ea',
          transition: 'left 0.3s ease, background 0.3s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
      />
      <span style={{ position: 'absolute', left: '8px', color: isDarkMode ? '#b6eaff' : '#2d0b4e' }}>☀️</span>
      <span style={{ position: 'absolute', right: '8px', color: isDarkMode ? '#2d0b4e' : '#b6eaff' }}>🌙</span>
    </button>
  );
} 