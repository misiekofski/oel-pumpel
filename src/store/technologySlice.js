import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  technologies: [
    {
      id: 1,
      name: 'Advanced Drilling',
      cost: 5000,
      description: 'I understand drilling, very complex stuff. Increases oil yield by 15%.',
      effect: { type: 'yield', value: 0.15 },
      researched: false,
      prerequisites: []
    },
    {
      id: 2,
      name: 'Seismic Surveying',
      cost: 6000,
      description: 'We have the best surveys, tremendous technology. Find new oil deposits faster.',
      effect: { type: 'discovery', value: 0.25 },
      researched: false,
      prerequisites: []
    },
    {
      id: 3,
      name: 'Environmental Protection',
      cost: 7000,
      description: 'Nobody loves the environment more than me. Reduces crisis probability by 20%.',
      effect: { type: 'crisis_reduction', value: 0.2 },
      researched: false,
      prerequisites: []
    },
    {
      id: 4,
      name: 'Enhanced Recovery',
      cost: 10000,
      description: 'Like my memory, enhanced and perfect. Extends field life by 3 months.',
      effect: { type: 'field_extension', value: 3 },
      researched: false,
      prerequisites: [1]
    },
    {
      id: 5,
      name: 'Automation Systems',
      cost: 12000,
      description: 'Robots doing the work, like my attention span - very efficient. Reduces maintenance by 30%.',
      effect: { type: 'maintenance_reduction', value: 0.3 },
      researched: false,
      prerequisites: [1]
    },
    {
      id: 6,
      name: 'Deep Sea Technology',
      cost: 15000,
      description: 'Going deeper than my understanding of quantum physics. Unlocks offshore premium fields.',
      effect: { type: 'unlock_premium', value: 'offshore' },
      researched: false,
      prerequisites: [2]
    },
    {
      id: 7,
      name: 'Market Analytics',
      cost: 8000,
      description: 'Better than my Twitter analytics. Improves market trend predictions.',
      effect: { type: 'market_prediction', value: 0.5 },
      researched: false,
      prerequisites: [2]
    },
    {
      id: 8,
      name: 'Crisis Management',
      cost: 12000,
      description: 'I handle crises better than anyone. Reduces crisis impact by 40%.',
      effect: { type: 'crisis_mitigation', value: 0.4 },
      researched: false,
      prerequisites: [3]
    },
    {
      id: 9,
      name: 'Global Logistics',
      cost: 16000,
      description: 'Worldwide shipping, like my brand recognition. Reduces shipping time by 1 month.',
      effect: { type: 'shipping_speed', value: 1 },
      researched: false,
      prerequisites: [7]
    },
    {
      id: 10,
      name: 'Quantum Computing',
      cost: 22000,
      description: 'Very complicated, I understand it perfectly. Optimizes everything by 25%.',
      effect: { type: 'global_efficiency', value: 0.25 },
      researched: false,
      prerequisites: [5, 7]
    },
    {
      id: 11,
      name: 'Renewable Integration',
      cost: 18000,
      description: 'Clean energy backup, like my conscience. Provides stable income during crises.',
      effect: { type: 'crisis_insurance', value: 50000 },
      researched: false,
      prerequisites: [3, 8]
    },
    {
      id: 12,
      name: 'AI Optimization',
      cost: 25000,
      description: 'Artificial Intelligence, almost as smart as me. Maximizes all operations.',
      effect: { type: 'ultimate_optimization', value: 0.5 },
      researched: false,
      prerequisites: [10, 11]
    }
  ],
  
  researchQueue: [],
  activeResearch: null,
  researchProgress: 0,
  researchPointsPerMonth: 100,
  totalResearchPoints: 0,
  
  technologyEffects: {
    yieldBonus: 0,
    discoveryBonus: 0,
    crisisReduction: 0,
    fieldExtension: 0,
    maintenanceReduction: 0,
    crisisMitigation: 0,
    shippingSpeedBonus: 0,
    globalEfficiency: 0,
    crisisInsurance: 0,
    marketPrediction: 0
  }
};

const technologySlice = createSlice({
  name: 'technology',
  initialState,
  reducers: {
    startResearch: (state, action) => {
      const techId = action.payload.techId;
      const cost = action.payload.cost;
      const technology = state.technologies.find(t => t.id === techId);
      
      if (technology && !technology.researched && !state.activeResearch) {
        // Check prerequisites
        const prerequisitesMet = technology.prerequisites.every(prereqId => 
          state.technologies.find(t => t.id === prereqId)?.researched
        );
        
        if (prerequisitesMet) {
          state.activeResearch = {
            techId,
            cost,
            pointsInvested: 0
          };
          state.researchProgress = 0;
        }
      }
    },
    
    processResearch: (state, action) => {
      const researchPoints = action.payload.researchPoints || state.researchPointsPerMonth;
      
      if (state.activeResearch) {
        state.activeResearch.pointsInvested += researchPoints;
        state.totalResearchPoints += researchPoints;
        state.researchProgress = Math.min(
          state.activeResearch.pointsInvested / state.activeResearch.cost, 
          1
        );
        
        if (state.researchProgress >= 1) {
          // Complete research
          const technology = state.technologies.find(t => t.id === state.activeResearch.techId);
          if (technology) {
            technology.researched = true;
            // Apply technology effects
            applyTechnologyEffect(state, technology);
          }
          
          state.activeResearch = null;
          state.researchProgress = 0;
        }
      }
    },
    
    cancelResearch: (state) => {
      state.activeResearch = null;
      state.researchProgress = 0;
    },
    
    upgradeResearchCapacity: (state, action) => {
      const cost = action.payload.cost;
      state.researchPointsPerMonth += 20;
    },
    
    resetTechnology: (state) => {
      return initialState;
    },
    
    applyTechnologyBonus: (state, action) => {
      const { type, value } = action.payload;
      switch (type) {
        case 'yield':
          state.technologyEffects.yieldBonus += value;
          break;
        case 'discovery':
          state.technologyEffects.discoveryBonus += value;
          break;
        case 'crisis_reduction':
          state.technologyEffects.crisisReduction += value;
          break;
        case 'field_extension':
          state.technologyEffects.fieldExtension += value;
          break;
        case 'maintenance_reduction':
          state.technologyEffects.maintenanceReduction += value;
          break;
        case 'crisis_mitigation':
          state.technologyEffects.crisisMitigation += value;
          break;
        case 'shipping_speed':
          state.technologyEffects.shippingSpeedBonus += value;
          break;
        case 'global_efficiency':
          state.technologyEffects.globalEfficiency += value;
          break;
        case 'crisis_insurance':
          state.technologyEffects.crisisInsurance += value;
          break;
        case 'market_prediction':
          state.technologyEffects.marketPrediction += value;
          break;
      }
    }
  }
});

export const {
  startResearch,
  processResearch,
  cancelResearch,
  upgradeResearchCapacity,
  resetTechnology,
  applyTechnologyBonus
} = technologySlice.actions;

export default technologySlice.reducer;
