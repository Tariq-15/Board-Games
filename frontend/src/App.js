import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GameDetail from './pages/GameDetail';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="container">
            <h1>Board Game Marketplace</h1>
            <p>Discover and explore amazing board games</p>
          </div>
        </header>
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game/:id" element={<GameDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        <footer className="App-footer">
          <div className="container">
            <p>&copy; 2024 Board Game Marketplace. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App; 