import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { useDriveAuth } from './hooks/useDriveAuth';
import StarManager from './components/StarManager/StarManager';
import StarDetails from './components/StarDetails/StarDetails';
import Header from './components/Header/Header';
import InstaPage from './components/InstaPage/InstaPage';
import styles from './styles/styles';
import * as starService from './services/starService';
import LoginPage from './components/LoginPage/LoginPage';
import './App.css';

const BigAndBingApp = () => {
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
      const starData = await starService.fetchStarFile(accessToken);
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

  const handleSync = async () => {
    try {
      const element = document.querySelector('.star-manager');
      if (element) {
        element.dispatchEvent(new Event('syncToDrive'));
      }
    } catch (error) {
      console.error('Sync error:', error);
      alert('Failed to sync with Drive');
    }
  };

  if (!accessToken) {
    return <LoginPage handleAuth={handleAuth} />;
  }

  return (
    <HashRouter>
      <div>
        <Header 
          onAddStar={() => {
            console.log('onAddStar called');
            setShowAddStar(true);
          }}
          onSignOut={handleSignOut}
          onSync={handleSync}
          onFetchData={handleFetchData}
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
                onSyncChange={setHasChanges} // Pass onSyncChange to StarDetails
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

export default BigAndBingApp;