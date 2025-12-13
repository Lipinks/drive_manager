import './VideosGrid.css';
import EditVidDialog from './EditVidDialog/EditVidDialog';

const VideosGrid = ({ favorites = [], editingFav, setEditingFav, handleEditFavorite, handleDeleteFavorite, tags, handleAddTagToFav, handleRemoveTagFromFav, handleCreateNewTag }) => {
  return (
    <div className="favorites-grid">
      {favorites.map((fav) => (
        <div key={fav.id} className="favorite-card">
          {editingFav?.id === fav.id ? (
            <EditVidDialog 
              editingFav={editingFav}
              handleEditFavorite={handleEditFavorite}
              setEditingFav={setEditingFav}
              tags={tags}
              handleAddTagToFav={handleAddTagToFav}
              handleRemoveTagFromFav={handleRemoveTagFromFav}
              handleCreateNewTag={handleCreateNewTag}
            />
          ) : (
            <>
              <img src={fav.imageUrl} alt={fav.name} />
              {fav.url && (
                <a href={fav.url} target="_blank" rel="noopener noreferrer">
                  {fav.name}
                </a>
              )}
              <div className="favorite-tags">
                {fav.tags && fav.tags.length > 0 && (
                  <div >
                    <select className="tags-dropdown">
                      <option value="">{`Tags (${fav.tags.length})`}</option>
                      {fav.tags.map((tag, index) => (
                        <option key={index} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <button onClick={() => setEditingFav(fav)} >Edit</button>
                <button onClick={() => handleDeleteFavorite(fav.id)}>Delete</button>
              
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default VideosGrid;