import React, { useEffect, useState } from "react";

const GoogleDriveUploader = ({ data }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize Google API
  useEffect(() => {
    // Check if gapi is already available
    if (window.gapi) {
      initClient();
      return;
    }

    // Load the Google API client library
    const loadGoogleAPI = () => {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        window.gapi.load('client:auth2', initClient);
      };
      script.onerror = () => {
        console.error("Failed to load Google API script");
        setIsLoading(false);
      };
      document.body.appendChild(script);
    };

    loadGoogleAPI();
  }, []);

  const initClient = () => {
    setIsLoading(true);
    window.gapi.client
      .init({
        apiKey: "AIzaSyDuZGN2v9f5AcSyQOOgDJnPk6aX2_9a0pI", // Replace with your actual API key
        clientId: "450496045755-lqaocrtplfggmk8l4eidlcmmpgcsioug.apps.googleusercontent.com", // Replace with your actual client ID
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
        ],
        scope: "https://www.googleapis.com/auth/drive.file",
      })
      .then(() => {
        // Listen for sign-in state changes
        window.gapi.auth2.getAuthInstance().isSignedIn.listen(setIsSignedIn);
        // Set initial sign-in state
        setIsSignedIn(window.gapi.auth2.getAuthInstance().isSignedIn.get());
        setIsInitialized(true);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error initializing Google API", error);
        setIsLoading(false);
      });
  };

  // Handle authentication
  const handleAuthClick = () => {
    if (!isInitialized) return;

    if (isSignedIn) {
      window.gapi.auth2.getAuthInstance().signOut();
    } else {
      window.gapi.auth2.getAuthInstance().signIn();
    }
  };

  // Upload file to Google Drive
  const handleSave = async () => {
    if (!isSignedIn) {
      alert("Please sign in first!");
      return;
    }

    try {
      const fileContent = JSON.stringify(data, null, 2);
      const boundary = "-------314159265358979323846";
      const delimiter = "\r\n--" + boundary + "\r\n";
      const close_delim = "\r\n--" + boundary + "--";

      const metadata = {
        name: "data.json",
        mimeType: "application/json",
      };

      const multipartRequestBody =
        delimiter +
        "Content-Type: application/json\r\n\r\n" +
        JSON.stringify(metadata) +
        delimiter +
        "Content-Type: application/json\r\n\r\n" +
        fileContent +
        close_delim;

      const request = window.gapi.client.request({
        path: "/upload/drive/v3/files",
        method: "POST",
        params: { uploadType: "multipart" },
        headers: {
          "Content-Type": 'multipart/related; boundary="' + boundary + '"',
        },
        body: multipartRequestBody,
      });

      request.execute((file) => {
        if (file.error) {
          console.error("Upload error", file.error);
          alert("Error uploading file: " + file.error.message);
        } else {
          console.log("File uploaded successfully", file);
          alert("Data saved to Google Drive successfully! 🎉");
        }
      });
    } catch (error) {
      console.error("Error uploading file", error);
      alert("Error uploading file: " + error.message);
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "20px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
      }}
    >
      <h2 style={{ color: "#4285f4", marginTop: 0, textAlign: "center" }}>
        Google Drive Uploader
      </h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
          padding: "10px",
          backgroundColor: "#f8f9fa",
          borderRadius: "6px",
        }}
      >
        <img src="https://drive.google.com/file/d/1nzovlA0Jp0aCt9VEZtwGAvpNZvAv-NzA/view?usp=drive_link"/>
        <button
          onClick={handleAuthClick}
          style={{
            backgroundColor: "#4285f4",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "500",
            marginRight: "15px",
          }}
          disabled={isLoading || !isInitialized}
        >
          {isSignedIn ? "Sign Out" : "Sign In to Google"}
        </button>
        <span
          style={{
            fontSize: "14px",
            fontWeight: "500",
            color: isSignedIn ? "#34a853" : "#ea4335",
          }}
        >
          {isLoading
            ? "Loading..."
            : isSignedIn
            ? "Signed In"
            : "Not Signed In"}
        </span>
      </div>

      <button
        onClick={handleSave}
        style={{
          width: "100%",
          backgroundColor: isSignedIn ? "#34a853" : "#a8a8a8",
          color: "white",
          border: "none",
          padding: "12px",
          borderRadius: "4px",
          cursor: isSignedIn ? "pointer" : "not-allowed",
          fontSize: "16px",
          fontWeight: "500",
          marginBottom: "20px",
        }}
        disabled={!isSignedIn}
      >
        Save to Google Drive
      </button>

      <div style={{ marginTop: "20px" }}>
        <h3 style={{ marginBottom: "10px", color: "#5f6368" }}>
          Data to be saved:
        </h3>
        <pre
          style={{
            backgroundColor: "#f8f9fa",
            padding: "15px",
            borderRadius: "4px",
            overflow: "auto",
            maxHeight: "300px",
            border: "1px solid #e0e0e0",
            fontSize: "14px",
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>

      {!isInitialized && !isLoading && (
        <div style={{ marginTop: "20px", color: "#ea4335" }}>
          <p>Google API not initialized. Please check:</p>
          <ul>
            <li>Your API key and client ID are correctly set</li>
            <li>You've enabled the Google Drive API in the Google Cloud Console</li>
            <li>Your domain is authorized in the OAuth consent screen</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default GoogleDriveUploader;