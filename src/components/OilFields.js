import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { purchaseField } from '../store/oilFieldsSlice';
import { updateMoney } from '../store/gameSlice';
import Equipment from './Equipment';

const OilFieldsContainer = styled.div`
  h2 {
    color: #495057;
    text-align: center;
    margin-bottom: 12px;
    font-size: 1.2rem;
    font-weight: 600;
  }
`;

const FieldGrid = styled.div`
  display: grid;
  gap: 6px;
`;

const FieldCard = styled.div`
  background: ${props => props.purchased ? '#e8f5e8' : '#ffffff'};
  border: 1px solid ${props => props.purchased ? '#28a745' : '#e9ecef'};
  border-radius: 4px;
  padding: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.purchased ? '#28a745' : '#007bff'};
    transform: ${props => !props.purchased ? 'translateY(-1px)' : 'none'};
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
`;

const FieldHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

const FieldName = styled.h3`
  color: #495057;
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
`;

const FieldType = styled.span`
  background: ${props => {
    switch(props.type) {
      case 'standard': return '#6c757d';
      case 'premium': return '#007bff';
      case 'offshore': return '#17a2b8';
      default: return '#6c757d';
    }
  }};
  color: #ffffff;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.65rem;
  font-weight: 500;
  text-transform: uppercase;
`;

const FieldDescription = styled.p`
  color: #6c757d;
  font-size: 0.7rem;
  margin: 4px 0;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const FieldStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  margin: 6px 0;
  font-size: 0.8rem;
`;

const StatItem = styled.div`
  text-align: center;
  background: #f8f9fa;
  padding: 4px 2px;
  border-radius: 3px;
  
  .label {
    color: #6c757d;
    font-size: 0.65rem;
    text-transform: uppercase;
    font-weight: 500;
  }
  
  .value {
    color: #495057;
    font-weight: 600;
    font-size: 0.75rem;
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
        opacity: 0.7;
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

const EquipmentSection = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 10px;
  
  .equipment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }
  
  .equipment-title {
    color: #495057;
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0;
  }
  
  .equipment-level {
    background: #007bff;
    color: #ffffff;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 0.7rem;
    font-weight: 600;
  }
  
  .equipment-info {
    font-size: 0.7rem;
    color: #6c757d;
    margin-bottom: 6px;
    line-height: 1.2;
  }
  
  .equipment-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
    margin-bottom: 6px;
  }
  
  .equipment-stat {
    background: #ffffff;
    padding: 3px 6px;
    border-radius: 3px;
    text-align: center;
    font-size: 0.65rem;
    
    .label {
      color: #6c757d;
      font-weight: 500;
    }
    
    .value {
      color: #495057;
      font-weight: 600;
    }
  }
`;



const ProgressInfo = styled.div`
  margin-top: 6px;
  padding: 4px 6px;
  background: rgba(40, 167, 69, 0.1);
  border: 1px solid #28a745;
  border-radius: 3px;
  font-size: 0.7rem;
  color: #155724;
  
  .progress-text {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2px;
  }
  
  .progress-bar {
    width: 100%;
    height: 4px;
    background: #e9ecef;
    border-radius: 2px;
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
      <h2>🛢️ BIGLY OIL DRILLING SITES 🛢️</h2>
      
      <FieldGrid>
        {(oilFields?.fields || [])
          .filter(field => field.purchased || gameState.money >= field.cost)
          .map(field => {
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
                  <div className="label">💰 Cost</div>
                  <div className="value">{formatMoney(field.cost)}</div>
                </StatItem>
                <StatItem>
                  <div className="label">🛢️ Yield</div>
                  <div className="value">{effectiveYield}/mo</div>
                </StatItem>
                <StatItem>
                  <div className="label">⏱️ Life</div>
                  <div className="value">{field.duration}mo</div>
                </StatItem>
              </FieldStats>
              
              {field.purchased ? (
                <>
                  <ActionButton purchased>
                    ✅ OWNED (DRILLING!)
                  </ActionButton>
                  
                  {field.monthsRemaining > 0 && (
                    <ProgressInfo>
                      <div className="progress-text">
                        <span>⏳ {field.monthsRemaining} months left</span>
                        <span>{Math.round(progress * 100)}%</span>
                      </div>
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
                  {canAfford ? '💰 BUY NOW' : '❌ TOO BROKE'}
                </ActionButton>
              )}
            </FieldCard>
          );
        })}
      </FieldGrid>
      
      <Equipment />
    </OilFieldsContainer>
  );
};

export default OilFields;
