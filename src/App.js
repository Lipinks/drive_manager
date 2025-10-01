import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { useDriveAuth } from './hooks/useDriveAuth';
import StarManager from './components/StarManager/StarManager';
import StarDetails from './components/StarDetails/StarDetails';
import Header from './components/Header/Header';
import InstaPage from './components/InstaPage/InstaPage';
import styles from './styles/styles';
import * as starService from './services/starService';

const GoogleDriveApp = () => {
  const { accessToken, handleDriveAuth: handleAuth, signOut: handleSignOut } = useDriveAuth();
  const [showAddStar, setShowAddStar] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stars, setStars] = useState(() => {
    const savedStars = localStorage.getItem('stars');
    return savedStars ? JSON.parse(savedStars) : [];
  });

  // Load stars from localStorage on mount
  useEffect(() => {
    const loadInitialStars = async () => {
      try {
        const savedStars = localStorage.getItem('stars');
        if (savedStars) {
          setStars(JSON.parse(savedStars));
        }
      } catch (error) {
        console.error('Error loading stars:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialStars();
  }, []);

  const handleFetchData = async () => {
    setIsLoading(true);
    try {
      const starData = await starService.getStarFile(accessToken);
      setStars(starData);
      localStorage.setItem('stars', JSON.stringify(starData));
    } catch (error) {
      console.error('Error fetching stars:', error);
      alert('Failed to fetch data from Drive');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStarsUpdate = (newStars) => {
    if (Array.isArray(newStars)) {
      setStars(newStars);
      localStorage.setItem('stars', JSON.stringify(newStars));
    }
  };

  if (!accessToken) {
    return (
      <div className="home-container">
        <h1>Google Drive Integration</h1>
        <button onClick={handleAuth} className="signin-btn">
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <HashRouter>
      <div>
        <Header 
          onAddStar={() => setShowAddStar(true)}
          onSignOut={handleSignOut}
          onFetchData={handleFetchData}
          onSync={() => {
            const starManagerRef = document.querySelector('.star-manager');
            if (starManagerRef) {
              starManagerRef.dispatchEvent(new CustomEvent('syncToDrive'));
            }
          }}
          showSync={hasChanges}
        />
        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : (
          <Routes>
            <Route path="/" element={
              <StarManager 
                accessToken={accessToken}
                showModal={showAddStar}
                onCloseModal={() => setShowAddStar(false)}
                onSyncChange={setHasChanges}
                onStarsUpdate={handleStarsUpdate}
                stars={stars}
                isLoading={isLoading}
              />
            } />
            <Route path="/star/:starName" element={
              <StarDetails 
                stars={stars} 
                onStarsUpdate={(newStars) => {
                  handleStarsUpdate(newStars);
                  setHasChanges(true);
                }}
              />
            } />
            <Route path="/insta" element={<InstaPage />} />
          </Routes>
        )}
      </div>
    </HashRouter>
  );
};

// Add styles to the document
if (!document.getElementById('app-styles')) {
  const styleSheet = document.createElement("style");
  styleSheet.id = 'app-styles';
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default GoogleDriveApp;