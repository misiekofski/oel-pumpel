import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { sellOil } from '../store/gameSlice';

const SellShipContainer = styled.div`
  h3 {
    color: #495057;
    text-align: center;
    margin-bottom: 12px;
    font-size: 1.1rem;
    font-weight: 600;
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 12px;
`;

const StatItem = styled.div`
  text-align: center;
  
  .label {
    color: #6c757d;
    font-size: 0.8rem;
    margin-bottom: 2px;
  }
  
  .value {
    color: #495057;
    font-weight: bold;
    font-size: 0.9rem;
  }
`;

const SellSection = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 10px;
`;

const InputRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
`;

const QuickSellRow = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

const QuickSellButton = styled.button`
  background: #e9ecef;
  color: #495057;
  border: 1px solid #dee2e6;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #dee2e6;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SellInput = styled.input`
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const SellButton = styled.button`
  background: ${props => props.disabled ? '#6c757d' : '#28a745'};
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: #218838;
  }
`;

const PriceInfo = styled.div`
  text-align: center;
  color: #28a745;
  font-size: 0.85rem;
  font-weight: 600;
`;

const SellShip = () => {
  const dispatch = useDispatch();
  const gameState = useSelector((state) => state.game);
  const [sellAmount, setSellAmount] = React.useState('');

  const handleSellOil = () => {
    const amount = parseInt(sellAmount) || 0;
    if (amount > 0 && amount <= gameState.oilStock) {
      const basePrice = gameState.baseOilPrice || 50;
      const multiplier = gameState.trendMultipliers?.[gameState.marketTrend] || 1.0;
      const finalPrice = Math.floor(basePrice * multiplier);
      
      dispatch(sellOil({
        amount,
        price: finalPrice
      }));
      
      setSellAmount('');
    }
  };

  const handleQuickSell = (percentage) => {
    const amount = Math.floor(gameState.oilStock * percentage);
    setSellAmount(amount.toString());
  };

  const handleSellAll = () => {
    setSellAmount(gameState.oilStock.toString());
  };

  const currentPrice = Math.floor((gameState.baseOilPrice || 50) * (gameState.trendMultipliers?.[gameState.marketTrend] || 1.0));
  const sellAmountNum = parseInt(sellAmount) || 0;
  const totalValue = sellAmountNum * currentPrice;

  return (
    <SellShipContainer>
      <h3>💰 OIL SALES - INSTANT CASH! 💰</h3>
      
      <StatsRow>
        <StatItem>
          <div className="label">Oil Stock</div>
          <div className="value">{gameState.oilStock?.toLocaleString() || 0}</div>
        </StatItem>
        <StatItem>
          <div className="label">Market Price</div>
          <div className="value">${currentPrice}/barrel</div>
        </StatItem>
        <StatItem>
          <div className="label">Market Trend</div>
          <div className="value">{gameState.marketTrend || 'Stable'}</div>
        </StatItem>
      </StatsRow>
      
      <SellSection>
        <QuickSellRow>
          <QuickSellButton 
            onClick={() => handleQuickSell(0.25)}
            disabled={gameState.oilStock < 4}
          >
            25%
          </QuickSellButton>
          <QuickSellButton 
            onClick={() => handleQuickSell(0.5)}
            disabled={gameState.oilStock < 2}
          >
            50%
          </QuickSellButton>
          <QuickSellButton 
            onClick={() => handleQuickSell(0.75)}
            disabled={gameState.oilStock < 1}
          >
            75%
          </QuickSellButton>
          <QuickSellButton 
            onClick={handleSellAll}
            disabled={gameState.oilStock < 1}
          >
            ALL
          </QuickSellButton>
        </QuickSellRow>
        
        <InputRow>
          <SellInput
            type="number"
            placeholder="Amount to sell"
            value={sellAmount}
            onChange={(e) => setSellAmount(e.target.value)}
            max={gameState.oilStock}
          />
          <SellButton
            disabled={!sellAmountNum || sellAmountNum > gameState.oilStock || sellAmountNum <= 0}
            onClick={handleSellOil}
          >
            💰 SELL
          </SellButton>
        </InputRow>
        
        {sellAmountNum > 0 && (
          <PriceInfo>
            Total: ${totalValue.toLocaleString()}
          </PriceInfo>
        )}
      </SellSection>
    </SellShipContainer>
  );
};

export default SellShip;
