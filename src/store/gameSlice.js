import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  money: 250000,
  oilStock: 0,
  ownedFields: 0,
  equipmentLevel: 1,
  currentMonth: 1,
  currentYear: 2024,
  baseOilPrice: 75,
  marketTrend: 'Stable',
  gameOver: false,
  won: false,
  
  // Achievements tracking
  achievements: {
    unlocked: new Set(),
    totalDrilled: 0,
    maxMoney: 0,
    totalFieldsPurchased: 0,
    totalOilSold: 0,
    monthsPlayed: 0
  },
  
  // Continental oil tracking
  continentalOil: {
    'north-america': { available: 0, inTransit: [] },
    'europe': { available: 0, inTransit: [] },
    'asia': { available: 0, inTransit: [] },
    'africa': { available: 0, inTransit: [] },
    'south-america': { available: 0, inTransit: [] }
  },
  
  // Market data
  continents: {
    'north-america': { name: 'North America', flag: '🇺🇸', multiplier: 1.1, demand: 'High', shippingTime: 2 },
    'europe': { name: 'Europe', flag: '🇪🇺', multiplier: 1.04, demand: 'Medium', shippingTime: 3 },
    'asia': { name: 'Asia', flag: '🇯🇵', multiplier: 0.96, demand: 'Very High', shippingTime: 4 },
    'africa': { name: 'Africa', flag: '🌍', multiplier: 0.9, demand: 'Low', shippingTime: 2 },
    'south-america': { name: 'South America', flag: '🇧🇷', multiplier: 1.0, demand: 'Medium', shippingTime: 3 }
  },
  
  marketTrends: ['Crashing', 'Declining', 'Stable', 'Rising', 'Booming'],
  trendMultipliers: { 'Crashing': 0.6, 'Declining': 0.8, 'Stable': 1.0, 'Rising': 1.2, 'Booming': 1.5 }
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    updateMoney: (state, action) => {
      state.money += action.payload;
      state.achievements.maxMoney = Math.max(state.achievements.maxMoney, state.money);
    },
    
    updateOilStock: (state, action) => {
      state.oilStock += action.payload;
      if (action.payload > 0) {
        state.achievements.totalDrilled += action.payload;
      }
    },
    
    upgradeEquipment: (state) => {
      const cost = state.equipmentLevel * 50000;
      if (state.money >= cost) {
        state.money -= cost;
        state.equipmentLevel++;
      }
    },
    
    nextMonth: (state) => {
      state.achievements.monthsPlayed++;
      state.currentMonth++;
      if (state.currentMonth > 12) {
        state.currentMonth = 1;
        state.currentYear++;
      }
    },
    
    updateMarketTrend: (state, action) => {
      state.marketTrend = action.payload.trend;
      state.baseOilPrice = action.payload.price;
    },
    
    shipOil: (state, action) => {
      const { continent, amount, shippingTime } = action.payload;
      if (state.oilStock >= amount) {
        state.oilStock -= amount;
        state.continentalOil[continent].inTransit.push({
          amount,
          arrivalMonth: shippingTime
        });
      }
    },
    
    processShipments: (state) => {
      Object.keys(state.continentalOil).forEach(continent => {
        const continentData = state.continentalOil[continent];
        continentData.inTransit = continentData.inTransit.filter(shipment => {
          shipment.arrivalMonth--;
          if (shipment.arrivalMonth <= 0) {
            continentData.available += shipment.amount;
            return false;
          }
          return true;
        });
      });
    },
    
    sellOil: (state, action) => {
      const { continent, amount, price } = action.payload;
      const available = state.continentalOil[continent].available;
      if (amount <= available) {
        state.money += amount * price;
        state.continentalOil[continent].available -= amount;
        state.achievements.totalOilSold += amount;
      }
    },
    
    unlockAchievement: (state, action) => {
      state.achievements.unlocked.add(action.payload);
    },
    
    setGameOver: (state, action) => {
      state.gameOver = true;
      state.won = action.payload.won || false;
    },
    
    resetGame: (state) => {
      return { ...initialState, achievements: { ...initialState.achievements, unlocked: new Set() } };
    },
    
    loadGameState: (state, action) => {
      return { ...state, ...action.payload };
    }
  }
});

export const {
  updateMoney,
  updateOilStock,
  upgradeEquipment,
  nextMonth,
  updateMarketTrend,
  shipOil,
  processShipments,
  sellOil,
  unlockAchievement,
  setGameOver,
  resetGame,
  loadGameState
} = gameSlice.actions;

export default gameSlice.reducer;
