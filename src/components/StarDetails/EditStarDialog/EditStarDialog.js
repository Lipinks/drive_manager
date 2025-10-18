import './EditStarDialog.css';

const EditStarDialog = ({editedStar, handleInputChange, handleEditSave, setShowEditModal, handleAddTagToStar, handleRemoveTagFromStar, availableTags, newTag, setNewTag, handleCreateNewTag, handleKeyPress}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Star</h2>
        <input
          type="text"
          name="Name"
          placeholder="Name"
          value={editedStar.Name}
          onChange={handleInputChange}
          disabled={true}
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
  );
} 

export default EditStarDialog;