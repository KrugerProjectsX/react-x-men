import { Box, Button, TextField } from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { decode } from "../../utilities/encryption";
import Swal from "sweetalert2";

const Login = () => {
  localStorage.clear();
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

        let userPasword = decode(user.password);
        if (userPasword !== password) {
          setErrorAlert("Usuario o Contraseña incorrecta.");
          return;
        }

        if (userPasword === password) {
          localStorage.setItem("user_logged", JSON.stringify(userId));
          setIsProgress(false);
          Swal.fire({
            title: "Ingreso Correcto!",
            text: "Se autentificado correctamente.",
            icon: "success",
          });
          navigate("/dashboard", { replace: true });
        }
      } else {
        Swal.fire({
          title: "Error!",
          text: "Aún no se encuentra Registrado!",
          icon: "error",
        });
      }
    } catch (error) {
      setErrorAlert("Usuario o Contraseña incorrecta.");
    }
    setIsProgress(false);
  };

  return (
    <>
     <div className="bg-blue-300 min-h-screen">
    <div className="w-full h-full grid grid-cols-1 gap-1 p-1">
      <div className={"flex justify-center items-center mb-8 mt-20"}>
        <img
          className="pointer-events-none w-32 h-32 lg:w-40 md:w-32 rounded-full"
          src="/src/assets/logo.svg"
          alt="My SVG"
        />
      </div>
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
          className="w-full"
          sx={{ backgroundColor: "#4CAF50", color: "white" }}
        >
          {isProgress ? "Iniciando sesión..." : "Iniciar sesión"}
        </Button>
        <div className="flex justify-center mt-3">
          <span className="text-center">
            Aún no te has registrado{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Registrarse
            </a>
          </span>
        </div>
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
    </div>
  </div>
    </>
  );
};

export default Login;
