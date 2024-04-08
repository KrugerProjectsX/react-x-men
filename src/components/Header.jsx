import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuTransitions from "./MenuTransitions";
import { getUserLogged } from "../services/users.js";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";

export default function Header() {
  const [user, setUser] = useState(null);
  const [activeButton, setActiveButton] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const processData = async () => {
    await getUserData();
  };

  const getUserData = async () => {
    const responseUser = await getUserLogged();
    localStorage.setItem("role", responseUser.role);
    setUser(responseUser);
  };
  useEffect(() => {
    processData();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <div>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                MenuListProps={{
                  "aria-labelledby": "menu-appbar",
                }}
              >
                <MenuItem onClick={handleMenuClose}>
                  <Button component={Link} to="/dashboard" color="inherit">
                    Home
                  </Button>
                </MenuItem>
                {user &&
                  (user.role === "landlord" || user.role === "admin") && (
                    <MenuItem onClick={handleMenuClose}>
                      <Button component={Link} to="/myflats" color="inherit">
                        Mis Pisos
                      </Button>
                    </MenuItem>
                  )}
                <MenuItem onClick={handleMenuClose}>
                  <Button
                    component={Link}
                    to="/my-favorites-flats"
                    color="inherit"
                  >
                    Favoritos
                  </Button>
                </MenuItem>
                {user && user.role === "admin" && (
                  <MenuItem onClick={handleMenuClose}>
                    <Button component={Link} to="/users" color="inherit">
                      Usuarios
                    </Button>
                  </MenuItem>
                )}
              </Menu>
            </Box>
            
            <Box className="ml-auto" sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }} >
              <div className="flex items-center m-4">
                <img
                  className="pointer-events-none my-auto w-14 h-14 lg:w-40 md:w-32 rounded-full"
                  src="/src/assets/logo.svg"
                  alt="My SVG"
                />
              </div>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1 }}
              ></Typography>
              <div className="flex items-center justify-center lg:mr-2">
                <Button
                 color="inherit"
                  component={Link}
                  to="/dashboard"
                >
                  Home
                </Button>
                {user &&
                  (user.role === "landlord" || user.role === "admin") && (
                    <Button
                    color="inherit"
                      component={Link}
                      to="/myflats"
                      className="text-secondary"
                      onClick={() => setActiveButton("myflats")}
                    >
                      Mis Pisos
                    </Button>
                  )}
                <Button
                 color="inherit"
                  className="text-secondary"
                  component={Link}
                  to="/my-favorites-flats"
                >
                  Favoritos
                </Button>
                {user && user.role === "admin" && (
                  <Button
                  color="inherit"
                    className="text-secondary"
                    component={Link}
                    to="/users"
                  >
                    Usuarios
                  </Button>
                )}
              </div>
              
            </Box>
          </div>
          <div className="ml-auto"> {/* Contenedor para alinear a la derecha */}
        <MenuTransitions user={user} setUser={setUser} />
      </div>
        </Toolbar>
      </AppBar>
    </>
  );
}
