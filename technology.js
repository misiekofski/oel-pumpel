class TechnologyManager {
    constructor() {
        this.technologies = {
            // Drilling Technologies
            'advanced_drilling': {
                name: '🔧 Advanced Drilling',
                description: 'Increases oil production per field by 25%',
                category: 'drilling',
                cost: 500000,
                researchTime: 3, // months
                prerequisites: [],
                effects: {
                    productionMultiplier: 1.25
                }
            },
            'smart_drilling': {
                name: '🤖 Smart Drilling Systems',
                description: 'AI-powered drilling increases efficiency by 40%',
                category: 'drilling',
                cost: 1200000,
                researchTime: 5,
                prerequisites: ['advanced_drilling'],
                effects: {
                    productionMultiplier: 1.4
                }
            },
            'deep_sea_drilling': {
                name: '🌊 Deep Sea Drilling',
                description: 'Access to offshore oil fields with 60% higher yield',
                category: 'drilling',
                cost: 2500000,
                researchTime: 8,
                prerequisites: ['smart_drilling'],
                effects: {
                    productionMultiplier: 1.6,
                    unlockOffshore: true
                }
            },
            
            // Processing Technologies
            'oil_refining': {
                name: '⚗️ Advanced Refining',
                description: 'Increases oil selling price by 15%',
                category: 'processing',
                cost: 750000,
                researchTime: 4,
                prerequisites: [],
                effects: {
                    priceMultiplier: 1.15
                }
            },
            'synthetic_oil': {
                name: '🧪 Synthetic Oil Production',
                description: 'Produce additional oil from chemical processes',
                category: 'processing',
                cost: 1800000,
                researchTime: 6,
                prerequisites: ['oil_refining'],
                effects: {
                    syntheticProduction: 5000 // barrels per month
                }
            },
            'carbon_capture': {
                name: '🌱 Carbon Capture Technology',
                description: 'Reduces environmental penalties and provides tax benefits',
                category: 'processing',
                cost: 3000000,
                researchTime: 7,
                prerequisites: ['synthetic_oil'],
                effects: {
                    environmentalBonus: 0.1, // 10% price bonus for green tech
                    reduceCrisisRisk: 0.3 // 30% less crisis probability
                }
            },
            
            // Logistics Technologies
            'pipeline_network': {
                name: '🔗 Pipeline Network',
                description: 'Reduces shipping time by 1 month to all continents',
                category: 'logistics',
                cost: 600000,
                researchTime: 4,
                prerequisites: [],
                effects: {
                    shippingTimeReduction: 1
                }
            },
            'tanker_fleet': {
                name: '🚢 Advanced Tanker Fleet',
                description: 'Ship 50% more oil per shipment',
                category: 'logistics',
                cost: 1500000,
                researchTime: 5,
                prerequisites: ['pipeline_network'],
                effects: {
                    shipmentCapacityMultiplier: 1.5
                }
            },
            'quantum_logistics': {
                name: '⚡ Quantum Logistics',
                description: 'Instant shipping to any continent (science fiction tech)',
                category: 'logistics',
                cost: 5000000,
                researchTime: 10,
                prerequisites: ['tanker_fleet'],
                effects: {
                    instantShipping: true
                }
            },
            
            // Market Technologies
            'market_analysis': {
                name: '📊 AI Market Analysis',
                description: 'Predict market trends one month in advance',
                category: 'market',
                cost: 400000,
                researchTime: 3,
                prerequisites: [],
                effects: {
                    marketPrediction: true
                }
            },
            'futures_trading': {
                name: '💹 Futures Trading',
                description: 'Lock in future oil prices for better profits',
                category: 'market',
                cost: 1000000,
                researchTime: 4,
                prerequisites: ['market_analysis'],
                effects: {
                    futuresTrading: true,
                    priceStabilization: 0.2 // 20% less price volatility
                }
            },
            'blockchain_trading': {
                name: '🔗 Blockchain Trading',
                description: 'Decentralized trading platform with 25% profit bonus',
                category: 'market',
                cost: 2200000,
                researchTime: 6,
                prerequisites: ['futures_trading'],
                effects: {
                    tradingProfitBonus: 0.25
                }
            }
        };
        
        this.categories = {
            'drilling': { name: 'Drilling', icon: '🔧', color: '#e67e22' },
            'processing': { name: 'Processing', icon: '⚗️', color: '#9b59b6' },
            'logistics': { name: 'Logistics', icon: '🚢', color: '#3498db' },
            'market': { name: 'Market', icon: '📊', color: '#27ae60' }
        };
    }
    
    getAvailableTechnologies(gameState) {
        const researched = gameState.research?.completed || new Set();
        const inProgress = gameState.research?.inProgress || {};
        
        return Object.entries(this.technologies).filter(([key, tech]) => {
            // Not already researched or in progress
            if (researched.has(key) || inProgress[key]) return false;
            
            // Check prerequisites
            return tech.prerequisites.every(prereq => researched.has(prereq));
        });
    }
    
    canAffordTechnology(techKey, gameState) {
        const tech = this.technologies[techKey];
        return gameState.money >= tech.cost;
    }
    
    startResearch(techKey, gameState) {
        const tech = this.technologies[techKey];
        
        if (!this.canAffordTechnology(techKey, gameState)) {
            return { success: false, message: 'Not enough money for research.' };
        }
        
        // Initialize research state if needed
        if (!gameState.research) {
            gameState.research = {
                completed: new Set(),
                inProgress: {},
                effects: {}
            };
        }
        
        // Check if already researching something
        if (Object.keys(gameState.research.inProgress).length > 0) {
            return { success: false, message: 'Already researching another technology.' };
        }
        
        // Start research
        gameState.money -= tech.cost;
        gameState.research.inProgress[techKey] = {
            monthsLeft: tech.researchTime,
            totalTime: tech.researchTime
        };
        
        return { 
            success: true, 
            message: `Started researching ${tech.name}. Will complete in ${tech.researchTime} months.` 
        };
    }
    
    processResearch(gameState) {
        if (!gameState.research?.inProgress) return null;
        
        const completed = [];
        
        for (const [techKey, progress] of Object.entries(gameState.research.inProgress)) {
            progress.monthsLeft--;
            
            if (progress.monthsLeft <= 0) {
                // Research completed
                gameState.research.completed.add(techKey);
                this.applyTechnologyEffects(techKey, gameState);
                completed.push(this.technologies[techKey]);
                delete gameState.research.inProgress[techKey];
            }
        }
        
        return completed;
    }
    
    applyTechnologyEffects(techKey, gameState) {
        const tech = this.technologies[techKey];
        
        if (!gameState.research.effects) {
            gameState.research.effects = {};
        }
        
        // Store the effects for later application
        gameState.research.effects[techKey] = tech.effects;
    }
    
    // Apply technology effects to production
    applyProductionModifiers(baseProduction, gameState) {
        let multiplier = 1.0;
        const effects = gameState.research?.effects || {};
        
        for (const techEffects of Object.values(effects)) {
            if (techEffects.productionMultiplier) {
                multiplier *= techEffects.productionMultiplier;
            }
        }
        
        // Add synthetic oil production
        let syntheticProduction = 0;
        for (const techEffects of Object.values(effects)) {
            if (techEffects.syntheticProduction) {
                syntheticProduction += techEffects.syntheticProduction;
            }
        }
        
        return Math.floor(baseProduction * multiplier) + syntheticProduction;
    }
    
    // Apply technology effects to prices
    applyPriceModifiers(basePrice, gameState) {
        let multiplier = 1.0;
        const effects = gameState.research?.effects || {};
        
        for (const techEffects of Object.values(effects)) {
            if (techEffects.priceMultiplier) {
                multiplier *= techEffects.priceMultiplier;
            }
            if (techEffects.environmentalBonus) {
                multiplier *= (1 + techEffects.environmentalBonus);
            }
            if (techEffects.tradingProfitBonus) {
                multiplier *= (1 + techEffects.tradingProfitBonus);
            }
        }
        
        return Math.floor(basePrice * multiplier);
    }
    
    // Apply technology effects to shipping
    applyShippingModifiers(baseShippingTime, gameState) {
        const effects = gameState.research?.effects || {};
        let timeReduction = 0;
        let instantShipping = false;
        
        for (const techEffects of Object.values(effects)) {
            if (techEffects.shippingTimeReduction) {
                timeReduction += techEffects.shippingTimeReduction;
            }
            if (techEffects.instantShipping) {
                instantShipping = true;
            }
        }
        
        if (instantShipping) return 0; // Instant shipping
        
        return Math.max(1, baseShippingTime - timeReduction);
    }
    
    // Check if market prediction is available
    hasMarketPrediction(gameState) {
        const effects = gameState.research?.effects || {};
        return Object.values(effects).some(effect => effect.marketPrediction);
    }
    
    // Reduce crisis probability with technology
    getCrisisReduction(gameState) {
        const effects = gameState.research?.effects || {};
        let reduction = 0;
        
        for (const techEffects of Object.values(effects)) {
            if (techEffects.reduceCrisisRisk) {
                reduction += techEffects.reduceCrisisRisk;
            }
        }
        
        return Math.min(0.8, reduction); // Max 80% reduction
    }
    
    getResearchProgress(gameState) {
        if (!gameState.research?.inProgress) return null;
        
        const progress = Object.entries(gameState.research.inProgress)[0];
        if (!progress) return null;
        
        const [techKey, data] = progress;
        const tech = this.technologies[techKey];
        
        return {
            name: tech.name,
            monthsLeft: data.monthsLeft,
            totalTime: data.totalTime,
            progress: ((data.totalTime - data.monthsLeft) / data.totalTime) * 100
        };
    }
}
