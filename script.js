class OilEmpireGame {
    constructor() {
        // Initialize managers for new features
        this.crisisManager = new CrisisEventManager();
        this.technologyManager = new TechnologyManager();
        this.oilFieldManager = new OilFieldManager();
        
        this.gameState = {
            money: 100000,
            oilStock: 0,
            ownedFields: 0,
            equipmentLevel: 1,
            currentMonth: 1,
            currentYear: 2024,
            baseOilPrice: 50,
            marketTrend: 'Stable',
            gameOver: false,
            won: false,
            
            // New feature states
            ownedFieldsByType: {},
            fieldProduction: {},
            research: {
                completed: new Set(),
                inProgress: {},
                effects: {}
            },
            crisisEffects: {},
            
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
        
        this.init();
    }
    
    // Achievements definitions
    getAchievementsList() {
        return {
            'oil_baron': {
                name: '🛢️ Oil Baron',
                description: 'Drill over 100,000 barrels total',
                condition: () => this.gameState.achievements.totalDrilled >= 100000
            },
            'millionaire': {
                name: '💰 Millionaire',
                description: 'Have $5,000,000 in your bank account',
                condition: () => this.gameState.achievements.maxMoney >= 5000000
            },
            'tech_master': {
                name: '🔧 Tech Master',
                description: 'Upgrade drilling equipment 10+ times',
                condition: () => this.gameState.equipmentLevel >= 11
            },
            'land_owner': {
                name: '🏭 Land Owner',
                description: 'Own 25 oil fields',
                condition: () => this.gameState.ownedFields >= 25
            },
            'early_bird': {
                name: '⏰ Early Bird',
                description: 'Reach $1M before 2030',
                condition: () => this.gameState.money >= 1000000 && this.gameState.currentYear < 2030
            },
            'speed_runner': {
                name: '🏃 Speed Runner',
                description: 'Win the game before 2040',
                condition: () => this.gameState.won && this.gameState.currentYear < 2040
            },
            'oil_trader': {
                name: '📈 Oil Trader',
                description: 'Sell over 500,000 barrels total',
                condition: () => this.gameState.achievements.totalOilSold >= 500000
            },
            'global_empire': {
                name: '🌍 Global Empire',
                description: 'Have oil available in all 5 continents simultaneously',
                condition: () => {
                    const continents = Object.keys(this.gameState.continentalOil);
                    return continents.every(continent => 
                        this.gameState.continentalOil[continent].available > 0
                    );
                }
            },
            'pipeline_master': {
                name: '🚢 Pipeline Master',
                description: 'Have 50,000+ barrels in transit',
                condition: () => {
                    let totalInTransit = 0;
                    Object.values(this.gameState.continentalOil).forEach(continent => {
                        totalInTransit += continent.inTransit.reduce((sum, shipment) => sum + shipment.amount, 0);
                    });
                    return totalInTransit >= 50000;
                }
            },
            'survivor': {
                name: '💪 Survivor',
                description: 'Play for 20+ years (240+ months)',
                condition: () => this.gameState.achievements.monthsPlayed >= 240
            },
            'mogul': {
                name: '👑 Oil Mogul',
                description: 'Reach the maximum equipment level (20)',
                condition: () => this.gameState.equipmentLevel >= 20
            },
            'steady_growth': {
                name: '📊 Steady Growth',
                description: 'Have 100,000+ barrels production per month',
                condition: () => this.getTotalProduction() >= 100000
            }
        };
    }
    
    checkAchievements() {
        const achievements = this.getAchievementsList();
        let newAchievements = [];
        
        for (const [key, achievement] of Object.entries(achievements)) {
            if (!this.gameState.achievements.unlocked.has(key) && achievement.condition()) {
                this.gameState.achievements.unlocked.add(key);
                newAchievements.push(achievement);
                this.addToLog(`🏆 ACHIEVEMENT UNLOCKED: ${achievement.name} - ${achievement.description}`);
            }
        }
        
        if (newAchievements.length > 0) {
            this.renderAchievements();
        }
        
        return newAchievements;
    }
    
    saveGameState() {
        try {
            // Convert Set to Array for JSON serialization
            const gameStateToSave = {
                ...this.gameState,
                achievements: {
                    ...this.gameState.achievements,
                    unlocked: Array.from(this.gameState.achievements.unlocked)
                },
                research: {
                    ...this.gameState.research,
                    completed: Array.from(this.gameState.research.completed || new Set())
                }
            };
            
            localStorage.setItem('oilEmpireGameState', JSON.stringify(gameStateToSave));
        } catch (error) {
            console.warn('Could not save game state to localStorage:', error);
        }
    }
    
    loadGameState() {
        try {
            const savedState = localStorage.getItem('oilEmpireGameState');
            if (savedState) {
                const loadedState = JSON.parse(savedState);
                
                // Convert Array back to Set for unlocked achievements
                if (loadedState.achievements && loadedState.achievements.unlocked) {
                    loadedState.achievements.unlocked = new Set(loadedState.achievements.unlocked);
                }
                
                // Convert Array back to Set for completed research
                if (loadedState.research && loadedState.research.completed) {
                    loadedState.research.completed = new Set(loadedState.research.completed);
                }
                
                // Merge loaded state with default state to handle any new properties
                this.gameState = {
                    ...this.gameState,
                    ...loadedState
                };
                
                this.addToLog('Game state loaded from previous session.');
                return true;
            }
        } catch (error) {
            console.warn('Could not load game state from localStorage:', error);
            this.addToLog('Could not load previous session. Starting new game.');
        }
        return false;
    }
    
    clearSavedGame() {
        try {
            localStorage.removeItem('oilEmpireGameState');
        } catch (error) {
            console.warn('Could not clear saved game:', error);
        }
    }
    
    manualSave() {
        this.saveGameState();
        this.addToLog('💾 Game manually saved to browser storage.');
    }
    
    confirmClearSave() {
        if (confirm('Are you sure you want to clear your saved game? This will delete your progress but keep the current session running.')) {
            this.clearSavedGame();
            this.addToLog('🗑️ Saved game data cleared from browser storage.');
        }
    }
    
    init() {
        this.loadGameState(); // Load saved state first
        this.updateDisplay();
        this.setupEventListeners();
        this.updateMarketPrices();
        this.renderAchievements();
        this.renderFieldTypes();
        this.renderTechnologies();
        this.renderActiveCrises();
        this.addToLog('Welcome to Oil Empire! Buy oil fields and research new technologies to start your business.');
    }
    
    setupEventListeners() {
        // Main game actions
        document.getElementById('buy-field').addEventListener('click', () => this.buyOilField());
        document.getElementById('upgrade-equipment').addEventListener('click', () => this.upgradeEquipment());
        document.getElementById('next-month').addEventListener('click', () => this.nextMonth());
        document.getElementById('save-game').addEventListener('click', () => this.manualSave());
        document.getElementById('clear-save').addEventListener('click', () => this.confirmClearSave());
        document.getElementById('perform-maintenance').addEventListener('click', () => this.performMaintenance());
        
        // Shipping and selling
        document.querySelectorAll('.ship-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const continent = e.target.dataset.continent;
                this.openShipModal(continent);
            });
        });
        
        document.querySelectorAll('.sell-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const continent = e.target.dataset.continent;
                this.openSellModal(continent);
            });
        });
        
        // Modal handlers
        document.getElementById('confirm-ship').addEventListener('click', () => this.confirmShipment());
        document.getElementById('cancel-ship').addEventListener('click', () => this.closeShipModal());
        document.getElementById('confirm-sell').addEventListener('click', () => this.confirmSale());
        document.getElementById('cancel-sell').addEventListener('click', () => this.closeSellModal());
        document.getElementById('restart-game').addEventListener('click', () => this.restartGame());
        
        // New feature modal handlers
        document.getElementById('confirm-research').addEventListener('click', () => this.confirmResearch());
        document.getElementById('cancel-research').addEventListener('click', () => this.closeResearchModal());
        document.getElementById('confirm-field-purchase').addEventListener('click', () => this.confirmFieldPurchase());
        document.getElementById('cancel-field-purchase').addEventListener('click', () => this.closeFieldTypeModal());
        
        // Close modals on background click
        document.getElementById('ship-modal').addEventListener('click', (e) => {
            if (e.target.id === 'ship-modal') this.closeShipModal();
        });
        document.getElementById('sell-modal').addEventListener('click', (e) => {
            if (e.target.id === 'sell-modal') this.closeSellModal();
        });
        document.getElementById('game-over-modal').addEventListener('click', (e) => {
            if (e.target.id === 'game-over-modal') this.restartGame();
        });
        document.getElementById('research-modal').addEventListener('click', (e) => {
            if (e.target.id === 'research-modal') this.closeResearchModal();
        });
        document.getElementById('field-type-modal').addEventListener('click', (e) => {
            if (e.target.id === 'field-type-modal') this.closeFieldTypeModal();
        });
    }
    
    buyOilField() {
        // Use conventional field type for the old button
        const result = this.oilFieldManager.buyOilField('conventional', this.gameState);
        if (result.success) {
            this.gameState.achievements.totalFieldsPurchased++;
            this.addToLog(result.message);
            this.updateDisplay();
            this.saveGameState();
        } else {
            this.addToLog(result.message);
        }
    }
    
    getFieldCost() {
        return this.oilFieldManager.getFieldCost('conventional', this.gameState);
    }
    
    upgradeEquipment() {
        const upgradeCost = this.getUpgradeCost();
        if (this.gameState.money >= upgradeCost) {
            this.gameState.money -= upgradeCost;
            this.gameState.equipmentLevel++;
            this.addToLog(`Upgraded equipment to level ${this.gameState.equipmentLevel} for $${upgradeCost.toLocaleString()}.`);
            this.updateDisplay();
            this.saveGameState();
        } else {
            this.addToLog(`Not enough money to upgrade equipment. Need $${upgradeCost.toLocaleString()}.`);
        }
    }
    
    getUpgradeCost() {
        return this.gameState.equipmentLevel * 50000;
    }
    
    getProductionPerField() {
        return 100 * this.gameState.equipmentLevel;
    }
    
    getTotalProduction() {
        let production = this.oilFieldManager.calculateTotalProduction(this.gameState, this.gameState.equipmentLevel);
        // Apply technology modifiers
        production = this.technologyManager.applyProductionModifiers(production, this.gameState);
        // Apply crisis modifiers
        production = this.crisisManager.applyProductionModifier(production, this.gameState);
        return Math.max(0, production);
    }
    
    nextMonth() {
        if (this.gameState.gameOver) return;
        
        // Track months played
        this.gameState.achievements.monthsPlayed++;
        
        // Process field aging and maintenance
        this.oilFieldManager.processFieldAging(this.gameState);
        
        // Process research
        const completedResearch = this.technologyManager.processResearch(this.gameState);
        if (completedResearch.length > 0) {
            completedResearch.forEach(tech => {
                this.addToLog(`🔬 Research completed: ${tech.name}! ${tech.description}`);
            });
        }
        
        // Process ongoing crises
        this.crisisManager.processCrisisEffects(this.gameState);
        
        // Automatic drilling if you have fields
        this.drillOil();
        
        // Process shipments
        this.processShipments();
        
        // Check for crisis events
        const crisisEvent = this.crisisManager.checkForCrisis(this.gameState);
        if (crisisEvent) {
            const severity = crisisEvent.severity === 'positive' ? '🎉' : '⚠️';
            this.addToLog(`${severity} CRISIS EVENT: ${crisisEvent.name} - ${crisisEvent.message}`);
        }
        
        // Update market prices
        this.updateMarketPrices();
        
        // Random events (reduced probability since we have crisis events now)
        if (Math.random() < 0.05) { // Reduced from 15% to 5%
            this.handleRandomEvents();
        }
        
        // Advance time
        this.gameState.currentMonth++;
        if (this.gameState.currentMonth > 12) {
            this.gameState.currentMonth = 1;
            this.gameState.currentYear++;
        }
        
        // Check achievements
        this.checkAchievements();
        
        // Check win/lose conditions
        this.checkGameEnd();
        
        this.updateDisplay();
        this.renderActiveCrises();
        this.saveGameState(); // Save after each month
    }
    
    drillOil() {
        if (this.gameState.ownedFields > 0) {
            const production = this.getTotalProduction();
            this.gameState.oilStock += production;
            this.gameState.achievements.totalDrilled += production;
            this.addToLog(`Drilled ${production.toLocaleString()} barrels of oil this month.`);
        } else {
            this.addToLog('No oil fields owned - no oil produced this month.');
        }
    }
    
    processShipments() {
        for (const continentKey in this.gameState.continentalOil) {
            const continent = this.gameState.continentalOil[continentKey];
            
            // Process arriving shipments
            continent.inTransit = continent.inTransit.filter(shipment => {
                shipment.arrivalMonth--;
                if (shipment.arrivalMonth <= 0) {
                    continent.available += shipment.amount;
                    this.addToLog(`${shipment.amount.toLocaleString()} barrels arrived in ${this.gameState.continents[continentKey].name}.`);
                    return false; // Remove from transit
                }
                return true; // Keep in transit
            });
        }
    }
    
    updateMarketPrices() {
        // Update market trend
        if (Math.random() < 0.3) { // 30% chance of trend change
            const trends = this.gameState.marketTrends;
            const currentIndex = trends.indexOf(this.gameState.marketTrend);
            const change = Math.random() < 0.5 ? -1 : 1;
            const newIndex = Math.max(0, Math.min(trends.length - 1, currentIndex + change));
            this.gameState.marketTrend = trends[newIndex];
        }
        
        // Update base price with trend and random variation
        const trendMultiplier = this.gameState.trendMultipliers[this.gameState.marketTrend];
        const randomVariation = 0.9 + Math.random() * 0.2; // ±10% random variation
        let basePrice = Math.max(20, Math.floor(50 * trendMultiplier * randomVariation));
        
        // Apply crisis effects
        basePrice = this.crisisManager.applyPriceModifier(basePrice, this.gameState);
        
        this.gameState.baseOilPrice = basePrice;
        
        // Update continental prices
        document.querySelectorAll('.continent').forEach(continent => {
            const continentKey = continent.dataset.continent;
            const multiplier = this.gameState.continents[continentKey].multiplier;
            let price = Math.floor(this.gameState.baseOilPrice * multiplier);
            
            // Apply technology modifiers
            price = this.technologyManager.applyPriceModifiers(price, this.gameState);
            
            continent.querySelector('.continent-price').textContent = price;
        });
    }
    
    handleRandomEvents() {
        if (Math.random() < 0.15) { // 15% chance of random event
            const events = [
                () => {
                    const loss = Math.floor(this.gameState.oilStock * 0.1);
                    this.gameState.oilStock -= loss;
                    this.addToLog(`⚡ Pipeline leak! Lost ${loss.toLocaleString()} barrels of oil.`);
                },
                () => {
                    const bonus = Math.floor(this.gameState.money * 0.05);
                    this.gameState.money += bonus;
                    this.addToLog(`💰 Government subsidy received: $${bonus.toLocaleString()}.`);
                },
                () => {
                    const maintenanceCost = this.gameState.ownedFields * 2000;
                    this.gameState.money -= maintenanceCost;
                    this.addToLog(`🔧 Equipment maintenance cost: $${maintenanceCost.toLocaleString()}.`);
                },
                () => {
                    const bonus = Math.floor(this.getTotalProduction() * 0.5);
                    this.gameState.oilStock += bonus;
                    this.addToLog(`🎯 Discovered new oil pocket! Bonus ${bonus.toLocaleString()} barrels.`);
                }
            ];
            
            const randomEvent = events[Math.floor(Math.random() * events.length)];
            randomEvent();
        }
    }
    
    openShipModal(continentKey) {
        if (this.gameState.oilStock <= 0) {
            this.addToLog('No oil available to ship.');
            return;
        }
        
        const continent = this.gameState.continents[continentKey];
        let shippingTime = continent.shippingTime;
        
        // Apply technology and crisis modifiers
        shippingTime = this.technologyManager.applyShippingModifiers(shippingTime, this.gameState);
        shippingTime = this.crisisManager.applyShippingModifier(shippingTime, this.gameState);
        
        document.getElementById('ship-modal-continent').textContent = continent.name;
        document.getElementById('ship-time').textContent = shippingTime;
        document.getElementById('ship-modal-available').textContent = this.gameState.oilStock.toLocaleString();
        document.getElementById('ship-amount').max = this.gameState.oilStock;
        document.getElementById('ship-amount').value = Math.min(1000, this.gameState.oilStock);
        document.getElementById('ship-modal').style.display = 'flex';
        document.getElementById('ship-modal').dataset.continent = continentKey;
    }
    
    closeShipModal() {
        document.getElementById('ship-modal').style.display = 'none';
    }
    
    confirmShipment() {
        const continentKey = document.getElementById('ship-modal').dataset.continent;
        const amount = parseInt(document.getElementById('ship-amount').value);
        
        if (amount > 0 && amount <= this.gameState.oilStock) {
            this.gameState.oilStock -= amount;
            let shippingTime = this.gameState.continents[continentKey].shippingTime;
            
            // Apply technology and crisis modifiers
            shippingTime = this.technologyManager.applyShippingModifiers(shippingTime, this.gameState);
            shippingTime = this.crisisManager.applyShippingModifier(shippingTime, this.gameState);
            
            this.gameState.continentalOil[continentKey].inTransit.push({
                amount: amount,
                arrivalMonth: shippingTime
            });
            
            this.addToLog(`Shipped ${amount.toLocaleString()} barrels to ${this.gameState.continents[continentKey].name}. Will arrive in ${shippingTime} months.`);
            this.updateDisplay();
            this.closeShipModal();
            this.saveGameState();
        }
    }
    
    openSellModal(continentKey) {
        const available = this.gameState.continentalOil[continentKey].available;
        if (available <= 0) {
            this.addToLog(`No oil available to sell in ${this.gameState.continents[continentKey].name}.`);
            return;
        }
        
        const continent = this.gameState.continents[continentKey];
        const price = Math.floor(this.gameState.baseOilPrice * continent.multiplier);
        
        document.getElementById('modal-continent').textContent = continent.name;
        document.getElementById('modal-price').textContent = price;
        document.getElementById('modal-available').textContent = available.toLocaleString();
        document.getElementById('sell-amount').max = available;
        document.getElementById('sell-amount').value = available;
        document.getElementById('sell-modal').style.display = 'flex';
        document.getElementById('sell-modal').dataset.continent = continentKey;
    }
    
    closeSellModal() {
        document.getElementById('sell-modal').style.display = 'none';
    }
    
    confirmSale() {
        const continentKey = document.getElementById('sell-modal').dataset.continent;
        const amount = parseInt(document.getElementById('sell-amount').value);
        const available = this.gameState.continentalOil[continentKey].available;
        
        if (amount > 0 && amount <= available) {
            const continent = this.gameState.continents[continentKey];
            const price = Math.floor(this.gameState.baseOilPrice * continent.multiplier);
            const revenue = amount * price;
            
            this.gameState.money += revenue;
            this.gameState.continentalOil[continentKey].available -= amount;
            this.gameState.achievements.totalOilSold += amount;
            
            this.addToLog(`Sold ${amount.toLocaleString()} barrels in ${continent.name} for $${revenue.toLocaleString()}.`);
            this.updateDisplay();
            this.closeSellModal();
            this.saveGameState();
        }
    }
    
    // New feature methods
    performMaintenance() {
        const result = this.oilFieldManager.performMaintenance(this.gameState);
        this.addToLog(result.message);
        if (result.success) {
            this.updateDisplay();
            this.saveGameState();
        }
    }
    
    // Field Type Modal Methods
    openFieldTypeModal(fieldType) {
        const field = this.oilFieldManager.fieldTypes[fieldType];
        const cost = this.oilFieldManager.getFieldCost(fieldType, this.gameState);
        
        document.getElementById('field-type-name').textContent = field.name;
        document.getElementById('field-type-description').textContent = field.description;
        document.getElementById('field-type-cost').textContent = cost.toLocaleString();
        document.getElementById('field-type-production').textContent = field.baseProduction.toLocaleString();
        document.getElementById('field-type-maintenance').textContent = field.maintenanceCost.toLocaleString();
        
        // Show requirements if any
        const requirements = document.getElementById('field-type-requirements');
        if (field.requiresTech) {
            const tech = this.technologyManager.technologies[field.requiresTech];
            requirements.innerHTML = `<p style="color: #e74c3c;">Requires: ${tech.name}</p>`;
            requirements.style.display = 'block';
        } else {
            requirements.style.display = 'none';
        }
        
        document.getElementById('field-type-modal').style.display = 'flex';
        document.getElementById('field-type-modal').dataset.fieldType = fieldType;
    }
    
    closeFieldTypeModal() {
        document.getElementById('field-type-modal').style.display = 'none';
    }
    
    confirmFieldPurchase() {
        const fieldType = document.getElementById('field-type-modal').dataset.fieldType;
        const result = this.oilFieldManager.buyOilField(fieldType, this.gameState);
        
        if (result.success) {
            this.gameState.achievements.totalFieldsPurchased++;
            this.addToLog(result.message);
            this.updateDisplay();
            this.renderFieldTypes();
            this.saveGameState();
        } else {
            this.addToLog(result.message);
        }
        
        this.closeFieldTypeModal();
    }
    
    // Research Modal Methods
    openResearchModal(techKey) {
        const tech = this.technologyManager.technologies[techKey];
        
        document.getElementById('research-tech-name').textContent = tech.name;
        document.getElementById('research-tech-description').textContent = tech.description;
        document.getElementById('research-tech-cost').textContent = tech.cost.toLocaleString();
        document.getElementById('research-tech-time').textContent = tech.researchTime;
        
        // Show prerequisites
        const prerequisites = document.getElementById('research-prerequisites');
        if (tech.prerequisites.length > 0) {
            const prereqNames = tech.prerequisites.map(prereq => 
                this.technologyManager.technologies[prereq].name
            ).join(', ');
            prerequisites.innerHTML = `<p style="color: #4a90e2;">Prerequisites: ${prereqNames}</p>`;
            prerequisites.style.display = 'block';
        } else {
            prerequisites.style.display = 'none';
        }
        
        document.getElementById('research-modal').style.display = 'flex';
        document.getElementById('research-modal').dataset.techKey = techKey;
    }
    
    closeResearchModal() {
        document.getElementById('research-modal').style.display = 'none';
    }
    
    confirmResearch() {
        const techKey = document.getElementById('research-modal').dataset.techKey;
        const result = this.technologyManager.startResearch(techKey, this.gameState);
        
        this.addToLog(result.message);
        
        if (result.success) {
            this.updateDisplay();
            this.renderTechnologies();
            this.saveGameState();
        }
        
        this.closeResearchModal();
    }
    
    // Rendering Methods for New Features
    renderFieldTypes() {
        const fieldTypesList = document.getElementById('field-types-list');
        const availableTypes = this.oilFieldManager.getAvailableFieldTypes(this.gameState);
        
        fieldTypesList.innerHTML = '';
        
        availableTypes.forEach(([typeKey, fieldType]) => {
            const cost = this.oilFieldManager.getFieldCost(typeKey, this.gameState);
            const canAfford = this.gameState.money >= cost;
            const owned = this.gameState.ownedFieldsByType?.[typeKey] || 0;
            
            const fieldCard = document.createElement('div');
            fieldCard.className = `field-type-card ${canAfford ? '' : 'disabled'}`;
            fieldCard.style.borderLeftColor = fieldType.color;
            
            fieldCard.innerHTML = `
                <div class="field-type-header">
                    <span class="field-type-name">${fieldType.name}</span>
                    <span class="field-type-cost">$${cost.toLocaleString()}</span>
                </div>
                <div class="field-type-description">${fieldType.description}</div>
                <div class="field-type-stats">
                    <span>Production: ${fieldType.baseProduction}/month</span>
                    <span>Owned: ${owned}</span>
                </div>
            `;
            
            if (canAfford) {
                fieldCard.addEventListener('click', () => this.openFieldTypeModal(typeKey));
            }
            
            fieldTypesList.appendChild(fieldCard);
        });
    }
    
    renderTechnologies() {
        const technologyList = document.getElementById('technology-list');
        const availableTechs = this.technologyManager.getAvailableTechnologies(this.gameState);
        const researchedTechs = this.gameState.research?.completed || new Set();
        const inProgress = this.gameState.research?.inProgress || {};
        
        // Update research progress display
        const currentResearch = document.getElementById('current-research');
        const progress = this.technologyManager.getResearchProgress(this.gameState);
        
        if (progress) {
            document.getElementById('research-name').textContent = progress.name;
            document.getElementById('research-progress').style.width = `${progress.progress}%`;
            document.getElementById('research-time').textContent = `${progress.monthsLeft} months remaining`;
            currentResearch.style.display = 'block';
        } else {
            currentResearch.style.display = 'none';
        }
        
        // Group technologies by category
        const categories = this.technologyManager.categories;
        technologyList.innerHTML = '';
        
        Object.keys(categories).forEach(categoryKey => {
            const category = categories[categoryKey];
            const categoryTechs = availableTechs.filter(([key, tech]) => tech.category === categoryKey);
            
            if (categoryTechs.length > 0) {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'tech-category';
                
                const categoryHeader = document.createElement('div');
                categoryHeader.className = 'tech-category-header';
                categoryHeader.style.borderLeftColor = category.color;
                categoryHeader.textContent = `${category.icon} ${category.name}`;
                
                categoryDiv.appendChild(categoryHeader);
                
                categoryTechs.forEach(([techKey, tech]) => {
                    const canAfford = this.technologyManager.canAffordTechnology(techKey, this.gameState);
                    const isResearching = Object.keys(inProgress).length > 0;
                    
                    const techCard = document.createElement('div');
                    techCard.className = `tech-card ${canAfford && !isResearching ? '' : 'disabled'}`;
                    
                    techCard.innerHTML = `
                        <div class="tech-header">
                            <span class="tech-name">${tech.name}</span>
                            <span class="tech-cost">$${tech.cost.toLocaleString()}</span>
                        </div>
                        <div class="tech-description">${tech.description}</div>
                        <div class="tech-time">${tech.researchTime} months research</div>
                    `;
                    
                    if (canAfford && !isResearching) {
                        techCard.addEventListener('click', () => this.openResearchModal(techKey));
                    }
                    
                    categoryDiv.appendChild(techCard);
                });
                
                technologyList.appendChild(categoryDiv);
            }
        });
        
        // Show researched technologies
        if (researchedTechs.size > 0) {
            const researchedDiv = document.createElement('div');
            researchedDiv.className = 'tech-category';
            
            const researchedHeader = document.createElement('div');
            researchedHeader.className = 'tech-category-header';
            researchedHeader.style.borderLeftColor = '#27ae60';
            researchedHeader.textContent = '✅ Completed Research';
            
            researchedDiv.appendChild(researchedHeader);
            
            researchedTechs.forEach(techKey => {
                const tech = this.technologyManager.technologies[techKey];
                
                const techCard = document.createElement('div');
                techCard.className = 'tech-card researched';
                
                techCard.innerHTML = `
                    <div class="tech-header">
                        <span class="tech-name">${tech.name}</span>
                        <span class="tech-cost">✅ Complete</span>
                    </div>
                    <div class="tech-description">${tech.description}</div>
                `;
                
                researchedDiv.appendChild(techCard);
            });
            
            technologyList.appendChild(researchedDiv);
        }
    }
    
    renderActiveCrises() {
        const activeCrises = document.getElementById('active-crises');
        const crises = this.crisisManager.getActiveCrises(this.gameState);
        
        activeCrises.innerHTML = '';
        
        crises.forEach(crisis => {
            const crisisCard = document.createElement('div');
            crisisCard.className = 'crisis-card';
            
            crisisCard.innerHTML = `
                <div class="crisis-header">${crisis.name}</div>
                <div class="crisis-effect">${crisis.effect}</div>
                <div class="crisis-time">${crisis.monthsLeft} months remaining</div>
            `;
            
            activeCrises.appendChild(crisisCard);
        });
        
        // Update risk level and maintenance cost
        const maintenanceCost = this.oilFieldManager.calculateMaintenanceCosts(this.gameState);
        document.getElementById('maintenance-cost').textContent = maintenanceCost.toLocaleString();
        
        const riskReduction = this.technologyManager.getCrisisReduction(this.gameState);
        const riskLevel = riskReduction > 0.5 ? 'Low' : (riskReduction > 0.2 ? 'Medium' : 'High');
        document.getElementById('crisis-risk').textContent = riskLevel;
        
        document.getElementById('perform-maintenance').disabled = this.gameState.money < maintenanceCost;
    }
    
    checkGameEnd() {
        if (this.gameState.money <= 0 && this.gameState.oilStock === 0 && this.gameState.ownedFields === 0) {
            this.gameOver('Bankruptcy! You ran out of money and assets.');
        } else if (this.gameState.currentYear >= 2050) {
            if (this.gameState.money >= 10000000) {
                this.gameWon('Congratulations! You built a $10M+ oil empire before 2050!');
            } else {
                this.gameOver(`Time's up! You ended with $${this.gameState.money.toLocaleString()}, but needed $10M.`);
            }
        }
    }
    
    gameOver(message) {
        this.gameState.gameOver = true;
        document.getElementById('game-over-title').textContent = 'Game Over';
        document.getElementById('game-over-title').style.color = '#e74c3c';
        document.getElementById('game-over-message').textContent = message;
        document.getElementById('game-over-modal').style.display = 'flex';
    }
    
    gameWon(message) {
        this.gameState.gameOver = true;
        this.gameState.won = true;
        document.getElementById('game-over-title').textContent = 'Victory!';
        document.getElementById('game-over-title').style.color = '#27ae60';
        document.getElementById('game-over-message').textContent = message;
        document.getElementById('game-over-modal').style.display = 'flex';
    }
    
    restartGame() {
        // Clear saved game state
        this.clearSavedGame();
        
        // Reset all game state including achievements and new features
        this.gameState = {
            money: 100000,
            oilStock: 0,
            ownedFields: 0,
            equipmentLevel: 1,
            currentMonth: 1,
            currentYear: 2024,
            baseOilPrice: 50,
            marketTrend: 'Stable',
            gameOver: false,
            won: false,
            
            // New feature states
            ownedFieldsByType: {},
            fieldProduction: {},
            research: {
                completed: new Set(),
                inProgress: {},
                effects: {}
            },
            crisisEffects: {},
            
            // Reset achievements tracking
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
        
        // Clear the log and close modals
        document.getElementById('log-content').innerHTML = '';
        document.getElementById('game-over-modal').style.display = 'none';
        
        // Re-initialize the game
        this.updateDisplay();
        this.updateMarketPrices();
        this.renderAchievements();
        this.renderFieldTypes();
        this.renderTechnologies();
        this.renderActiveCrises();
        this.addToLog('New game started! Build your oil empire, research new technologies, and manage crises!');
    }
    
    renderAchievements() {
        const achievements = this.getAchievementsList();
        const achievementsList = document.getElementById('achievements-list');
        const achievementCount = document.getElementById('achievement-count');
        
        achievementsList.innerHTML = '';
        
        for (const [key, achievement] of Object.entries(achievements)) {
            const achievementDiv = document.createElement('div');
            achievementDiv.className = `achievement ${this.gameState.achievements.unlocked.has(key) ? 'unlocked' : 'locked'}`;
            
            achievementDiv.innerHTML = `
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-description">${achievement.description}</div>
            `;
            
            achievementsList.appendChild(achievementDiv);
        }
        
        achievementCount.textContent = this.gameState.achievements.unlocked.size;
    }
    
    updateDisplay() {
        // Track max money achieved
        this.gameState.achievements.maxMoney = Math.max(this.gameState.achievements.maxMoney, this.gameState.money);
        
        // Check for any new achievements
        this.checkAchievements();
        
        // Basic game info
        document.getElementById('money').textContent = this.gameState.money.toLocaleString();
        document.getElementById('oil-stock').textContent = this.gameState.oilStock.toLocaleString();
        document.getElementById('owned-fields').textContent = this.gameState.ownedFields;
        document.getElementById('total-production').textContent = this.getTotalProduction().toLocaleString();
        document.getElementById('equipment-level').textContent = this.gameState.equipmentLevel;
        document.getElementById('oil-production').textContent = this.getProductionPerField().toLocaleString();
        
        // Costs
        document.getElementById('field-cost').textContent = this.getFieldCost().toLocaleString();
        document.getElementById('field-price').textContent = this.getFieldCost().toLocaleString();
        document.getElementById('upgrade-cost').textContent = this.getUpgradeCost().toLocaleString();
        
        // Date
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
        document.getElementById('current-date').textContent = `${months[this.gameState.currentMonth - 1]} ${this.gameState.currentYear}`;
        
        // Market info
        document.getElementById('base-oil-price').textContent = this.gameState.baseOilPrice;
        document.getElementById('market-trend').textContent = this.gameState.marketTrend;
        
        // Continental oil tracking
        document.querySelectorAll('.continent').forEach(continent => {
            const continentKey = continent.dataset.continent;
            const data = this.gameState.continentalOil[continentKey];
            
            continent.querySelector('.oil-available').textContent = data.available.toLocaleString();
            
            const inTransitTotal = data.inTransit.reduce((sum, shipment) => sum + shipment.amount, 0);
            continent.querySelector('.oil-in-transit').textContent = inTransitTotal.toLocaleString();
            
            // Enable/disable buttons
            const shipBtn = continent.querySelector('.ship-btn');
            const sellBtn = continent.querySelector('.sell-btn');
            
            shipBtn.disabled = this.gameState.oilStock <= 0;
            sellBtn.disabled = data.available <= 0;
        });
        
        // Button states
        document.getElementById('buy-field').disabled = this.gameState.money < this.getFieldCost();
        document.getElementById('upgrade-equipment').disabled = this.gameState.money < this.getUpgradeCost();
        
        // Update field summary
        this.updateFieldSummary();
    }
    
    updateFieldSummary() {
        const fieldSummary = this.oilFieldManager.getFieldSummary(this.gameState);
        const fieldsInfo = document.querySelector('.fields-info');
        
        // Remove existing field summary
        const existingSummary = fieldsInfo.querySelector('.field-summary');
        if (existingSummary) {
            existingSummary.remove();
        }
        
        if (fieldSummary.length > 0) {
            const summaryDiv = document.createElement('div');
            summaryDiv.className = 'field-summary';
            
            const summaryTitle = document.createElement('h4');
            summaryTitle.textContent = 'Field Breakdown:';
            summaryDiv.appendChild(summaryTitle);
            
            fieldSummary.forEach(field => {
                const fieldItem = document.createElement('div');
                fieldItem.className = 'field-summary-item';
                fieldItem.innerHTML = `
                    <span>${field.icon} ${field.name} (${field.count})</span>
                    <span class="field-efficiency">${field.avgEfficiency}% avg</span>
                `;
                summaryDiv.appendChild(fieldItem);
            });
            
            fieldsInfo.appendChild(summaryDiv);
        }
    }
    
    addToLog(message) {
        const logContent = document.getElementById('log-content');
        const timestamp = `${String(this.gameState.currentMonth).padStart(2, '0')}/${this.gameState.currentYear}`;
        logContent.innerHTML += `<p><span style="color: #4a90e2;">${timestamp}:</span> ${message}</p>`;
        logContent.scrollTop = logContent.scrollHeight;
    }
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new OilEmpireGame();
});
