import './EditFavDialog.css';
import React, { useState } from 'react';

const EditFavDialog = ({ editingFav, handleEditFavorite, setEditingFav, tags, handleAddTagToFav, handleRemoveTagFromFav, handleCreateNewTag }) => {
  const [formData, setFormData] = useState({
    name: editingFav?.name || '',
    imageUrl: editingFav?.imageUrl || '',
    url: editingFav?.url || '',
    tags: editingFav?.tags || []
  });
  const [newTag, setNewTag] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    handleEditFavorite(editingFav.id, formData);
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
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleInputChange}
        className="edit-input"
      />
      <input
        type="url"
        name="imageUrl"
        placeholder="Image URL"
        value={formData.imageUrl}
        onChange={handleInputChange}
        className="edit-input"
      />
      <input
        type="url"
        name="url"
        placeholder="Video URL"
        value={formData.url}
        onChange={handleInputChange}
        className="edit-input"
      />
      
      <div className="tag-section">
        <h4>Selected Tags</h4>
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
        
        <h4>Available Tags</h4>
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
            placeholder="Create new tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleKeyPress}
            className="new-tag-input"
          />
          <button onClick={handleCreateTag} className="create-tag-btn">
            Create Tag
          </button>
        </div>
      </div>

      <div className="edit-actions">
        <button onClick={handleSave} className="save-btn">Save</button>
        <button onClick={() => setEditingFav(null)} className="cancel-btn">Cancel</button>
      </div>
    </div>
  );
};

export default EditFavDialog;