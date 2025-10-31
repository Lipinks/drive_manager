import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { useDriveAuth } from './hooks/useDriveAuth';
import StarManager from './components/StarManager/StarManager';
import StarDetails from './components/StarDetails/StarDetails';
import Header from './components/Header/Header';
import InstaPage from './components/InstaPage/InstaPage';
import VideosPage from './components/VideosPage/VideosPage';
import styles from './styles/styles';
import * as starService from './services/starService';
import LoginPage from './components/LoginPage/LoginPage';
import './App.css';
import LoadingPage from './components/LoadingPage/LoadingPage';

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
    setIsLoading(true);
    try {
      const element = document.querySelector('.star-manager');
      if (element) {
        // Listen for sync completion
        const handleSyncComplete = () => {
          setIsLoading(false);
          element.removeEventListener('syncComplete', handleSyncComplete);
        };
        
        element.addEventListener('syncComplete', handleSyncComplete);
        element.dispatchEvent(new Event('syncToDrive'));
        
        // Fallback timeout in case sync complete event doesn't fire
        setTimeout(() => {
          setIsLoading(false);
          element.removeEventListener('syncComplete', handleSyncComplete);
        }, 5000);
      }
    } catch (error) {
      console.error('Sync error:', error);
      alert('Failed to sync with Drive');
      setIsLoading(false);
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
          <LoadingPage />
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
            <Route path="/videos" element={<VideosPage />} />
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