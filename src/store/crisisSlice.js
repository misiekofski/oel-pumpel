import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  events: [
    {
      id: 1,
      name: 'Market Crash',
      description: 'The market is crashing worse than my approval ratings! Oil prices drop significantly.',
      effect: { type: 'price_change', value: -0.4, duration: 3 },
      probability: 0.15,
      cooldown: 6
    },
    {
      id: 2,
      name: 'Environmental Scandal',
      description: 'Fake news media attacking our beautiful drilling! Maintenance costs increase.',
      effect: { type: 'maintenance_increase', value: 0.5, duration: 4 },
      probability: 0.12,
      cooldown: 8
    },
    {
      id: 3,
      name: 'Equipment Failure',
      description: 'Equipment broke down, probably made in China. Production halted temporarily.',
      effect: { type: 'production_halt', value: 0, duration: 2 },
      probability: 0.18,
      cooldown: 4
    },
    {
      id: 4,
      name: 'OPEC Decision',
      description: 'OPEC makes a decision, they should have asked me first. Oil prices fluctuate wildly.',
      effect: { type: 'price_volatility', value: 0.3, duration: 5 },
      probability: 0.1,
      cooldown: 12
    },
    {
      id: 5,
      name: 'Natural Disaster',
      description: 'Hurricane hits the Gulf, very wet from the standpoint of water. Operations disrupted.',
      effect: { type: 'field_damage', value: 0.3, duration: 3 },
      probability: 0.08,
      cooldown: 10
    },
    {
      id: 6,
      name: 'Regulatory Changes',
      description: 'Government imposing new regulations, very unfair! Compliance costs skyrocket.',
      effect: { type: 'cost_increase', value: 2.0, duration: 6 },
      probability: 0.14,
      cooldown: 8
    },
    {
      id: 7,
      name: 'Labor Strike',
      description: 'Workers on strike, they want more money. Production severely reduced.',
      effect: { type: 'production_reduction', value: 0.6, duration: 2 },
      probability: 0.16,
      cooldown: 6
    },
    {
      id: 8,
      name: 'Geopolitical Tension',
      description: 'International tensions rising, oil becomes strategic. Prices could go either way.',
      effect: { type: 'random_price', value: [-0.3, 0.5], duration: 4 },
      probability: 0.13,
      cooldown: 8
    }
  ],
  
  activeEvents: [],
  eventHistory: [],
  baseProbabilityModifier: 1.0,
  lastEventMonth: 0,
  
  // Event cooldowns tracking
  eventCooldowns: {}
};

const crisisSlice = createSlice({
  name: 'crisis',
  initialState,
  reducers: {
    checkForCrisis: (state, action) => {
      const currentMonth = action.payload.currentMonth;
      const reductionBonus = action.payload.crisisReduction || 0;
      
      // Don't trigger events too frequently
      if (currentMonth - state.lastEventMonth < 2) return;
      
      state.events.forEach(event => {
        // Check cooldown
        const lastOccurrence = state.eventCooldowns[event.id] || 0;
        if (currentMonth - lastOccurrence < event.cooldown) return;
        
        // Calculate probability with modifiers
        const adjustedProbability = event.probability * state.baseProbabilityModifier * (1 - reductionBonus);
        
        if (Math.random() < adjustedProbability) {
          triggerCrisisInternal(state, event, currentMonth);
        }
      });
    },
    
    triggerCrisis: (state, action) => {
      const { event, currentMonth } = action.payload;
      
      const activeEvent = {
        ...event,
        startMonth: currentMonth,
        remainingDuration: event.effect.duration,
        isActive: true
      };
      
      state.activeEvents.push(activeEvent);
      state.eventHistory.push({
        ...event,
        occurredAt: currentMonth
      });
      
      state.eventCooldowns[event.id] = currentMonth;
      state.lastEventMonth = currentMonth;
    },
    
    processActiveEvents: (state, action) => {
      const mitigationBonus = action.payload.crisisMitigation || 0;
      
      state.activeEvents = state.activeEvents.filter(event => {
        event.remainingDuration--;
        
        // Apply mitigation to reduce severity
        if (mitigationBonus > 0) {
          switch (event.effect.type) {
            case 'price_change':
              event.effect.value *= (1 - mitigationBonus);
              break;
            case 'maintenance_increase':
              event.effect.value *= (1 - mitigationBonus);
              break;
            case 'production_reduction':
              event.effect.value *= (1 - mitigationBonus);
              break;
            case 'cost_increase':
              event.effect.value *= (1 - mitigationBonus);
              break;
          }
        }
        
        return event.remainingDuration > 0;
      });
    },
    
    resolveEvent: (state, action) => {
      const eventId = action.payload;
      state.activeEvents = state.activeEvents.filter(event => event.id !== eventId);
    },
    
    applyInsuranceProtection: (state, action) => {
      const insuranceAmount = action.payload;
      
      // Reduce impact of active financial events
      state.activeEvents.forEach(event => {
        if (event.effect.type === 'price_change' || event.effect.type === 'cost_increase') {
          event.effect.value *= 0.5; // Insurance reduces financial impact
        }
      });
    },
    
    updateProbabilityModifier: (state, action) => {
      state.baseProbabilityModifier = action.payload;
    },
    
    getActiveEffects: (state) => {
      const effects = {
        priceMultiplier: 1.0,
        maintenanceMultiplier: 1.0,
        productionMultiplier: 1.0,
        costMultiplier: 1.0
      };
      
      state.activeEvents.forEach(event => {
        switch (event.effect.type) {
          case 'price_change':
            effects.priceMultiplier += event.effect.value;
            break;
          case 'maintenance_increase':
            effects.maintenanceMultiplier += event.effect.value;
            break;
          case 'production_halt':
            effects.productionMultiplier = 0;
            break;
          case 'production_reduction':
            effects.productionMultiplier *= (1 - event.effect.value);
            break;
          case 'cost_increase':
            effects.costMultiplier += event.effect.value;
            break;
          case 'price_volatility':
            // Add random fluctuation
            const volatility = event.effect.value;
            effects.priceMultiplier *= (1 + (Math.random() - 0.5) * volatility);
            break;
          case 'random_price':
            const [min, max] = event.effect.value;
            effects.priceMultiplier += min + Math.random() * (max - min);
            break;
        }
      });
      
      return effects;
    }
  }
});

// Helper function to trigger crisis (used in reducer)
function triggerCrisisInternal(state, event, currentMonth) {
  const activeEvent = {
    ...event,
    startMonth: currentMonth,
    remainingDuration: event.effect.duration,
    isActive: true
  };
  
  state.activeEvents.push(activeEvent);
  state.eventHistory.push({
    ...event,
    occurredAt: currentMonth
  });
  
  state.eventCooldowns[event.id] = currentMonth;
  state.lastEventMonth = currentMonth;
}

export const {
  checkForCrisis,
  triggerCrisis,
  processActiveEvents,
  resolveEvent,
  applyInsuranceProtection,
  updateProbabilityModifier,
  getActiveEffects
} = crisisSlice.actions;

export default crisisSlice.reducer;
