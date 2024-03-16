import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import UserRegister from "./pages/UserRegister";
import AddFlat from "./pages/AddFlat";
import Flats from "./pages/Flats";
import MyFlats from "./pages/MyFlats";

function App() {
  return (
    <>
      <Routes>
      <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/userregister" element={<UserRegister />} />
        <Route path="/addflat" element={<AddFlat />} />
        <Route path="/flats" element={<Flats />} />
        <Route path="/myflats" element={<MyFlats />} />
      </Routes>
    </>
  );
}

export default App;
