import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { purchaseField } from '../store/oilFieldsSlice';
import { updateMoney } from '../store/gameSlice';

const OilFieldsContainer = styled.div`
  h2 {
    color: #495057;
    text-align: center;
    margin-bottom: 16px;
    font-size: 1.4rem;
    font-weight: 600;
  }
`;

const FieldGrid = styled.div`
  display: grid;
  gap: 10px;
`;

const FieldCard = styled.div`
  background: ${props => props.purchased ? '#f8f9fa' : '#ffffff'};
  border: 1px solid ${props => props.purchased ? '#28a745' : '#e9ecef'};
  border-radius: 6px;
  padding: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.purchased ? '#28a745' : '#adb5bd'};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const FieldHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const FieldName = styled.h3`
  color: #495057;
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
`;

const FieldType = styled.span`
  background: #6c757d;
  color: #ffffff;
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
`;

const FieldDescription = styled.p`
  color: #6c757d;
  font-size: 0.8rem;
  margin: 6px 0;
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
    color: #6c757d;
    font-size: 0.8rem;
  }
  
  .value {
    color: #495057;
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
        background: #28a745;
        color: #ffffff;
        cursor: default;
      `;
    } else if (props.disabled) {
      return `
        background: #6c757d;
        color: #ffffff;
        cursor: not-allowed;
      `;
    } else {
      return `
        background: #007bff;
        color: #ffffff;
        
        &:hover {
          background: #0056b3;
        }
      `;
    }
  }}
`;

const ProgressInfo = styled.div`
  margin-top: 10px;
  padding: 8px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #495057;
  
  .progress-bar {
    width: 100%;
    height: 6px;
    background: #e9ecef;
    border-radius: 3px;
    margin-top: 5px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: #28a745;
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
