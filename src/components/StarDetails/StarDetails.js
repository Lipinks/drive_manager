import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AddVidDialog from './AddVidDialog/AddVidDialog';
import StarHeader from './StarHeader/StarHeader';
import EditStarDialog from './EditStarDialog/EditStarDialog';
import VideosGrid from './VideosGrid/VideosGrid';
import EditVidDialog from './VideosGrid/EditVidDialog/EditVidDialog';
import './StarDetails.css';

const StarDetails = ({ stars = [], onStarsUpdate }) => {
  const { starName } = useParams();
  const navigate = useNavigate();
  
  // Ensure stars is an array before using findIndex
  const starIndex = Array.isArray(stars) ? stars.findIndex(s => s.Name.toLowerCase() === starName.toLowerCase()) : -1;
  const star = starIndex !== -1 ? stars[starIndex] : null;
  const [editedStar, setEditedStar] = useState(star || {
    Name: '',
    Image_Link: ''
  });
  // available tags and new-tag input for the tag-section
  const [availableTags, setAvailableTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [editingFav, setEditingFav] = useState(null);
  const [newFavorite, setNewFavorite] = useState({
    name: '',
    imageUrl: '',
    url: ''
  });
  const [showVidEditModal, setShowVidEditModal] = useState(false);
  const [showVidsModal, setShowVidAddModal] = useState(false);
  const [showEditVidModal, setShowEditVidModal] = useState(false);

  // Tags state for this star
  const [tags, setTags] = useState([]);

  useEffect(() => {
    var allFavorites = JSON.parse(localStorage.getItem('favorites')) || {};
    var starFavorites = allFavorites[starName] || [];
    setFavorites(starFavorites);
  }, [starName]);

  useEffect(() => {
    // Load tags for this star (tags stored as object keyed by star name)
    var allTags = JSON.parse(localStorage.getItem('tags')) || {};
    var starTags = Array.isArray(allTags[starName]) ? allTags[starName] : [];
    setTags(starTags);
  }, [starName]);

  useEffect(() => {
    // Update editedStar when star changes
    setEditedStar(star || {
      Name: '',
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
    var globalTags = JSON.parse(localStorage.getItem('tags')) || [];
    setAvailableTags(Array.isArray(globalTags) ? globalTags : []);
  }, []);

  // Handlers for tag-section (selected/available/create)
  const handleAddTagToStar = (tag) => {
    setEditedStar(prev => {
      var existing = Array.isArray(prev.Tags) ? prev.Tags : [];
      if (existing.includes(tag)) return prev;
      var updated = [...existing, tag];
      // persist per-star tags immediately
      saveTagsToStorage(updated, prev.Name || starName);
      setTags(updated);
      return { ...prev, Tags: updated };
    });
  };
  
  const handleRemoveTagFromStar = (tag) => {
    setEditedStar(prev => {
      var existing = Array.isArray(prev.Tags) ? prev.Tags : [];
      var updated = existing.filter(t => t !== tag);
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
      var updatedAvail = prevAvail.includes(v) ? prevAvail : [...prevAvail, v];
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
    var allFavorites = JSON.parse(localStorage.getItem('favorites')) || {};
    allFavorites[starName] = updatedFavorites;
    localStorage.setItem('favorites', JSON.stringify(allFavorites));
  };

  const saveTagsToStorage = (updatedTags, targetStarName = starName) => {
    var allTags = JSON.parse(localStorage.getItem('tags')) || {};
    allTags[targetStarName] = updatedTags;
    localStorage.setItem('tags', JSON.stringify(allTags));
    
    setTags(updatedTags);
  };

  const handleInputChange = (e) => {
    var { name, value } = e.target;
    setEditedStar(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSave = () => {
    var updatedStars = [...stars];
    updatedStars[starIndex] = editedStar;
    onStarsUpdate(updatedStars);
    localStorage.setItem('stars', JSON.stringify(updatedStars));
    // migrate tags if name changed
    if (editedStar.Name && editedStar.Name !== star.Name) {
      var allTags = JSON.parse(localStorage.getItem('tags')) || {};
      allTags[editedStar.Name] = allTags[star.Name] || tags || [];
      delete allTags[star.Name];
      localStorage.setItem('tags', JSON.stringify(allTags));
    } else {
      // save tags under current name
      saveTagsToStorage(tags, editedStar.Name || starName);
    }
    setShowVidEditModal(false);

    if (editedStar.Name.toLowerCase() !== star.Name.toLowerCase()) {
      navigate('/');
    }
  };

  const handleEditFavorite = (favId, updatedData) => {
    var updatedFavorites = favorites.map(fav => 
      fav.id === favId ? { ...fav, ...updatedData } : fav
    );
    
    var currentFavs = JSON.parse(localStorage.getItem('favorites') || '{}');
    currentFavs[starName] = updatedFavorites;
    localStorage.setItem('favorites', JSON.stringify(currentFavs));
    setFavorites(updatedFavorites);
    setEditingFav(null);
    setShowEditVidModal(false);
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

    var updatedFavorites = [...favorites, favorite];
    var currentFavs = JSON.parse(localStorage.getItem('favorites') || '{}');
    currentFavs[starName] = updatedFavorites;
    localStorage.setItem('favorites', JSON.stringify(currentFavs));
    setFavorites(updatedFavorites);
    setNewFavorite({ name: '', imageUrl: '', url: '', tags: [] });
    setShowVidAddModal(false);
  };

  const handleDeleteFavorite = (id) => {
    var updatedFavorites = favorites.filter(fav => fav.id !== id);
    setFavorites(updatedFavorites);
    saveFavoritesToStorage(updatedFavorites);
  };

  if (!star) {
    return <div className="star-details">Star not found</div>;
  }

  return (
    <div className="star-details">
      {showVidEditModal && (
        <EditStarDialog 
          editedStar={editedStar} 
          handleInputChange={handleInputChange} 
          handleEditSave={handleEditSave} 
          setShowVidEditModal={setShowVidEditModal} 
          handleAddTagToStar={handleAddTagToStar}
          handleRemoveTagFromStar={handleRemoveTagFromStar}
          availableTags={availableTags}
          newTag={newTag}
          setNewTag={setNewTag}
          handleCreateNewTag={handleCreateNewTag}
          handleKeyPress={handleKeyPress}
        />
      )}

      {showVidsModal && (
        <AddVidDialog 
          newFavorite={newFavorite} 
          setNewFavorite={setNewFavorite} 
          handleAddFavorite={handleAddFavorite} 
          setShowVidAddModal={setShowVidAddModal} />
      )}

      {showEditVidModal && editingFav && (
        <div className="modal-overlay">
          <div className="modal-content">
            <EditVidDialog 
              editingFav={editingFav}
              handleEditFavorite={handleEditFavorite}
              setEditingFav={() => {
                setEditingFav(null);
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

      <StarHeader 
        star={star}
        setShowVidEditModal={setShowVidEditModal}
        setShowVidAddModal={setShowVidAddModal} />

      <VideosGrid
        favorites={favorites}
        setEditingFav={(fav) => {
          setEditingFav(fav);
          setShowEditVidModal(true);
        }}
        handleDeleteFavorite={handleDeleteFavorite}
      />
    </div>
  );
};

export default StarDetails;
