import { useRef, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { db } from "../firebase";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const usersRef = collection(db, "users");
  const navigate = useNavigate();
  const [isProgress, setIsProgress] = useState(false);
  const [errorAlert, setErrorAlert] = useState(null);


  const handleLogin = async (e) => {
    e.preventDefault();
    setIsProgress(true);

    const emailValue = emailRef.current.value;
    const passwordValue = passwordRef.current.value;

    try {
        const querySnapshot = await getDocs(query(usersRef, where("email", "==", emailValue)));
        if (!querySnapshot.empty) {
            const user = querySnapshot.docs[0].data();
            const userId = querySnapshot.docs[0].id;

            if (user.password === passwordValue) {
                console.log("Login success");
                localStorage.setItem('user_logged', JSON.stringify(userId));
                setIsProgress(false);
                navigate('/dashboard', { replace: true });
                return;
            } else {
                setErrorAlert("Contraseña incorrecta");
            }
        } else {
            setErrorAlert("Usuario no encontrado");
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        setErrorAlert("Ocurrió un error al iniciar sesión. Por favor, inténtelo de nuevo más tarde.");
    }

    setIsProgress(false);
}


  const handleAlertClose = () => {
    setShowAlert(false);
  };



  return (
    <>
  
      <h1 className="text-3xl font-semibold text-center mb-4">Acceso</h1>
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{ p: 2, border: "1px dashed grey" }}
        className="max-w-md mx-auto"
      >
        <TextField
          className="w-full mb-4"
          label="Email"
          type="email"
          variant="outlined"
          inputRef={emailRef}
        />
        <TextField
          className="w-full mb-4"
          label="Password"
          type="password"
          variant="outlined"
          inputRef={passwordRef}
        />
        <Button type="submit" disabled={isProgress} fullWidth variant="contained" className="w-full "  sx={{ backgroundColor: '#4CAF50', color: 'white' }}>
        {isProgress ? 'Iniciando sesión...' : 'Iniciar sesión'}
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
