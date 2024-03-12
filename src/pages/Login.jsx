import { useRef, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { db } from "../firebase";

const Login = () => {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  const email = useRef("");
  const password = useRef("");
  const usersRef = collection(db, "users");

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const login = async (e) => {
    e.preventDefault();
    const search = query(usersRef, where("email", "==", email.current.value));
    const result = await getDocs(search);

    if (result.docs.length > 0) {
      const user = result.docs[0].data();
      if (user.password === password.current.value) {
        setAlertSeverity("success");
        setAlertMessage("Login Success");
        setShowAlert(true);
        console.log("Redirect");
      } else {
        setAlertSeverity("error");
        setAlertMessage("Incorrect Password");
        setShowAlert(true);
      }
    } else {
      setAlertSeverity("error");
      setAlertMessage("User Not Found");
      setShowAlert(true);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-semibold text-center mb-4">Acceso</h1>
      <Box
        component="form"
        sx={{ p: 2, border: "1px dashed grey" }}
        className="max-w-md mx-auto"
      >
        <TextField
          className="w-full mb-4"
          label="Email"
          type="email"
          variant="outlined"
          inputRef={email}
        />
        <TextField
          className="w-full mb-4"
          label="Password"
          type="password"
          variant="outlined"
          inputRef={password}
        />
        <Button onClick={login} variant="contained" className="w-full">
          Login
        </Button>
      </Box>
      <Box className="max-w-md mx-auto mt-4">
        {showAlert && (
          <Alert severity={alertSeverity} onClose={handleAlertClose}>
            <AlertTitle>
              {alertSeverity === "success" ? "Success" : "Error"}
            </AlertTitle>
            {alertMessage}
          </Alert>
        )}
      </Box>
    </>
  );
};

export default Login;
