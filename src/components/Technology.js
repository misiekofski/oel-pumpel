import React from 'react';

const Technology = ({ money, technologies, currentTech, buyTechnology, setCurrentTech, formatNumber, techDiscount = 1.0 }) => {
  return (
    <div className="panel">
      <h3>Technology</h3>
      {techDiscount < 1.0 && (
        <div className="trading-info">
          <p>🎉 Technology Discount Active! {Math.round((1 - techDiscount) * 100)}% off next purchase!</p>
        </div>
      )}
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
                disabled={money < Math.floor(tech.cost * techDiscount)}
                className="buy-btn"
              >
                {techDiscount < 1.0 ? (
                  <>
                    <span style={{textDecoration: 'line-through', color: '#999'}}>
                      ${formatNumber(tech.cost)}
                    </span>
                    {' '}
                    <span style={{color: '#28a745', fontWeight: 'bold'}}>
                      ${formatNumber(Math.floor(tech.cost * techDiscount))}
                    </span>
                  </>
                ) : (
                  `$${formatNumber(tech.cost)}`
                )}
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
