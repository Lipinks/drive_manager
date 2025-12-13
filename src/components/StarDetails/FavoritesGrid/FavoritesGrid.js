import React from 'react';
import './FavoritesGrid.css';
import EditFavDialog from './EditFavDialog/EditFavDialog';

const FavoritesGrid = ({ favorites = [], editingFav, setEditingFav, handleEditFavorite, handleDeleteFavorite, tags, handleAddTagToFav, handleRemoveTagFromFav, handleCreateNewTag }) => {
  return (
    <div className="favorites-grid">
      {favorites.map((fav) => (
        <div key={fav.id} className="favorite-card">
          {editingFav?.id === fav.id ? (
            <EditFavDialog 
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
              <h3>{fav.name}</h3>
              {fav.url && (
                <a href={fav.url} target="_blank" rel="noopener noreferrer">
                  Play the video
                </a>
              )}
              <div className="favorite-tags">
                {fav.tags && fav.tags.length > 0 && (
                  <div className="tags-display">
                    {fav.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="favorite-actions">
                <button onClick={() => setEditingFav(fav)} className='edit-btn'>Edit</button>
                <button onClick={() => handleDeleteFavorite(fav.id)} className='edit-btn'>Delete</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default FavoritesGrid;