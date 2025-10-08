import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const callHelloRoute = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/hello');
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      setMessage(data.message);
    } catch (err) {
      setError(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Test de l'API Backend</h1>
        
        <button 
          onClick={callHelloRoute}
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#61dafb',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            margin: '20px'
          }}
        >
          {loading ? 'Chargement...' : 'Appeler /hello'}
        </button>

        {message && (
          <div style={{ 
            backgroundColor: '#d4edda', 
            color: '#155724', 
            padding: '10px', 
            borderRadius: '5px',
            margin: '10px'
          }}>
            <strong>Réponse du serveur:</strong> {message}
          </div>
        )}

        {error && (
          <div style={{ 
            backgroundColor: '#f8d7da', 
            color: '#721c24', 
            padding: '10px', 
            borderRadius: '5px',
            margin: '10px'
          }}>
            {error}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
