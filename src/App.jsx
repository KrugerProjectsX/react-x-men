import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Users from "./pages/Users";
import Theme from "./pages/Theme";
import RegisterUser from "./pages/RegisterUser";
function App() {
  return (
    <>
    
      <Routes>
        
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/users" element={<Users/>}/>
        <Route path="/register" element={<RegisterUser></RegisterUser>}/>
        <Route path="/theme" element={<Theme></Theme>}> </Route>
      </Routes> 
    </>
  );
}

export default App;
