import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './StarDetails.css';
import AddFavDialog from './AddFavDialog/AddFavDialog';
import StarHeader from './StarHeader/StarHeader';
import EditStarDialog from './EditStarDialog/EditStarDialog';
import FavoritesGrid from './FavoritesGrid/FavoritesGrid';

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
    // Load global tags from localStorage (used by stars)
    const globalTags = JSON.parse(localStorage.getItem('tags')) || [];
    setAvailableTags(Array.isArray(globalTags) ? globalTags : []);
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

  const handleEditFavorite = (favId, updatedData) => {
    const updatedFavorites = favorites.map(fav => 
      fav.id === favId ? { ...fav, ...updatedData } : fav
    );
    
    const currentFavs = JSON.parse(localStorage.getItem('favorites') || '{}');
    currentFavs[starName] = updatedFavorites;
    localStorage.setItem('favorites', JSON.stringify(currentFavs));
    setFavorites(updatedFavorites);
    setEditingFav(null);
    onSyncChange(true);
  };

  const handleAddFavorite = () => {
    if (!newFavorite.name || !newFavorite.imageUrl) {
      alert('Please fill in name and image URL');
      return;
    }

    const favorite = {
      ...newFavorite,
      id: Date.now(),
      tags: newFavorite.tags || []
    };

    const updatedFavorites = [...favorites, favorite];
    const currentFavs = JSON.parse(localStorage.getItem('favorites') || '{}');
    currentFavs[starName] = updatedFavorites;
    localStorage.setItem('favorites', JSON.stringify(currentFavs));
    setFavorites(updatedFavorites);
    setNewFavorite({ name: '', imageUrl: '', url: '', tags: [] });
    setShowFavModal(false);
    onSyncChange(true);
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

      <StarHeader 
        star={star}
        setShowEditModal={setShowEditModal}
        setShowFavModal={setShowFavModal} />

      <FavoritesGrid
        favorites={favorites}
        editingFav={editingFav}
        setEditingFav={setEditingFav}
        handleEditFavorite={handleEditFavorite}
        handleDeleteFavorite={handleDeleteFavorite}
        tags={availableTags}
        handleCreateNewTag={(newTag) => {
          if (newTag.trim() && !availableTags.includes(newTag.trim())) {
            const updatedTags = [...availableTags, newTag.trim()];
            setAvailableTags(updatedTags);
            localStorage.setItem('tags', JSON.stringify(updatedTags));
          }
        }}
      />

      {showEditModal && (
        <EditStarDialog 
          editedStar={editedStar} 
          handleInputChange={handleInputChange} 
          handleEditSave={handleEditSave} 
          setShowEditModal={setShowEditModal} 
          handleAddTagToStar={handleAddTagToStar}
          handleRemoveTagFromStar={handleRemoveTagFromStar}
          availableTags={availableTags}
          newTag={newTag}
          setNewTag={setNewTag}
          handleCreateNewTag={handleCreateNewTag}
          handleKeyPress={handleKeyPress}
        />
      )}

      {showFavModal && (
        <AddFavDialog 
          newFavorite={newFavorite} 
          setNewFavorite={setNewFavorite} 
          handleAddFavorite={handleAddFavorite} 
          setShowFavModal={setShowFavModal} />
      )}
    </div>
  );
};

export default StarDetails;
