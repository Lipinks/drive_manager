import React, { useState, useEffect } from 'react';

const Profile = ({ accessToken, onSignOut }) => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    listFiles();
  }, [accessToken]);

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

  const formatDate = (dateString) => {
    if (!dateString) return "No date available";
    
    const date = new Date(dateString);
    return isNaN(date) ? "Invalid date" : date.toLocaleString();
  };

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
          <button onClick={onSignOut} className="signout-btn">
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

export default Profile;