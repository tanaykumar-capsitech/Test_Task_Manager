import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../feature/counter/counterSlice"
import tokenReducer from "../feature/token/tokenSlice"
import projectIdReducer from "../feature/project/projectIdSlice"

export const store = configureStore({ 
    reducer: { 
        counter: counterReducer, 
        token: tokenReducer,
        projectId: projectIdReducer  
    } 
})

export type RootState = ReturnType<typeof store.getState> 
export type AppDispatch = typeof store.dispatch

export default store