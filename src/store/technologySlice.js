import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  technologies: [
    {
      id: 1,
      name: 'Advanced Drilling',
      cost: 5000,
      description: 'Nobody drills better than me, believe me. I know drilling, I have the best drilling - tremendous holes, the deepest holes you\'ve ever seen.',
      effect: { type: 'yield', value: 0.15 },
      researched: false,
      prerequisites: []
    },
    {
      id: 2,
      name: 'Seismic Surveying',
      cost: 6000,
      description: 'We\'re gonna shake the earth so hard, the oil will practically jump out. My surveys are the most beautiful surveys, everyone says so.',
      effect: { type: 'discovery', value: 0.25 },
      researched: false,
      prerequisites: []
    },
    {
      id: 3,
      name: 'Environmental Protection',
      cost: 7000,
      description: 'I love the environment more than anyone, probably more than trees love themselves. This will make drilling so clean, Greta will send thank you cards.',
      effect: { type: 'crisis_reduction', value: 0.2 },
      researched: false,
      prerequisites: []
    },
    {
      id: 4,
      name: 'Enhanced Recovery',
      cost: 10000,
      description: 'Like my stamina at rallies, this makes oil fields last forever. Some say it\'s impossible, but I do impossible things before breakfast.',
      effect: { type: 'field_extension', value: 3 },
      researched: false,
      prerequisites: [1]
    },
    {
      id: 5,
      name: 'Automation Systems',
      cost: 12000,
      description: 'Robots doing all the work while I take credit - it\'s like having the perfect cabinet! These bots work harder than my Twitter fingers.',
      effect: { type: 'maintenance_reduction', value: 0.3 },
      researched: false,
      prerequisites: [1]
    },
    {
      id: 6,
      name: 'Deep Sea Technology',
      cost: 15000,
      description: 'We\'re going deeper than my understanding of basic economics. Underwater drilling - it\'s like space, but wetter and more profitable.',
      effect: { type: 'unlock_premium', value: 'offshore' },
      researched: false,
      prerequisites: [2]
    },
    {
      id: 7,
      name: 'Market Analytics',
      cost: 8000,
      description: 'Better market predictions than my election forecasts. This AI reads markets like I read crowds - bigly and with tremendous accuracy.',
      effect: { type: 'market_prediction', value: 0.5 },
      researched: false,
      prerequisites: [2]
    },
    {
      id: 8,
      name: 'Crisis Management',
      cost: 12000,
      description: 'I handle crises better than anyone - just ask my lawyers. When crisis hits, I don\'t panic, I tweet through it.',
      effect: { type: 'crisis_mitigation', value: 0.4 },
      researched: false,
      prerequisites: [3]
    },
    {
      id: 9,
      name: 'Global Logistics',
      cost: 16000,
      description: 'Worldwide shipping faster than my scandal news cycles. We\'ll move oil so fast, it\'ll make your head spin - in a good way.',
      effect: { type: 'shipping_speed', value: 1 },
      researched: false,
      prerequisites: [7]
    },
    {
      id: 10,
      name: 'Quantum Computing',
      cost: 22000,
      description: 'Quantum technology - I understand it perfectly, probably better than quantum physicists. It\'s like regular computing but more... quantum-y.',
      effect: { type: 'global_efficiency', value: 0.25 },
      researched: false,
      prerequisites: [5, 7]
    },
    {
      id: 11,
      name: 'Renewable Integration',
      cost: 18000,
      description: 'Clean energy backup - like having a Plan B, but for when the planet gets angry. Solar panels that work even when I\'m golfing.',
      effect: { type: 'crisis_insurance', value: 50000 },
      researched: false,
      prerequisites: [3, 8]
    },
    {
      id: 12,
      name: 'AI Optimization',
      cost: 25000,
      description: 'Artificial Intelligence almost as smart as me - which is saying something tremendous. This AI will optimize everything, even my tweets.',
      effect: { type: 'ultimate_optimization', value: 0.5 },
      researched: false,
      prerequisites: [10, 11]
    }
  ],
  
  researchQueue: [],
  activeResearch: null,
  researchProgress: 0,
  researchPointsPerMonth: 2000,
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
    marketPrediction: 0,
    offshoreUnlocked: false
  }
};

// Helper function to apply technology effects
const applyTechnologyEffect = (state, technology) => {
  const { type, value } = technology.effect;
  
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
    case 'unlock_premium':
      // This would need to be handled in the oil fields slice
      // For now, we'll track it as a flag
      if (value === 'offshore') {
        state.technologyEffects.offshoreUnlocked = true;
      }
      break;
    case 'ultimate_optimization':
      // Apply multiple bonuses for ultimate tech
      state.technologyEffects.yieldBonus += value * 0.3;
      state.technologyEffects.globalEfficiency += value;
      state.technologyEffects.maintenanceReduction += value * 0.2;
      break;
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
      state.researchPointsPerMonth += 500;
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
