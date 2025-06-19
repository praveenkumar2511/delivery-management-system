import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import {combineReducers} from '@reduxjs/toolkit'
import wareHouseReducer from '../features/warehouse/wareHouseSlice';
import agentReducer from "../features/agent/agentSlice"
import orderReducer from "../features/order/orderSlice"
const authPersistConfig = {
    key: "auth",
    storage,
    version:1
  };

  const rootReducer = combineReducers({
    auth: authReducer,
      warehouse: wareHouseReducer,  // ✅ include this
          agent: agentReducer, // ✅ Add this line
    order: orderReducer,
  });
  const persistedAuthReducer = persistReducer(authPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedAuthReducer
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
