import React, { useEffect, useState } from 'react';

const Home = ({ onSetAccessToken }) => {
  const [tokenClient, setTokenClient] = useState(null);

  useEffect(() => {
    // Initialize the token client once Google API is loaded
    const initTokenClient = () => {
      if (window.google && window.google.accounts) {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: "52677784884-87658h6utyutiyi7asad1tjpf5wf3t5abbnj.apps.googleusercontent.com",
          scope: "https://www.googleapis.com/auth/drive",
          callback: (response) => {
            if (response.error) {
              console.error("Token error:", response);
              return;
            }
            onSetAccessToken(response.access_token);
          },
        });
        setTokenClient(client);
      }
    };

    // Try to initialize immediately
    initTokenClient();

    // If Google API isn't loaded yet, set up a listener
    if (!window.google) {
      window.addEventListener('load', initTokenClient);
      return () => window.removeEventListener('load', initTokenClient);
    }
  }, [onSetAccessToken]);

  const handleDriveAuth = () => {
    if (tokenClient) {
      tokenClient.requestAccessToken({ prompt: "consent" });
    }
  };

  return (
    <div className="home-container">
      <h1>Google Drive Integration</h1>
      <button onClick={handleDriveAuth} className="signin-btn">
        Sign in with Google
      </button>
    </div>
  );
};

export default Home;