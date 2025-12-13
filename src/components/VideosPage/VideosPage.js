import React, { useState, useEffect } from 'react';
import './VideosPage.css';

const VideosPage = () => {
  const [allFavorites, setAllFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    // Load favorites data from localStorage and flatten into single array
    const loadFavoritesData = () => {
      try {
        const storedData = localStorage.getItem('favorites');
        if (storedData) {
          const favoritesData = JSON.parse(storedData);
          const flattened = [];
          const tagsSet = new Set();
          
          // Flatten all favorites from all stars into one array
          Object.entries(favoritesData).forEach(([starName, favorites]) => {
            favorites.forEach(favorite => {
              const favWithStar = {
                ...favorite,
                starName: starName
              };
              flattened.push(favWithStar);
              
              // Collect all unique tags
              if (favorite.tags && Array.isArray(favorite.tags)) {
                favorite.tags.forEach(tag => tagsSet.add(tag));
              }
            });
          });
          
          setAllFavorites(flattened);
          setFilteredFavorites(flattened);
          setAvailableTags([...tagsSet].sort());
        }
      } catch (error) {
        console.error('Error loading favorites data:', error);
      }
    };

    loadFavoritesData();
  }, []);

  // Filter favorites based on selected tag
  useEffect(() => {
    if (!selectedTag) {
      setFilteredFavorites(allFavorites);
    } else {
      const filtered = allFavorites.filter(favorite => 
        favorite.tags && favorite.tags.includes(selectedTag)
      );
      setFilteredFavorites(filtered);
    }
  }, [selectedTag, allFavorites]);

  const handleTagChange = (e) => {
    setSelectedTag(e.target.value);
  };

  return (
    <div className="videos-page">
      {/* Tag Filter Section */}
      <div className="filter-section">
        <label htmlFor="tag-filter" className="filter-label">
          Filter by Category:
        </label>
        <select 
          id="tag-filter" 
          value={selectedTag} 
          onChange={handleTagChange}
          className="tag-filter-select"
        >
          <option value="">All Categories</option>
          {availableTags.map(tag => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <span className="results-count">
          {filteredFavorites.length} video{filteredFavorites.length !== 1 ? 's' : ''} found
        </span>
      </div>

      {filteredFavorites.length === 0 ? (
        <p className="no-data">
          {selectedTag ? `No videos found for category "${selectedTag}"` : 'No videos found'}
        </p>
      ) : (
        <div className="videos-grid">
          {filteredFavorites.map((favorite) => (
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
                
                {/* Display tags */}
                {favorite.tags && favorite.tags.length > 0 && (
                  <div className="video-tags">
                    {favorite.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className={`video-tag ${selectedTag === tag ? 'highlighted' : ''}`}
                        onClick={() => setSelectedTag(tag)}
                        title="Click to filter by this tag"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
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
