import React, { useState, useEffect } from 'react';
import './OilGame.css';
import Header from './Header';
import OilFields from './OilFields';
import ShippingFleet from './ShippingFleet';
import Technology from './Technology';
import OilTrading from './OilTrading';
import Achievements from './Achievements';
import Notifications from './Notifications';

const CONTINENTS = [
  { name: 'North America', distance: 1, basePrice: 45 },
  { name: 'Europe', distance: 2, basePrice: 55 },
  { name: 'Asia', distance: 3, basePrice: 65 },
  { name: 'Africa', distance: 2, basePrice: 50 },
  { name: 'South America', distance: 2, basePrice: 48 }
];

const SHIP_TYPES = [
  { name: 'Small Tanker', capacity: 1000, cost: 50000, speed: 1 },
  { name: 'Medium Tanker', capacity: 2500, cost: 120000, speed: 1.2 },
  { name: 'Large Tanker', capacity: 5000, cost: 250000, speed: 1.5 },
  { name: 'Super Tanker', capacity: 10000, cost: 500000, speed: 1.8 }
];

const ACHIEVEMENTS = [
  { id: 'first_field', name: 'Oil Baron Beginner', description: 'Buy your first oil field', target: 1, type: 'oilFields', unlocked: false },
  { id: 'oil_millionaire', name: 'Oil Millionaire', description: 'Accumulate $1,000,000', target: 1000000, type: 'money', unlocked: false },
  { id: 'drill_master', name: 'Drill Master', description: 'Drill 100,000 barrels of oil', target: 100000, type: 'totalOilDrilled', unlocked: false },
  { id: 'shipping_mogul', name: 'Shipping Mogul', description: 'Complete 50 shipments', target: 50, type: 'shipmentsCompleted', unlocked: false },
  { id: 'tech_innovator', name: 'Tech Innovator', description: 'Unlock all technologies', target: 4, type: 'technologiesUnlocked', unlocked: false },
  { id: 'fleet_commander', name: 'Fleet Commander', description: 'Own 10 ships', target: 10, type: 'ships', unlocked: false },
  { id: 'global_trader', name: 'Global Trader', description: 'Ship oil to all continents', target: 5, type: 'continentsTraded', unlocked: false },
  { id: 'oil_tycoon', name: 'Oil Tycoon', description: 'Reach $10,000,000', target: 10000000, type: 'money', unlocked: false }
];

const TECHNOLOGIES = [
  { name: 'Basic Drill', cost: 0, efficiency: 1, unlocked: true },
  { name: 'Advanced Drill', cost: 5000, efficiency: 1.5, unlocked: false },
  { name: 'Hydraulic Fracturing', cost: 15000, efficiency: 2.2, unlocked: false },
  { name: 'Deep Sea Drilling', cost: 50000, efficiency: 3.5, unlocked: false }
];

