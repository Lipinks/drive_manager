import React, { useEffect } from 'react';

const GoogleSignIn = ({ onCredentialResponse }) => {
  useEffect(() => {
    // Initialize Google Sign-In when component mounts
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: "567189276629-9tkesauoqldd41mnr5gdeh0t2ii67432.apps.googleusercontent.com",
        callback: onCredentialResponse
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleSignIn"),
        { theme: "outline", size: "large", type: "standard" }
      );
    }
  }, [onCredentialResponse]);

  return (
    <div className="signin-container">
      <h1>Google SignIn</h1>
      <div id="googleSignIn"></div>
    </div>
  );
};

export default GoogleSignIn;