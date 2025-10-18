import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const StarDetails = ({ stars = [], onStarsUpdate, onSyncChange }) => {
  const { starName } = useParams();
  const navigate = useNavigate();
  
  // Ensure stars is an array before using findIndex
  const starIndex = Array.isArray(stars) ? stars.findIndex(s => s.Name.toLowerCase() === starName.toLowerCase()) : -1;
  const star = starIndex !== -1 ? stars[starIndex] : null;
  const [isEditing, setIsEditing] = useState(false);
  const [editedStar, setEditedStar] = useState(star || {
    Name: '',
    Age: '',
    Country: '',
    Image_Link: ''
  });
  // available tags and new-tag input for the tag-section
  const [availableTags, setAvailableTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [showFavModal, setShowFavModal] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [editingFav, setEditingFav] = useState(null);
  const [newFavorite, setNewFavorite] = useState({
    name: '',
    imageUrl: '',
    url: ''
  });
  const [showEditModal, setShowEditModal] = useState(false);

  // Tags state for this star
  const [tags, setTags] = useState([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [editingTagIndex, setEditingTagIndex] = useState(null);
  const [editingTagValue, setEditingTagValue] = useState('');

  useEffect(() => {
    const allFavorites = JSON.parse(localStorage.getItem('favorites')) || {};
    const starFavorites = allFavorites[starName] || [];
    setFavorites(starFavorites);
  }, [starName]);

  useEffect(() => {
    // Load tags for this star (tags stored as object keyed by star name)
    const allTags = JSON.parse(localStorage.getItem('tags')) || {};
    const starTags = Array.isArray(allTags[starName]) ? allTags[starName] : [];
    setTags(starTags);
  }, [starName]);

  useEffect(() => {
    // Update editedStar when star changes
    setEditedStar(star || {
      Name: '',
      Age: '',
      Country: '',
      Image_Link: ''
    });
    // ensure Tags array exists on editedStar
    if (star && !Array.isArray(star.Tags)) {
      setEditedStar(prev => ({ ...prev, Tags: [] }));
    }
  }, [star]);

  // load available tags (global list) from localStorage
  useEffect(() => {
    const avail = JSON.parse(localStorage.getItem('tags') || '[]');
    setAvailableTags(Array.isArray(avail) ? avail : []);
  }, []);

  // Handlers for tag-section (selected/available/create)
  const handleAddTagToStar = (tag) => {
    setEditedStar(prev => {
      const existing = Array.isArray(prev.Tags) ? prev.Tags : [];
      if (existing.includes(tag)) return prev;
      const updated = [...existing, tag];
      // persist per-star tags immediately
      saveTagsToStorage(updated, prev.Name || starName);
      setTags(updated);
      return { ...prev, Tags: updated };
    });
  };
  
  const handleRemoveTagFromStar = (tag) => {
    setEditedStar(prev => {
      const existing = Array.isArray(prev.Tags) ? prev.Tags : [];
      const updated = existing.filter(t => t !== tag);
      saveTagsToStorage(updated, prev.Name || starName);
      setTags(updated);
      return { ...prev, Tags: updated };
    });
  };
  
  const handleCreateNewTag = () => {
    const v = (newTag || '').trim();
    if (!v) return;
    // add to global available tags if not present
    setAvailableTags(prevAvail => {
      const updatedAvail = prevAvail.includes(v) ? prevAvail : [...prevAvail, v];
      localStorage.setItem('tags', JSON.stringify(updatedAvail));
      return updatedAvail;
    });
    // also add to the current star selection
    handleAddTagToStar(v);
    setNewTag('');
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreateNewTag();
    }
  };
  
  const saveFavoritesToStorage = (updatedFavorites) => {
    const allFavorites = JSON.parse(localStorage.getItem('favorites')) || {};
    allFavorites[starName] = updatedFavorites;
    localStorage.setItem('favorites', JSON.stringify(allFavorites));
    
    if (onSyncChange) {
      onSyncChange(true); // Trigger sync after updating localStorage
    }
  };

  const saveTagsToStorage = (updatedTags, targetStarName = starName) => {
    const allTags = JSON.parse(localStorage.getItem('tags')) || {};
    allTags[targetStarName] = updatedTags;
    localStorage.setItem('tags', JSON.stringify(allTags));
    
    setTags(updatedTags);
    if (onSyncChange) onSyncChange(true);
  };
  
  const handleAddTag = () => {
    const value = (newTagInput || '').trim();
    if (!value) return;
    const updated = [...tags, value];
    setNewTagInput('');
    saveTagsToStorage(updated);
  };
  
  const handleRemoveTag = (index) => {
    const updated = tags.filter((_, i) => i !== index);
    saveTagsToStorage(updated);
  };
  
  const startEditTag = (index) => {
    setEditingTagIndex(index);
    setEditingTagValue(tags[index] || '');
  };
  
  const saveEditTag = () => {
    if (editingTagIndex === null) return;
    const value = (editingTagValue || '').trim();
    const updated = [...tags];
    if (!value) {
      // remove if empty
      updated.splice(editingTagIndex, 1);
    } else {
      updated[editingTagIndex] = value;
    }
    setEditingTagIndex(null);
    setEditingTagValue('');
    saveTagsToStorage(updated);
  };

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
    localStorage.setItem('stars', JSON.stringify(updatedStars));
    // migrate tags if name changed
    if (editedStar.Name && editedStar.Name !== star.Name) {
      const allTags = JSON.parse(localStorage.getItem('tags')) || {};
      allTags[editedStar.Name] = allTags[star.Name] || tags || [];
      delete allTags[star.Name];
      localStorage.setItem('tags', JSON.stringify(allTags));
      if (onSyncChange) onSyncChange(true);
    } else {
      // ensure tags saved under current name
      saveTagsToStorage(tags, editedStar.Name || starName);
    }
    if (onSyncChange) onSyncChange(true);
    setIsEditing(false);

    // Only navigate to home if the name was changed
    if (editedStar.Name.toLowerCase() !== star.Name.toLowerCase()) {
      navigate('/');
    }
  };

  const handleEditSave = () => {
    const updatedStars = [...stars];
    updatedStars[starIndex] = editedStar;
    onStarsUpdate(updatedStars);
    localStorage.setItem('stars', JSON.stringify(updatedStars));
    // migrate tags if name changed
    if (editedStar.Name && editedStar.Name !== star.Name) {
      const allTags = JSON.parse(localStorage.getItem('tags')) || {};
      allTags[editedStar.Name] = allTags[star.Name] || tags || [];
      delete allTags[star.Name];
      localStorage.setItem('tags', JSON.stringify(allTags));
    } else {
      // save tags under current name
      saveTagsToStorage(tags, editedStar.Name || starName);
    }
    if (onSyncChange) onSyncChange(true);
    setShowEditModal(false);

    if (editedStar.Name.toLowerCase() !== star.Name.toLowerCase()) {
      navigate('/');
    }
  };

  const handleAddFavorite = () => {
    if (!newFavorite.name || !newFavorite.imageUrl) {
      alert('Please fill in at least Name and Image URL');
      return;
    }

    const updatedFavorites = [...favorites, { ...newFavorite, id: Date.now() }];
    setFavorites(updatedFavorites);
    saveFavoritesToStorage(updatedFavorites);
    setNewFavorite({ name: '', imageUrl: '', url: '' });
    setShowFavModal(false);
  };

  const handleEditFavorite = (favorite) => {
    const updatedFavorites = favorites.map(fav => 
      fav.id === favorite.id ? { ...favorite } : fav
    );
    setFavorites(updatedFavorites);
    saveFavoritesToStorage(updatedFavorites);
    setEditingFav(null);
  };

  const handleDeleteFavorite = (id) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== id);
    setFavorites(updatedFavorites);
    saveFavoritesToStorage(updatedFavorites);
  };

  // Add error check before accessing star properties
  if (!Array.isArray(stars)) {
    return <div className="star-details">Error: Invalid stars data</div>;
  }

  if (!star) {
    return <div className="star-details">Star not found</div>;
  }

  return (
    <div className="star-details">
      <div className="star-header">
        <div className="star-main-info">
          <div className="star-image-container">
            <img src={star.Image_Link} alt={star.Name} />
          </div>
          <div className="star-text-info">
            <h1>{star.Name}</h1>
            <p className="age">Age: {star.Age} years</p>
            <p className="country">Country: {star.Country}</p>
            <div className="tags-list">
              <strong>Tags:</strong>
              {star.Tags.length === 0 ? (
                <span className="no-tags"> No tags</span>
              ) : (
                <ul>
                  {star.Tags.map((t, i) => (
                    <li key={i} className="tag-item">
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="button-group">
          <button className="add-favorite-btn" onClick={() => setShowFavModal(true)}>
            Add Favorite
          </button>
          <button className="add-favorite-btn" onClick={() => setShowEditModal(true)}>
            Edit Star
          </button>
        </div>
      </div>

      <div className="favorites-grid">
        {favorites.map((fav) => (
          <div key={fav.id} className="favorite-card">
            {editingFav?.id === fav.id ? (
              <div className="edit-favorite-form">
                <input
                  type="text"
                  value={editingFav.name}
                  onChange={(e) => setEditingFav({ ...editingFav, name: e.target.value })}
                  placeholder="Name"
                />
                <input
                  type="url"
                  value={editingFav.imageUrl}
                  onChange={(e) => setEditingFav({ ...editingFav, imageUrl: e.target.value })}
                  placeholder="Image URL"
                />
                <input
                  type="url"
                  value={editingFav.url}
                  onChange={(e) => setEditingFav({ ...editingFav, url: e.target.value })}
                  placeholder="URL"
                />
                <div className="edit-buttons">
                  <button onClick={() => handleEditFavorite(editingFav)}>Save</button>
                  <button onClick={() => setEditingFav(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <img src={fav.imageUrl} alt={fav.name} />
                <h3>{fav.name}</h3>
                {fav.url && (
                  <a href={fav.url} target="_blank" rel="noopener noreferrer">
                    Visit
                  </a>
                )}
                <div className="favorite-actions">
                  <button onClick={() => setEditingFav(fav)}>Edit</button>
                  <button onClick={() => handleDeleteFavorite(fav.id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Star</h2>
            <input
              type="text"
              name="Name"
              placeholder="Name"
              value={editedStar.Name}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="Age"
              placeholder="Age"
              value={editedStar.Age}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="Country"
              placeholder="Country"
              value={editedStar.Country}
              onChange={handleInputChange}
            />
            <input
              type="url"
              name="Image_Link"
              placeholder="Image URL"
              value={editedStar.Image_Link}
              onChange={handleInputChange}
            />

            <div className="tag-section">
              <h3>Selected Tags</h3>
              <div className="selected-tags">
                {(editedStar.Tags || []).map(tag => (
                  <span 
                    key={tag} 
                    className="tag selected-tag"
                    onClick={() => handleRemoveTagFromStar(tag)}
                    title="Click to remove"
                  >
                    {tag}
                    <span className="remove-icon">×</span>
                  </span>
                ))}
              </div>
              
              <h3>Available Tags</h3>
              <div className="available-tags">
                {availableTags
                  .filter(tag => !(editedStar.Tags || []).includes(tag))
                  .map(tag => (
                    <span 
                      key={tag} 
                      className="tag available-tag"
                      onClick={() => handleAddTagToStar(tag)}
                      title="Click to add"
                    >
                      {tag}
                      <span className="add-icon">+</span>
                    </span>
                  ))}
              </div>
              
              <div className="create-new-tag">
                <input
                  type="text"
                  placeholder="Create new tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="new-tag-input"
                />
                <button onClick={handleCreateNewTag} className="create-tag-btn">
                  Create Tag
                </button>
              </div>
            </div>

            <div className="modal-buttons">
              <button onClick={handleEditSave} className="save-btn">Save</button>
              <button onClick={() => setShowEditModal(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showFavModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Favorite</h2>
            <input
              type="text"
              placeholder="Name"
              value={newFavorite.name}
              onChange={(e) => setNewFavorite({ ...newFavorite, name: e.target.value })}
            />
            <input
              type="url"
              placeholder="Image URL"
              value={newFavorite.imageUrl}
              onChange={(e) => setNewFavorite({ ...newFavorite, imageUrl: e.target.value })}
            />
            <input
              type="url"
              placeholder="URL (optional)"
              value={newFavorite.url}
              onChange={(e) => setNewFavorite({ ...newFavorite, url: e.target.value })}
            />
            <div className="modal-buttons">
              <button onClick={handleAddFavorite} className="save-btn">Save</button>
              <button onClick={() => setShowFavModal(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StarDetails;
