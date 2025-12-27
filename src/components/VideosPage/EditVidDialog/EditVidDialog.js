import './EditVidDialog.css';
import { useState, useEffect } from 'react';

const EditVidDialog = ({ editingVideo, handleEditFavorite, setEditingVideo, tags, handleCreateNewTag }) => {
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    url: '',
    tags: []
  });

  useEffect(() => {
    if (editingVideo) {
      setFormData({
        name: editingVideo.name || '',
        imageUrl: editingVideo.imageUrl || '',
        url: editingVideo.url || '',
        tags: editingVideo.tags || []
      });
    }
  }, [editingVideo]);
  const [newTag, setNewTag] = useState('');

  const handleInputChange = (e) => {
    var { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    handleEditFavorite(editingVideo.id, formData, editingVideo.starName);
  };

  const handleAddTag = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleCreateTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      handleCreateNewTag(newTag.trim());
      handleAddTag(newTag.trim());
      setNewTag('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCreateTag();
    }
  };

  return (
    <div className="edit-dialog">
      <div className='label-input'>
        <div className='label-content'>Video Name</div>
        
        <input
          type="text"
          name="name"
          placeholder="Video Name"
          value={formData.name}
          onChange={handleInputChange}
        />
      </div>
      <div className='label-input'>
        <div className='label-content'>Thumbnail URL</div>
        <input
          type="url"
          name="imageUrl"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={handleInputChange}
        />
      </div>
      <div className='label-input'>
        <div className='label-content'>Video URL</div>
        <input
          type="url"
          name="url"
          placeholder="Video URL"
          value={formData.url}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="tag-section">
        <div className="label-content">Selected Tags</div>
        <div className="selected-tags">
          {formData.tags.map(tag => (
            <span 
              key={tag} 
              className="tag selected-tag"
              onClick={() => handleRemoveTag(tag)}
              title="Click to remove"
            >
              {tag}
              <span className="remove-icon">×</span>
            </span>
          ))}
        </div>
        
        <div className="label-content">Available Tags</div>
        <div className="available-tags">
          {tags
            .filter(tag => !formData.tags.includes(tag))
            .map(tag => (
              <span 
                key={tag} 
                className="tag available-tag"
                onClick={() => handleAddTag(tag)}
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
            className="new-tag-input"
            placeholder="Create new tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleCreateTag} className="create-tag-btn">
            Create Tag
          </button>
          <button onClick={handleSave} className="save-btn">Save Changes</button>
          <button onClick={() => setEditingVideo(null)} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditVidDialog;