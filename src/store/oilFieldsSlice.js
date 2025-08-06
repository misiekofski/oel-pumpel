import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  fields: [
    { 
      id: 4, 
      name: 'Backyard Oil Patch', 
      cost: 25000, 
      yield: 400, 
      duration: 12, 
      description: 'Small operation in your backyard. Even I started somewhere, folks.',
      type: 'budget',
      purchased: false,
      monthsRemaining: 0
    },
    { 
      id: 1, 
      name: 'Middle Eastern Light', 
      cost: 45000, 
      yield: 700, 
      duration: 16, 
      description: 'Good oil from the desert. Very hot climate, like my deals.',
      type: 'budget',
      purchased: false,
      monthsRemaining: 0
    },
    { 
      id: 2, 
      name: 'Canadian Oil Sands', 
      cost: 75000, 
      yield: 900, 
      duration: 22, 
      description: 'From our neighbors up north. Nice people, but their oil needs work.',
      type: 'standard',
      purchased: false,
      monthsRemaining: 0
    },
    { 
      id: 3, 
      name: 'North Sea Brent', 
      cost: 120000, 
      yield: 1200, 
      duration: 24, 
      description: 'European oil that is almost as good as American oil. Almost.',
      type: 'standard',
      purchased: false,
      monthsRemaining: 0
    },
    { 
      id: 5, 
      name: 'Texas Sweet Crude', 
      cost: 180000, 
      yield: 1500, 
      duration: 30, 
      description: 'The best crude in America, tremendous quality. Everybody says so.',
      type: 'premium',
      purchased: false,
      monthsRemaining: 0
    },
    { 
      id: 6, 
      name: 'Alaskan Crude', 
      cost: 250000, 
      yield: 1800, 
      duration: 36, 
      description: 'From the beautiful Alaskan wilderness. Sarah Palin can see it from her house.',
      type: 'premium',
      purchased: false,
      monthsRemaining: 0
    },
    { 
      id: 7, 
      name: 'Offshore Gulf Mega-Rig', 
      cost: 400000, 
      yield: 2400, 
      duration: 48, 
      description: 'Deep sea drilling, very dangerous. But worth it! Like my presidency.',
      type: 'premium',
      purchased: false,
      monthsRemaining: 0
    }
  ],
  
  fieldTypes: {
    budget: { multiplier: 0.8, color: '#CD853F', maintenance: 1000 },
    standard: { multiplier: 1.0, color: '#4169E1', maintenance: 2000 },
    premium: { multiplier: 1.3, color: '#FFD700', maintenance: 3500 }
  },
  
  monthlyProduction: 0,
  totalInvestment: 0,
  fieldDepletionRate: 0.02
};

const oilFieldsSlice = createSlice({
  name: 'oilFields',
  initialState,
  reducers: {
    purchaseField: (state, action) => {
      const fieldId = action.payload;
      const field = state.fields.find(f => f.id === fieldId);
      if (field && !field.purchased) {
        field.purchased = true;
        field.monthsRemaining = field.duration;
        state.totalInvestment += field.cost;
      }
    },
    
    processMonthlyProduction: (state, action) => {
      // Defensive check to ensure fields array exists
      if (!state.fields || !Array.isArray(state.fields)) {
        console.warn('processMonthlyProduction: state.fields is not initialized');
        return 0;
      }
      
      const equipmentLevel = action.payload.equipmentLevel || 1;
      let totalProduction = 0;
      
      state.fields.forEach(field => {
        if (field.purchased && field.monthsRemaining > 0) {
          // Calculate production with equipment bonus and field type multiplier
          const fieldType = state.fieldTypes[field.type];
          const production = Math.floor(field.yield * fieldType.multiplier * equipmentLevel);
          totalProduction += production;
          
          // Decrease remaining months and apply depletion
          field.monthsRemaining--;
          if (field.monthsRemaining <= 0) {
            field.purchased = false;
          } else {
            // Apply gradual depletion
            field.yield = Math.max(field.yield * (1 - state.fieldDepletionRate), field.yield * 0.3);
          }
        }
      });
      
      state.monthlyProduction = Math.floor(totalProduction);
      // Don't return value from Redux action - just store it in state
    },
    
    calculateMaintenanceCosts: (state) => {
      let totalMaintenance = 0;
      state.fields.forEach(field => {
        if (field.purchased && field.monthsRemaining > 0) {
          const fieldType = state.fieldTypes[field.type];
          totalMaintenance += fieldType.maintenance;
        }
      });
      return totalMaintenance;
    },
    
    resetField: (state, action) => {
      const fieldId = action.payload;
      const field = state.fields.find(f => f.id === fieldId);
      if (field) {
        field.purchased = false;
        field.monthsRemaining = 0;
        // Reset yield to original (this would need to be stored separately in a real app)
      }
    },
    
    applyTechnologyBonus: (state, action) => {
      const { fieldId, bonus } = action.payload;
      const field = state.fields.find(f => f.id === fieldId);
      if (field) {
        field.yield = Math.floor(field.yield * (1 + bonus));
      }
    },
    
    extendFieldLife: (state, action) => {
      const { fieldId, months } = action.payload;
      const field = state.fields.find(f => f.id === fieldId);
      if (field && field.purchased) {
        field.monthsRemaining += months;
      }
    },
    
    updateFieldEfficiency: (state, action) => {
      const efficiencyBonus = action.payload;
      state.fields.forEach(field => {
        if (field.purchased) {
          field.yield = Math.floor(field.yield * (1 + efficiencyBonus));
        }
      });
    },
    
    resetOilFields: (state) => {
      return initialState;
    }
  }
});

export const {
  purchaseField,
  processMonthlyProduction,
  calculateMaintenanceCosts,
  resetField,
  applyTechnologyBonus,
  extendFieldLife,
  updateFieldEfficiency,
  resetOilFields
} = oilFieldsSlice.actions;

export default oilFieldsSlice.reducer;
