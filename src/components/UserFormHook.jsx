import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addUserToFirestore,
  getUser,
  updateUser,
} from "../redux/states/UsersSlice";
import { useNavigate, useParams } from "react-router-dom";
import { decode, encode } from "../utilities/encryption";
import AlertMessage from "./AlertMessage";
import Swal from "sweetalert2";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import ButtonGroup from "@mui/material/ButtonGroup";
import Alert from "@mui/material/Alert";

export default function UserFormHook({ type }) {
  const user = JSON.parse(localStorage.getItem("user_logged"));
  const roleLoged = localStorage.getItem("role");

  const userLogged = useSelector((state) => state.users.user);
  const dispatch = useDispatch();
  const { userId } = useParams();

  useEffect(() => {
    dispatch(getUser(userId));
  }, [dispatch]);

  useEffect(() => {
    setValue("firstName", userLogged.firstName);
    setValue("lastName", userLogged.lastName);
    setValue("email", userLogged.email);
    setValue("birthDate", userLogged.birthDate);
    setValue("role", userLogged.role);
  }, [userLogged]);

  const currentDate = new Date().toJSON().slice(0, 10);
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      birthDate: currentDate,
      password: "",
    },
  });

  const [userLoaded, setUserLoaded] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorAlert, setErrorAlert] = useState("");

  const [showAlert, setShowAlert] = useState(false);

  const today = new Date();
  const minBirthDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];
  const maxBirthDate = new Date(
    today.getFullYear() - 120,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  let nameButton = type === "create" ? "Crear" : "Modificar";

  const onSubmit = async (data) => {
    const formattedDate = new Date(data.birthDate).toISOString().slice(0, 10);
    const passwordCode = encode(data.password);

    if (type === "create") {
      try {
        let resp = await dispatch(
          addUserToFirestore({
            ...data,
            birthDate: formattedDate,
            password: passwordCode.toString(),
          })
        );

        if (resp.error) {
          if (resp.error.message === "Email existe") {
            Swal.fire({
              title: "Error!",
              text: "Email ya esta registrado.!",
              icon: "error",
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: "Ocurrio un error.!",
              icon: "error",
            });
          }

          return;
        }
        Swal.fire({
          title: "Buen trabajo!",
          text: "Usuario Creado Correctamente!!",
          icon: "success",
        });

        const querySnapshot = await getDocs(
          query(collection(db, "users"), where("email", "==", data.email))
        );
        if (!querySnapshot.empty) {
          const user = querySnapshot.docs[0].data();
          const userId = querySnapshot.docs[0].id;

          if (querySnapshot.empty) {
            setErrorAlert("Usuario o Contraseña incorrecta.");
            return;
          }

          let userPasword = decode(user.password);
          if (userPasword !== data.password) {
            setErrorAlert("Usuario o Contraseña incorrecta.");
            return;
          }

          if (userPasword === data.password) {
            localStorage.setItem("user_logged", JSON.stringify(userId));

            navigate("/dashboard", { replace: true });
          }
        }
      } catch (error) {
        setErrorMessage(error.message);
      }
    }

    if (type === "update") {
      data["id"] = userId;
      await dispatch(updateUser({ ...data, birthDate: formattedDate }));
      Swal.fire({
        title: "Buen trabajo!",
        text: "Usuario Editado Correctamente!!",
        icon: "success",
      });
      navigate("/users", { replace: true });
    }
  };

  const inputRole = () => {
    if (roleLoged === "admin" || !roleLoged) {
      return (
        <TextField
          select
          label={type === "view" || type === "update" ? "" : "Rol"}
          variant="outlined"
          SelectProps={{ native: true }}
          className="w-full mb-5"
          disabled={type === "view"}
          {...register("role", { required: "Elija el tipo de Rol." })}
          error={errors.role}
        >
          
          {roleLoged === "admin" && (
            <option key="admin" value="admin">
              admin
            </option>
          )}
          <option key="landlord" value="landlord">
            landlord
          </option>
          <option key="renter" value="renter">
            renter
          </option>
        </TextField>
        
      );
    }
  };

  const handeClikCancel = () => {
    if (type === "create") {
      navigate("/", { replace: true });
      return;
    }
    if (type === "my-flats") {
      navigate("/myflats", { replace: true });
      return;
    }
    navigate("/dashboard", { replace: true });
  };
  return (
    <Box
      component={"form"}
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-4 border rounded"
    >
      {userLoaded ? (
        <>
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
          {showAlert && (
            <AlertMessage
              message={"Usuarios"}
              type={"success"}
              accion={"creado Correctamente."}
            />
          )}

          <TextField
            disabled={type === "view"}
            label={type === "view" || type === "update" ? "" : "Nombre"}
            {...register("firstName", {
              required: "Nombre es requerido, incluir dos caracteres",
              minLength: { value: 2, message: "Ingresa al menos 2 carácteres" },
            })}
            error={!!errors.firstName}
            variant="outlined"
            className="mb-4 w-full"
          />
          {errors.firstName && (
            <Alert className="mb-3" severity="warning">
              {errors.firstName.message}
            </Alert>
          )}
          <TextField
            disabled={type === "view"}
            label={type === "view" || type === "update" ? "" : "Apellidos"}
            {...register("lastName", {
              required: "Apellidos es requerido, incluir dos caracteres",
              minLength: { value: 2, message: "Ingresa al menos 2 carácteres" },
            })}
            variant="outlined"
            className="mb-4 w-full"
          />

          {errors.lastName && (
            <Alert className="mb-3" severity="warning">
              {errors.lastName.message}
            </Alert>
          )}
          <TextField
            disabled={type === "view"}
            type="email"
            label={type === "view" || type === "update" ? "" : "Email"}
            {...register("email", {
              required: "Email es requerido",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "El e-mail no es valido",
              },
            })}
            error={!!errors.email}
            variant="outlined"
            className="mb-4 w-full"
          />

          {errors.email && (
            <Alert className="mb-3" severity="warning">
              {errors.email.message}
            </Alert>
          )}
          {type === "create" && (
            <div>
             
              <div className="mb-4 w-full">
                <TextField
                  type="password"
                  label={type === "view" ? "" : "Password"}
                  {...register("password", {
                    required:
                      "Password es requerido, Minimo 6 caracteres, Al menos 1 caracter especial",
                    pattern: {
                      value: /^(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,15}$/,
                      message: "El password no es válido",
                    },
                  })}
                  variant="outlined"
                  className="w-full"
                />
                {errors.password && (
                  <Alert className="mt-2" severity="warning">
                    {errors.password.message}
                  </Alert>
                )}
              </div>

              <div className="mb-4 w-full">
                <TextField
                  type="password"
                  label={type === "view" ? "" : "Repetir Password"}
                  {...register("passwordRepeat", {
                    required: "Repetir Password es requerido",
                    validate: (value) =>
                      value === getValues("password") ||
                      "Las contraseñas no coinciden",
                  })}
                  variant="outlined"
                  className="w-full"
                />
                {errors.passwordRepeat && (
                  <Alert className="mt-2" severity="warning">
                    {errors.passwordRepeat.message}
                  </Alert>
                )}
              </div>
            </div>
          )}
          <TextField
            disabled={type === "view"}
            label={
              type === "view" || type === "update" ? "" : "Fecha Nacimiento"
            }
            type="date"
            {...register("birthDate", {
              required: "Fecha de Nacimiento  es requerido",
              min: maxBirthDate,
              max: minBirthDate,
            })}
            error={errors.birthDate}
            inputProps={{ min: maxBirthDate, max: minBirthDate }}
            variant="outlined"
            className="mb-4 w-full"
          />

          {errors.birthDate && (
            <Alert className="mb-3" severity="warning">
              {errors.birthDate.message}
            </Alert>
          )}
          {inputRole()
          }
           {errors.role && (
          <Alert className="mb-3" severity="warning">
            {errors.role.message}
          </Alert>
        )}

          {type !== "view" && (
            <ButtonGroup
              className="flex justify-center space-x-4"
              variant="text"
              size="small"
              aria-label="Basic button group"
            >
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {nameButton}
              </Button>
              <Button
                onClick={handeClikCancel}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancelar
              </Button>
            </ButtonGroup>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </Box>
  );
}
