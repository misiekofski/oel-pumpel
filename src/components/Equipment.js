import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { upgradeEquipment } from '../store/gameSlice';

const EquipmentContainer = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 10px;
`;

const EquipmentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

const EquipmentTitle = styled.h3`
  color: #495057;
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
`;

const EquipmentLevel = styled.span`
  background: #007bff;
  color: #ffffff;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.7rem;
  font-weight: 600;
`;

const EquipmentInfo = styled.div`
  font-size: 0.7rem;
  color: #6c757d;
  margin-bottom: 6px;
  line-height: 1.2;
`;

const EquipmentStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  margin-bottom: 6px;
`;

const EquipmentStat = styled.div`
  background: #ffffff;
  padding: 3px 6px;
  border-radius: 3px;
  text-align: center;
  font-size: 0.65rem;
  
  .label {
    color: #6c757d;
    font-weight: 500;
    text-transform: uppercase;
  }
  
  .value {
    color: #495057;
    font-weight: 600;
  }
`;

const EquipmentButton = styled.button`
  width: 100%;
  padding: 6px;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  font-size: 0.7rem;
  
  ${props => {
    if (props.disabled) {
      return `
        background: #6c757d;
        color: #ffffff;
        cursor: not-allowed;
        opacity: 0.7;
      `;
    } else {
      return `
        background: #28a745;
        color: #ffffff;
        
        &:hover {
          background: #218838;
          transform: translateY(-1px);
        }
      `;
    }
  }}
`;

const Equipment = () => {
  const dispatch = useDispatch();
  const gameState = useSelector((state) => state.game);

  const upgradeCost = gameState.equipmentLevel * 50000;
  const canAfford = gameState.money >= upgradeCost;

  const handleUpgrade = () => {
    if (canAfford) {
      dispatch(upgradeEquipment());
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

  const getEquipmentName = (level) => {
    if (level >= 20) return 'QUANTUM DRILLS';
    if (level >= 15) return 'ELITE RIGS';
    if (level >= 10) return 'ADVANCED TECH';
    if (level >= 5) return 'PREMIUM GEAR';
    return 'BASIC EQUIPMENT';
  };

  const getNextLevelBonus = () => {
    const currentBonus = gameState.equipmentLevel;
    const nextBonus = gameState.equipmentLevel + 1;
    return `${currentBonus}x → ${nextBonus}x`;
  };

  return (
    <EquipmentContainer>
      <EquipmentHeader>
        <EquipmentTitle>⚡ Equipment Center</EquipmentTitle>
        <EquipmentLevel>LVL {gameState.equipmentLevel}</EquipmentLevel>
      </EquipmentHeader>
      
      <EquipmentInfo>
        {getEquipmentName(gameState.equipmentLevel)} - Tremendous drilling power multiplies all oil production!
      </EquipmentInfo>
      
      <EquipmentStats>
        <EquipmentStat>
          <div className="label">💰 Upgrade Cost</div>
          <div className="value">{formatMoney(upgradeCost)}</div>
        </EquipmentStat>
        <EquipmentStat>
          <div className="label">🚀 Bonus</div>
          <div className="value">{getNextLevelBonus()}</div>
        </EquipmentStat>
      </EquipmentStats>
      
      <EquipmentButton 
        disabled={!canAfford}
        onClick={handleUpgrade}
      >
        {canAfford ? '⬆️ UPGRADE BIGLY' : '❌ TOO BROKE'}
      </EquipmentButton>
    </EquipmentContainer>
  );
};

export default Equipment;
