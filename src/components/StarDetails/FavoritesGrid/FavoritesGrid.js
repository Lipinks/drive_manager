import './FavoritesGrid.css';
import EditFavDialog from './EditFavDialog/EditFavDialog';

const FavoritesGrid = ({ favorites = [], editingFav, setEditingFav, handleEditFavorite, handleDeleteFavorite }) => {
  return (
    <div className="favorites-grid">
      {favorites.map((fav) => (
        <div key={fav.id} className="favorite-card">
          {editingFav?.id === fav.id ? (
            <EditFavDialog 
              editingFav={editingFav}
              handleEditFavorite={handleEditFavorite}
              setEditingFav={setEditingFav} />
          ) : (
            <>
              <img src={fav.imageUrl} alt={fav.name} />
              <h3>{fav.name}</h3>
              {fav.url && (
                <a href={fav.url} target="_blank" rel="noopener noreferrer">
                  Visit
                </a>
              )}
              <div className="favorite-actions">
                <button onClick={() => setEditingFav(fav)}>Edit</button>
                <button onClick={() => handleDeleteFavorite(fav.id)}>Delete</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default FavoritesGrid;