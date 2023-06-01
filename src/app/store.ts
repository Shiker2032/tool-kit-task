// import {configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
// import userReducer from "../features/user-slice";
// import { gitGraphApi } from "../services/gitGraph-service";

// export const store = configureStore({
//     reducer: {
//         user: userReducer,
//         [gitGraphApi.reducerPath]: gitGraphApi.reducer
//     },    
//     middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(gitGraphApi.middleware)
// });

// export type AppDispatch = typeof store.dispatch;
// export type RootState = ReturnType<typeof store.getState>;