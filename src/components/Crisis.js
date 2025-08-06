import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const CrisisContainer = styled.div`
  h2 {
    color: #495057;
    text-align: center;
    margin-bottom: 16px;
    font-size: 1.4rem;
    font-weight: 600;
  }
`;

const CrisisStatus = styled.div`
  background: ${props => props.hasActiveEvents ? '#f8d7da' : '#d4edda'};
  border: 1px solid ${props => props.hasActiveEvents ? '#f5c6cb' : '#c3e6cb'};
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 16px;
  text-align: center;
`;

const StatusIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 8px;
`;

const StatusText = styled.div`
  color: ${props => props.hasActiveEvents ? '#721c24' : '#155724'};
  font-weight: 600;
  font-size: 1rem;
`;

const StatusSubtext = styled.div`
  color: #6c757d;
  font-size: 0.8rem;
  margin-top: 4px;
`;

const EventsList = styled.div`
  display: grid;
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f8f9fa;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #adb5bd;
    border-radius: 4px;
  }
`;

const EventCard = styled.div`
  background: #ffffff;
  border: 2px solid #dc3545;
  border-radius: 10px;
  padding: 15px;
  position: relative;
`;

const EventHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const EventName = styled.h3`
  color: #495057;
  margin: 0;
  font-size: 1.1rem;
`;

const EventDuration = styled.div`
  background: #dc3545;
  color: #ffffff;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: bold;
`;

const EventDescription = styled.p`
  color: #6c757d;
  font-size: 0.9rem;
  margin: 8px 0;
  font-style: italic;
  line-height: 1.3;
`;

const EventEffect = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 8px;
  font-size: 0.85rem;
  color: #495057;
  font-weight: bold;
`;

const HistorySection = styled.div`
  margin-top: 20px;
`;

const HistoryTitle = styled.h3`
  color: #495057;
  margin-bottom: 10px;
  font-size: 1.2rem;
`;

const HistoryList = styled.div`
  max-height: 150px;
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

const HistoryItem = styled.div`
  background: #f8f9fa;
  border-left: 3px solid #007bff;
  padding: 8px 12px;
  margin-bottom: 8px;
  border-radius: 0 6px 6px 0;
  
  .event-name {
    color: #495057;
    font-weight: bold;
    font-size: 0.9rem;
  }
  
  .event-time {
    color: #6c757d;
    font-size: 0.8rem;
  }
`;

const TechInfo = styled.div`
  background: #f8f9fa;
  border: 1px solid #007bff;
  border-radius: 8px;
  padding: 12px;
  margin-top: 15px;
  
  h4 {
    color: #007bff;
    margin: 0 0 8px 0;
    font-size: 1rem;
  }
  
  .tech-effect {
    color: #6c757d;
    font-size: 0.85rem;
    margin: 4px 0;
  }
  
  .tech-value {
    color: #28a745;
    font-weight: bold;
  }
`;

const Crisis = () => {
  const crisis = useSelector((state) => state.crisis);
  const technology = useSelector((state) => state.technology);
  const gameState = useSelector((state) => state.game);

  const getEffectDescription = (event) => {
    const effect = event.effect;
    switch (effect.type) {
      case 'price_change':
        const change = effect.value > 0 ? 'increase' : 'decrease';
        const percent = Math.abs(effect.value * 100);
        return `Oil prices ${change} by ${percent}%`;
      case 'maintenance_increase':
        return `Maintenance costs increase by ${effect.value * 100}%`;
      case 'production_halt':
        return 'All production halted';
      case 'production_reduction':
        return `Production reduced by ${effect.value * 100}%`;
      case 'cost_increase':
        return `All costs increased by ${effect.value * 100}%`;
      case 'price_volatility':
        return `Oil prices become highly volatile (±${effect.value * 100}%)`;
      case 'random_price':
        const [min, max] = effect.value;
        return `Random price change between ${min * 100}% and ${max * 100}%`;
      case 'field_damage':
        return `Field damage reduces efficiency by ${effect.value * 100}%`;
      default:
        return 'Unknown effect';
    }
  };

  const formatMonth = (month) => {
    if (month === 1) return `${month} month ago`;
    return `${month} months ago`;
  };

  const recentHistory = crisis.eventHistory.slice(-5);

  return (
    <CrisisContainer>
      <h2>🚨 CRISIS MANAGEMENT - FAKE NEWS ALERTS! 🚨</h2>
      
      <CrisisStatus hasActiveEvents={(crisis?.activeEvents?.length || 0) > 0}>
        <StatusIcon>
          {(crisis?.activeEvents?.length || 0) > 0 ? '⚠️' : '✅'}
        </StatusIcon>
        <StatusText hasActiveEvents={(crisis?.activeEvents?.length || 0) > 0}>
          {(crisis?.activeEvents?.length || 0) > 0 ? 
            `${crisis?.activeEvents?.length || 0} ACTIVE CRISIS EVENT${(crisis?.activeEvents?.length || 0) > 1 ? 'S' : ''}` :
            'ALL SYSTEMS STABLE'
          }
        </StatusText>
        <StatusSubtext>
          {crisis.activeEvents.length > 0 ? 
            'Dealing with tremendous challenges, but we will win!' :
            'Perfect operations, as expected from the best!'
          }
        </StatusSubtext>
      </CrisisStatus>
      
      {(crisis?.activeEvents?.length || 0) > 0 && (
        <EventsList>
          {(crisis?.activeEvents || []).map((event, index) => (
            <EventCard key={`${event.id}-${index}`}>
              <EventHeader>
                <EventName>{event.name}</EventName>
                <EventDuration>
                  {event.remainingDuration} month{event.remainingDuration !== 1 ? 's' : ''} left
                </EventDuration>
              </EventHeader>
              
              <EventDescription>
                {event.description}
              </EventDescription>
              
              <EventEffect>
                💥 Effect: {getEffectDescription(event)}
              </EventEffect>
            </EventCard>
          ))}
        </EventsList>
      )}
      
      <TechInfo>
        <h4>🛡️ Crisis Protection Technologies</h4>
        <div className="tech-effect">
          Crisis Probability Reduction: 
          <span className="tech-value"> -{((technology?.technologyEffects?.crisisReduction || 0) * 100).toFixed(0)}%</span>
        </div>
        <div className="tech-effect">
          Crisis Impact Mitigation: 
          <span className="tech-value"> -{((technology?.technologyEffects?.crisisMitigation || 0) * 100).toFixed(0)}%</span>
        </div>
        <div className="tech-effect">
          Crisis Insurance Fund: 
          <span className="tech-value"> ${(technology?.technologyEffects?.crisisInsurance || 0).toLocaleString()}</span>
        </div>
      </TechInfo>
      
      {recentHistory.length > 0 && (
        <HistorySection>
          <HistoryTitle>📋 Recent Crisis History</HistoryTitle>
          <HistoryList>
            {recentHistory.reverse().map((event, index) => (
              <HistoryItem key={`history-${event.id}-${index}`}>
                <div className="event-name">{event.name}</div>
                <div className="event-time">
                  Occurred {formatMonth((gameState?.currentMonth || 1) - event.occurredAt)}
                </div>
              </HistoryItem>
            ))}
          </HistoryList>
        </HistorySection>
      )}
    </CrisisContainer>
  );
};

export default Crisis;
