import dashReducer from './reducer';
import thunk from 'redux-thunk';
// import rootReducer from './reducers/index'
import {configureStore} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import {
  combineReducers,
  applyMiddleware,
  legacy_createStore as createStore,
} from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer} from 'redux-persist';
export const rootReducer = combineReducers({
  dashboardReducer: dashReducer,
});
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['dashboardReducer'],
  timeout: null,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk, logger],
});
// const store = createStore(rootReducer, applyMiddleware(thunk))
export default store;
