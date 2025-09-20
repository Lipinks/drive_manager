import React, { useState, useEffect } from 'react';

const GoogleDriveApp = () => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [tokenClient, setTokenClient] = useState(null);

  // Load Google API script
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

  // Initialize token client
  const initTokenClient = () => {
    if (window.google && window.google.accounts) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: "567189276629-9tkesauoqldd41mnr5gdeh0t2ii67432.apps.googleusercontent.com",
        scope: "https://www.googleapis.com/auth/drive",
        callback: (response) => {
          if (response.error) {
            console.error("Token error:", response);
            return;
          }
          setAccessToken(response.access_token);
          localStorage.setItem('accessToken', response.access_token);
        },
      });
      setTokenClient(client);
    }
  };

  // List files when access token is available
  useEffect(() => {
    if (accessToken) {
      listFiles();
    }
  }, [accessToken]);

  const handleDriveAuth = () => {
    if (tokenClient) {
      tokenClient.requestAccessToken({ prompt: "consent" });
    }
  };

  const listFiles = () => {
    fetch("https://www.googleapis.com/drive/v3/files?fields=files(id,name,modifiedTime)", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.files && data.files.length > 0) {
        setFiles(data.files);
      } else {
        setFiles([]);
      }
    })
    .catch(error => {
      console.error("Error listing files:", error);
    });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadStatus('');
  };

  const uploadFile = () => {
    if (!selectedFile || !accessToken) {
      setUploadStatus("Missing file or token");
      return;
    }

    const metadata = {
      name: selectedFile.name,
      mimeType: selectedFile.type
    };

    const form = new FormData();
    form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    form.append("file", selectedFile);

    fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
      method: "POST",
      headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
      body: form,
    })
    .then(res => res.json())
    .then(data => {
      setUploadStatus(`Uploaded: ${data.name}`);
      setSelectedFile(null);
      document.getElementById('fileInput').value = '';
      listFiles();
    })
    .catch(err => {
      console.error(err);
      setUploadStatus("Upload failed.");
    });
  };

  const downloadFile = (fileId) => {
    if (!accessToken) {
      alert("No access token found.");
      return;
    }

    fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      method: "GET",
      headers: new Headers({ Authorization: `Bearer ${accessToken}` })
    })
    .then(response => response.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "download-file";
      link.click();
      URL.revokeObjectURL(url);
    })
    .catch(err => {
      alert("Download failed.");
    });
  };

  const deleteFile = (fileId) => {
    if (!fileId || !accessToken) {
      console.error("Missing file ID or token.");
      return;
    }

    fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    })
    .then(response => {
      if (response.ok) {
        alert("File deleted successfully.");
        listFiles();
      } else {
        console.error("Failed to delete file");
        alert("Failed to delete file.");
      }
    })
    .catch(error => {
      console.error("Error deleting file:", error);
      alert("Error deleting file.");
    });
  };

  const signOut = () => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.disableAutoSelect();
    }
    setAccessToken(null);
    localStorage.removeItem('accessToken');
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date available";
    
    const date = new Date(dateString);
    return isNaN(date) ? "Invalid date" : date.toLocaleString();
  };

  // Render login screen if not authenticated
  if (!accessToken) {
    return (
      <div className="home-container">
        <h1>Google Drive Integration</h1>
        <button onClick={handleDriveAuth} className="signin-btn">
          Sign in with Google
        </button>
      </div>
    );
  }

  // Render file manager if authenticated
  return (
    <div className="profile-container">
      <h1>Google Drive Files</h1>
      
      <div className="control-container">
        <div className="upload-controls">
          <input 
            type="file" 
            id="fileInput" 
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="fileInput" className="custom-file-upload">
            Choose File
          </label>
          
          <div className="selected-file">
            {selectedFile ? selectedFile.name : "No file selected"}
          </div>
          
          <button onClick={uploadFile} className="upload-btn">
            Upload
          </button>
          
          {uploadStatus && (
            <div className="upload-status">{uploadStatus}</div>
          )}
        </div>
        
        <div className="sign-out-container">
          <button onClick={signOut} className="signout-btn">
            Sign Out
          </button>
        </div>
      </div>

      <table className="file-table">
        <thead>
          <tr>
            <th>File Name</th>
            <th>Last Modified</th>
            <th>Download</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {files.length > 0 ? (
            files.map(file => (
              <tr key={file.id}>
                <td>{file.name}</td>
                <td>{formatDate(file.modifiedTime)}</td>
                <td>
                  <button 
                    onClick={() => downloadFile(file.id)}
                    className="download-btn"
                  >
                    Download
                  </button>
                </td>
                <td>
                  <button 
                    onClick={() => deleteFile(file.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="no-files">
                No Files found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// CSS Styles
const styles = `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f5f5f5;
    color: #333;
    line-height: 1.6;
  }

  .home-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 20px;
    text-align: center;
  }

  .home-container h1 {
    margin-bottom: 30px;
    color: #4285f4;
  }

  .signin-btn {
    background-color: #4285f4;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .signin-btn:hover {
    background-color: #357ae8;
  }

  .profile-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .profile-container h1 {
    text-align: center;
    margin-bottom: 30px;
    color: #4285f4;
  }

  .control-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    flex-wrap: wrap;
    gap: 20px;
  }

  .upload-controls {
    display: flex;
    align-items: center;
    gap: 15px;
    flex-wrap: wrap;
  }

  .custom-file-upload {
    background-color: #f1f1f1;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    border: 1px solid #ccc;
    transition: background-color 0.3s;
  }

  .custom-file-upload:hover {
    background-color: #e1e1e1;
  }

  .selected-file {
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 4px;
    min-width: 150px;
  }

  .upload-btn {
    background-color: #34a853;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .upload-btn:hover {
    background-color: #2d8d47;
  }

  .upload-status {
    padding: 10px;
    background-color: #e6f4ea;
    border-radius: 4px;
    color: #137333;
  }

  .sign-out-container {
    margin-left: auto;
  }

  .signout-btn {
    background-color: #ea4335;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .signout-btn:hover {
    background-color: #d33426;
  }

  .file-table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
  }

  .file-table th,
  .file-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  .file-table th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #5f6368;
  }

  .file-table tr:hover {
    background-color: #f9f9f9;
  }

  .download-btn {
    background-color: #4285f4;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .download-btn:hover {
    background-color: #357ae8;
  }

  .delete-btn {
    background-color: #ea4335;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .delete-btn:hover {
    background-color: #d33426;
  }

  .no-files {
    text-align: center;
    padding: 30px;
    color: #5f6368;
  }

  @media (max-width: 768px) {
    .control-container {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .sign-out-container {
      margin-left: 0;
      width: 100%;
    }
    
    .file-table {
      display: block;
      overflow-x: auto;
    }
  }
`;

// Add styles to the document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default GoogleDriveApp;