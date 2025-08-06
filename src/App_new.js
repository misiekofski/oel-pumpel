import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import GameHeader from './components/GameHeader';
import OilFields from './components/OilFields';
import Technology from './components/Technology';
import Crisis from './components/Crisis';
import Continents from './components/Continents';
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
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  min-height: 100vh;
  color: #ffffff;
  font-family: 'Arial', sans-serif;
`;

const GameContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
    padding: 15px;
  }
`;

const GameSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const NextMonthButton = styled.button`
  background: linear-gradient(45deg, #FFD700, #FFA500);
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  color: #000;
  font-weight: bold;
  font-size: 18px;
  cursor: pointer;
  margin: 20px auto;
  display: block;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 215, 0, 0.6);
  }
  
  &:active {
    transform: translateY(0);
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
    // Process monthly production
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

    // Process active crisis events
    dispatch(processActiveEvents());

    // Update market trend
    dispatch(updateMarketTrend());

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

  // Show loading if state not ready
  if (!gameState || !oilFields?.fields || !technology?.technologies || !crisis?.activeEvents) {
    return (
      <AppContainer>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '24px',
          color: '#FFD700'
        }}>
          Loading Drill Baby Drill Empire...
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
      
      <GameContent>
        <GameSection>
          <OilFields />
        </GameSection>
        
        <GameSection>
          <Technology />
        </GameSection>
        
        <GameSection>
          <Crisis />
        </GameSection>
        
        <GameSection>
          <Continents />
        </GameSection>
      </GameContent>
      
      <NextMonthButton onClick={handleNextMonth}>
        🚀 ADVANCE TO NEXT MONTH 🚀
      </NextMonthButton>
    </AppContainer>
  );
}

export default App;
