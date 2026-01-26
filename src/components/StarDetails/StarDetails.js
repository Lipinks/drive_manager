import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AddVidDialog from './AddVidDialog/AddVidDialog';
import StarHeader from './StarHeader/StarHeader';
import EditStarDialog from './EditStarDialog/EditStarDialog';
import VideosPage from '../VideosPage/VideosPage';
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
  const [newFavorite, setNewFavorite] = useState({
    name: '',
    imageUrl: '',
    url: ''
  });
  const [showVidEditModal, setShowVidEditModal] = useState(false);
  const [showVidsModal, setShowVidAddModal] = useState(false);

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
    console.log('Star edited:', editedStar);
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

  const handleAddFavorite = () => {
    if (!newFavorite.name || !newFavorite.imageUrl) {
      alert('Please fill in name and image URL');
      return;
    }

    var now = new Date();
    var istOptions = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
    var istParts = new Intl.DateTimeFormat('en-CA', istOptions).formatToParts(now);
    var getPart = (type) => istParts.find(p => p.type === type)?.value || '';
    var currentDateTime = `${getPart('year')}-${getPart('month')}-${getPart('day')}T${getPart('hour')}:${getPart('minute')}`;

    const favorite = {
      ...newFavorite,
      id: Date.now(),
      tags: newFavorite.tags || [],
      creation: currentDateTime
    };

    var updatedFavorites = [...favorites, favorite];
    var currentFavs = JSON.parse(localStorage.getItem('favorites') || '{}');
    currentFavs[starName] = updatedFavorites;
    localStorage.setItem('favorites', JSON.stringify(currentFavs));
    setFavorites(updatedFavorites);
    setNewFavorite({ name: '', imageUrl: '', url: '', tags: [] });
    setShowVidAddModal(false);
    window.location.reload();
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

      <StarHeader 
        star={star}
        setShowVidEditModal={setShowVidEditModal}
        setShowVidAddModal={setShowVidAddModal} 
      />
      <VideosPage 
        starName={star.Name}
      />
    </div>
  );
};

export default StarDetails;
