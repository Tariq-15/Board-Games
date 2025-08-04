import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import gameService from '../services/gameService';
import './GameDetail.css';

const GameDetail = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadGame();
  }, [id]);

  const loadGame = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await gameService.getGameById(id);
      setGame(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPlayTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} hours ${mins} minutes` : `${hours} hours`;
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading game details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <h3>Error loading game</h3>
          <p>{error}</p>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="container">
        <div className="no-game">
          <h3>Game not found</h3>
          <p>The game you're looking for doesn't exist.</p>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="game-detail">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span> / </span>
          <span>{game.name}</span>
        </div>

        <div className="game-detail-content">
          <div className="game-images">
            {game.images && game.images.length > 0 ? (
              <div className="main-image">
                <img 
                  src={game.images[0]} 
                  alt={game.name}
                />
              </div>
            ) : (
              <div className="main-image placeholder">
                <span>No Image Available</span>
              </div>
            )}
          </div>

          <div className="game-info">
            <h1 className="game-title">{game.name}</h1>
            
            <div className="game-meta">
              <span className="category">{game.category}</span>
              <span className="difficulty">{game.difficulty}</span>
            </div>

            <div className="game-stats">
              <div className="stat">
                <span className="stat-label">Players:</span>
                <span className="stat-value">{game.playerRange}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Play Time:</span>
                <span className="stat-value">{formatPlayTime(game.averagePlayTime)}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Age Range:</span>
                <span className="stat-value">{game.ageRangeText}</span>
              </div>
            </div>

            <div className="game-description">
              <h3>Description</h3>
              <p>{game.description}</p>
            </div>

            {game.components && game.components.length > 0 && (
              <div className="game-components">
                <h3>What's in the Box</h3>
                <div className="components-list">
                  {game.components.map((component, index) => (
                    <div key={index} className="component">
                      <span className="component-name">{component.name}</span>
                      <span className="component-quantity">x{component.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail; 