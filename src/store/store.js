import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './gameSlice';
import oilFieldsReducer from './oilFieldsSlice';
import technologyReducer from './technologySlice';
import crisisReducer from './crisisSlice';

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
      },
    }),
  // Add preloaded state to ensure all slices are initialized
  preloadedState: undefined, // Let Redux use initial states from slices
});

// Log the initial state to debug
console.log('Store initial state:', store.getState());
