import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import GameHeader from './components/GameHeader';
import OilFields from './components/OilFields';
import Technology from './components/Technology';
import Crisis from './components/Crisis';
import SellShip from './components/SellShip';
import { 
  nextMonth, 
  processShipments, 
  updateMarketTrend,
  unlockAchievement,
  updateOilStock
} from './store/gameSlice';
import { processMonthlyProduction } from './store/oilFieldsSlice';
import { processResearch } from './store/technologySlice';
import { checkForCrisis, processActiveEvents } from './store/crisisSlice';

const AppContainer = styled.div`
  background: #ffffff;
  min-height: 100vh;
  color: #333333;
  font-family: 'Arial', sans-serif;
`;

const GameContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  padding: 12px;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 8px;
  }
`;

const GameSection = styled.div`
  background: #ffffff;
  border-radius: 6px;
  padding: 12px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
`;

const NextMonthButton = styled.button`
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  padding: 8px 20px;
  border-radius: 4px;
  color: #495057;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  margin: 8px auto;
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
  max-width: 1200px;
  
  &:hover {
    background: #e9ecef;
    border-color: #adb5bd;
  }
  
  &:active {
    background: #dee2e6;
  }
`;

function App() {
  const dispatch = useDispatch();
  const gameState = useSelector((state) => state.game);
  const oilFields = useSelector((state) => state.oilFields);
  const technology = useSelector((state) => state.technology);
  const crisis = useSelector((state) => state.crisis);

  // Process month function
  const processMonth = () => {
    // Process monthly production first
    dispatch(processMonthlyProduction({
      equipmentLevel: gameState?.equipmentLevel || 1
    }));

    // Process research
    dispatch(processResearch({
      researchPoints: technology?.researchPointsPerMonth || 0
    }));

    // Process shipments
    dispatch(processShipments());

    // Check for crisis events
    dispatch(checkForCrisis({
      currentMonth: gameState?.currentMonth || 1,
      crisisReduction: technology?.technologyEffects?.crisisReduction || 0
    }));

    // Process active crisis events with proper payload
    dispatch(processActiveEvents({
      crisisMitigation: technology?.technologyEffects?.crisisMitigation || 0
    }));

    // Update market trend with proper logic
    const trends = ['Recession', 'Decline', 'Stable', 'Growth', 'Boom'];
    const multipliers = { 'Recession': 0.6, 'Decline': 0.8, 'Stable': 1.0, 'Growth': 1.2, 'Boom': 1.5 };
    
    const currentTrendIndex = trends.indexOf(gameState?.marketTrend || 'Stable');
    let change = Math.random() - 0.5; // Random change between -0.5 and 0.5
    
    // Crisis events make market more volatile
    if (crisis?.activeEvents?.length > 0) {
      change -= 0.2;
    }
    
    let newTrendIndex = currentTrendIndex;
    if (change > 0.2) newTrendIndex = Math.min(currentTrendIndex + 1, trends.length - 1);
    else if (change < -0.2) newTrendIndex = Math.max(currentTrendIndex - 1, 0);
    
    const newTrend = trends[newTrendIndex];
    const newPrice = Math.floor((gameState?.baseOilPrice || 100) * multipliers[newTrend]);
    
    dispatch(updateMarketTrend({
      trend: newTrend,
      price: newPrice
    }));

    // Advance to next month
    dispatch(nextMonth());
  };

  // Check achievements function
  const checkAchievements = () => {
    if (!gameState?.achievements) return;

    // Check money milestones
    if (gameState.money >= 1000000 && !gameState.achievements.millionaire) {
      dispatch(unlockAchievement('millionaire'));
    }
    if (gameState.money >= 100000000 && !gameState.achievements.oilBaron) {
      dispatch(unlockAchievement('oilBaron'));
    }
    if (gameState.money >= 1000000000 && !gameState.achievements.oilTycoon) {
      dispatch(unlockAchievement('oilTycoon'));
    }

    // Check production milestones
    if (gameState.achievements.totalDrilled >= 100000 && !gameState.achievements.drillMaster) {
      dispatch(unlockAchievement('drillMaster'));
    }
    if (gameState.achievements.totalDrilled >= 1000000 && !gameState.achievements.drillLegend) {
      dispatch(unlockAchievement('drillLegend'));
    }

    // Check sales milestones
    if (gameState.achievements.totalOilSold >= 50000 && !gameState.achievements.oilDealer) {
      dispatch(unlockAchievement('oilDealer'));
    }
    if (gameState.achievements.totalOilSold >= 500000 && !gameState.achievements.oilMogul) {
      dispatch(unlockAchievement('oilMogul'));
    }
  };

  // Game loop effect
  useEffect(() => {
    if (gameState && !gameState.gameOver) {
      const gameLoop = setInterval(() => {
        processMonth();
      }, 10000); // Process every 10 seconds

      return () => clearInterval(gameLoop);
    }
  }, [gameState?.gameOver]);

  // Check achievements effect
  useEffect(() => {
    if (gameState?.money !== undefined && gameState?.achievements) {
      checkAchievements();
    }
  }, [gameState?.money, gameState?.achievements?.totalDrilled, gameState?.achievements?.totalOilSold]);

  // Oil production effect - automatically add monthly production to oil stock
  useEffect(() => {
    const currentProduction = oilFields?.monthlyProduction || 0;
    if (currentProduction > 0) {
      dispatch(updateOilStock(currentProduction));
    }
  }, [oilFields?.monthlyProduction, dispatch]);

  // Show loading if state not ready
  if (!gameState || !oilFields?.fields || !technology?.technologies) {
    return (
      <AppContainer>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '24px',
          color: '#666666'
        }}>
          Loading Drill Baby Drill Empire... (Gonna be HUGE!)
        </div>
      </AppContainer>
    );
  }

  const handleNextMonth = () => {
    processMonth();
  };

  return (
    <AppContainer>
      <GameHeader />
      
      <NextMonthButton onClick={handleNextMonth}>
        ⏭ ADVANCE EMPIRE
      </NextMonthButton>
      
      <GameContent>
        <GameSection>
          <OilFields />
        </GameSection>
        
        <GameSection>
          <Technology />
        </GameSection>
        
        <GameSection>
          <SellShip />
          <div style={{ marginTop: '20px' }}>
            <Crisis />
          </div>
        </GameSection>
      </GameContent>
    </AppContainer>
  );
}

export default App;
