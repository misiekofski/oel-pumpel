import React from 'react';

const CONTINENTS = [
  { name: 'North America', distance: 1, basePrice: 45 },
  { name: 'Europe', distance: 2, basePrice: 55 },
  { name: 'Asia', distance: 3, basePrice: 65 },
  { name: 'Africa', distance: 2, basePrice: 50 },
  { name: 'South America', distance: 2, basePrice: 48 }
];

const OilDepots = ({ 
  depots, 
  buyDepot, 
  upgradeDepot, 
  sellFromDepot, 
  formatNumber, 
  money,
  autoSellSettings,
  toggleAutoSell 
}) => {
  const getDepotCapacityColor = (stored, capacity) => {
    const percentage = (stored / capacity) * 100;
    if (percentage >= 90) return '#dc3545'; // Red - almost full
    if (percentage >= 70) return '#ffc107'; // Yellow - getting full
    return '#28a745'; // Green - good space
  };

  return (
    <div className="panel">
      <h3>Oil Depots & Storage</h3>
      <div className="trading-info">
        <p>Manage oil storage at each continent. Ships wait if depot is full!</p>
      </div>
      
      <div className="depots-list">
        {CONTINENTS.map((continent, index) => {
          const depot = depots.find(d => d.continent === continent.name);
          const stored = depot ? depot.stored : 0;
          const capacity = depot ? depot.capacity : 0;
          const level = depot ? depot.level : 0;
          const isOwned = !!depot;
          
          return (
            <div key={index} className="depot-item">
              <div className="depot-header">
                <span className="depot-name">{continent.name}</span>
                <span className="depot-price">${continent.basePrice}/barrel</span>
                {isOwned && (
                  <span className="depot-level">Lv.{level}</span>
                )}
              </div>
              
              {!isOwned ? (
                <div className="depot-buy">
                  <span className="depot-info">No depot - Build one to store oil here</span>
                  <button 
                    onClick={() => buyDepot(continent.name)}
                    disabled={money < 5000}
                    className="buy-btn"
                  >
                    Build Depot ($5K)
                  </button>
                </div>
              ) : (
                <>
                  <div className="depot-status">
                    <div className="capacity-bar">
                      <div 
                        className="capacity-fill"
                        style={{
                          width: `${Math.min((stored / capacity) * 100, 100)}%`,
                          backgroundColor: getDepotCapacityColor(stored, capacity)
                        }}
                      ></div>
                    </div>
                    <span className="capacity-text">
                      {formatNumber(stored)} / {formatNumber(capacity)} barrels
                    </span>
                  </div>
                  
                  <div className="depot-actions">
                    <button 
                      onClick={() => upgradeDepot(continent.name)}
                      disabled={money < (level * 3000 + 2000)}
                      className="upgrade-btn"
                    >
                      Upgrade (+{formatNumber(level * 1000 + 2000)} capacity)
                      <br />${formatNumber(level * 3000 + 2000)}
                    </button>
                    
                    <button 
                      onClick={() => sellFromDepot(continent.name, stored)}
                      disabled={stored === 0}
                      className="sell-all-btn"
                    >
                      Sell All
                      <br />${formatNumber(stored * continent.basePrice)}
                    </button>
                  </div>
                  
                  <div className="depot-controls">
                    <label className="auto-sell-toggle">
                      <input 
                        type="checkbox" 
                        checked={autoSellSettings[continent.name] || false}
                        onChange={() => toggleAutoSell(continent.name)}
                      />
                      Auto-sell when full
                    </label>
                    {autoSellSettings[continent.name] && (
                      <span className="auto-indicator">✓ AUTO</span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OilDepots;
