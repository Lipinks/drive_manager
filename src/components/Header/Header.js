import React from 'react';

const Header = ({ onAddStar, onSignOut, onSync, showSync }) => {
  return (
    <header className="header">
      <div className="logo">BigAndBig</div>
      <div className="header-buttons">
        {showSync && (
          <button onClick={onSync} className="sync-btn">Sync to Drive</button>
        )}
        <button onClick={onAddStar} className="add-star-btn">Add Star</button>
        <button onClick={onSignOut} className="signout-btn">Sign Out</button>
      </div>
    </header>
  );
};

export default Header;