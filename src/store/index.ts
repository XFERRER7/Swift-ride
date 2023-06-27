import { combineReducers, configureStore, createSlice } from "@reduxjs/toolkit";
import { useSelector, TypedUseSelectorHook } from 'react-redux'
import { client } from "./slices/client";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { delivery } from "./slices/delivery";

const clientPersistConfig = {
  key: 'client',
  storage,
};

const deliveryPersistConfig = {
  key: 'delivery',
  storage,
};


const persistedClientReducer = persistReducer(clientPersistConfig, client);
const persistedDeliveryReducer = persistReducer(deliveryPersistConfig, delivery);

const rootReducer = combineReducers({
  client: persistedClientReducer,
  delivery: persistedDeliveryReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const persistor = persistStore(store);