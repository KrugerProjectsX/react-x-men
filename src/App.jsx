import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/login/Login";
import Home from "./pages/user/Home";

import Flats from "./pages/flat/Flats";
import MyFlats from "./pages/flat/MyFlats";

import Users from "./pages/user/Users";
import Profile from "./pages/user/Profile";

import RegisterUser from "./pages/login/RegisterUser";

import UserRegister from "./pages/login/UserRegister";
import AddFlats from "./pages/flat/AddFlats";
import Flat from "./pages/flat/Flat";
import ProfileUpdate from "./pages/user/ProfileUpdate";
import FlatsFavorites from "./pages/flat/FlatsFavorites";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/profile" element={<Profile />} />
        <Route path={"/profile/edit/:userId"} element={<ProfileUpdate/>}/>
        <Route path="/register" element={<RegisterUser></RegisterUser>} />
        <Route path="/userregister" element={<UserRegister />} />
        <Route path="/flats" element={<Flats />} />
        <Route path="/myflats" element={<MyFlats />} />
        <Route path="/addflat" element={<AddFlats />} />
        <Route path={"/flat/:id"} element={<Flat />} />
        <Route path={"/my-favorites-flats"} element={<FlatsFavorites/>}/>
      </Routes>
    </>
  );
}

export default App;
