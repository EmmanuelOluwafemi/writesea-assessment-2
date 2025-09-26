import { configureStore } from "@reduxjs/toolkit";
import resumeReducer from "./resume-slice";
import settingsReducer from "./settings-slice";

export const store = configureStore({
  reducer: {
    resume: resumeReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
