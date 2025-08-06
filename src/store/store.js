import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './gameSlice';
import oilFieldsReducer from './oilFieldsSlice';
import technologyReducer from './technologySlice';
import crisisReducer from './crisisSlice';
import { loadGameState, saveGameState } from '../utils/localStorage';

// Load persisted state
const persistedState = loadGameState();

export const store = configureStore({
  reducer: {
    game: gameReducer,
    oilFields: oilFieldsReducer,
    technology: technologyReducer,
    crisis: crisisReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
        ignoredPaths: ['game.achievements.unlocked'], // Ignore Set object
      },
    }),
  preloadedState: persistedState, // Load saved state if available
});

// Subscribe to store changes and save to localStorage
store.subscribe(() => {
  const state = store.getState();
  saveGameState(state);
});

// Log the initial state to debug
console.log('Store initial state:', store.getState());
