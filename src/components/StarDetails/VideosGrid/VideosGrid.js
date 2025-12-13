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
            <button onClick={() => setEditingFav(fav)} className='vid-edit-button'>Edit</button>
            <button onClick={() => handleDeleteFavorite(fav.id)} className='vid-delete-button'>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default VideosGrid;