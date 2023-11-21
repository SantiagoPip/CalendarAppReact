import { configureStore } from "@reduxjs/toolkit";
import { uiSlice } from "./ui/uiSilce";
import { CalendarSlice } from "./calendar/calendarSlice";
import { authSlice } from "./auth/authSilce";

export const store = configureStore({
    reducer:{
        auth:authSlice.reducer,
        ui:uiSlice.reducer,
        calendar:CalendarSlice.reducer
    },
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
        serializableCheck:false
    })
})