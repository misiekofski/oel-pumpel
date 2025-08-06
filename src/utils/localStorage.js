// localStorage utility for game persistence

const GAME_SAVE_KEY = 'drill_baby_drill_save';

export const saveGameState = (state) => {
  try {
    // State already uses arrays, no conversion needed
    const serializedData = JSON.stringify(state);
    localStorage.setItem(GAME_SAVE_KEY, serializedData);
    console.log('✅ Game saved successfully');
  } catch (error) {
    console.warn('❌ Failed to save game state to localStorage:', error);
  }
};

export const loadGameState = () => {
  try {
    const serializedData = localStorage.getItem(GAME_SAVE_KEY);
    if (serializedData === null) {
      console.log('🆕 No saved game found, starting new game');
      return undefined; // No saved data
    }
    
    const state = JSON.parse(serializedData);
    console.log('📁 Game loaded from save');
    return state;
  } catch (error) {
    console.warn('❌ Failed to load game state from localStorage:', error);
    return undefined;
  }
};

export const clearGameSave = () => {
  try {
    localStorage.removeItem(GAME_SAVE_KEY);
    console.log('🗑️ Game save cleared');
  } catch (error) {
    console.warn('❌ Failed to clear game save from localStorage:', error);
  }
};
