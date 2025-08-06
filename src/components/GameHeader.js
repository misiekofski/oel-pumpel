import React from 'react';
import { useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { clearGameSave } from '../utils/localStorage';

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.4); }
  50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.8); }
`;

const HeaderContainer = styled.div`
  background: #ffffff;
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const NewGameButton = styled.button`
  background: #dc3545;
  color: #ffffff;
  border: 1px solid #dc3545;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.2s ease;
  
  &:hover {
    background: #c82333;
    border-color: #bd2130;
  }
  
  &:active {
    background: #bd2130;
  }
`;

const GameTitle = styled.h1`
  color: #495057;
  font-size: 2.5rem;
  font-weight: 600;
  margin: 0;
  letter-spacing: 1px;
  text-transform: uppercase;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const GameSubtitle = styled.p`
  color: #6c757d;
  font-size: 1.1rem;
  margin: 5px 0 20px 0;
  font-style: italic;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

const StatCard = styled.div`
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  
  h3 {
    color: #495057;
    margin: 0 0 5px 0;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 500;
  }
  
  p {
    color: #212529;
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
  }
`;

const TrendIndicator = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-left: 8px;
  
  ${props => {
    switch (props.trend) {
      case 'Boom':
        return 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;';
      case 'Growth':
        return 'background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb;';
      case 'Stable':
        return 'background: #f8f9fa; color: #495057; border: 1px solid #dee2e6;';
      case 'Decline':
        return 'background: #fff3cd; color: #856404; border: 1px solid #ffeaa7;';
      case 'Recession':
        return 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;';
      default:
        return 'background: #e9ecef; color: #495057; border: 1px solid #ced4da;';
    }
  }}
`;

const GameHeader = () => {
  const gameState = useSelector((state) => state.game);
  const oilFields = useSelector((state) => state.oilFields);
  const technology = useSelector((state) => state.technology);
  const crisis = useSelector((state) => state.crisis);

  // Debug logging to understand what's undefined
  console.log('GameHeader render - oilFields:', oilFields);
  console.log('GameHeader render - oilFields.fields:', oilFields?.fields);

  const formatMoney = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const getMonthName = (month) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  };

  const activeFields = oilFields?.fields?.filter(f => f.purchased && f.monthsRemaining > 0)?.length || 0;
  const researchedTechs = technology?.technologies?.filter(t => t.researched)?.length || 0;
  const activeEvents = crisis?.activeEvents?.length || 0;

  const handleNewGame = () => {
    if (window.confirm('Are you sure you want to start a new game? All progress will be lost!')) {
      clearGameSave();
      window.location.reload();
    }
  };

  return (
    <HeaderContainer>
      <HeaderTop>
        <div></div>
        <div>
          <GameTitle>🛢️ DRILL BABY DRILL 🛢️</GameTitle>
          <GameSubtitle>"The most tremendous oil empire, believe me!"</GameSubtitle>
        </div>
        <NewGameButton onClick={handleNewGame}>
          New Game
        </NewGameButton>
      </HeaderTop>
      
      <StatsContainer>
        <StatCard>
          <h3>💰 Cash Money</h3>
          <p>{formatMoney(gameState.money)}</p>
        </StatCard>
        
        <StatCard>
          <h3>🛢️ Oil Stock</h3>
          <p>{gameState.oilStock.toLocaleString()} barrels</p>
        </StatCard>
        
        <StatCard>
          <h3>📅 Date</h3>
          <p>{getMonthName(gameState.currentMonth)} {gameState.currentYear}</p>
        </StatCard>
        
        <StatCard>
          <h3>💼 Market</h3>
          <p>
            ${gameState.baseOilPrice}/barrel
            <TrendIndicator trend={gameState.marketTrend}>
              {gameState.marketTrend}
            </TrendIndicator>
          </p>
        </StatCard>
        
        <StatCard>
          <h3>🏭 Active Fields</h3>
          <p>{activeFields} / {oilFields.fields.length}</p>
        </StatCard>
        
        <StatCard>
          <h3>🔬 Technologies</h3>
          <p>{researchedTechs} / {technology.technologies.length}</p>
        </StatCard>
        
        <StatCard>
          <h3>⚡ Equipment Level</h3>
          <p>Level {gameState.equipmentLevel}</p>
        </StatCard>
        
        <StatCard>
          <h3>🚨 Active Crises</h3>
          <p style={{ color: activeEvents > 0 ? '#FF4444' : '#44FF44' }}>
            {activeEvents} events
          </p>
        </StatCard>
      </StatsContainer>
    </HeaderContainer>
  );
};

export default GameHeader;