const OilGame = () => {
  // Load saved game state from localStorage
  const loadGameState = () => {
    const saved = localStorage.getItem('oilTycoonGame');
    if (saved) {
      const gameState = JSON.parse(saved);
      return {
        money: gameState.money || 10000,
        oil: gameState.oil || 0,
        oilFields: gameState.oilFields || [],
        technologies: gameState.technologies || TECHNOLOGIES,
        currentTech: gameState.currentTech || 0,
        shipments: gameState.shipments || [],
        gameTime: gameState.gameTime || 0,
        ships: gameState.ships || [],
        achievements: gameState.achievements || ACHIEVEMENTS,
        stats: gameState.stats || {
          totalOilDrilled: 0,
          shipmentsCompleted: 0,
          continentsTraded: new Set()
        }
      };
    }
    return {
      money: 10000,
      oil: 0,
      oilFields: [],
      technologies: TECHNOLOGIES,
      currentTech: 0,
      shipments: [],
      gameTime: 0,
      ships: [
        {
          id: Date.now(),
          type: 'Small Tanker',
          capacity: 1000,
          speed: 1,
          inUse: false,
          destination: null
        }
      ],
      achievements: ACHIEVEMENTS,
      stats: {
        totalOilDrilled: 0,
        shipmentsCompleted: 0,
        continentsTraded: new Set()
      }
    };
  };

  const initialState = loadGameState();
  const [money, setMoney] = useState(initialState.money);
  const [oil, setOil] = useState(initialState.oil);
  const [oilFields, setOilFields] = useState(initialState.oilFields);
  const [technologies, setTechnologies] = useState(initialState.technologies);
  const [currentTech, setCurrentTech] = useState(initialState.currentTech);
  const [shipments, setShipments] = useState(initialState.shipments);
  const [gameTime, setGameTime] = useState(initialState.gameTime);
  const [notifications, setNotifications] = useState([]);
  const [ships, setShips] = useState(initialState.ships);
  const [achievements, setAchievements] = useState(initialState.achievements);
  const [stats, setStats] = useState(initialState.stats);
  const [showAchievements, setShowAchievements] = useState(false);

  // Save game state to localStorage whenever state changes
  useEffect(() => {
    const gameState = {
      money,
      oil,
      oilFields,
      technologies,
      currentTech,
      shipments,
      gameTime,
      ships,
      achievements,
      stats: {
        ...stats,
        continentsTraded: Array.from(stats.continentsTraded)
      }
    };
    localStorage.setItem('oilTycoonGame', JSON.stringify(gameState));
  }, [money, oil, oilFields, technologies, currentTech, shipments, gameTime, ships, achievements, stats]);

  // Game tick every 15 seconds (representing 1 week in game time)
  useEffect(() => {
    const interval = setInterval(() => {
      setGameTime(prev => prev + 1);
      
      // Drill oil from fields (weekly production)
      setOil(prev => {
        const totalProduction = oilFields.reduce((total, field) => {
          return total + (field.productivity * technologies[currentTech].efficiency * 7); // 7x for weekly
        }, 0);
        
        // Update stats
        setStats(prevStats => ({
          ...prevStats,
          totalOilDrilled: prevStats.totalOilDrilled + totalProduction
        }));
        
        return prev + totalProduction;
      });

      // Update shipments (countdown in weeks)
      setShipments(prev => prev.map(shipment => ({
        ...shipment,
        timeLeft: shipment.timeLeft - 1
      })).filter(shipment => shipment.timeLeft > 0));

    }, 15000); // 15 seconds per week

    return () => clearInterval(interval);
  }, [oilFields, currentTech, technologies]);

  // Complete shipments and add money (auto-sell when arriving)
  useEffect(() => {
    const completedShipments = shipments.filter(s => s.timeLeft <= 0);
    if (completedShipments.length > 0) {
      const earnings = completedShipments.reduce((total, s) => total + s.totalValue, 0);
      setMoney(prev => prev + earnings);
      
      // Update stats
      setStats(prevStats => ({
        ...prevStats,
        shipmentsCompleted: prevStats.shipmentsCompleted + completedShipments.length,
        continentsTraded: new Set([...prevStats.continentsTraded, ...completedShipments.map(s => s.continent)])
      }));
      
      // Free up ships
      completedShipments.forEach(shipment => {
        setShips(prevShips => prevShips.map(ship => 
          ship.id === shipment.shipId 
            ? { ...ship, inUse: false, destination: null }
            : ship
        ));
      });
      
      // Add notifications for completed shipments
      completedShipments.forEach(shipment => {
        const notification = {
          id: Date.now() + Math.random(),
          message: `Oil sold in ${shipment.continent}! +$${formatNumber(shipment.totalValue)}`,
          type: 'success'
        };
        setNotifications(prev => [...prev, notification]);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, 5000);
      });
    }
  }, [shipments]);

  // Check achievements
  useEffect(() => {
    setAchievements(prevAchievements => {
      return prevAchievements.map(achievement => {
        if (achievement.unlocked) return achievement;
        
        let currentValue = 0;
        switch (achievement.type) {
          case 'money':
            currentValue = money;
            break;
          case 'oilFields':
            currentValue = oilFields.length;
            break;
          case 'totalOilDrilled':
            currentValue = stats.totalOilDrilled;
            break;
          case 'shipmentsCompleted':
            currentValue = stats.shipmentsCompleted;
            break;
          case 'technologiesUnlocked':
            currentValue = technologies.filter(t => t.unlocked).length;
            break;
          case 'ships':
            currentValue = ships.length;
            break;
          case 'continentsTraded':
            currentValue = stats.continentsTraded.size;
            break;
          default:
            return achievement;
        }
        
        if (currentValue >= achievement.target) {
          // Achievement unlocked!
          const notification = {
            id: Date.now() + Math.random(),
            message: `🏆 Achievement Unlocked: ${achievement.name}!`,
            type: 'achievement'
          };
          setNotifications(prev => [...prev, notification]);
          
          setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== notification.id));
          }, 8000);
          
          return { ...achievement, unlocked: true };
        }
        
        return achievement;
      });
    });
  }, [money, oilFields, stats, technologies, ships]);

  const buyOilField = () => {
    const cost = 2000 + (oilFields.length * 1500);
    if (money >= cost) {
      setMoney(prev => prev - cost);
      setOilFields(prev => [...prev, {
        id: Date.now(),
        productivity: 0.5 + Math.random() * 1.5,
        name: `Field ${prev.length + 1}`
      }]);
    }
  };

  const buyShip = (shipType, index) => {
    if (money >= shipType.cost) {
      setMoney(prev => prev - shipType.cost);
      setShips(prev => [...prev, {
        id: Date.now(),
        type: shipType.name,
        capacity: shipType.capacity,
        speed: shipType.speed,
        inUse: false,
        destination: null
      }]);
    }
  };

  const getAvailableShips = () => {
    return ships.filter(ship => !ship.inUse);
  };

  const upgradeField = (fieldId) => {
    const cost = 1000;
    if (money >= cost) {
      setMoney(prev => prev - cost);
      setOilFields(prev => prev.map(field => 
        field.id === fieldId 
          ? { ...field, productivity: field.productivity * 1.3 }
          : field
      ));
    }
  };

  const buyTechnology = (techIndex) => {
    const tech = technologies[techIndex];
    if (money >= tech.cost && !tech.unlocked) {
      setMoney(prev => prev - tech.cost);
      setTechnologies(prev => prev.map((t, i) => 
        i === techIndex ? { ...t, unlocked: true } : t
      ));
    }
  };

  const shipOil = (continent, amount) => {
    const availableShips = getAvailableShips();
    if (oil >= amount && availableShips.length > 0) {
      // Find the best ship for this shipment
      const suitableShip = availableShips.find(ship => ship.capacity >= amount) || 
                          availableShips.reduce((best, ship) => 
                            ship.capacity > best.capacity ? ship : best
                          );
      
      const actualAmount = Math.min(amount, suitableShip.capacity);
      
      setOil(prev => prev - actualAmount);
      
      // Mark ship as in use
      setShips(prevShips => prevShips.map(ship => 
        ship.id === suitableShip.id 
          ? { ...ship, inUse: true, destination: continent.name }
          : ship
      ));
      
      const shipment = {
        id: Date.now(),
        continent: continent.name,
        amount: actualAmount,
        totalValue: actualAmount * continent.basePrice,
        timeLeft: Math.ceil(continent.distance / suitableShip.speed), // weeks adjusted for ship speed
        shipId: suitableShip.id,
        shipName: suitableShip.type
      };
      setShipments(prev => [...prev, shipment]);
      
      return true;
    }
    return false;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.floor(num).toString();
  };

  const formatTime = (weeks) => {
    if (weeks < 52) return `${weeks}w`;
    const years = Math.floor(weeks / 52);
    const remainingWeeks = weeks % 52;
    return remainingWeeks > 0 ? `${years}y ${remainingWeeks}w` : `${years}y`;
  };

  const resetGame = () => {
    if (window.confirm('Are you sure you want to reset the game? All progress will be lost.')) {
      localStorage.removeItem('oilTycoonGame');
      window.location.reload();
    }
  };

  return (
    <div className="oil-game">
      {/* Notifications */}
      <div className="notifications">
        {notifications.map(notification => (
          <div key={notification.id} className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        ))}
      </div>

      <div className="header">
        <h1>Oil Tycoon</h1>
        <div className="resources">
          <span>💰 ${formatNumber(money)}</span>
          <span>🛢️ {formatNumber(oil)} barrels</span>
          <span>� {ships.length} ships ({getAvailableShips().length} available)</span>
          <span>�📅 Week {gameTime} ({formatTime(gameTime)})</span>
          <button 
            onClick={() => setShowAchievements(!showAchievements)} 
            className="achievements-btn"
          >
            🏆 Achievements ({achievements.filter(a => a.unlocked).length}/{achievements.length})
          </button>
          <button onClick={resetGame} className="reset-btn">Reset Game</button>
        </div>
      </div>

      <div className="game-grid">
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

        <div className="panel">
          <h3>Oil Trading & Shipments</h3>
          <div className="trading-info">
            <p>Ship oil to different continents. You need ships to transport oil!</p>
            <p>Available ships: {getAvailableShips().length} | Oil is automatically sold when it arrives.</p>
          </div>
          <div className="continents-list">
            {CONTINENTS.map((continent, index) => (
              <div key={index} className="continent-item">
                <div className="continent-info">
                  <span className="continent-name">{continent.name}</span>
                  <span className="price">${continent.basePrice}/barrel</span>
                  <span className="distance">🚢 {continent.distance} week{continent.distance > 1 ? 's' : ''}</span>
                </div>
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
                      const input = e.target.previousElementSibling;
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
      </div>

      {/* Achievements Modal */}
      {showAchievements && (
        <div className="modal-overlay" onClick={() => setShowAchievements(false)}>
          <div className="achievements-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🏆 Achievements</h2>
              <button onClick={() => setShowAchievements(false)} className="close-btn">×</button>
            </div>
            <div className="achievements-list">
              {achievements.map(achievement => (
                <div key={achievement.id} className={`achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`}>
                  <div className="achievement-icon">
                    {achievement.unlocked ? '🏆' : '🔒'}
                  </div>
                  <div className="achievement-info">
                    <h4>{achievement.name}</h4>
                    <p>{achievement.description}</p>
                    {!achievement.unlocked && (
                      <div className="progress">
                        Progress: {(() => {
                          let current = 0;
                          switch (achievement.type) {
                            case 'money': current = money; break;
                            case 'oilFields': current = oilFields.length; break;
                            case 'totalOilDrilled': current = stats.totalOilDrilled; break;
                            case 'shipmentsCompleted': current = stats.shipmentsCompleted; break;
                            case 'technologiesUnlocked': current = technologies.filter(t => t.unlocked).length; break;
                            case 'ships': current = ships.length; break;
                            case 'continentsTraded': current = stats.continentsTraded.size; break;
                          }
                          return `${formatNumber(current)} / ${formatNumber(achievement.target)}`;
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OilGame;
