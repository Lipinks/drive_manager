import './AddVidDialog.css';

const AddStarDialog = ({ newFavorite, setNewFavorite, handleAddFavorite, setShowVidAddModal }) => {
  return (
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
          <button onClick={() => setShowVidAddModal(false)} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddStarDialog;