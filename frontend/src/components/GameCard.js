import React from 'react';
import { Link } from 'react-router-dom';
import './GameCard.css';

const GameCard = ({ game }) => {
  const formatPlayTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star">☆</span>);
    }

    return stars;
  };

  return (
    <Link to={`/game/${game._id}`} className="game-card-link">
      <div className="game-card">
        <div className="game-image">
          {game.images && game.images.length > 0 ? (
            <img 
              src={game.images[0]} 
              alt={game.name}
              onError={(e) => {
                e.target.src = '/placeholder-game.jpg';
              }}
            />
          ) : (
            <div className="placeholder-image">
              <span>No Image</span>
            </div>
          )}
          <div className="game-overlay">
            <span className="view-details">View Details</span>
          </div>
        </div>
        
        <div className="game-info">
          <h3 className="game-title">{game.name}</h3>
          
          <div className="game-meta">
            <span className="game-category">{game.category}</span>
            <span className="game-players">{game.playerRange}</span>
          </div>
          
          <div className="game-details">
            <span className="play-time">
              ⏱️ {formatPlayTime(game.averagePlayTime)}
            </span>
            <span className="difficulty">
              🎯 {game.difficulty}
            </span>
          </div>
          
          {game.averageRating > 0 && (
            <div className="game-rating">
              <div className="stars">
                {getRatingStars(game.averageRating)}
              </div>
              <span className="rating-text">
                {game.averageRating.toFixed(1)} ({game.totalRatings})
              </span>
            </div>
          )}
          
          {game.price && (
            <div className="game-price">
              ${game.price}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default GameCard; 