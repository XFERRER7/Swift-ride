import { combineReducers, configureStore, createSlice } from "@reduxjs/toolkit"
import { useSelector, TypedUseSelectorHook } from 'react-redux'
import { client } from "./slices/client"
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { delivery } from "./slices/delivery"
import { search } from "./slices/search"

const clientPersistConfig = {
  key: 'client',
  storage,
}

const deliveryPersistConfig = {
  key: 'delivery',
  storage,
}

const searchPersistConfig = {
  key: 'search',
  storage,
}


const persistedClientReducer = persistReducer(clientPersistConfig, client)
const persistedDeliveryReducer = persistReducer(deliveryPersistConfig, delivery)
const persistedSearchReducer = persistReducer(searchPersistConfig, search)

const rootReducer = combineReducers({
  client: persistedClientReducer,
  delivery: persistedDeliveryReducer,
  search: persistedSearchReducer,
})

export const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof store.getState>
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const persistor = persistStore(store)