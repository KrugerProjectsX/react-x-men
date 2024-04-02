import { Box, Button, TextField } from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { db } from "../../firebase";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isProgress, setIsProgress] = useState(false);
  const [errorAlert, setErrorAlert] = useState("");
  const navigate = useNavigate();
  const usersRef = collection(db, "users");

  const onSubmit = async (data) => {
    setIsProgress(true);
    const { email, password } = data;

    try {
      const querySnapshot = await getDocs(
        query(usersRef, where("email", "==", email))
      );

      if (!querySnapshot.empty) {
        const user = querySnapshot.docs[0].data();
        const userId = querySnapshot.docs[0].id;

        if (querySnapshot.empty) {
          setErrorAlert("Usuario o Contraseña incorrecta.");
          return;
        }

        if (user.password !== password) {
          console.log("Usuario o Contraseña incorrecta.");
          setErrorAlert("Usuario o Contraseña incorrecta.");
          return;
        }

        if (user.password === password) {
          localStorage.setItem("user_logged", JSON.stringify(userId));
          setIsProgress(false);
          navigate("/dashboard", { replace: true });
        }
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
   
    }
    setIsProgress(false);
  };

  return (
    <>
      <h1 className="text-3xl font-semibold text-center mb-4">Login</h1>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ p: 2, border: "1px solid grey" }}
        className="max-w-md mx-auto"
      >
        <TextField
          className="w-full mb-4"
          label="Email"
          type="email"
          variant="outlined"
          {...register("email", {
            required: "Email es obligatorio",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Email no válido",
            },
          })}
        />
        {errors.email && (
          <Alert className="mb-3" severity="error">
            <AlertTitle>Error</AlertTitle>
            {errors.email.message}
            {errorAlert}
          </Alert>
        )}
        <TextField
          className="w-full mb-4"
          label="Password"
          type="password"
          variant="outlined"
          {...register("password", {
            required: "Contraseña es obligatoria",
          })}
        />
        {errors.password && (
          <Alert className="mb-3" severity="error">
            <AlertTitle>Error</AlertTitle>
            {errors.password.message}
          </Alert>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          className="w-full "
          sx={{ backgroundColor: "#4CAF50", color: "white" }}
        >
          {isProgress ? "Iniciando sesión..." : "Iniciar sesión"}
        </Button>
        {errorAlert !== "" && (
          <Alert
            className="mt-3"
            severity="error"
            sx={{ display: errorAlert ? "block" : "none" }}
          >
          <AlertTitle>Error</AlertTitle>
            {errorAlert}
          </Alert>
        )}
      </Box>
    </>
  );
};

export default Login;
