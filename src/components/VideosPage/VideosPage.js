import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './VideosPage.css';

const VideosPage = () => {
  const [allFavorites, setAllFavorites] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    const loadData = () => {
      try {
        const [storedFavorites, storedTags] = [
          localStorage.getItem('favorites'),
          localStorage.getItem('tags')
        ];
        
        if (storedFavorites) {
          const favoritesData = JSON.parse(storedFavorites);
          const flattened = Object.entries(favoritesData).flatMap(([starName, favorites]) =>
            favorites.map(favorite => ({ ...favorite, starName }))
          );
          setAllFavorites(flattened);
        }
        
        if (storedTags) {
          const tags = JSON.parse(storedTags);
          if (Array.isArray(tags)) {
            setAvailableTags(tags.sort());
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const filteredFavorites = useMemo(() => {
    if (!selectedTag) return allFavorites;
    return allFavorites.filter(favorite => 
      favorite.tags?.includes(selectedTag)
    );
  }, [selectedTag, allFavorites]);

  const handleTagChange = useCallback((e) => {
    setSelectedTag(e.target.value);
  }, []);

  const handleTagClick = useCallback((tag) => {
    setSelectedTag(tag);
  }, []);

  const handleImageError = useCallback((e) => {
    e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
  }, []);

  return (
    <div className="videos-page">
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
      </div>

      {filteredFavorites.length === 0 ? (
        <p className="no-data">
          {selectedTag ? `No videos found for category "${selectedTag}"` : 'No videos found'}
        </p>
      ) : (
        <div className="videos-grid">
          {filteredFavorites.map((favorite) => (
            <VideoCard
              key={`${favorite.starName}-${favorite.id}`}
              favorite={favorite}
              selectedTag={selectedTag}
              onTagClick={handleTagClick}
              onImageError={handleImageError}
              starName={favorite.starName}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const VideoCard = React.memo(({ favorite, selectedTag, onTagClick, onImageError, starName }) => (
  <div className="video-card">
    <div className="card-image">
      <img 
        src={favorite.imageUrl} 
        alt={favorite.name}
        onError={onImageError}
        loading="lazy"
        onClick={() => window.open(favorite.url, '_blank')}
      />
    </div>
    <div className="card-content">
      <h3 className="video-name">{favorite.name}</h3>
      <a className="star-name" href={`#/star/${encodeURIComponent(favorite.starName)}`}>{favorite.starName.charAt(0).toUpperCase() + favorite.starName.slice(1)}</a>
      
      {favorite.tags?.length > 0 && (
        <div className="video-tags-container">
          <div className="video-tags">
            {favorite.tags.map((tag, index) => (
              <span 
                key={index} 
                className={`video-tag ${selectedTag === tag ? 'highlighted' : ''}`}
                onClick={() => onTagClick(tag)}
                title="Click to filter by this tag"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
));

VideoCard.displayName = 'VideoCard';

export default VideosPage;