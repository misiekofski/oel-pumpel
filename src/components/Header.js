import React from 'react';

const Header = ({ 
  money, 
  oil, 
  ships, 
  gameTime, 
  achievements, 
  formatNumber, 
  formatTime, 
  getAvailableShips, 
  setShowAchievements, 
  showAchievements, 
  resetGame 
}) => {
  return (
    <div className="header">
      <h1>Oil Tycoon</h1>
      <div className="resources">
        <span>💰 ${formatNumber(money)}</span>
        <span>🛢️ {formatNumber(oil)} barrels</span>
        <span>🚢 {ships.length} ships ({getAvailableShips().length} available)</span>
        <span>📅 Week {gameTime} ({formatTime(gameTime)})</span>
        <button 
          onClick={() => setShowAchievements(!showAchievements)} 
          className="achievements-btn"
        >
          🏆 Achievements ({achievements.filter(a => a.unlocked).length}/{achievements.length})
        </button>
        <button onClick={resetGame} className="reset-btn">Reset Game</button>
      </div>
    </div>
  );
};

export default Header;
