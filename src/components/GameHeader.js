import React from 'react';
import { useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.4); }
  50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.8); }
`;

const HeaderContainer = styled.div`
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%);
  padding: 20px;
  text-align: center;
  border-bottom: 3px solid #B8860B;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
`;

const TrumpImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid #FFD700;
  animation: ${float} 3s ease-in-out infinite, ${pulse} 2s ease-in-out infinite;
  position: absolute;
  top: 50%;
  left: 30px;
  transform: translateY(-50%);
  
  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    left: 10px;
  }
`;

const GameTitle = styled.h1`
  color: #8B0000;
  font-size: 3rem;
  font-weight: bold;
  margin: 0;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5);
  letter-spacing: 2px;
  text-transform: uppercase;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-left: 80px;
  }
`;

const GameSubtitle = styled.p`
  color: #8B0000;
  font-size: 1.2rem;
  margin: 5px 0 20px 0;
  font-style: italic;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    margin-left: 80px;
    font-size: 1rem;
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
  background: rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 10px;
  border: 2px solid #B8860B;
  
  h3 {
    color: #FFD700;
    margin: 0 0 5px 0;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  p {
    color: #FFF;
    margin: 0;
    font-size: 1.1rem;
    font-weight: bold;
  }
`;

const TrendIndicator = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  margin-left: 8px;
  
  ${props => {
    switch (props.trend) {
      case 'Booming':
        return 'background: #00FF00; color: #000;';
      case 'Rising':
        return 'background: #90EE90; color: #000;';
      case 'Stable':
        return 'background: #FFD700; color: #000;';
      case 'Declining':
        return 'background: #FFA500; color: #000;';
      case 'Crashing':
        return 'background: #FF0000; color: #FFF;';
      default:
        return 'background: #666; color: #FFF;';
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

  return (
    <HeaderContainer>
      <TrumpImage src="./img/trump.png.png" alt="Trump" />
      
      <GameTitle>🛢️ DRILL BABY DRILL 🛢️</GameTitle>
      <GameSubtitle>"The most tremendous oil empire, believe me!"</GameSubtitle>
      
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
