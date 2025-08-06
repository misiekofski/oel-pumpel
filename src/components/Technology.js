import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { startResearch, cancelResearch } from '../store/technologySlice';
import { updateMoney } from '../store/gameSlice';

const TechnologyContainer = styled.div`
  h2 {
    color: #495057;
    text-align: center;
    margin-bottom: 12px;
    font-size: 1.2rem;
    font-weight: 600;
  }
`;

const ResearchStatus = styled.div`
  background: #f8f9fa;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 12px;
  border: 1px solid #e9ecef;
`;

const StatusHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  
  h3 {
    color: #495057;
    margin: 0;
    font-size: 0.9rem;
    font-weight: 600;
  }
  
  .research-points {
    color: #28a745;
    font-weight: 600;
    font-size: 0.8rem;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
  margin: 6px 0;
  
  .fill {
    height: 100%;
    background: #28a745;
    transition: width 0.3s ease;
  }
`;

const CurrentResearch = styled.div`
  color: #6c757d;
  font-size: 0.75rem;
  
  .tech-name {
    color: #495057;
    font-weight: 600;
  }
`;

const TechGrid = styled.div`
  display: grid;
  gap: 4px;
`;

const TechSection = styled.div`
  margin-bottom: 8px;
  
  .section-title {
    font-size: 0.75rem;
    font-weight: 600;
    color: #495057;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
    padding: 2px 0;
    border-bottom: 1px solid #e9ecef;
  }
`;

const TechCard = styled.div`
  background: ${props => {
    if (props.researched) return '#e8f5e8';
    if (props.available) return '#ffffff';
    return '#f8f9fa';
  }};
  border: 1px solid ${props => {
    if (props.researched) return '#28a745';
    if (props.available) return '#007bff';
    return '#e9ecef';
  }};
  border-radius: 4px;
  padding: 6px;
  opacity: ${props => props.available || props.researched ? 1 : 0.7};
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => {
      if (props.researched) return '#28a745';
      if (props.available) return '#007bff';
      return '#adb5bd';
    }};
    transform: ${props => props.available && !props.researched ? 'translateY(-1px)' : 'none'};
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
  font-size: 0.8rem;
  font-weight: 600;
`;

const TechCost = styled.div`
  color: #28a745;
  font-weight: 600;
  font-size: 0.7rem;
`;

const TechDescription = styled.p`
  color: #6c757d;
  font-size: 0.7rem;
  margin: 4px 0;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TechEffect = styled.div`
  background: rgba(40, 167, 69, 0.1);
  border-radius: 3px;
  padding: 2px 4px;
  margin: 4px 0;
  font-size: 0.65rem;
  color: #155724;
  font-weight: 500;
`;

