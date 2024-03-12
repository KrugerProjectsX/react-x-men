import { NavLink } from "react-router-dom";

const PrivateNavbar = () => {
  return (
    <>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/flat">Pisos</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        <NavLink to="/setting">Setting</NavLink>
        <NavLink to="/login">Logout</NavLink>
      </nav>
    </>
  );
};

export default PrivateNavbar;
