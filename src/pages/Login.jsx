import { Box, Button, TextField } from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRef } from "react";
import { db } from "../firebase";

const Login = () => {
  const email = useRef("");
  const password = useRef("");
  const usersRef = collection(db, "users");
  const login = async (e) => {
    e.preventDefault();
    /**Realizar la conexion del email y constrasena son las correctas */
    const search = query(usersRef, where("email", "==", email.current.value));
    const result = await getDocs(search);

    console.log(result);
    if (result.docs.length > 0) {
      const user = result.docs[0].data();
      if (user.password === password.current.value) {
        console.log("Login Sucess");
        console.log("Redirige");
      } else {
        console.log("Incorrect");
      }
    }
  };
  return (
    <>
      <h1>Acceso</h1>
      <Box component="form" sx={{ p: 2, border: "1px dashed grey" }}>
        <TextField
          className="w-full my-4"
          label="Email"
          type="email"
          variant="outlined"
          inputRef={email}
        />
        <br />
        <TextField
          className="w-full my-4"
          label="password"
          type="password"
          variant="outlined"
          inputRef={password}
        />
        <br />
        <Button type="submit" onClick={login} variant="contained">
          Login
        </Button>
      </Box>
    </>
  );
};

export default Login;
