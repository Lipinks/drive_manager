import { useState, useEffect } from 'react';

export const useDriveAuth = () => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [tokenClient, setTokenClient] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initTokenClient;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initTokenClient = () => {
    if (window.google && window.google.accounts) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: "567189276629-9tkesauoqldd41mnr5gdeh0t2ii67432.apps.googleusercontent.com",
        scope: "https://www.googleapis.com/auth/drive",
        callback: handleAuthResponse,
      });
      setTokenClient(client);
    }
  };

  const handleAuthResponse = (response) => {
    if (response.error) {
      console.error("Token error:", response);
      return;
    }
    setAccessToken(response.access_token);
    localStorage.setItem('accessToken', response.access_token);
  };

  const handleDriveAuth = () => {
    if (tokenClient) {
      tokenClient.requestAccessToken({ prompt: "consent" });
    }
  };

  const signOut = () => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.disableAutoSelect();
    }
    setAccessToken(null);
    localStorage.removeItem('accessToken');
  };

  return { accessToken, handleDriveAuth, signOut };
};