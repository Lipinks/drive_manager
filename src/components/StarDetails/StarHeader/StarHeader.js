import './StarHeader.css';

const StarHeader = ({ star, setShowVidEditModal, setShowVidAddModal }) => {
  return (
    <div className="star-header">
      <div className="star-main-info">
        <div className="star-image-container">
          <img src={star.Image_Link} alt={star.Name} />
        </div>
        <div className="star-text-info">
          <h1>{star.Name}</h1>
          <div className="tags-list">
            <strong>Tags:</strong>
            {star.Tags.length === 0 ? (
              <span className="no-tags"> No tags</span>
            ) : (
              <ul>
                {star.Tags.map((t, i) => (
                  <li key={i} className="tag-item">
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <div className="button-group">
        <button className="add-favorite-btn" onClick={() => setShowVidAddModal(true)}>
          Add Favorite
        </button>
        <button className="add-favorite-btn" onClick={() => setShowVidEditModal(true)}>
          Edit Star
        </button>
      </div>
    </div>
  );
};

export default StarHeader;