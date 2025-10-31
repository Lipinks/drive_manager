import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as starService from '../../services/starService';
import './StarManager.css';
import AddStarDialog from './AddStarDialog/AddStarDialog';

const StarManager = ({ accessToken, showModal, onCloseModal, onSyncChange, onStarsUpdate, stars }) => {
  const navigate = useNavigate();
  // Ensure stars is always an array
  const [displayStars, setDisplayStars] = useState([]);

  useEffect(() => {
    // Convert stars to array if it's not already
    setDisplayStars(Array.isArray(stars) ? stars : []);
  }, [stars]);

  const [newStar, setNewStar] = useState({
    Name: '',
    Age: '',
    Country: '',
    Image_Link: '',
    Tags: []
  });
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    const savedTags = JSON.parse(localStorage.getItem('tags')) || [];
    if (!savedTags.length) {
      localStorage.setItem('tags', JSON.stringify([]));
    }
    setTags(savedTags);
  }, []);

  useEffect(() => {
    const handleSync = async () => {
      try {
        // Save current data to localStorage before sync
        localStorage.setItem('stars', JSON.stringify(Array.isArray(stars) ? stars : []));
        await starService.saveStarFile(accessToken);
        onSyncChange(false);
        
        // Dispatch a custom event to signal sync completion
        const element = document.querySelector('.star-manager');
        if (element) {
          element.dispatchEvent(new CustomEvent('syncComplete'));
        }
      } catch (error) {
        console.error('Error syncing:', error);
        alert('Failed to sync with Drive');
      }
    };

    // Listen for sync event
    const element = document.querySelector('.star-manager');
    if (element) {
      element.addEventListener('syncToDrive', handleSync);
      return () => element.removeEventListener('syncToDrive', handleSync);
    }
  }, [accessToken, stars, onSyncChange]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStar(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTagToStar = (tag) => {
    if (tag && !newStar.Tags.includes(tag)) {
      setNewStar(prev => ({
        ...prev,
        Tags: [...prev.Tags, tag]
      }));
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setNewStar(prev => ({
      ...prev,
      Tags: prev.Tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleCreateNewTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const trimmedTag = newTag.trim();
      const updatedTags = [...tags, trimmedTag];
      setTags(updatedTags);
      localStorage.setItem('tags', JSON.stringify(updatedTags));
      
      // Automatically add the newly created tag to the star
      setNewStar(prev => ({
        ...prev,
        Tags: [...prev.Tags, trimmedTag]
      }));
      
      setNewTag('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCreateNewTag();
    }
  };

  const handleSave = () => {
    if (!newStar.Name || !newStar.Age || !newStar.Country || !newStar.Image_Link) {
      alert('Please fill all fields');
      return;
    }

    const updatedStars = [...(Array.isArray(stars) ? stars : []), newStar];
    
    // Update localStorage and state
    localStorage.setItem('stars', JSON.stringify(updatedStars));
    onStarsUpdate(updatedStars);
    
    // Reset form
    setNewStar({
      Name: '',
      Age: '',
      Country: '',
      Image_Link: '',
      Tags: []
    });

    // Trigger sync
    onSyncChange(true);
    onCloseModal();
  };

  const handleDelete = (index) => {
    const star = stars[index];
    const isConfirmed = window.confirm(`Are you sure you want to delete ${star.Name}?`);
    
    if (isConfirmed) {
      const newStars = stars.filter((_, i) => i !== index);
      onStarsUpdate(newStars);
      onSyncChange(true);
    }
  };

  const handleImageClick = (star) => {
    navigate(`/star/${star.Name.toLowerCase()}`);
  };

  return (
    <div className="star-manager" style={{ paddingTop: '80px' }}>
      {console.log('showModal:', showModal)}
      {showModal && (
        <AddStarDialog 
          newStar={newStar}
          handleInputChange={handleInputChange}
          handleAddTagToStar={handleAddTagToStar}
          handleRemoveTag={handleRemoveTag}
          handleCreateNewTag={handleCreateNewTag}
          handleKeyPress={handleKeyPress}
          onCloseModal={onCloseModal}
          handleSave={handleSave}
          tags={tags}
          newTag={newTag}
          setNewTag={setNewTag} 
        />
      )}

      <div className="stars-grid">
        {displayStars.map((star, index) => (
          <div key={index} className="star-frame">
            <div className="image-container">
              <img 
                src={star.Image_Link} 
                alt={star.Name} 
                onClick={() => handleImageClick(star)}
                style={{ cursor: 'pointer' }}
              />
              <button 
                onClick={() => handleDelete(index)} 
                className="delete-star-btn"
                aria-label="Delete star"
              >💋
              </button>
            </div>
            <div className="star-info">
              <h3>{star.Name}</h3>
              <p>{star.Age} years • {star.Country}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StarManager;
