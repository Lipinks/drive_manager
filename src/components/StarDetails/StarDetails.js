import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const StarDetails = ({ stars, onStarsUpdate }) => {
  const { starName } = useParams();
  const navigate = useNavigate();
  const starIndex = stars.findIndex(s => s.Name.toLowerCase() === starName.toLowerCase());
  const star = stars[starIndex];
  const [isEditing, setIsEditing] = useState(false);
  const [editedStar, setEditedStar] = useState(star || {
    Name: '',
    Age: '',
    Country: '',
    Image_Link: ''
  });

  if (!star) {
    return <div className="star-details">Star not found</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedStar(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    const updatedStars = [...stars];
    updatedStars[starIndex] = editedStar;
    onStarsUpdate(updatedStars);
    setIsEditing(false);
    
    // Only navigate to home if the name was changed
    if (editedStar.Name.toLowerCase() !== star.Name.toLowerCase()) {
      navigate('/');
    }
  };

  return (
    <div className="star-details">
      <div className="star-details-content">
        <div className="star-image">
          {isEditing ? (
            <input
              type="url"
              name="Image_Link"
              value={editedStar.Image_Link}
              onChange={handleInputChange}
              className="edit-input"
            />
          ) : (
            <img src={star.Image_Link} alt={star.Name} />
          )}
        </div>
        <div className="star-info-detailed">
          {isEditing ? (
            <>
              <input
                type="text"
                name="Name"
                value={editedStar.Name}
                onChange={handleInputChange}
                className="edit-input"
                placeholder="Name"
              />
              <input
                type="number"
                name="Age"
                value={editedStar.Age}
                onChange={handleInputChange}
                className="edit-input"
                placeholder="Age"
              />
              <input
                type="text"
                name="Country"
                value={editedStar.Country}
                onChange={handleInputChange}
                className="edit-input"
                placeholder="Country"
              />
              <div className="edit-buttons">
                <button onClick={handleSave} className="save-btn">Save</button>
                <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
              </div>
            </>
          ) : (
            <>
              <h1>{star.Name}</h1>
              <p className="age">Age: {star.Age} years</p>
              <p className="country">Country: {star.Country}</p>
              <button onClick={() => setIsEditing(true)} className="edit-btn">Edit</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StarDetails;
