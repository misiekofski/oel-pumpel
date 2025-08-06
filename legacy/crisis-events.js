class CrisisEventManager {
    constructor() {
        this.events = {
            'oil_spill': {
                name: '🚨 Major Oil Spill',
                description: 'Environmental disaster! Production halted and cleanup costs required.',
                probability: 0.02, // 2% chance per month
                effects: {
                    type: 'immediate',
                    execute: (gameState) => {
                        const productionLoss = Math.floor(gameState.ownedFields * 0.3); // 30% of fields affected
                        const cleanupCost = productionLoss * 50000;
                        gameState.money -= cleanupCost;
                        gameState.ownedFields -= productionLoss;
                        return {
                            message: `Oil spill affected ${productionLoss} fields. Cleanup cost: $${cleanupCost.toLocaleString()}`,
                            severity: 'high'
                        };
                    }
                }
            },
            'market_crash': {
                name: '📉 Global Market Crash',
                description: 'Oil prices plummet worldwide for several months.',
                probability: 0.01, // 1% chance per month
                effects: {
                    type: 'duration',
                    duration: 6, // 6 months
                    execute: (gameState) => {
                        gameState.crisisEffects = gameState.crisisEffects || {};
                        gameState.crisisEffects.marketCrash = { 
                            monthsLeft: 6,
                            priceMultiplier: 0.4 // 60% price reduction
                        };
                        return {
                            message: 'Global market crash! Oil prices reduced by 60% for 6 months.',
                            severity: 'high'
                        };
                    }
                }
            },
            'supply_chain_disruption': {
                name: '🚢 Supply Chain Crisis',
                description: 'Shipping delays and increased costs affect global operations.',
                probability: 0.03, // 3% chance per month
                effects: {
                    type: 'duration',
                    duration: 4,
                    execute: (gameState) => {
                        gameState.crisisEffects = gameState.crisisEffects || {};
                        gameState.crisisEffects.supplyChain = {
                            monthsLeft: 4,
                            shippingCostMultiplier: 2.0, // Double shipping costs
                            delayMultiplier: 1.5 // 50% longer shipping times
                        };
                        return {
                            message: 'Supply chain disruption! Shipping costs doubled and delays increased for 4 months.',
                            severity: 'medium'
                        };
                    }
                }
            },
            'political_instability': {
                name: '⚖️ Political Instability',
                description: 'Regional conflicts affect oil field operations.',
                probability: 0.025, // 2.5% chance per month
                effects: {
                    type: 'duration',
                    duration: 3,
                    execute: (gameState) => {
                        gameState.crisisEffects = gameState.crisisEffects || {};
                        gameState.crisisEffects.political = {
                            monthsLeft: 3,
                            productionMultiplier: 0.7 // 30% production reduction
                        };
                        return {
                            message: 'Political instability! Oil production reduced by 30% for 3 months.',
                            severity: 'medium'
                        };
                    }
                }
            },
            'cyber_attack': {
                name: '💻 Cyber Security Breach',
                description: 'Hackers target oil infrastructure causing operational disruptions.',
                probability: 0.015, // 1.5% chance per month
                effects: {
                    type: 'immediate',
                    execute: (gameState) => {
                        const securityCost = Math.floor(gameState.money * 0.05); // 5% of money
                        const productionLoss = Math.floor(gameState.oilStock * 0.15); // 15% of stock
                        gameState.money -= securityCost;
                        gameState.oilStock -= productionLoss;
                        return {
                            message: `Cyber attack! Lost ${productionLoss.toLocaleString()} barrels and paid $${securityCost.toLocaleString()} for security upgrades.`,
                            severity: 'medium'
                        };
                    }
                }
            },
            'natural_disaster': {
                name: '🌪️ Natural Disaster',
                description: 'Extreme weather damages oil facilities.',
                probability: 0.02, // 2% chance per month
                effects: {
                    type: 'immediate',
                    execute: (gameState) => {
                        const fieldsLost = Math.min(3, Math.floor(gameState.ownedFields * 0.2));
                        const repairCost = fieldsLost * 75000;
                        gameState.ownedFields -= fieldsLost;
                        gameState.money -= repairCost;
                        return {
                            message: `Natural disaster destroyed ${fieldsLost} oil fields. Repair costs: $${repairCost.toLocaleString()}`,
                            severity: 'high'
                        };
                    }
                }
            },
            'oil_discovery': {
                name: '🎯 Major Oil Discovery',
                description: 'Geological survey reveals massive new oil reserves!',
                probability: 0.01, // 1% chance per month (positive event)
                effects: {
                    type: 'immediate',
                    execute: (gameState) => {
                        const bonusFields = Math.floor(Math.random() * 3) + 2; // 2-4 bonus fields
                        const bonusOil = Math.floor(Math.random() * 50000) + 25000; // 25k-75k bonus oil
                        gameState.ownedFields += bonusFields;
                        gameState.oilStock += bonusOil;
                        return {
                            message: `Major discovery! Gained ${bonusFields} new fields and ${bonusOil.toLocaleString()} barrels of oil!`,
                            severity: 'positive'
                        };
                    }
                }
            },
            'government_subsidy': {
                name: '🏛️ Government Subsidy',
                description: 'Government provides financial support for oil industry.',
                probability: 0.015, // 1.5% chance per month (positive event)
                effects: {
                    type: 'immediate',
                    execute: (gameState) => {
                        const subsidy = Math.floor(gameState.ownedFields * 25000); // $25k per field
                        gameState.money += subsidy;
                        return {
                            message: `Government subsidy received: $${subsidy.toLocaleString()}!`,
                            severity: 'positive'
                        };
                    }
                }
            }
        };
    }

    checkForCrisis(gameState) {
        // Higher chance of crisis with more fields (higher stakes)
        const riskMultiplier = 1 + (gameState.ownedFields * 0.02); // +2% risk per field
        
        for (const [eventKey, event] of Object.entries(this.events)) {
            const adjustedProbability = event.probability * riskMultiplier;
            
            if (Math.random() < adjustedProbability) {
                return this.triggerEvent(eventKey, gameState);
            }
        }
        
        return null;
    }

    triggerEvent(eventKey, gameState) {
        const event = this.events[eventKey];
        const result = event.effects.execute(gameState);
        
        return {
            name: event.name,
            description: event.description,
            message: result.message,
            severity: result.severity
        };
    }

    processCrisisEffects(gameState) {
        if (!gameState.crisisEffects) return;

        // Process market crash effects
        if (gameState.crisisEffects.marketCrash) {
            gameState.crisisEffects.marketCrash.monthsLeft--;
            if (gameState.crisisEffects.marketCrash.monthsLeft <= 0) {
                delete gameState.crisisEffects.marketCrash;
            }
        }

        // Process supply chain effects
        if (gameState.crisisEffects.supplyChain) {
            gameState.crisisEffects.supplyChain.monthsLeft--;
            if (gameState.crisisEffects.supplyChain.monthsLeft <= 0) {
                delete gameState.crisisEffects.supplyChain;
            }
        }

        // Process political instability effects
        if (gameState.crisisEffects.political) {
            gameState.crisisEffects.political.monthsLeft--;
            if (gameState.crisisEffects.political.monthsLeft <= 0) {
                delete gameState.crisisEffects.political;
            }
        }
    }

    getActiveCrises(gameState) {
        if (!gameState.crisisEffects) return [];
        
        const activeCrises = [];
        
        if (gameState.crisisEffects.marketCrash) {
            activeCrises.push({
                name: 'Market Crash',
                effect: 'Oil prices reduced by 60%',
                monthsLeft: gameState.crisisEffects.marketCrash.monthsLeft
            });
        }
        
        if (gameState.crisisEffects.supplyChain) {
            activeCrises.push({
                name: 'Supply Chain Crisis',
                effect: 'Shipping costs doubled, delays increased',
                monthsLeft: gameState.crisisEffects.supplyChain.monthsLeft
            });
        }
        
        if (gameState.crisisEffects.political) {
            activeCrises.push({
                name: 'Political Instability',
                effect: 'Production reduced by 30%',
                monthsLeft: gameState.crisisEffects.political.monthsLeft
            });
        }
        
        return activeCrises;
    }

    // Apply crisis effects to game mechanics
    applyPriceModifier(basePrice, gameState) {
        let modifier = 1.0;
        
        if (gameState.crisisEffects?.marketCrash) {
            modifier *= gameState.crisisEffects.marketCrash.priceMultiplier;
        }
        
        return Math.floor(basePrice * modifier);
    }

    applyProductionModifier(production, gameState) {
        let modifier = 1.0;
        
        if (gameState.crisisEffects?.political) {
            modifier *= gameState.crisisEffects.political.productionMultiplier;
        }
        
        return Math.floor(production * modifier);
    }

    applyShippingModifier(shippingTime, gameState) {
        let modifier = 1.0;
        
        if (gameState.crisisEffects?.supplyChain) {
            modifier *= gameState.crisisEffects.supplyChain.delayMultiplier;
        }
        
        return Math.ceil(shippingTime * modifier);
    }
}
