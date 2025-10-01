const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
  }

  .header {
    background: linear-gradient(135deg, #4285f4, #34a853);
    padding: 0.5rem 2rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    position: sticky;
    z-index: 1000;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-buttons {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .header-btn {
    background-color: #f3f4f6;
    color: #374151;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
  }

  .header-btn:hover {
    background-color: #e5e7eb;
    color: #1f2937;
  }

  .sync-btn {
    background-color: #fbbc04;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .sync-btn:hover {
    background-color: #f9ab00;
  }

  .logo {
    font-family: 'Pacifico', cursive;
    font-size: 1.5rem;
    color: white;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  }

  .home-btn {
    background-color: #4285f4;
    color: white;
  }

  .home-btn:hover {
    background-color: #357ae8;
  }

  .fetch-btn {
    background-color: #34a853;
    color: white;
  }

  .fetch-btn:hover {
    background-color: #2d8d47;
  }

  .add-star-btn {
    background-color: #34a853;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }

  .add-star-btn:hover {
    background-color: #2d8d47;
  }

  .insta-btn {
    background-color: #e1306c;
    color: white;
  }

  .insta-btn:hover {
    background-color: #c1275b;
  }

  .signout-btn {
    background-color: #ea4335;
    color: white;
  }

  .signout-btn:hover {
    background-color: #d33426;
  }

  .stars-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    padding: 5px 8px;
  }

  .star-frame {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    position: relative;
  }

  .delete-star-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgba(234, 67, 53, 0.9);
    color: white;
    border: none;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .star-frame:hover .delete-star-btn {
    opacity: 1;
  }

  .delete-star-btn:hover {
    background: rgb(234, 67, 53);
  }

  .image-container {
    width: 100%;
    height: 200px;
    overflow: hidden;
    position: relative;
  }

  .image-container img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background-color: #f5f5f5;
  }

  .star-info {
    padding: 12px;
    text-align: center;
  }

  .star-info h3 {
    margin: 0 0 4px;
    color: #333;
  }

  .star-info p {
    margin: 0;
    color: #666;
    font-size: 14px;
  }

  /* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Modal Content */
.modal-content {
  background: #ffffff;
  border-radius: 16px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Modal Title */
.modal-content h2 {
  margin: 0 0 24px 0;
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.5px;
}

/* Form Inputs */
.modal-content input[type="text"],
.modal-content input[type="number"],
.modal-content input[type="url"] {
  width: 100%;
  padding: 14px 16px;
  margin-bottom: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 15px;
  font-family: inherit;
  color: #374151;
  background: #f9fafb;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.modal-content input[type="text"]:focus,
.modal-content input[type="number"]:focus,
.modal-content input[type="url"]:focus {
  outline: none;
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.modal-content input::placeholder {
  color: #9ca3af;
}

/* Tag Section */
.tag-section {
  background: #f9fafb;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
}

.tag-section h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Star Tags Display */
.star-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 40px;
  margin-bottom: 16px;
  padding: 12px;
  background: #ffffff;
  border-radius: 8px;
  border: 2px dashed #e5e7eb;
}

.star-tags:empty::after {
  content: "No tags added yet";
  color: #9ca3af;
  font-size: 14px;
}

/* Tag Styling */
.tag {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.3px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Add Tag Section */
.add-tag {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

/* Select Dropdown */
.edit-input {
  flex: 1;
  padding: 12px 14px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  color: #374151;
  background: #ffffff;
  transition: all 0.2s ease;
  cursor: pointer;
}

.edit-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Add Tag Button */
.add-tag-btn {
  padding: 12px 20px;
  background: #3b82f6;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.add-tag-btn:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.add-tag-btn:active {
  transform: translateY(0);
}

/* Modal Buttons */
.modal-buttons {
  display: flex;
  gap: 12px;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 2px solid #f3f4f6;
}

.save-btn,
.cancel-btn {
  flex: 1;
  padding: 14px 24px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: 0.3px;
}

.save-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
}

.cancel-btn {
  background: #f3f4f6;
  color: #6b7280;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.cancel-btn:hover {
  background: #e5e7eb;
  color: #374151;
  transform: translateY(-2px);
}

.save-btn:active,
.cancel-btn:active {
  transform: translateY(0);
}

/* Scrollbar Styling */
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
  transition: background 0.2s ease;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Responsive Design */
@media (max-width: 600px) {
  .modal-content {
    padding: 24px 20px;
    width: 95%;
  }

  .modal-content h2 {
    font-size: 24px;
  }

  .modal-buttons {
    flex-direction: column;
  }

  .add-tag,

  .add-tag-btn {
    width: 100%;
  }
}
  /* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Modal Content */
.modal-content {
  background: #ffffff;
  border-radius: 16px;
  padding: 32px;
  max-width: 550px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Modal Title */
.modal-content h2 {
  margin: 0 0 24px 0;
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.5px;
}

/* Form Inputs */
.modal-content input[type="text"],
.modal-content input[type="number"],
.modal-content input[type="url"] {
  width: 100%;
  padding: 14px 16px;
  margin-bottom: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 15px;
  font-family: inherit;
  color: #374151;
  background: #f9fafb;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.modal-content input[type="text"]:focus,
.modal-content input[type="number"]:focus,
.modal-content input[type="url"]:focus {
  outline: none;
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.modal-content input::placeholder {
  color: #9ca3af;
}

/* Tag Section */
.tag-section {
  background: #f9fafb;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
}

.tag-section h3 {
  margin: 0 0 12px 0;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

/* Selected Tags Container */
.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 50px;
  margin-bottom: 24px;
  padding: 14px;
  background: #ffffff;
  border-radius: 10px;
  border: 2px dashed #d1d5db;
  transition: all 0.2s ease;
}

.selected-tags:empty::after {
  content: "Click tags below to select them";
  color: #9ca3af;
  font-size: 14px;
  font-style: italic;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.selected-tags:has(.selected-tag) {
  border-color: #10b981;
  border-style: solid;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
}

/* Available Tags Container */
.available-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
  padding: 14px;
  background: #ffffff;
  border-radius: 10px;
  min-height: 50px;
  border: 2px solid #e5e7eb;
}

.available-tags:empty::after {
  content: "All tags are selected";
  color: #9ca3af;
  font-size: 14px;
  font-style: italic;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

/* Base Tag Styling */
.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.3px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

/* Selected Tag Styling */
.selected-tag {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.selected-tag:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
}

.selected-tag:active {
  transform: translateY(0) scale(0.98);
}

.selected-tag .remove-icon {
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
  margin-left: 2px;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.selected-tag:hover .remove-icon {
  opacity: 1;
}

/* Available Tag Styling */
.available-tag {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #374151;
  border: 2px solid #d1d5db;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.available-tag:hover {
  transform: translateY(-2px) scale(1.05);
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: #ffffff;
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.available-tag:active {
  transform: translateY(0) scale(0.98);
}

.available-tag .add-icon {
  font-size: 18px;
  font-weight: 700;
  line-height: 1;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.available-tag:hover .add-icon {
  opacity: 1;
}

/* Modal Buttons */
.modal-buttons {
  display: flex;
  gap: 12px;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 2px solid #f3f4f6;
}

.save-btn,
.cancel-btn {
  flex: 1;
  padding: 14px 24px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: 0.3px;
}

.save-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
}

.cancel-btn {
  background: #f3f4f6;
  color: #6b7280;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.cancel-btn:hover {
  background: #e5e7eb;
  color: #374151;
  transform: translateY(-2px);
}

.save-btn:active,
.cancel-btn:active {
  transform: translateY(0);
}

/* Scrollbar Styling */
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
  transition: background 0.2s ease;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Responsive Design */
@media (max-width: 600px) {
  .modal-content {
    padding: 24px 20px;
    width: 95%;
  }

  .modal-content h2 {
    font-size: 24px;
  }

  .modal-buttons {
    flex-direction: column;
  }

}
/* Create New Tag Section */
.create-new-tag {
  display: flex;
  gap: 10px;
  align-items: flex-start; /* Changed from stretch to flex-start */
  margin-top: 16px;
  padding-top: 16px;
  border-top: 2px solid #e5e7eb;
}

.new-tag-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  line-height: 1.5;
  font-family: inherit;
  color: #374151;
  background: #ffffff;
  transition: all 0.2s ease;
  box-sizing: border-box;
  height: 44px; /* Explicit height */
}

.new-tag-input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.create-tag-btn {
  padding: 10px 20px; /* Reduced vertical padding */
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: #ffffff;
  border: 2px solid transparent;
  border-radius: 10px;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
  white-space: nowrap;
  box-sizing: border-box;
  height: 44px; /* Match input height exactly */
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.create-tag-btn:hover {
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
}

.create-tag-btn:active {
  transform: translateY(0);
}




`;

export default styles;