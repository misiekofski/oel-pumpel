import React from 'react';

const SHIP_TYPES = [
  { name: 'Small Tanker', capacity: 1000, cost: 50000, speed: 1 },
  { name: 'Medium Tanker', capacity: 2500, cost: 120000, speed: 1.2 },
  { name: 'Large Tanker', capacity: 5000, cost: 250000, speed: 1.5 },
  { name: 'Super Tanker', capacity: 10000, cost: 500000, speed: 1.8 }
];

const ShippingFleet = ({ money, ships, buyShip, formatNumber }) => {
  return (
    <div className="panel">
      <h3>Shipping Fleet</h3>
      <div className="ship-types">
        {SHIP_TYPES.map((shipType, index) => (
          <div key={index} className="ship-type-item">
            <div className="ship-info">
              <span className="ship-name">{shipType.name}</span>
              <span className="ship-stats">
                📦 {formatNumber(shipType.capacity)} barrels | 
                ⚡ {shipType.speed}x speed
              </span>
            </div>
            <button 
              onClick={() => buyShip(shipType, index)}
              disabled={money < shipType.cost}
              className="buy-btn"
            >
              ${formatNumber(shipType.cost)}
            </button>
          </div>
        ))}
      </div>
      
      <h4>Your Fleet</h4>
      <div className="ships-list">
        {ships.length === 0 ? (
          <div className="no-ships">No ships owned</div>
        ) : (
          ships.map(ship => (
            <div key={ship.id} className={`ship-item ${ship.inUse ? 'in-use' : 'available'}`}>
              <span>{ship.type}</span>
              <span>📦 {formatNumber(ship.capacity)}</span>
              <span className="ship-status">
                {ship.inUse ? `→ ${ship.destination}` : '⚓ Available'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShippingFleet;
