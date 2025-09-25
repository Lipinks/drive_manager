const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    p.stars-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    padding: 0 40px;
    margin-top: 30px;
  }g: 0;
  }

  .header {
    background: linear-gradient(135deg, #4285f4, #34a853);
    padding: 0.5rem 2rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    position: sticky;
     @media (max-width: 1400px) {
    .star-manager {
      padding: 30px 40px;
    }
    .stars-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 1024px) {
    .star-manager {
      padding: 30px 120px;
      max-width: 1600px;
      margin: 0 auto;
    }
    .stars-grid {
      grid-template-columns: repeat(2, 1fr);
    }
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
    
    .stars-grid {
      grid-template-columns: 1fr;
      padding: 0 15px;
    }
  }index: 1000;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-buttons {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .sync-btn {
    background-color: #fbbc04;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .sync-btn:hover {
    background-color: #f9ab00;
  }

  .logo {
    font-family: 'Pacifico', cursive;
    font-size: 1.5rem;
    color: white;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  }

  .add-star-btn {
    background-color: #34a853;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1100;
  }

  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .modal-content h2 {
    margin-bottom: 1.5rem;
    color: #333;
  }

  .modal-content input {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .modal-buttons {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1.5rem;
  }

  .save-btn, .cancel-btn {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    border: none;
  }

  .save-btn {
    background-color: #34a853;
    color: white;
  }

  .cancel-btn {
    background-color: #ea4335;
    color: white;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color  .star-manager {
    padding: 30px 60px;
    max-width: 1600px;
    margin: 0 auto;
  }

  .input-section {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    flex-wrap: wrap;
    align-items: center;
  }

  .input-section input {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }

  .save-btn {
    background-color: #34a853;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  }

  .sync-btn {
    background-color: #4285f4;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  }

  .stars-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    padding: 5px 8px;
  }

  .star-frame {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    position: relative;
  }

  .delete-star-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgba(234, 67, 53, 0.9);
    color: white;
    border: none;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .star-frame:hover .delete-star-btn {
    opacity: 1;
  }

  .delete-star-btn:hover {
    background: rgb(234, 67, 53);
  }

  .image-container {
    width: 100%;
    height: 200px;
    overflow: hidden;
    position: relative;
  }

  .image-container img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background-color: #f5f5f5;
  }

  .delete-star-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgba(234, 67, 53, 0.9);
    color: white;
    border: none;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .star-frame:hover .delete-star-btn {
    opacity: 1;
  }

  .delete-star-btn:hover {
    background: rgb(234, 67, 53);
  }

  .star-info {
    padding: 12px;
    text-align: center;
  }

  .star-info h3 {
    margin: 0 0 4px;
    color: #333;
  }

  .star-info p {
    margin: 0;
    color: #666;
    font-size: 14px;
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
    
    .stars-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 480px) {
    .stars-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 1200px) {
    .stars-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 900px) {
    .stars-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 600px) {
    .stars-grid {
      grid-template-columns: 1fr;
    }
    
    .star-manager {
      padding: 20px;
    }
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

export default styles;