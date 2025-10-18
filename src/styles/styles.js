const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
  }

/* Star Details Page Styling */
.star-details {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  background: #ffffff;
  min-height: calc(100vh - 60px);
}

.star-details-content {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 40px;
  padding: 30px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.star-image {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.star-image img {
  width: 100%;
  height: 500px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.star-image:hover img {
  transform: scale(1.03);
}

.star-info-detailed {
  padding: 20px;
}

.star-info-detailed h1 {
  font-size: 36px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 24px;
  letter-spacing: -0.5px;
}

.star-info-detailed p {
  font-size: 18px;
  line-height: 1.6;
  color: #4b5563;
  margin-bottom: 16px;
}

.star-info-detailed .age,
.star-info-detailed .country {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 16px;
  font-weight: 500;
}

/* Edit Mode Styling */
.edit-input {
  width: 100%;
  padding: 14px 16px;
  margin-bottom: 20px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 16px;
  color: #374151;
  background: #f9fafb;
  transition: all 0.2s ease;
}

.edit-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.edit-buttons {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.edit-buttons button {
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

/* Star Header Styling */
.star-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 30px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
}

.star-main-info {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.star-image-container {
  width: 200px;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.star-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.star-text-info {
  padding: 10px 0;
}

.add-favorite-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #f472b6 0%, #db2777 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(219, 39, 119, 0.3);
}

.add-favorite-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(219, 39, 119, 0.4);
}

/* Favorites Grid Styling */
.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
  padding: 20px;
}

.favorite-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.favorite-card:hover {
  transform: translateY(-4px);
}

.favorite-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.favorite-card h3 {
  padding: 12px;
  margin: 0;
  font-size: 16px;
  color: #374151;
}

.favorite-card a {
  display: inline-block;
  margin: 0 12px 12px;
  color: #2563eb;
  text-decoration: none;
}

.favorite-actions {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid #e5e7eb;
}

.favorite-actions button {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.favorite-actions button:first-child {
  background: #3b82f6;
  color: white;
}

.favorite-actions button:last-child {
  background: #ef4444;
  color: white;
}

.edit-favorite-form {
  padding: 16px;
}

.edit-favorite-form input {
  width: 100%;
  padding: 8px;
  margin-bottom: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}
`;

export default styles;