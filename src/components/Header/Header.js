import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ onAddStar, onSignOut, onSync, onFetchData }) => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="logo">BigAndBig</div>
      <div className="header-buttons">
        <button onClick={() => navigate('/')} className="home-btn">Home</button>
        <button onClick={onFetchData} className="fetch-btn">Fetch Data</button>
        <button onClick={onSync} className="sync-btn">Sync to Drive</button>
        <button onClick={onAddStar} className="add-star-btn">Add Star</button>
        <button onClick={onSignOut} className="signout-btn">Sign Out</button>
      </div>
    </header>
  );
};

export default Header;