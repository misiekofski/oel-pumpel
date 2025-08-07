import React from 'react';

const Technology = ({ money, technologies, currentTech, buyTechnology, setCurrentTech, formatNumber }) => {
  return (
    <div className="panel">
      <h3>Technology</h3>
      <div className="current-tech">
        Current: {technologies[currentTech].name} 
        <span className="efficiency">(×{technologies[currentTech].efficiency})</span>
      </div>
      
      <div className="tech-list">
        {technologies.map((tech, index) => (
          <div key={index} className={`tech-item ${tech.unlocked ? 'unlocked' : ''}`}>
            <span>{tech.name}</span>
            <span>×{tech.efficiency}</span>
            {!tech.unlocked ? (
              <button 
                onClick={() => buyTechnology(index)}
                disabled={money < tech.cost}
                className="buy-btn"
              >
                ${formatNumber(tech.cost)}
              </button>
            ) : (
              <button 
                onClick={() => setCurrentTech(index)}
                className={`select-btn ${currentTech === index ? 'active' : ''}`}
              >
                {currentTech === index ? 'Active' : 'Select'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Technology;
