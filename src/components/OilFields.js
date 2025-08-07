import React from 'react';

const OilFields = ({ money, oilFields, buyOilField, upgradeField, formatNumber }) => {
  return (
    <div className="panel">
      <h3>Oil Fields</h3>
      <button 
        onClick={buyOilField}
        disabled={money < (2000 + (oilFields.length * 1500))}
        className="buy-btn"
      >
        Buy Field (${formatNumber(2000 + (oilFields.length * 1500))})
      </button>
      
      <div className="fields-list">
        {oilFields.map(field => (
          <div key={field.id} className="field-item">
            <span>{field.name}</span>
            <span>⚡ {(field.productivity * 7).toFixed(1)}/week</span>
            <button 
              onClick={() => upgradeField(field.id)}
              disabled={money < 1000}
              className="upgrade-btn"
            >
              Upgrade ($1K)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OilFields;
