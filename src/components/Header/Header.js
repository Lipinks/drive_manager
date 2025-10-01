import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ onAddStar, onSignOut, onSync, onFetchData }) => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="logo">BigAndBig</div>
      <div className="header-buttons">
        <button onClick={() => navigate('/')} className="header-btn home-btn">Home</button>
        <button onClick={onFetchData} className="header-btn fetch-btn">Fetch Data</button>
        <button onClick={onSync} className="header-btn sync-btn">Sync to Drive</button>
        <button onClick={onAddStar} className="header-btn add-star-btn">Add Star</button>
        <button onClick={() => navigate('/insta')} className="header-btn insta-btn">Insta</button>
        <button onClick={onSignOut} className="header-btn signout-btn">Sign Out</button>
      </div>
    </header>
  );
};

export default Header;