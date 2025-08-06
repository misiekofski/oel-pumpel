class OilFieldManager {
    constructor() {
        this.fieldTypes = {
            'conventional': {
                name: '🏭 Conventional Field',
                description: 'Standard field. Very reliable. I know conventional, best conventional.',
                baseCost: 25000,
                costMultiplier: 1.0,
                baseProduction: 100,
                productionVariability: 0.1, // ±10% variation
                maintenanceCost: 2000,
                depletionRate: 0.002, // 0.2% per month
                riskFactor: 0.1,
                color: '#95a5a6',
                icon: '🏭'
            },
            'offshore': {
                name: '🌊 Offshore Field',
                description: 'Deep sea drilling. Higher yield, like my IQ. Very deep, very smart.',
                baseCost: 75000,
                costMultiplier: 2.5,
                baseProduction: 200,
                productionVariability: 0.15,
                maintenanceCost: 8000,
                depletionRate: 0.001,
                riskFactor: 0.25,
                color: '#3498db',
                icon: '🌊',
                requiresTech: 'deep_sea_drilling'
            },
            'shale': {
                name: '⛰️ Shale Field',
                description: 'Fracking operation. High yield but depletes fast, like my attention span.',
                baseCost: 40000,
                costMultiplier: 1.4,
                baseProduction: 150,
                productionVariability: 0.2,
                maintenanceCost: 5000,
                depletionRate: 0.005, // depletes faster
                riskFactor: 0.3,
                color: '#8e44ad',
                icon: '⛰️'
            },
            'arctic': {
                name: '🧊 Arctic Field',
                description: 'Extreme drilling. Massive reserves, like my ego. Very cold, very profitable.',
                baseCost: 120000,
                costMultiplier: 3.0,
                baseProduction: 300,
                productionVariability: 0.25,
                maintenanceCost: 15000,
                depletionRate: 0.0005, // very slow depletion
                riskFactor: 0.4,
                color: '#ecf0f1',
                icon: '🧊',
                requiresTech: 'smart_drilling'
            },
            'heavy_oil': {
                name: '🛢️ Heavy Oil Field',
                description: 'Viscous oil, very thick. Like my real estate deals - heavy but profitable.',
                baseCost: 60000,
                costMultiplier: 1.8,
                baseProduction: 80,
                productionVariability: 0.05,
                maintenanceCost: 6000,
                depletionRate: 0.001,
                riskFactor: 0.15,
                color: '#34495e',
                icon: '🛢️',
                requiresTech: 'oil_refining'
            },
            'experimental': {
                name: '🔬 Experimental Field',
                description: 'Cutting-edge tech. Unpredictable results, like my tweets. Could be YUGE!',
                baseCost: 200000,
                costMultiplier: 4.0,
                baseProduction: 500,
                productionVariability: 0.4, // very unpredictable
                maintenanceCost: 25000,
                depletionRate: 0.003,
                riskFactor: 0.5,
                color: '#e74c3c',
                icon: '🔬',
                requiresTech: 'quantum_logistics'
            }
        };
    }
    
    getAvailableFieldTypes(gameState) {
        const researchedTechs = gameState.research?.completed || new Set();
        
        return Object.entries(this.fieldTypes).filter(([key, fieldType]) => {
            if (!fieldType.requiresTech) return true;
            return researchedTechs.has(fieldType.requiresTech);
        });
    }
    
    getFieldCost(fieldType, gameState) {
        const field = this.fieldTypes[fieldType];
        const baseFieldCost = field.baseCost + ((gameState.ownedFieldsByType?.[fieldType] || 0) * field.baseCost * 0.5);
        return Math.floor(baseFieldCost * field.costMultiplier);
    }
    
    buyOilField(fieldType, gameState) {
        const field = this.fieldTypes[fieldType];
        const cost = this.getFieldCost(fieldType, gameState);
        
        if (gameState.money < cost) {
            return { success: false, message: `Not enough money. Need $${cost.toLocaleString()}.` };
        }
        
        // Initialize field tracking if needed
        if (!gameState.ownedFieldsByType) {
            gameState.ownedFieldsByType = {};
        }
        if (!gameState.fieldProduction) {
            gameState.fieldProduction = {};
        }
        
        // Create unique field ID
        const fieldId = `${fieldType}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        
        // Purchase field
        gameState.money -= cost;
        gameState.ownedFields++;
        gameState.ownedFieldsByType[fieldType] = (gameState.ownedFieldsByType[fieldType] || 0) + 1;
        
        // Initialize field with random production efficiency
        const efficiency = 0.8 + Math.random() * 0.4; // 80-120% efficiency
        gameState.fieldProduction[fieldId] = {
            type: fieldType,
            efficiency: efficiency,
            currentProduction: field.baseProduction * efficiency,
            ageMonths: 0,
            lastMaintenance: 0
        };
        
        return { 
            success: true, 
            message: `Purchased ${field.name} for $${cost.toLocaleString()}. Production efficiency: ${Math.floor(efficiency * 100)}%`,
            fieldId: fieldId
        };
    }
    
    calculateTotalProduction(gameState, equipmentLevel) {
        if (!gameState.fieldProduction) return 0;
        
        let totalProduction = 0;
        
        for (const [fieldId, fieldData] of Object.entries(gameState.fieldProduction)) {
            const fieldType = this.fieldTypes[fieldData.type];
            
            // Base production with equipment multiplier
            let production = fieldData.currentProduction * equipmentLevel;
            
            // Apply age-based depletion
            const depletionFactor = 1 - (fieldData.ageMonths * fieldType.depletionRate);
            production *= Math.max(0.1, depletionFactor); // minimum 10% production
            
            // Apply production variability
            const variability = 1 + (Math.random() - 0.5) * fieldType.productionVariability;
            production *= variability;
            
            // Maintenance penalty
            const monthsSinceMaintenance = fieldData.ageMonths - fieldData.lastMaintenance;
            if (monthsSinceMaintenance > 12) {
                production *= 0.8; // 20% penalty if no maintenance for over a year
            }
            
            totalProduction += production;
        }
        
        return Math.floor(totalProduction);
    }
    
    processFieldAging(gameState) {
        if (!gameState.fieldProduction) return;
        
        for (const fieldData of Object.values(gameState.fieldProduction)) {
            fieldData.ageMonths++;
        }
    }
    
    calculateMaintenanceCosts(gameState) {
        if (!gameState.fieldProduction) return 0;
        
        let totalCost = 0;
        
        for (const fieldData of Object.values(gameState.fieldProduction)) {
            const fieldType = this.fieldTypes[fieldData.type];
            totalCost += fieldType.maintenanceCost;
        }
        
        return totalCost;
    }
    
    performMaintenance(gameState) {
        const cost = this.calculateMaintenanceCosts(gameState);
        
        if (gameState.money < cost) {
            return { success: false, message: `Not enough money for maintenance. Need $${cost.toLocaleString()}.` };
        }
        
        gameState.money -= cost;
        
        // Reset maintenance for all fields
        for (const fieldData of Object.values(gameState.fieldProduction)) {
            fieldData.lastMaintenance = fieldData.ageMonths;
        }
        
        return { 
            success: true, 
            message: `Performed maintenance on all fields for $${cost.toLocaleString()}.` 
        };
    }
    
    getFieldSummary(gameState) {
        if (!gameState.ownedFieldsByType) return [];
        
        const summary = [];
        
        for (const [fieldType, count] of Object.entries(gameState.ownedFieldsByType)) {
            if (count > 0) {
                const field = this.fieldTypes[fieldType];
                
                // Calculate average efficiency for this field type
                let totalEfficiency = 0;
                let fieldCount = 0;
                
                for (const fieldData of Object.values(gameState.fieldProduction || {})) {
                    if (fieldData.type === fieldType) {
                        totalEfficiency += fieldData.efficiency;
                        fieldCount++;
                    }
                }
                
                const avgEfficiency = fieldCount > 0 ? totalEfficiency / fieldCount : 1;
                
                summary.push({
                    type: fieldType,
                    name: field.name,
                    icon: field.icon,
                    color: field.color,
                    count: count,
                    avgEfficiency: Math.floor(avgEfficiency * 100),
                    maintenanceCost: field.maintenanceCost * count
                });
            }
        }
        
        return summary;
    }
    
    // Handle field-specific crises
    applyFieldCrisis(gameState, crisisType) {
        if (!gameState.fieldProduction) return { fieldsAffected: 0, description: 'No fields to affect' };
        
        const fieldIds = Object.keys(gameState.fieldProduction);
        let fieldsAffected = 0;
        let totalDamage = 0;
        
        switch (crisisType) {
            case 'equipment_failure':
                // Affects 10-30% of fields
                const failureCount = Math.ceil(fieldIds.length * (0.1 + Math.random() * 0.2));
                for (let i = 0; i < failureCount; i++) {
                    const randomFieldId = fieldIds[Math.floor(Math.random() * fieldIds.length)];
                    const fieldData = gameState.fieldProduction[randomFieldId];
                    fieldData.efficiency *= 0.7; // 30% efficiency loss
                    fieldsAffected++;
                }
                return { 
                    fieldsAffected, 
                    description: `Equipment failure affected ${fieldsAffected} fields, reducing their efficiency by 30%` 
                };
                
            case 'environmental_accident':
                // Remove 1-3 fields entirely
                const removalCount = Math.min(3, Math.max(1, Math.floor(fieldIds.length * 0.1)));
                for (let i = 0; i < removalCount; i++) {
                    const randomFieldId = fieldIds[Math.floor(Math.random() * fieldIds.length)];
                    const fieldData = gameState.fieldProduction[randomFieldId];
                    const fieldType = fieldData.type;
                    
                    delete gameState.fieldProduction[randomFieldId];
                    gameState.ownedFields--;
                    gameState.ownedFieldsByType[fieldType]--;
                    
                    fieldsAffected++;
                    totalDamage += this.fieldTypes[fieldType].baseCost;
                    fieldIds.splice(fieldIds.indexOf(randomFieldId), 1);
                }
                return { 
                    fieldsAffected, 
                    description: `Environmental accident destroyed ${fieldsAffected} fields, estimated loss: $${totalDamage.toLocaleString()}` 
                };
        }
        
        return { fieldsAffected: 0, description: 'Unknown crisis type' };
    }
}