const Prerequisites = styled.div`
  font-size: 0.65rem;
  color: #6c757d;
  margin: 4px 0;
  
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
  padding: 6px;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  font-size: 0.7rem;
  margin-top: 4px;
  
  ${props => {
    if (props.researched) {
      return `
        background: #28a745;
        color: #ffffff;
        cursor: default;
      `;
    } else if (props.researching) {
      return `
        background: #dc3545;
        color: #ffffff;
        &:hover {
          background: #c82333;
        }
      `;
    } else if (props.disabled) {
      return `
        background: #6c757d;
        color: #ffffff;
        cursor: not-allowed;
        opacity: 0.6;
      `;
    } else {
      return `
        background: #007bff;
        color: #ffffff;
        
        &:hover {
          background: #0056b3;
          transform: translateY(-1px);
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

  const getEffectDescription = (effect) => {
    switch (effect.type) {
      case 'yield':
        return `+${Math.round(effect.value * 100)}% Oil Yield`;
      case 'discovery':
        return `+${Math.round(effect.value * 100)}% Discovery Rate`;
      case 'crisis_reduction':
        return `-${Math.round(effect.value * 100)}% Crisis Chance`;
      case 'field_extension':
        return `+${effect.value} Months Field Life`;
      case 'maintenance_reduction':
        return `-${Math.round(effect.value * 100)}% Maintenance`;
      case 'crisis_mitigation':
        return `-${Math.round(effect.value * 100)}% Crisis Impact`;
      case 'shipping_speed':
        return `-${effect.value} Month Shipping`;
      case 'global_efficiency':
        return `+${Math.round(effect.value * 100)}% All Efficiency`;
      case 'crisis_insurance':
        return `$${effect.value.toLocaleString()} Crisis Protection`;
      case 'market_prediction':
        return `+${Math.round(effect.value * 100)}% Market Insight`;
      case 'unlock_premium':
        return `Unlock ${effect.value} Fields`;
      case 'ultimate_optimization':
        return `+${Math.round(effect.value * 100)}% Ultimate Boost`;
      default:
        return 'Special Effect';
    }
  };

  const organizeTechnologies = () => {
    const techs = technology?.technologies || [];
    const available = techs.filter(tech => tech.researched || isAvailable(tech) || technology?.activeResearch?.techId === tech.id);
    
    const categories = {
      basic: available.filter(tech => tech.prerequisites.length === 0),
      intermediate: available.filter(tech => tech.prerequisites.length === 1),
      advanced: available.filter(tech => tech.prerequisites.length >= 2)
    };
    
    return categories;
  };

  const currentResearchTech = technology?.activeResearch ? 
    technology?.technologies?.find(t => t.id === technology.activeResearch.techId) : null;

  const organizedTechs = organizeTechnologies();

  const renderTechCard = (tech) => {
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
        
        <TechEffect>{getEffectDescription(tech.effect)}</TechEffect>
        <TechDescription>{tech.description}</TechDescription>
        
        {tech.prerequisites.length > 0 && (
          <Prerequisites met={available}>
            Req: {prerequisiteNames.map((name, index) => {
              const prereqTech = technology.technologies.find(t => t.name === name);
              return (
                <span 
                  key={index}
                  className="prereq-item"
                  style={{
                    borderColor: prereqTech?.researched ? '#28a745' : '#dc3545'
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
            ✅ BIGLY SUCCESS
          </ActionButton>
        ) : isResearching ? (
          <ActionButton 
            researching
            onClick={handleCancelResearch}
          >
            🚫 FAKE RESEARCH
          </ActionButton>
        ) : (
          <ActionButton 
            disabled={!available || !canAfford || technology.activeResearch}
            onClick={() => handleStartResearch(tech)}
          >
            {!available ? '🔒 NEED MORE SMARTS' : 
             !canAfford ? '💸 TOO POOR' :
             technology.activeResearch ? '⏳ GENIUS BUSY' : '🔬 MAKE IT HAPPEN'}
          </ActionButton>
        )}
      </TechCard>
    );
  };

  return (
    <TechnologyContainer>
      <h2>🔬 R&D LAB (Very Smart Labs!) 🔬</h2>
      
      <ResearchStatus>
        <StatusHeader>
          <h3>🧪 Elite Research Facility</h3>
          <div className="research-points">
            ⚡ {technology.researchPointsPerMonth} genius points/mo
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
              <span className="tech-name">{currentResearchTech?.name}</span> - {Math.floor(technology.researchProgress * 100)}% (Tremendous progress!)
            </CurrentResearch>
          </>
        ) : (
          <CurrentResearch>
            💡 Lab ready for next billion-dollar idea
          </CurrentResearch>
        )}
      </ResearchStatus>
      
      <TechGrid>
        {organizedTechs.basic.length > 0 && (
          <TechSection>
            <div className="section-title">🌱 Bigly Basics</div>
            {organizedTechs.basic.map(renderTechCard)}
          </TechSection>
        )}
        
        {organizedTechs.intermediate.length > 0 && (
          <TechSection>
            <div className="section-title">🔧 Tremendous Tech</div>
            {organizedTechs.intermediate.map(renderTechCard)}
          </TechSection>
        )}
        
        {organizedTechs.advanced.length > 0 && (
          <TechSection>
            <div className="section-title">🚀 Genius Level (Very Smart!)</div>
            {organizedTechs.advanced.map(renderTechCard)}
          </TechSection>
        )}
      </TechGrid>
    </TechnologyContainer>
  );
};

export default Technology;
