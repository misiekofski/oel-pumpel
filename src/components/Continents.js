import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { shipOil, sellOil } from '../store/gameSlice';

const ContinentsContainer = styled.div`
  h2 {
    color: #495057;
    text-align: center;
    margin-bottom: 16px;
    font-size: 1.4rem;
    font-weight: 600;
  }
`;

const ContinentGrid = styled.div`
  display: grid;
  gap: 10px;
  max-height: 400px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f8f9fa;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #adb5bd;
    border-radius: 3px;
  }
`;

const ContinentCard = styled.div`
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #adb5bd;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ContinentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ContinentInfo = styled.div`
  .name {
    color: #495057;
    font-size: 1rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .flag {
    font-size: 1.2rem;
  }
  
  .demand {
    color: #6c757d;
    font-size: 0.8rem;
    margin-top: 2px;
  }
`;

const PriceInfo = styled.div`
  text-align: right;
  
  .price {
    color: #28a745;
    font-size: 1rem;
    font-weight: 600;
  }
  
  .multiplier {
    color: #6c757d;
    font-size: 0.8rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin: 10px 0;
`;

const StatItem = styled.div`
  background: #f8f9fa;
  padding: 6px;
  border-radius: 4px;
  text-align: center;
  border: 1px solid #e9ecef;
  
  .label {
    color: #6c757d;
    font-size: 0.7rem;
    text-transform: uppercase;
    font-weight: 500;
  }
  
  .value {
    color: #495057;
    font-weight: 600;
    font-size: 0.8rem;
  }
`;

const ActionsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-top: 10px;
`;

const ActionButton = styled.button`
  padding: 6px 10px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8rem;
  text-transform: uppercase;
  
  ${props => {
    if (props.disabled) {
      return `
        background: #f8f9fa;
        color: #6c757d;
        cursor: not-allowed;
        border-color: #e9ecef;
      `;
    }
    if (props.variant === 'ship') {
      return `
        background: #007bff;
        color: #ffffff;
        border-color: #007bff;
        
        &:hover {
          background: #0056b3;
          border-color: #0056b3;
        }
      `;
    } else if (props.variant === 'sell') {
      return `
        background: #28a745;
        color: #ffffff;
        border-color: #28a745;
        
        &:hover {
          background: #1e7e34;
          border-color: #1e7e34;
        }
      `;
    }
  }}
`;

const InputGroup = styled.div`
  display: flex;
  gap: 6px;
  margin: 6px 0;
  align-items: center;
  
  input {
    flex: 1;
    padding: 4px 6px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    background: #ffffff;
    color: #495057;
    font-size: 0.8rem;
    
    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
  }
  
  label {
    color: #6c757d;
    font-size: 0.75rem;
    font-weight: 500;
  }
`;

const TransitInfo = styled.div`
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  padding: 6px;
  margin: 6px 0;
  font-size: 0.75rem;
  
  .transit-title {
    color: #856404;
    font-weight: 600;
    margin-bottom: 3px;
  }
  
  .transit-item {
    color: #6c757d;
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
