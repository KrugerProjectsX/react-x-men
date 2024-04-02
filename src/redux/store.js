import { configureStore } from "@reduxjs/toolkit";
import UsersSlice from "./states/UsersSlice";
import FlatSlice from "./states/FlatSlice";

const store = configureStore({
    reducer:{
        users: UsersSlice,
        flats: FlatSlice,
    }
});

export default store;