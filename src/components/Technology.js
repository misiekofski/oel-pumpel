import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { startResearch, cancelResearch } from '../store/technologySlice';
import { updateMoney } from '../store/gameSlice';

const TechnologyContainer = styled.div`
  h2 {
    color: #495057;
    text-align: center;
    margin-bottom: 16px;
    font-size: 1.4rem;
    font-weight: 600;
  }
`;

const ResearchStatus = styled.div`
  background: #f8f9fa;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 16px;
  border: 1px solid #e9ecef;
`;

const StatusHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  
  h3 {
    color: #495057;
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
  }
  
  .research-points {
    color: #28a745;
    font-weight: 600;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin: 8px 0;
  
  .fill {
    height: 100%;
    background: #28a745;
    transition: width 0.3s ease;
  }
`;

const CurrentResearch = styled.div`
  color: #6c757d;
  font-size: 0.8rem;
  
  .tech-name {
    color: #495057;
    font-weight: 600;
  }
`;

const TechGrid = styled.div`
  display: grid;
  gap: 6px;
  max-height: 350px;
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

const TechCard = styled.div`
  background: ${props => {
    if (props.researched) return '#d4edda';
    if (props.available) return '#ffffff';
    return '#f8f9fa';
  }};
  border: 1px solid ${props => {
    if (props.researched) return '#28a745';
    if (props.available) return '#007bff';
    return '#e9ecef';
  }};
  border-radius: 6px;
  padding: 6px;
  opacity: ${props => props.available || props.researched ? 1 : 0.7};
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => {
      if (props.researched) return '#28a745';
      if (props.available) return '#007bff';
      return '#adb5bd';
    }};
  }
`;

const TechHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
`;

const TechName = styled.h4`
  color: ${props => {
    if (props.researched) return '#155724';
    if (props.available) return '#495057';
    return '#6c757d';
  }};
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
`;

const TechCost = styled.div`
  color: #28a745;
  font-weight: 600;
  font-size: 0.8rem;
`;

const TechDescription = styled.p`
  color: #6c757d;
  font-size: 0.75rem;
  margin: 5px 0;
  font-style: italic;
  line-height: 1.2;
`;

const Prerequisites = styled.div`
  font-size: 0.7rem;
  color: #6c757d;
  margin: 5px 0;
  
  .prereq-item {
    display: inline-block;
    padding: 2px 4px;
    margin: 1px;
    background: #f8f9fa;
    border-radius: 3px;
    border: 1px solid ${props => props.met ? '#28a745' : '#dc3545'};
    font-weight: 500;
    font-size: 0.65rem;
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
