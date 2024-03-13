import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import UserRegister from "./pages/UserRegister";
import AddFlat from "./pages/AddFlat";
import Flats from "./pages/Flats";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/userregister" element={<UserRegister />} />
        <Route path="/addflat" element={<AddFlat />} />
        <Route path="/flats" element={<Flats />} />
      </Routes>
    </>
  );
}

export default App;
