import './EditFavDialog.css';

const EditFavDialog = ({editingFav, handleEditFavorite, setEditingFav}) => {
  return (
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
  );
}

export default EditFavDialog;