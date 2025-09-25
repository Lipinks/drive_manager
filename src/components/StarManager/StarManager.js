import React, { useState, useEffect } from 'react';
import * as starService from '../../services/starService';

const StarManager = ({ accessToken, showModal, onCloseModal, onSyncChange }) => {
  const [stars, setStars] = useState(() => {
    const savedStars = localStorage.getItem('stars');
    return savedStars ? JSON.parse(savedStars) : [];
  });
  
  const [newStar, setNewStar] = useState({
    Name: '',
    Age: '',
    Country: '',
    Image_Link: ''
  });

  useEffect(() => {
    if (accessToken) {
      loadStars();
    }
  }, [accessToken]);

  useEffect(() => {
    const handleSync = async () => {
      try {
        await starService.saveStarFile(accessToken, stars);
        onSyncChange(false);
      } catch (error) {
        console.error('Error syncing:', error);
        alert('Failed to sync with Drive');
      }
    };

    const element = document.querySelector('.star-manager');
    if (element) {
      element.addEventListener('syncToDrive', handleSync);
      return () => element.removeEventListener('syncToDrive', handleSync);
    }
  }, [accessToken, stars, onSyncChange]);

  const loadStars = async () => {
    const starData = await starService.getStarFile(accessToken);
    setStars(starData);
    localStorage.setItem('stars', JSON.stringify(starData));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStar(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (!newStar.Name || !newStar.Age || !newStar.Country || !newStar.Image_Link) {
      alert('Please fill all fields');
      return;
    }
    const newStars = [...stars, newStar];
    setStars(newStars);
    localStorage.setItem('stars', JSON.stringify(newStars));
    setNewStar({
      Name: '',
      Age: '',
      Country: '',
      Image_Link: ''
    });
    onSyncChange(true);
    onCloseModal();
  };

  const handleSync = async () => {
    try {
      await starService.saveStarFile(accessToken, stars);
      onSyncChange(false);
    } catch (error) {
      console.error('Error syncing:', error);
      alert('Failed to sync with Drive');
    }
  };

  const handleDelete = (index) => {
    const star = stars[index];
    const isConfirmed = window.confirm(`Are you sure you want to delete ${star.Name}?`);
    
    if (isConfirmed) {
      const newStars = stars.filter((_, i) => i !== index);
      setStars(newStars);
      localStorage.setItem('stars', JSON.stringify(newStars));
      onSyncChange(true);
    }
  };

  return (
    <div className="star-manager">
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Star</h2>
            <input
              type="text"
              name="Name"
              placeholder="Name"
              value={newStar.Name}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="Age"
              placeholder="Age"
              value={newStar.Age}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="Country"
              placeholder="Country"
              value={newStar.Country}
              onChange={handleInputChange}
            />
            <input
              type="url"
              name="Image_Link"
              placeholder="Image Link"
              value={newStar.Image_Link}
              onChange={handleInputChange}
            />
            <div className="modal-buttons">
              <button onClick={handleSave} className="save-btn">Save</button>
              <button onClick={onCloseModal} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="stars-grid">
        {stars.map((star, index) => (
          <div key={index} className="star-frame">
            <div className="image-container">
              <img src={star.Image_Link} alt={star.Name} />
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