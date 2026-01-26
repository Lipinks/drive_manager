import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import './VideosPage.css';
import EditVidDialog from './EditVidDialog/EditVidDialog';

const VideosPage = ({starName}) => {

  const [videos, setVideos] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [editingVideo, setEditingVideo] = useState(null);
  const [showEditVidModal, setShowEditVidModal] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showOrderDropdown, setShowOrderDropdown] = useState(false);
  const [selectedSort, setSelectedSort] = useState('');
  const [selectedOrder, setSelectedOrder] = useState('new');
  const filterRef = useRef(null);
  const sortRef = useRef(null);
  const orderRef = useRef(null);

  // Shuffle array function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const loadData = () => {
      var [storedVideos, storedTags] = [
        localStorage.getItem('favorites'),
        localStorage.getItem('tags')
      ];
      
      if (storedVideos) {
        var videosData = JSON.parse(storedVideos);
        var flattened = [];
        if(starName===''){
          flattened = Object.entries(videosData).flatMap(([starName, favorites]) =>
            favorites.map(favorite => ({ ...favorite, starName }))
          );
        }
        else{
          var starNameLowerCase = starName.toLowerCase();
          flattened = (videosData[starNameLowerCase] || []).map(favorite => ({ ...favorite, starName: starNameLowerCase }));
        }
        // Shuffle videos on load
        setVideos(flattened);
      }
      
      if (storedTags) {
        var tags = JSON.parse(storedTags);
        if (Array.isArray(tags)) {
          setAvailableTags(tags.sort());
        }
      }
    };
    loadData();
  }, [starName]);

  const handleShuffle = () => {
    setVideos(shuffleArray(videos));
  };

  // Filter and sort videos based on selected tag and sort option.
  var filteredFavorites = useMemo(() => {
    let result = videos;
    
    // Apply tag filter
    if (selectedTag) {
      result = result.filter(favorite => 
        favorite.tags?.includes(selectedTag)
      );
    }
    
    // Apply sorting
    if (selectedSort) {
      result = [...result].sort((a, b) => {
        const dateA = new Date(selectedSort === 'creation' ? a.creation : a.modification) || 0;
        const dateB = new Date(selectedSort === 'creation' ? b.creation : b.modification) || 0;
        return selectedOrder === 'new' ? dateB - dateA : dateA - dateB;
      });
    }
    
    return result;
  }, [selectedTag, selectedSort, selectedOrder, videos]);

  var handleTagClick = useCallback((tag) => {
    setSelectedTag(tag);
  }, []);

  var handleImageError = useCallback((e) => {
    
  }, []);

  var handleEditVideo = (favId, updatedData, videoStarName) => {
    
    var updatedVideos = videos.map(fav => 
      fav.id === favId ? { ...fav, ...updatedData } : fav
    );
    setVideos(updatedVideos);
    
    // Get the current favorites from localStorage
    var currentFavs = JSON.parse(localStorage.getItem('favorites') || '{}');
    
    // Get only the videos for this specific star and update the matching one
    var starFavorites = currentFavs[videoStarName.toLowerCase()] || [];
    var updatedStarFavorites = starFavorites.map(fav => 
      fav.id === favId ? { ...fav, ...updatedData } : fav
    );
    
    // Save only the updated star's favorites back
    currentFavs[videoStarName.toLowerCase()] = updatedStarFavorites;
    localStorage.setItem('favorites', JSON.stringify(currentFavs));
    
    setEditingVideo(null);
    setShowEditVidModal(false);
  };

  var handleDeleteFavorite = (id, videoStarName) => {
    if (window.confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      // Update the videos state (flattened array) for UI
      var updatedVideos = videos.filter(fav => fav.id !== id);
      setVideos(updatedVideos);
      
      // Get the current favorites from localStorage
      var currentFavs = JSON.parse(localStorage.getItem('favorites') || '{}');
      
      // Get only the videos for this specific star and remove the matching one
      var starFavorites = currentFavs[videoStarName.toLowerCase()] || [];
      var updatedStarFavorites = starFavorites.filter(fav => fav.id !== id);
      
      // Save only the updated star's favorites back
      currentFavs[videoStarName.toLowerCase()] = updatedStarFavorites;
      localStorage.setItem('favorites', JSON.stringify(currentFavs));
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
      if (orderRef.current && !orderRef.current.contains(event.target)) {
        setShowOrderDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  var handleFilterSelect = useCallback((tag) => {
    setSelectedTag(tag);
    setShowFilterDropdown(false);
  }, []);

  var handleSortSelect = useCallback((sortOption) => {
    setSelectedSort(sortOption);
    setShowSortDropdown(false);
  }, []);

  var handleOrderSelect = useCallback((orderOption) => {
    setSelectedOrder(orderOption);
    setShowOrderDropdown(false);
  }, []);

  const sortOptions = [
    { value: 'creation', label: 'Creation Time' },
    { value: 'modification', label: 'Modified Time' }
  ];

  const orderOptions = [
    { value: 'new', label: 'Newest First' },
    { value: 'old', label: 'Oldest First' }
  ];

  return (
    <div className={`videos-page ${starName === '' ? 'with-header-padding' : ''}`}>
      <div className="filter-section" ref={filterRef}>
        <div className='filter-section-middle'>
          <label className="filter-label">
            Filter by Category:
          </label>
          <div className="custom-filter-dropdown">
            <button 
              className="filter-dropdown-trigger"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <span className={selectedTag ? 'selected-value' : 'placeholder-value'}>
                {selectedTag || 'All Categories'}
              </span>
              <svg 
                className={`dropdown-arrow ${showFilterDropdown ? 'open' : ''}`} 
                width="12" 
                height="12" 
                viewBox="0 0 12 12"
              >
                <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            
            {showFilterDropdown && (
              <div className="filter-dropdown-menu">
                <div 
                  className={`filter-option all-option ${!selectedTag ? 'active' : ''}`}
                  onClick={() => handleFilterSelect('')}
                >
                  All Categories
                </div>
                <div className="filter-options-grid">
                  {availableTags.map((tag, index) => (
                    <div
                      key={tag}
                      className={`filter-option-tag ${selectedTag === tag ? 'active' : ''}`}
                      onClick={() => handleFilterSelect(tag)}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="custom-sort-dropdown" ref={sortRef}>
            <label className="filter-label">Sort by:</label>
            <button 
              className="sort-dropdown-trigger"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
            >
              <span className={selectedSort ? 'selected-value' : 'placeholder-value'}>
                {sortOptions.find(opt => opt.value === selectedSort)?.label || 'None'}
              </span>
              <svg 
                className={`dropdown-arrow ${showSortDropdown ? 'open' : ''}`} 
                width="12" 
                height="12" 
                viewBox="0 0 12 12"
              >
                <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            
            {showSortDropdown && (
              <div className="sort-dropdown-menu">
                {sortOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`sort-option ${selectedSort === option.value ? 'active' : ''}`}
                    onClick={() => handleSortSelect(option.value)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="custom-sort-dropdown" ref={orderRef}>
            <label className="filter-label">Order:</label>
            <button 
              className="sort-dropdown-trigger"
              onClick={() => setShowOrderDropdown(!showOrderDropdown)}
            >
              <span className="selected-value">
                {orderOptions.find(opt => opt.value === selectedOrder)?.label}
              </span>
              <svg 
                className={`dropdown-arrow ${showOrderDropdown ? 'open' : ''}`} 
                width="12" 
                height="12" 
                viewBox="0 0 12 12"
              >
                <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            
            {showOrderDropdown && (
              <div className="sort-dropdown-menu">
                {orderOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`sort-option ${selectedOrder === option.value ? 'active' : ''}`}
                    onClick={() => handleOrderSelect(option.value)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button 
            className="shuffle-button"
            onClick={handleShuffle}
            title="Shuffle videos"
          >🔀</button>
        </div>
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
              onEdit={() => {
                setEditingVideo(favorite);
                setShowEditVidModal(true);
              }}
              onDelete={() => handleDeleteFavorite(favorite.id,favorite.starName)}
            />
          ))}
        </div>
      )}

      {editingVideo && showEditVidModal &&(
        <div className="modal-overlay">
          <div className="modal-content">
            <EditVidDialog 
              editingVideo={editingVideo}
              handleEditFavorite={handleEditVideo}
              setEditingVideo={() => {
                setEditingVideo(null);
                setShowEditVidModal(false);
              }}
              tags={availableTags}
              handleCreateNewTag={(newTag) => {
                if (newTag.trim() && !availableTags.includes(newTag.trim())) {
                  var updatedTags = [...availableTags, newTag.trim()];
                  setAvailableTags(updatedTags);
                  localStorage.setItem('tags', JSON.stringify(updatedTags));
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const VideoCard = React.memo(({ favorite, selectedTag, onTagClick, onImageError, onEdit, onDelete }) => (
  <div className="video-card">
    <div className="card-actions">
      <button className="action-btn edit-btn" onClick={onEdit} title="Edit video">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      </button>
      <button className="action-btn delete-btn" onClick={onDelete} title="Delete video">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3,6 5,6 21,6"></polyline>
          <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
    </div>
    {favorite.videoDuration && (
      <div className="video-duration-tag">
        {favorite.videoDuration}
      </div>
    )}
    {favorite.isVPN && (
      <div className="video-vpn-tag">
        VPN
      </div>
    )}
    <div className="card-image">
      <img 
        src={favorite.imageUrl} 
        alt={favorite.name}
        loading="lazy"
        onClick={() => window.open(favorite.url, '_blank')}
        onError={onImageError}
      />
    </div>
    <div className="card-content">
      <h3 className="video-name">{favorite.name}</h3>
      <a className="star-name" href={`#/star/${encodeURIComponent(favorite.starName)}`}>
        {favorite.starName.charAt(0).toUpperCase() + favorite.starName.slice(1)}
      </a>
      
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