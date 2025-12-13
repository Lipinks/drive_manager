import './AddStarDialog.css';

const AddStarDialog = ({newStar,handleInputChange,handleAddTagToStar,handleRemoveTag,handleCreateNewTag,handleKeyPress,closeAddStarModal,handleSave,tags,newTag,setNewTag})=> {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="name-input-section">
          <div className='add-new-star'>Add New Star</div>
          <input
            type="text"
            name="Name"
            placeholder="Name"
            value={newStar.Name}
            onChange={handleInputChange}

          />
          <input
            type="url"
            name="Image_Link"
            placeholder="Image Link"
            value={newStar.Image_Link}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="tag-section">
          <h3>Selected Tags</h3>
          <div className="selected-tags">
            {newStar.Tags.map(tag => (
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
          
          <h3>Available Tags</h3>
          <div className="available-tags">
            {tags
              .filter(tag => !newStar.Tags.includes(tag))
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
              Save Tag
            </button>
            <button onClick={handleSave} className="save-btn">Save Star</button>
            <button onClick={closeAddStarModal} className="cancel-btn">Cancel</button>
          </div>
        </div>
      </div>
      </div>
  );
};

export default AddStarDialog;