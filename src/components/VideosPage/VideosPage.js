import React, { useState, useEffect } from 'react';
import './VideosPage.css';

const VideosPage = () => {
  const [allFavorites, setAllFavorites] = useState([]);

  useEffect(() => {
    // Load favorites data from localStorage and flatten into single array
    const loadFavoritesData = () => {
      try {
        const storedData = localStorage.getItem('favorites');
        if (storedData) {
          const favoritesData = JSON.parse(storedData);
          const flattened = [];
          
          // Flatten all favorites from all stars into one array
          Object.entries(favoritesData).forEach(([starName, favorites]) => {
            favorites.forEach(favorite => {
              flattened.push({
                ...favorite,
                starName: starName
              });
            });
          });
          
          setAllFavorites(flattened);
        }
      } catch (error) {
        console.error('Error loading favorites data:', error);
      }
    };

    loadFavoritesData();
  }, []);

  return (
    <div className="videos-page">
      {allFavorites.length === 0 ? (
        <p className="no-data">No videos found</p>
      ) : (
        <div className="videos-grid">
          {allFavorites.map((favorite) => (
            <div key={`${favorite.starName}-${favorite.id}`} className="video-card">
              <div className="card-image">
                <img 
                  src={favorite.imageUrl} 
                  alt={favorite.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                  }}
                />
              </div>
              <div className="card-content">
                <h3 className="video-name">{favorite.name}</h3>
                <p className="star-name">{favorite.starName.charAt(0).toUpperCase() + favorite.starName.slice(1)}</p>
                {favorite.url && (
                  <a 
                    href={favorite.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="video-link"
                  >
                    View Original
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideosPage;
