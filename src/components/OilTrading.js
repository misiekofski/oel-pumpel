import React from 'react';

const CONTINENTS = [
  { name: 'North America', distance: 1, basePrice: 45 },
  { name: 'Europe', distance: 2, basePrice: 55 },
  { name: 'Asia', distance: 3, basePrice: 65 },
  { name: 'Africa', distance: 2, basePrice: 50 },
  { name: 'South America', distance: 2, basePrice: 48 }
];

const OilTrading = ({ oil, shipments, shipOil, sellOil, getAvailableShips, formatNumber, autoSellSettings, toggleAutoSell }) => {
  return (
    <div className="panel">
      <h3>Oil Trading & Shipments</h3>
      <div className="trading-info">
        <p>Ship oil to different continents or sell locally. You need ships to transport oil!</p>
        <p>Available ships: {getAvailableShips().length} | Shipped oil is automatically sold when it arrives.</p>
      </div>
      <div className="continents-list">
        {CONTINENTS.map((continent, index) => (
          <div key={index} className="continent-item">
            <div className="continent-info">
              <span className="continent-name">{continent.name}</span>
              <span className="price">${continent.basePrice}/barrel</span>
              <span className="distance">🚢 {continent.distance}w</span>
            </div>
            
            {/* Row 1: Ship input and buttons */}
            <div className="ship-controls">
              <input 
                type="number" 
                min="1" 
                max={oil}
                placeholder="Amount"
                className="amount-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const amount = parseInt(e.target.value);
                    if (amount && amount <= oil) {
                      const success = shipOil(continent, amount);
                      if (success) {
                        e.target.value = '';
                      } else {
                        alert('No available ships or insufficient oil!');
                      }
                    }
                  }
                }}
              />
              <button 
                onClick={(e) => {
                  const input = e.target.parentElement.querySelector('.amount-input');
                  const amount = parseInt(input.value);
                  if (amount && amount <= oil) {
                    const success = shipOil(continent, amount);
                    if (success) {
                      input.value = '';
                    } else {
                      alert('No available ships or insufficient oil!');
                    }
                  }
                }}
                disabled={oil === 0 || getAvailableShips().length === 0}
                className="ship-btn"
              >
                Ship
              </button>
              <button 
                onClick={() => sellOil(continent, oil)}
                disabled={oil === 0}
                className="sell-all-btn"
              >
                Sell All
              </button>
            </div>
            
            {/* Row 2: Auto-sell toggle and status */}
            <div className="ship-controls-row2">
              <label className="auto-sell-toggle">
                <input 
                  type="checkbox" 
                  checked={autoSellSettings[continent.name] || false}
                  onChange={() => toggleAutoSell(continent.name)}
                />
                Auto-sell here
              </label>
              {autoSellSettings[continent.name] && (
                <span style={{fontSize: '10px', color: '#28a745', fontWeight: 'bold'}}>
                  ✓ AUTO
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <h4>Active Shipments</h4>
      <div className="shipments-list">
        {shipments.length === 0 ? (
          <div className="no-shipments">No oil in transit</div>
        ) : (
          shipments.map(shipment => (
            <div key={shipment.id} className="shipment-item">
              <span>🚢 {shipment.shipName}</span>
              <span>→ {shipment.continent}</span>
              <span>{formatNumber(shipment.amount)} barrels</span>
              <span>${formatNumber(shipment.totalValue)}</span>
              <span className="time-left">{shipment.timeLeft} week{shipment.timeLeft !== 1 ? 's' : ''}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OilTrading;
