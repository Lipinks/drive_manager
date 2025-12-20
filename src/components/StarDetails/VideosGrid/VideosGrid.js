import './VideosGrid.css';

const VideosGrid = ({ favorites = [], setEditingFav, handleDeleteFavorite }) => {
  return (
    <div className="favorites-grid">
      {favorites.map((fav) => (
        <div key={fav.id} className="favorite-card">
            <a href={fav.url} target="_blank" rel="noopener noreferrer">
              <img src={fav.imageUrl} alt={fav.name} />
            </a>
            <h3>{fav.name}</h3>
          <div className="favorite-tags">
            {fav.tags && fav.tags.length > 0 && (
              <div className="tags-scroll-container">
                <div className="tags-scroll-wrapper">
                  {fav.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}
            <button onClick={() => setEditingFav(fav)} className='vid-edit-button'>Edit</button>
            <button onClick={() => handleDeleteFavorite(fav.id)} className='vid-delete-button'>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default VideosGrid;