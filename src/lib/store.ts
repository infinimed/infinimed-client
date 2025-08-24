import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import addToCart from './features/cart/addToCart';
import changeSearchBarVisibilityState from './features/searchBar/searchBarVisibility';
import setIsLoggedIn from './features/auth/isLoggedIn';
import changeAreaDropDownOpenState from './features/areaDropDownOpen/searchBarVisibility';
import setArea from './features/area/area';
import setSearchResults from './features/searchResults/searchResults';
import setMedicineSearchResults from './features/searchResults/medicineSearchResults';

const rootReducer = combineReducers({
  addToCart: addToCart,
  searchBarVisibility: changeSearchBarVisibilityState,
  setIsLoggedIn: setIsLoggedIn,
  changeAreaDropDownOpenState: changeAreaDropDownOpenState,
  area: setArea,
  searchResults: setSearchResults,
  medicineSearchResults: setMedicineSearchResults,
});

const persistConfig = {
  key: 'infinimed_root',
  storage,
  whitelist: ['addToCart'], // only persist cart slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist action types
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
