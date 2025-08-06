import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { shipOil, sellOil } from '../store/gameSlice';

const ContinentsContainer = styled.div`
  h2 {
    color: #FFD700;
    text-align: center;
    margin-bottom: 20px;
    font-size: 1.8rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
`;

const ContinentGrid = styled.div`
  display: grid;
  gap: 15px;
  max-height: 500px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #FFD700;
    border-radius: 4px;
  }
`;

const ContinentCard = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid #32CD32;
  border-radius: 12px;
  padding: 15px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    border-color: #FFD700;
  }
`;

const ContinentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const ContinentInfo = styled.div`
  .name {
    color: #32CD32;
    font-size: 1.1rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .flag {
    font-size: 1.3rem;
  }
  
  .demand {
    color: #AAA;
    font-size: 0.85rem;
    margin-top: 2px;
  }
`;

const PriceInfo = styled.div`
  text-align: right;
  
  .price {
    color: #FFD700;
    font-size: 1.1rem;
    font-weight: bold;
  }
  
  .multiplier {
    color: #CCC;
    font-size: 0.8rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 12px 0;
`;

const StatItem = styled.div`
  background: rgba(0, 0, 0, 0.3);
  padding: 8px;
  border-radius: 6px;
  text-align: center;
  
  .label {
    color: #AAA;
    font-size: 0.75rem;
    text-transform: uppercase;
  }
  
  .value {
    color: #FFF;
    font-weight: bold;
    font-size: 0.9rem;
  }
`;

const ActionsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 12px;
`;

const ActionButton = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  text-transform: uppercase;
  
  ${props => {
    if (props.variant === 'ship') {
      if (props.disabled) {
        return `
          background: #666;
          color: #999;
          cursor: not-allowed;
        `;
      }
      return `
        background: linear-gradient(45deg, #4169E1, #00BFFF);
        color: #FFF;
        
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 3px 8px rgba(65, 105, 225, 0.4);
        }
      `;
    } else if (props.variant === 'sell') {
      if (props.disabled) {
        return `
          background: #666;
          color: #999;
          cursor: not-allowed;
        `;
      }
      return `
        background: linear-gradient(45deg, #32CD32, #00FF32);
        color: #000;
        
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 3px 8px rgba(50, 205, 50, 0.4);
        }
      `;
    }
  }}
`;

const InputGroup = styled.div`
  display: flex;
  gap: 8px;
  margin: 8px 0;
  align-items: center;
  
  input {
    flex: 1;
    padding: 6px 8px;
    border: 1px solid #666;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.3);
    color: #FFF;
    font-size: 0.85rem;
    
    &:focus {
      outline: none;
      border-color: #FFD700;
    }
  }
  
  label {
    color: #CCC;
    font-size: 0.8rem;
    min-width: 60px;
  }
`;

const TransitInfo = styled.div`
  background: rgba(255, 165, 0, 0.2);
  border: 1px solid #FFA500;
  border-radius: 6px;
  padding: 8px;
  margin: 8px 0;
  font-size: 0.8rem;
  
  .transit-title {
    color: #FFA500;
    font-weight: bold;
    margin-bottom: 4px;
  }
  
  .transit-item {
    color: #CCC;
    margin: 2px 0;
  }
`;

const Continents = () => {
  const dispatch = useDispatch();
  const gameState = useSelector((state) => state.game);
  const technology = useSelector((state) => state.technology);
  const [shipAmounts, setShipAmounts] = React.useState({});
  const [sellAmounts, setSellAmounts] = React.useState({});

  const handleShipOil = (continentId) => {
    const amount = parseInt(shipAmounts[continentId]) || 0;
    const continent = gameState.continents[continentId];
    
    if (amount > 0 && amount <= gameState.oilStock) {
      const shippingTime = Math.max(1, continent.shippingTime - technology.technologyEffects.shippingSpeedBonus);
      
      dispatch(shipOil({
        continent: continentId,
        amount,
        shippingTime
      }));
      
      setShipAmounts(prev => ({ ...prev, [continentId]: '' }));
    }
  };

  const handleSellOil = (continentId) => {
    const amount = parseInt(sellAmounts[continentId]) || 0;
    const available = gameState.continentalOil[continentId].available;
    
    if (amount > 0 && amount <= available) {
      const continent = gameState.continents[continentId];
      const basePrice = gameState.baseOilPrice;
      const multiplier = gameState.trendMultipliers[gameState.marketTrend];
      const continentMultiplier = continent.multiplier;
      const finalPrice = Math.floor(basePrice * multiplier * continentMultiplier);
      
      dispatch(sellOil({
        continent: continentId,
        amount,
        price: finalPrice
      }));
      
      setSellAmounts(prev => ({ ...prev, [continentId]: '' }));
    }
  };

  const updateShipAmount = (continentId, value) => {
    setShipAmounts(prev => ({ ...prev, [continentId]: value }));
  };

  const updateSellAmount = (continentId, value) => {
    setSellAmounts(prev => ({ ...prev, [continentId]: value }));
  };

  const getDemandColor = (demand) => {
    switch (demand) {
      case 'Very High': return '#FF4444';
      case 'High': return '#FF8844';
      case 'Medium': return '#FFAA44';
      case 'Low': return '#44FF44';
      default: return '#CCC';
    }
  };

  const calculatePrice = (continentId) => {
    const continent = gameState?.continents?.[continentId];
    const basePrice = gameState?.baseOilPrice || 50;
    const multiplier = gameState?.trendMultipliers?.[gameState?.marketTrend] || 1;
    const continentMultiplier = continent?.multiplier || 1;
    return Math.floor(basePrice * multiplier * continentMultiplier);
  };

  const getEffectiveShippingTime = (originalTime) => {
    return Math.max(1, originalTime - (technology?.technologyEffects?.shippingSpeedBonus || 0));
  };

  return (
    <ContinentsContainer>
      <h2>🌍 GLOBAL OIL MARKETS - WORLDWIDE DOMINATION! 🌍</h2>
      
      <ContinentGrid>
        {Object.entries(gameState?.continents || {}).map(([continentId, continent]) => {
          const continentOil = gameState?.continentalOil?.[continentId] || { available: 0, inTransit: [] };
          const currentPrice = calculatePrice(continentId);
          const effectiveShippingTime = getEffectiveShippingTime(continent?.shippingTime || 1);
          const shipAmount = parseInt(shipAmounts[continentId]) || 0;
          const sellAmount = parseInt(sellAmounts[continentId]) || 0;
          
          return (
            <ContinentCard key={continentId}>
              <ContinentHeader>
                <ContinentInfo>
                  <div className="name">
                    <span className="flag">{continent.flag}</span>
                    {continent.name}
                  </div>
                  <div 
                    className="demand"
                    style={{ color: getDemandColor(continent.demand) }}
                  >
                    Demand: {continent.demand}
                  </div>
                </ContinentInfo>
                
                <PriceInfo>
                  <div className="price">${currentPrice}/barrel</div>
                  <div className="multiplier">
                    {continent.multiplier}x base price
                  </div>
                </PriceInfo>
              </ContinentHeader>
              
              <StatsGrid>
                <StatItem>
                  <div className="label">Available</div>
                  <div className="value">{continentOil.available.toLocaleString()}</div>
                </StatItem>
                <StatItem>
                  <div className="label">In Transit</div>
                  <div className="value">{continentOil.inTransit.length}</div>
                </StatItem>
                <StatItem>
                  <div className="label">Shipping</div>
                  <div className="value">{effectiveShippingTime}mo</div>
                </StatItem>
              </StatsGrid>
              
              {continentOil.inTransit.length > 0 && (
                <TransitInfo>
                  <div className="transit-title">🚢 Shipments in Transit:</div>
                  {continentOil.inTransit.map((shipment, index) => (
                    <div key={index} className="transit-item">
                      {shipment.amount.toLocaleString()} barrels arriving in {shipment.arrivalMonth} month{shipment.arrivalMonth !== 1 ? 's' : ''}
                    </div>
                  ))}
                </TransitInfo>
              )}
              
              <InputGroup>
                <label>Ship:</label>
                <input
                  type="number"
                  placeholder="Amount"
                  value={shipAmounts[continentId] || ''}
                  onChange={(e) => updateShipAmount(continentId, e.target.value)}
                  max={gameState.oilStock}
                />
              </InputGroup>
              
              <ActionsContainer>
                <ActionButton
                  variant="ship"
                  disabled={!shipAmount || shipAmount > gameState.oilStock || shipAmount <= 0}
                  onClick={() => handleShipOil(continentId)}
                >
                  🚢 Ship Oil
                </ActionButton>
                
                <ActionButton
                  variant="sell"
                  disabled={!sellAmount || sellAmount > continentOil.available || sellAmount <= 0}
                  onClick={() => handleSellOil(continentId)}
                >
                  💰 Sell Oil
                </ActionButton>
              </ActionsContainer>
              
              <InputGroup>
                <label>Sell:</label>
                <input
                  type="number"
                  placeholder="Amount"
                  value={sellAmounts[continentId] || ''}
                  onChange={(e) => updateSellAmount(continentId, e.target.value)}
                  max={continentOil.available}
                />
              </InputGroup>
            </ContinentCard>
          );
        })}
      </ContinentGrid>
    </ContinentsContainer>
  );
};

export default Continents;
