import React, { useState } from 'react';
import { useDriveAuth } from './hooks/useDriveAuth';
import StarManager from './components/StarManager/StarManager';
import Header from './components/Header/Header';
import styles from './styles/styles';

const GoogleDriveApp = () => {
  const { accessToken, handleDriveAuth: handleAuth, signOut: handleSignOut } = useDriveAuth();
  const [showAddStar, setShowAddStar] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

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
    <div>
      <Header 
        onAddStar={() => setShowAddStar(true)}
        onSignOut={handleSignOut}
        onSync={() => {
          const starManagerRef = document.querySelector('.star-manager');
          if (starManagerRef) {
            starManagerRef.dispatchEvent(new CustomEvent('syncToDrive'));
          }
        }}
        showSync={hasChanges}
      />
      <StarManager 
        accessToken={accessToken}
        showModal={showAddStar}
        onCloseModal={() => setShowAddStar(false)}
        onSyncChange={setHasChanges}
      />
    </div>
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