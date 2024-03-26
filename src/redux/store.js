import { configureStore } from "@reduxjs/toolkit";
import UsersSlice from "./states/UsersSlice";

const store = configureStore({
    reducer:{
        users: UsersSlice,
    }
});

export default store;