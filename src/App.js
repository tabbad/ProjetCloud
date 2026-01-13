import './App.css';
import { useState } from 'react';

function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });

  // URL de l'API - change automatiquement selon l'environnement
  const API_URL = process.env.NODE_ENV === 'production' 
    ? 'https://backend-api-349217030551.europe-west1.run.app'
    : 'http://localhost:8080';

  const callHelloRoute = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/hello`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      setMessage(data.message);
    } catch (err) {
      setError(`Erreur: ${err.message}. Note: Mixed Content Error peut nécessiter HTTPS sur le backend.`);
    } finally {
      setLoading(false);
    }
  };

  // Lire les TODOs Firestore
  const fetchTodos = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/todos`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const result = await response.json();
      setTodos(result.data || []);
    } catch (err) {
      setError(`Erreur Firestore: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un TODO
  const addTodo = async () => {
    if (!newTodo.title.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo)
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      setNewTodo({ title: '', description: '' });
      fetchTodos(); // Rafraîchir les TODOs
    } catch (err) {
      setError(`Erreur ajout: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Marquer un TODO comme terminé/non terminé
  const toggleTodo = async (id, completed) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !completed })
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      fetchTodos(); // Rafraîchir les TODOs
    } catch (err) {
      setError(`Erreur mise à jour: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  
  // Marquer un TODO comme terminé/non terminé
  const TestS3 = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/files`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      //const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      fetchTodos(); // Rafraîchir les TODOs
    } catch (err) {
      setError(`Erreur mise à jour: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };


  // Supprimer un TODO
  const deleteTodo = async (id) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      fetchTodos(); // Rafraîchir les TODOs
    } catch (err) {
      setError(`Erreur suppression: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
      <button
            onClick={() => TestS3()}
            style={{
              padding: '5px 10px',
              fontSize: '12px',
              backgroundColor:  '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >TEST</button>
        <h1>Todo App avec Firestore</h1>
        
        {/* Section Hello */}
        <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
          <h2>Test Route Hello</h2>
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
              margin: '10px'
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
              <strong>Réponse:</strong> {message}
            </div>
          )}
        </div>

        {/* Section TODO Firestore */}
        <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
          <h2>Gestionnaire de TODOs - Firestore</h2>
          
          <div style={{ margin: '10px' }}>
            <button 
              onClick={fetchTodos}
              disabled={loading}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: '#ff9800',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: loading ? 'not-allowed' : 'pointer',
                margin: '5px'
              }}
            >
              Charger les TODOs
            </button>
          </div>

          {/* Formulaire d'ajout */}
          <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
            <h3>Ajouter un TODO</h3>
            <div style={{ margin: '10px 0' }}>
              <input
                type="text"
                value={newTodo.title}
                onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
                placeholder="Titre du TODO"
                style={{
                  padding: '10px',
                  fontSize: '16px',
                  width: '300px',
                  marginRight: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc'
                }}
              />
            </div>
            <div style={{ margin: '10px 0' }}>
              <textarea
                value={newTodo.description}
                onChange={(e) => setNewTodo({...newTodo, description: e.target.value})}
                placeholder="Description (optionnelle)"
                style={{
                  padding: '10px',
                  fontSize: '16px',
                  width: '300px',
                  height: '80px',
                  marginRight: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  resize: 'vertical'
                }}
              />
            </div>
            <button 
              onClick={addTodo}
              disabled={loading || !newTodo.title.trim()}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: (loading || !newTodo.title.trim()) ? 'not-allowed' : 'pointer'
              }}
            >
              Ajouter TODO
            </button>
          </div>

          {/* Liste des TODOs */}
          {todos.length > 0 && (
            <div style={{ 
              backgroundColor: '#e3f2fd', 
              color: '#0277bd', 
              padding: '15px', 
              borderRadius: '5px',
              margin: '10px',
              textAlign: 'left'
            }}>
              <strong>TODOs ({todos.length}):</strong>
              <div style={{ marginTop: '10px' }}>
                {todos.map((todo) => (
                  <div key={todo.id} style={{ 
                    padding: '10px', 
                    margin: '5px 0', 
                    backgroundColor: todo.completed ? '#c8e6c9' : '#fff3e0',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        fontWeight: 'bold',
                        fontSize: '16px'
                      }}>
                        {todo.title}
                      </div>
                      {todo.description && (
                        <div style={{ 
                          fontSize: '14px', 
                          color: '#666', 
                          marginTop: '5px' 
                        }}>
                          {todo.description}
                        </div>
                      )}
                      <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                        Créé: {new Date(todo.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => toggleTodo(todo.id, todo.completed)}
                        style={{
                          padding: '5px 10px',
                          fontSize: '12px',
                          backgroundColor: todo.completed ? '#ff9800' : '#4caf50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer'
                        }}
                      >
                        {todo.completed ? 'Rouvrir' : 'Terminer'}
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        style={{
                          padding: '5px 10px',
                          fontSize: '12px',
                          backgroundColor: '#f44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer'
                        }}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section erreurs */}
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
