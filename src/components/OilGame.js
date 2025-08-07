import React, { useState, useEffect, useCallback } from 'react';
import './OilGame.css';
import Header from './Header';
import OilFields from './OilFields';
import ShippingFleet from './ShippingFleet';
import Technology from './Technology';
import OilTrading from './OilTrading';
import Achievements from './Achievements';
import Notifications from './Notifications';

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
        ships: gameState.ships || [
          {
            id: Date.now(),
            type: 'Small Tanker',
            capacity: 1000,
            speed: 1,
            inUse: false,
            destination: null
          }
        ],
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

  // Utility functions
  const formatNumber = useCallback((num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.floor(num).toString();
  }, []);

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
          return total + (field.productivity * technologies[currentTech].efficiency * 7);
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
      
      // Remove completed shipments
      setShipments(prevShipments => prevShipments.filter(s => s.timeLeft > 0));
      
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
  }, [shipments, formatNumber]);

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
        timeLeft: Math.ceil(continent.distance / suitableShip.speed),
        shipId: suitableShip.id,
        shipName: suitableShip.type
      };
      setShipments(prev => [...prev, shipment]);
      
      return true;
    }
    return false;
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

  const advanceWeek = () => {
    // Manually advance the game by one week
    setGameTime(prev => prev + 1);
    
    // Drill oil from fields (weekly production)
    const totalProduction = oilFields.reduce((total, field) => {
      return total + (field.productivity * technologies[currentTech].efficiency * 7);
    }, 0);
    
    if (totalProduction > 0) {
      setOil(prev => prev + totalProduction);
      
      // Update stats
      setStats(prevStats => ({
        ...prevStats,
        totalOilDrilled: prevStats.totalOilDrilled + totalProduction
      }));
      
      // Show production notification
      const notification = {
        id: Date.now() + Math.random(),
        message: `Week completed! Drilled ${formatNumber(totalProduction)} barrels of oil`,
        type: 'info'
      };
      setNotifications(prev => [...prev, notification]);
      
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 3000);
    }

    // Update shipments (countdown in weeks)
    setShipments(prev => prev.map(shipment => ({
      ...shipment,
      timeLeft: shipment.timeLeft - 1
    })).filter(shipment => shipment.timeLeft > 0));
  };

  return (
    <div className="oil-game">
      <Notifications notifications={notifications} />

      <Header 
        money={money}
        oil={oil}
        ships={ships}
        gameTime={gameTime}
        achievements={achievements}
        formatNumber={formatNumber}
        formatTime={formatTime}
        getAvailableShips={getAvailableShips}
        setShowAchievements={setShowAchievements}
        showAchievements={showAchievements}
        resetGame={resetGame}
        advanceWeek={advanceWeek}
      />

      <div className="game-grid">
        <OilFields 
          money={money}
          oilFields={oilFields}
          buyOilField={buyOilField}
          upgradeField={upgradeField}
          formatNumber={formatNumber}
        />

        <ShippingFleet 
          money={money}
          ships={ships}
          buyShip={buyShip}
          formatNumber={formatNumber}
        />

        <Technology 
          money={money}
          technologies={technologies}
          currentTech={currentTech}
          buyTechnology={buyTechnology}
          setCurrentTech={setCurrentTech}
          formatNumber={formatNumber}
        />

        <OilTrading 
          oil={oil}
          shipments={shipments}
          shipOil={shipOil}
          getAvailableShips={getAvailableShips}
          formatNumber={formatNumber}
        />
      </div>

      <Achievements 
        showAchievements={showAchievements}
        setShowAchievements={setShowAchievements}
        achievements={achievements}
        money={money}
        oilFields={oilFields}
        stats={stats}
        technologies={technologies}
        ships={ships}
        formatNumber={formatNumber}
      />
    </div>
  );
};

export default OilGame;
