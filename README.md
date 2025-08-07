# 🛢️ Oil Tycoon Game

A retro-style browser-based oil drilling and trading tycoon game built with React. Start with a small oil operation and grow into a global oil empire!

**🎮 [Play the Game](https://misiekofski.github.io/oel-pumpel)**

## 🎮 How to Play

### 🎯 **Game Objective**
Build and expand your oil empire by drilling oil, managing storage, shipping to global markets, and handling random events. Unlock achievements and become the ultimate Oil Tycoon!

---

## 🏗️ **Getting Started**

### **Starting Resources**
- **$10,000** initial money
- **1 Small Tanker** ship (1,000 barrel capacity)
- **Basic Drill** technology
- **0 oil fields** (you need to buy your first one!)

### **First Steps**
1. **Buy your first oil field** - Click "Buy Oil Field" in the Oil Fields panel ($2,000)
2. **Wait for oil production** - Oil is produced every week (15 seconds real-time)
3. **Build a depot** - Go to Oil Depots and build your first storage facility ($5,000)
4. **Ship oil** - Use the Oil Shipping panel to send oil to continents
5. **Sell oil** - Once oil arrives at depots, sell it for profit!

---

## 🛢️ **Core Game Mechanics**

### **⏰ Time System**
- **1 week = 15 seconds** real-time
- **Manual advancement** - Use "⏭️ Next Week" button for faster play
- **Week counter** - Shows current game week and equivalent time

### **💰 Money Management**
- Earn money by selling oil at continent depots
- Spend on oil fields, ships, technology, and depot upgrades
- Higher-priced continents offer better profits

### **🛢️ Oil Production**
- Oil fields produce oil automatically every week
- Production = `Field Productivity × Technology Efficiency × 7 days`
- Upgrade fields to increase productivity by 30% ($1,000 each)

---

## 🏭 **Oil Fields System**

### **Buying Fields**
- **Cost increases** with each field: $2,000 + ($1,500 × number of fields owned)
- **Random productivity** between 0.5-2.0 barrels per day
- **Naming** - Fields are automatically named (Field 1, Field 2, etc.)

### **Upgrading Fields**
- **Cost**: $1,000 per upgrade
- **Effect**: +30% productivity (multiplicative)
- **Strategy**: Focus on upgrading high-productivity fields first

---

## 🚢 **Shipping & Fleet Management**

### **Ship Types Available**
| Ship Type | Capacity | Speed | Cost |
|-----------|----------|-------|------|
| Small Tanker | 1,000 | 1 week/distance | $8,000 |
| Medium Tanker | 2,500 | 1 week/distance | $20,000 |
| Large Tanker | 5,000 | 1 week/distance | $45,000 |
| Super Tanker | 10,000 | 1 week/distance | $100,000 |

### **Shipping Process**
1. **Select continent** in Oil Shipping panel
2. **Enter amount** to ship (limited by ship capacity and available oil)
3. **Ship departs** and travels for the continent's distance in weeks
4. **Oil delivered** to your depot at destination (if you have one)
5. **Ship returns** to your available fleet

### **Shipping Times by Continent**
- **North America**: 1 week ($45/barrel)
- **Europe**: 2 weeks ($55/barrel)
- **Asia**: 3 weeks ($65/barrel)
- **Africa**: 2 weeks ($50/barrel)
- **South America**: 2 weeks ($48/barrel)

---

## 🏭 **Oil Depots System**

### **Building Depots**
- **Cost**: $5,000 per depot
- **Initial capacity**: 5,000 barrels
- **Required** for storing shipped oil
- **One per continent** maximum

### **Depot Management**
- **Capacity bar** shows storage level with color coding:
  - 🟢 **Green (0-70%)**: Good space available
  - 🟡 **Yellow (70-90%)**: Getting full
  - 🔴 **Red (90%+)**: Almost full, ships may wait!

### **Upgrading Depots**
- **Level 1**: 5,000 barrels (base)
- **Level 2**: +3,000 barrels for $5,000
- **Level 3**: +4,000 barrels for $8,000
- **Level 4**: +5,000 barrels for $11,000
- **Pattern**: Each level adds +1,000 more capacity than previous, costs +$3,000 more

### **Selling from Depots**
- **Manual selling**: Click "Sell All" to sell entire depot contents
- **Auto-sell**: Enable "Auto-sell when full" for automatic sales at 90% capacity
- **Revenue preview**: Button shows expected earnings before selling

### **⚠️ Important**: If a depot is full, ships will wait and cannot unload until you make space!

---

## 🔬 **Technology System**

### **Available Technologies**
1. **Basic Drill** - 1.0x efficiency (free, starts unlocked)
2. **Advanced Drill** - 1.5x efficiency ($5,000)
3. **Hydraulic Fracturing** - 2.2x efficiency ($15,000)
4. **Deep Sea Drilling** - 3.5x efficiency ($50,000)

### **Technology Effects**
- **Multiplicative** - Affects ALL oil field production
- **Permanent** - Once unlocked, always available
- **Switchable** - Can change active technology anytime (free)
- **Discount events** - Random events may offer 25% discounts

---

## 🎲 **Random Events System**

Events start appearing after **week 5** with a **15% chance per week**. Events add unpredictability and strategic opportunities!

### **Positive Events** 🎉
- **Oil Price Boom** - +50% oil prices for 3 weeks
- **New Oil Discovery** - Free high-productivity oil field
- **Government Subsidy** - Cash bonus ($15,000)
- **Competitor Buyout** - Gain 2 ships + $8,000
- **Technology Breakthrough** - 25% discount on next tech purchase

### **Negative Events** ⚠️
- **Equipment Failure** - 30% production reduction for 2 weeks
- **Storm Delays** - All shipments delayed 1-2 extra weeks
- **Environmental Fine** - Pay $12,000 cleanup costs

### **Event Strategy**
- **Save money** for unexpected fines and opportunities
- **Time your sales** during oil price booms
- **Build reserves** to weather production slowdowns

---

## 🏆 **Achievements System**

### **Achievement Categories**
- **Oil Baron Beginner** - Buy your first oil field
- **Oil Millionaire** - Accumulate $1,000,000
- **Drill Master** - Drill 100,000 barrels total
- **Shipping Mogul** - Complete 50 shipments
- **Tech Innovator** - Unlock all 4 technologies
- **Fleet Commander** - Own 10 ships
- **Global Trader** - Ship oil to all 5 continents
- **Oil Tycoon** - Reach $10,000,000

### **Achievement Benefits**
- **Progress tracking** - See your progress toward each goal
- **Milestone rewards** - Sense of progression and accomplishment
- **Unlock notifications** - Celebrate your successes!

---

## 💡 **Strategy Guide**

### **Early Game (Weeks 1-20)**
1. **Buy 2-3 oil fields** immediately
2. **Build depot in Asia** first (highest oil price: $65/barrel)
3. **Upgrade your best field** once for better production
4. **Save for Advanced Drill** technology ($5,000)

### **Mid Game (Weeks 20-50)**
1. **Buy Medium Tankers** for better shipping efficiency
2. **Build depots in Europe and Africa** for diversification
3. **Upgrade to Hydraulic Fracturing** tech ($15,000)
4. **Start using auto-sell** to reduce micromanagement

### **Late Game (Weeks 50+)**
1. **Build Super Tankers** for massive shipments
2. **Max out depot capacities** in high-value continents
3. **Unlock Deep Sea Drilling** for maximum production
4. **Time the market** during oil boom events

### **Pro Tips** 🎯
- **Asia pays best** - Prioritize Asian depot and auto-sell there
- **Upgrade fields strategically** - Focus on high-productivity fields first
- **Watch depot capacity** - Don't let ships get stuck waiting
- **Plan for events** - Keep cash reserves for opportunities and emergencies
- **Use manual weeks** - Speed up boring waiting periods
- **Auto-sell wisely** - Enable on your highest-paying depot

---

## 🎮 **Controls & Interface**

### **Header Controls**
- **⏭️ Next Week** - Manually advance one week
- **🏆 Achievements** - View achievement progress
- **Reset Game** - Start over (with confirmation)

### **Game Panels**
- **Oil Fields** - Buy and upgrade drilling operations
- **Shipping Fleet** - Purchase ships and manage fleet
- **Technology** - Research and select drilling technology
- **Oil Shipping** - Send oil to global markets
- **Oil Depots** - Manage storage and sales at each continent

### **Keyboard Shortcuts**
- **Enter** in shipping amount field - Confirm shipment
- **Click outside modal** - Close achievements panel

---

## 🎯 **Winning Conditions**

There's no single "win" condition - the game is about continuous growth and optimization:

- **Short-term**: Achieve your first million dollars
- **Medium-term**: Unlock all achievements
- **Long-term**: Build a massive, efficient oil empire
- **Challenge**: Reach $10,000,000+ and maintain steady growth

---

## 🔧 **Development & Technical Info**

### **Technologies Used**
- **React 18** with functional components and hooks
- **CSS Grid & Flexbox** for responsive layouts
- **localStorage** for game state persistence
- **GitHub Actions** for automatic deployment
- **GitHub Pages** for hosting

### **Local Development**

1. **Clone the repository**:
   ```bash
   git clone https://github.com/misiekofski/oel-pumpel.git
   cd oel-pumpel
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm start
   ```

4. **Open in browser**: [http://localhost:3000](http://localhost:3000)

### **Available Scripts**
- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run deploy` - Manually deploy to GitHub Pages

### **Game Features**
- **Automatic saves** - Game state persists in browser localStorage
- **Responsive design** - Works on desktop and mobile devices
- **No installation required** - Runs directly in web browser
- **Offline capable** - Once loaded, can be played without internet

---

## 🎮 **Ready to Play?**

**🚀 [Start Playing Now!](https://misiekofski.github.io/oel-pumpel)**

Start your oil empire today! Buy your first oil field, drill for black gold, and work your way up to becoming the ultimate **Oil Tycoon**! 

*Good luck, and may your wells be deep and your profits high!* 🛢️💰

---

## 📄 **License**

This project is open source and available under the [MIT License](LICENSE).
