import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { startResearch, cancelResearch } from '../store/technologySlice';
import { updateMoney } from '../store/gameSlice';

const TechnologyContainer = styled.div`
  h2 {
    color: #FFD700;
    text-align: center;
    margin-bottom: 20px;
    font-size: 1.8rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
`;

const ResearchStatus = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  border: 2px solid #4169E1;
`;

const StatusHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  
  h3 {
    color: #4169E1;
    margin: 0;
  }
  
  .research-points {
    color: #FFD700;
    font-weight: bold;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: #333;
  border-radius: 6px;
  overflow: hidden;
  margin: 10px 0;
  
  .fill {
    height: 100%;
    background: linear-gradient(90deg, #4169E1, #00BFFF);
    transition: width 0.3s ease;
  }
`;

const CurrentResearch = styled.div`
  color: #CCC;
  font-size: 0.9rem;
  
  .tech-name {
    color: #FFF;
    font-weight: bold;
  }
`;

const TechGrid = styled.div`
  display: grid;
  gap: 12px;
  max-height: 400px;
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

const TechCard = styled.div`
  background: ${props => {
    if (props.researched) return 'linear-gradient(135deg, rgba(0, 255, 0, 0.2), rgba(0, 200, 0, 0.1))';
    if (props.available) return 'rgba(255, 255, 255, 0.08)';
    return 'rgba(255, 255, 255, 0.03)';
  }};
  border: 2px solid ${props => {
    if (props.researched) return '#00AA00';
    if (props.available) return '#4169E1';
    return '#666';
  }};
  border-radius: 10px;
  padding: 12px;
  opacity: ${props => props.available || props.researched ? 1 : 0.6};
  transition: all 0.3s ease;
  
  &:hover {
    transform: ${props => props.available ? 'translateY(-1px)' : 'none'};
    box-shadow: ${props => props.available ? '0 4px 12px rgba(0, 0, 0, 0.3)' : 'none'};
  }
`;

const TechHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const TechName = styled.h4`
  color: ${props => {
    if (props.researched) return '#00FF00';
    if (props.available) return '#4169E1';
    return '#999';
  }};
  margin: 0;
  font-size: 1rem;
`;

const TechCost = styled.div`
  color: #FFD700;
  font-weight: bold;
  font-size: 0.9rem;
`;

const TechDescription = styled.p`
  color: #CCC;
  font-size: 0.85rem;
  margin: 8px 0;
  font-style: italic;
  line-height: 1.3;
`;

const Prerequisites = styled.div`
  font-size: 0.8rem;
  color: #AAA;
  margin: 8px 0;
  
  .prereq-item {
    display: inline-block;
    padding: 2px 6px;
    margin: 2px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    border: 1px solid ${props => props.met ? '#00AA00' : '#AA0000'};
  }
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 8px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  font-size: 0.85rem;
  
  ${props => {
    if (props.researched) {
      return `
        background: linear-gradient(45deg, #00AA00, #00FF00);
        color: #000;
        cursor: default;
      `;
    } else if (props.researching) {
      return `
        background: linear-gradient(45deg, #FF4444, #FF6666);
        color: #FFF;
      `;
    } else if (props.disabled) {
      return `
        background: #666;
        color: #999;
        cursor: not-allowed;
      `;
    } else {
      return `
        background: linear-gradient(45deg, #4169E1, #00BFFF);
        color: #FFF;
        
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 3px 8px rgba(65, 105, 225, 0.4);
        }
      `;
    }
  }}
`;

const Technology = () => {
  const dispatch = useDispatch();
  const gameState = useSelector((state) => state.game);
  const technology = useSelector((state) => state.technology);

  const handleStartResearch = (tech) => {
    if (gameState.money >= tech.cost && !technology.activeResearch) {
      dispatch(updateMoney(-tech.cost));
      dispatch(startResearch({
        techId: tech.id,
        cost: tech.cost
      }));
    }
  };

  const handleCancelResearch = () => {
    dispatch(cancelResearch());
  };

  const formatMoney = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const isAvailable = (tech) => {
    return tech.prerequisites.every(prereqId =>
      technology?.technologies?.find(t => t.id === prereqId)?.researched
    );
  };

  const getPrerequisiteNames = (tech) => {
    return tech.prerequisites.map(prereqId => {
      const prereqTech = technology?.technologies?.find(t => t.id === prereqId);
      return prereqTech ? prereqTech.name : 'Unknown';
    });
  };

  const currentResearchTech = technology?.activeResearch ? 
    technology?.technologies?.find(t => t.id === technology.activeResearch.techId) : null;

  return (
    <TechnologyContainer>
      <h2>🔬 RESEARCH & DEVELOPMENT - VERY SMART! 🔬</h2>
      
      <ResearchStatus>
        <StatusHeader>
          <h3>🧪 Research Lab</h3>
          <div className="research-points">
            ⚡ {technology.researchPointsPerMonth}/month
          </div>
        </StatusHeader>
        
        {technology.activeResearch ? (
          <>
            <ProgressBar>
              <div 
                className="fill" 
                style={{ width: `${technology.researchProgress * 100}%` }}
              />
            </ProgressBar>
            <CurrentResearch>
              Researching: <span className="tech-name">{currentResearchTech?.name}</span>
              <br />
              Progress: {Math.floor(technology.researchProgress * 100)}%
            </CurrentResearch>
          </>
        ) : (
          <CurrentResearch>
            💡 Ready to start new research project!
          </CurrentResearch>
        )}
      </ResearchStatus>
      
      <TechGrid>
        {(technology?.technologies || []).map(tech => {
          const available = isAvailable(tech);
          const canAfford = gameState.money >= tech.cost;
          const isResearching = technology?.activeResearch?.techId === tech.id;
          const prerequisiteNames = getPrerequisiteNames(tech);
          
          return (
            <TechCard 
              key={tech.id}
              researched={tech.researched}
              available={available && !tech.researched}
            >
              <TechHeader>
                <TechName 
                  researched={tech.researched}
                  available={available && !tech.researched}
                >
                  {tech.name}
                </TechName>
                <TechCost>{formatMoney(tech.cost)}</TechCost>
              </TechHeader>
              
              <TechDescription>{tech.description}</TechDescription>
              
              {tech.prerequisites.length > 0 && (
                <Prerequisites met={available}>
                  Prerequisites: {prerequisiteNames.map((name, index) => {
                    const prereqTech = technology.technologies.find(t => t.name === name);
                    return (
                      <span 
                        key={index}
                        className="prereq-item"
                        style={{
                          borderColor: prereqTech?.researched ? '#00AA00' : '#AA0000'
                        }}
                      >
                        {name}
                      </span>
                    );
                  })}
                </Prerequisites>
              )}
              
              {tech.researched ? (
                <ActionButton researched>
                  ✅ RESEARCHED
                </ActionButton>
              ) : isResearching ? (
                <ActionButton 
                  researching
                  onClick={handleCancelResearch}
                >
                  🚫 CANCEL RESEARCH
                </ActionButton>
              ) : (
                <ActionButton 
                  disabled={!available || !canAfford || technology.activeResearch}
                  onClick={() => handleStartResearch(tech)}
                >
                  {!available ? '🔒 LOCKED' : 
                   !canAfford ? '💸 TOO EXPENSIVE' :
                   technology.activeResearch ? '⏳ LAB BUSY' : '🔬 START RESEARCH'}
                </ActionButton>
              )}
            </TechCard>
          );
        })}
      </TechGrid>
    </TechnologyContainer>
  );
};

export default Technology;
