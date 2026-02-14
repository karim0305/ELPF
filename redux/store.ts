import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // uses localStorage
import measurementReducer from "./slices/measureSlice";
import suitBookingSlice from "./slices/suitBookingSlice";
import userReducer from "./slices/userSlice";

// Combine reducers
const rootReducer = combineReducers({
  users: userReducer,
  measurements: measurementReducer,
  booking: suitBookingSlice,
});

// Persist config (Web only)
const persistConfig = {
  key: "root",
  storage, // localStorage
  whitelist: ["users"], // only persist user
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
