import React, { useState, useEffect, useCallback } from 'react';
import './gallery.css';

const IMAGES_PER_PAGE = 20;

const Gallery = ({ accessToken }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [galleryFolderId, setGalleryFolderId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [fullImageUrl, setFullImageUrl] = useState(null);
  const [loadingFullImage, setLoadingFullImage] = useState(false);
  const [error, setError] = useState(null);

  // Find or create the 'gallery' folder in Google Drive
  const getGalleryFolderId = useCallback(async () => {
    try {
      // Search for existing 'gallery' folder
      const searchResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=name='gallery' and mimeType='application/vnd.google-apps.folder' and trashed=false&fields=files(id,name)`,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      const searchData = await searchResponse.json();
      
      if (searchData.files && searchData.files.length > 0) {
        return searchData.files[0].id;
      }
      
      // Create 'gallery' folder if it doesn't exist
      const createResponse = await fetch(
        'https://www.googleapis.com/drive/v3/files',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: 'gallery',
            mimeType: 'application/vnd.google-apps.folder'
          })
        }
      );
      const createData = await createResponse.json();
      return createData.id;
    } catch (err) {
      console.error('Error getting gallery folder:', err);
      throw err;
    }
  }, [accessToken]);

  // Fetch images from the gallery folder
  const fetchGalleryImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const folderId = await getGalleryFolderId();
      setGalleryFolderId(folderId);
      
      // Fetch images from the gallery folder
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents and (mimeType contains 'image/') and trashed=false&fields=files(id,name,mimeType,thumbnailLink,webContentLink,createdTime)&orderBy=createdTime desc&pageSize=1000`,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      
      const data = await response.json();
      setImages(data.files || []);
    } catch (err) {
      console.error('Error fetching gallery images:', err);
      setError('Failed to load images. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [accessToken, getGalleryFolderId]);

  useEffect(() => {
    if (accessToken) {
      fetchGalleryImages();
    }
  }, [accessToken, fetchGalleryImages]);

  // Upload image to Google Drive
  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setUploading(true);
    
    try {
      const folderId = galleryFolderId || await getGalleryFolderId();
      
      // Create file metadata
      const metadata = {
        name: file.name,
        parents: [folderId]
      };

      // Create form data for multipart upload
      const formData = new FormData();
      formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      formData.append('file', file);

      const response = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,thumbnailLink,webContentLink,createdTime',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const uploadedFile = await response.json();
      
      // Add the new image to the beginning of the list
      setImages(prevImages => [uploadedFile, ...prevImages]);
      
      // Reset to first page to show the new upload
      setCurrentPage(1);
      
      alert('Image uploaded successfully!');
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      // Reset the file input
      event.target.value = '';
    }
  };

  // Delete image from Google Drive
  const handleDelete = async (imageId, imageName) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${imageName}"?`);
    if (!confirmed) return;

    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${imageId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );

      if (!response.ok && response.status !== 204) {
        throw new Error('Delete failed');
      }

      // Remove the image from the list
      setImages(prevImages => prevImages.filter(img => img.id !== imageId));
      setSelectedImage(null);
    } catch (err) {
      console.error('Error deleting image:', err);
      alert('Failed to delete image. Please try again.');
    }
  };

  // Get image URL for display
  const getImageUrl = (image) => {
    // Use thumbnail for grid view, or construct a direct link
    if (image.thumbnailLink) {
      // Increase thumbnail size
      return image.thumbnailLink.replace('=s220', '=s400');
    }
    return `https://drive.google.com/uc?export=view&id=${image.id}`;
  };

  // Fetch full-size image with authentication
  const fetchFullImage = async (image) => {
    setLoadingFullImage(true);
    setSelectedImage(image);
    setFullImageUrl(null);
    
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${image.id}?alt=media`,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to load image');
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setFullImageUrl(url);
    } catch (err) {
      console.error('Error loading full image:', err);
      // Fallback to thumbnail with larger size
      if (image.thumbnailLink) {
        setFullImageUrl(image.thumbnailLink.replace('=s220', '=s1600'));
      }
    } finally {
      setLoadingFullImage(false);
    }
  };

  // Clean up blob URL when modal closes
  const closeModal = () => {
    if (fullImageUrl && fullImageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(fullImageUrl);
    }
    setSelectedImage(null);
    setFullImageUrl(null);
  };

  // Pagination calculations
  const totalPages = Math.ceil(images.length / IMAGES_PER_PAGE);
  const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
  const endIndex = startIndex + IMAGES_PER_PAGE;
  const currentImages = images.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (loading) {
    return (
      <div className="gallery-page">
        <div className="gallery-loading">
          <div className="loading-spinner"></div>
          <p>Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <div className="gallery-actions">
          <label className={`upload-btn ${uploading ? 'uploading' : ''}`}>
            {uploading ? (
              <>
                <span className="upload-spinner"></span>
                Uploading...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M12 4L12 16M12 4L8 8M12 4L16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <path d="M4 17V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                </svg>
                Upload Image
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              hidden
            />
          </label>
          <button className="refresh-btn" onClick={fetchGalleryImages} disabled={loading}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="gallery-error">
          <p>{error}</p>
          <button onClick={fetchGalleryImages}>Try Again</button>
        </div>
      )}

      {!error && images.length === 0 ? (
        <div className="gallery-empty">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="64" height="64">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <p>No images in gallery yet</p>
          <p className="gallery-empty-hint">Upload your first image to get started!</p>
        </div>
      ) : (
        <>

          <div className="gallery-grid">
            {currentImages.map((image) => (
              <div 
                key={image.id} 
                className="gallery-item"
                onClick={() => fetchFullImage(image)}
              >
                <img
                  src={getImageUrl(image)}
                  alt={image.name}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = `https://drive.google.com/uc?export=view&id=${image.id}`;
                  }}
                />
                <div className="gallery-item-overlay">
                  <span className="gallery-item-name">{image.name}</span>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="gallery-pagination">
              <button 
                className="pagination-btn"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>
              
              <div className="pagination-numbers">
                {getPageNumbers().map((page, index) => (
                  page === '...' ? (
                    <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                  ) : (
                    <button
                      key={page}
                      className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </button>
                  )
                ))}
              </div>
              
              <button 
                className="pagination-btn"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Full-size image modal */}
      {selectedImage && (
        <div className="gallery-modal" onClick={closeModal}>
          <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            {loadingFullImage ? (
              <div className="modal-loading">
                <div className="loading-spinner"></div>
                <p>Loading image...</p>
              </div>
            ) : (
              <img 
                src={fullImageUrl} 
                alt={selectedImage.name}
              />
            )}
            <div className="modal-info">
              <span className="modal-name">{selectedImage.name}</span>
              <button 
                className="modal-delete-btn"
                onClick={() => handleDelete(selectedImage.id, selectedImage.name)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
