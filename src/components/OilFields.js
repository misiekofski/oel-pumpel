import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { purchaseField } from '../store/oilFieldsSlice';
import { updateMoney } from '../store/gameSlice';

const OilFieldsContainer = styled.div`
  h2 {
    color: #FFD700;
    text-align: center;
    margin-bottom: 20px;
    font-size: 1.8rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
`;

const FieldGrid = styled.div`
  display: grid;
  gap: 15px;
`;

const FieldCard = styled.div`
  background: ${props => props.purchased ? 
    'linear-gradient(135deg, rgba(0, 255, 0, 0.2), rgba(0, 200, 0, 0.1))' : 
    'rgba(255, 255, 255, 0.05)'
  };
  border: 2px solid ${props => {
    switch (props.type) {
      case 'premium': return '#FFD700';
      case 'standard': return '#4169E1';
      case 'budget': return '#CD853F';
      default: return '#666';
    }
  }};
  border-radius: 12px;
  padding: 15px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
`;

const FieldHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const FieldName = styled.h3`
  color: ${props => {
    switch (props.type) {
      case 'premium': return '#FFD700';
      case 'standard': return '#4169E1';
      case 'budget': return '#CD853F';
      default: return '#FFF';
    }
  }};
  margin: 0;
  font-size: 1.1rem;
`;

const FieldType = styled.span`
  background: ${props => {
    switch (props.type) {
      case 'premium': return '#FFD700';
      case 'standard': return '#4169E1';
      case 'budget': return '#CD853F';
      default: return '#666';
    }
  }};
  color: ${props => props.type === 'premium' ? '#000' : '#FFF'};
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
`;

const FieldDescription = styled.p`
  color: #CCC;
  font-size: 0.9rem;
  margin: 8px 0;
  font-style: italic;
`;

const FieldStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin: 10px 0;
  font-size: 0.9rem;
`;

const StatItem = styled.div`
  text-align: center;
  
  .label {
    color: #AAA;
    font-size: 0.8rem;
  }
  
  .value {
    color: #FFF;
    font-weight: bold;
  }
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  
  ${props => {
    if (props.purchased) {
      return `
        background: linear-gradient(45deg, #00AA00, #00FF00);
        color: #000;
        cursor: default;
      `;
    } else if (props.disabled) {
      return `
        background: #666;
        color: #999;
        cursor: not-allowed;
      `;
    } else {
      return `
        background: linear-gradient(45deg, #FFD700, #FFA500);
        color: #000;
        
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(255, 215, 0, 0.4);
        }
      `;
    }
  }}
`;

const ProgressInfo = styled.div`
  margin-top: 10px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  font-size: 0.9rem;
  
  .progress-bar {
    width: 100%;
    height: 6px;
    background: #333;
    border-radius: 3px;
    margin-top: 5px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #FFD700, #FFA500);
    transition: width 0.3s ease;
  }
`;

const OilFields = () => {
  const dispatch = useDispatch();
  const gameState = useSelector((state) => state.game);
  const oilFields = useSelector((state) => state.oilFields);
  const technology = useSelector((state) => state.technology);

  const handlePurchaseField = (field) => {
    if (gameState.money >= field.cost && !field.purchased) {
      dispatch(updateMoney(-field.cost));
      dispatch(purchaseField(field.id));
    }
  };

  const formatMoney = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const getFieldMultiplier = (type) => {
    return oilFields?.fieldTypes?.[type]?.multiplier || 1;
  };

  const calculateEffectiveYield = (field) => {
    const baseYield = field.yield;
    const typeMultiplier = getFieldMultiplier(field.type);
    const techBonus = technology?.technologyEffects?.yieldBonus || 0;
    const equipmentBonus = gameState.equipmentLevel;
    
    return Math.floor(baseYield * typeMultiplier * (1 + techBonus) * equipmentBonus);
  };

  return (
    <OilFieldsContainer>
      <h2>🛢️ OIL FIELDS - TREMENDOUS OPPORTUNITIES! 🛢️</h2>
      
      <FieldGrid>
        {(oilFields?.fields || []).map(field => {
          const effectiveYield = calculateEffectiveYield(field);
          const canAfford = gameState.money >= field.cost;
          const progress = field.purchased && field.monthsRemaining > 0 ? 
            (field.duration - field.monthsRemaining) / field.duration : 0;
          
          return (
            <FieldCard 
              key={field.id} 
              type={field.type}
              purchased={field.purchased}
            >
              <FieldHeader>
                <FieldName type={field.type}>{field.name}</FieldName>
                <FieldType type={field.type}>{field.type}</FieldType>
              </FieldHeader>
              
              <FieldDescription>
                {field.description}
              </FieldDescription>
              
              <FieldStats>
                <StatItem>
                  <div className="label">Cost</div>
                  <div className="value">{formatMoney(field.cost)}</div>
                </StatItem>
                <StatItem>
                  <div className="label">Yield</div>
                  <div className="value">{effectiveYield}/month</div>
                </StatItem>
                <StatItem>
                  <div className="label">Duration</div>
                  <div className="value">{field.duration} months</div>
                </StatItem>
              </FieldStats>
              
              {field.purchased ? (
                <>
                  <ActionButton purchased>
                    ✅ OWNED & DRILLING
                  </ActionButton>
                  
                  {field.monthsRemaining > 0 && (
                    <ProgressInfo>
                      <div>🕐 {field.monthsRemaining} months remaining</div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${progress * 100}%` }}
                        />
                      </div>
                    </ProgressInfo>
                  )}
                </>
              ) : (
                <ActionButton 
                  disabled={!canAfford}
                  onClick={() => handlePurchaseField(field)}
                >
                  {canAfford ? '💰 BUY FIELD' : '❌ TOO EXPENSIVE'}
                </ActionButton>
              )}
            </FieldCard>
          );
        })}
      </FieldGrid>
    </OilFieldsContainer>
  );
};

export default OilFields;
