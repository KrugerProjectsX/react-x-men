import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";  
import { useForm } from "react-hook-form";
import { useDispatch , useSelector} from "react-redux";
import { addUserToFirestore, updateUser, validateEmail } from "../redux/states/UsersSlice";
import { useNavigate } from "react-router-dom";
import { decode, encode } from "../utilities/encryption";
import AlertMessage from "./AlertMessage";
import Swal from 'sweetalert2';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export default function UserFormHook({ type }) {
    const currentDate = new Date().toJSON().slice(0, 10);
    const navigate= useNavigate();
    const { handleSubmit, register, setValue, formState: { errors } } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            birthDate: currentDate,
            password: '',
        },
    });

    const data = useSelector((state)=>state.users.usersArray);
    const dispatch = useDispatch();
    const [userLoaded, setUserLoaded] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorAlert, setErrorAlert] = useState("");
  

    const [showAlert, setShowAlert] = useState(false);

 
    const today = new Date();
    const minBirthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()).toISOString().split('T')[0];
    const maxBirthDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate()).toISOString().split('T')[0];
  
    let nameButton = 'Create';
    const onSubmit = async (data) => {
        const formattedDate = new Date(data.birthDate).toISOString().slice(0, 10);
        const passwordCode= encode(data.password);
    
        console.log(passwordCode)
        if (type === 'create') {
            try {
            let resp= await dispatch(addUserToFirestore({ ...data, birthDate: formattedDate, password: passwordCode.toString() }));
            console.log(resp);
            if(resp.error ){
                if(resp.error.message ===  
                    "Email existe"){
                        Swal.fire({
                            title: "Error!",
                            text: "Email ya esta registrado.!",
                            icon: "error"
                          });
                }else{
                    Swal.fire({
                        title: "Error!",
                        text: "Ocurrio un error.!",
                        icon: "error"
                      });
                }
               
               return ;
             }
                 Swal.fire({
                    title: "Buen trabajo!",
                    text: "Usuario Creado Correctamente!!",
                    icon: "success"
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
                
                    let userPasword=decode(user.password)
                    if (userPasword !== data.password) {
                      console.log("Usuario o Contraseña incorrecta.");
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
        
        if (type === 'update') {
            dispatch(updateUser({ ...data, birthDate: formattedDate })); 
        }
    }

    return (
        <Box component={'form'} onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4 border rounded">
            {userLoaded ? (
                <>
                 
                 {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
                 {showAlert &&(
        <AlertMessage message={"Usuarios"} type={"success"} accion={"creado Correctamente."} />
      )}
                    
                    <TextField disabled={type === 'view'} label="Nombre" {...register("firstName", { required: true })} error={!!errors.firstName} helperText={errors.firstName && "Nombre es requerido"} variant='outlined' className="mb-4 w-full" />
                    <TextField disabled={type === 'view'} label="Apellidos" {...register("lastName", { required: true })} error={!!errors.lastName} helperText={errors.lastName && "Apellidos es requerido"} variant='outlined' className="mb-4 w-full" />
                    <TextField disabled={type === 'view'} type='email' label='Email' {...register("email", { required: true })} error={!!errors.email} helperText={errors.email && "Email es requerido"} variant='outlined' className="mb-4 w-full" />
                    {type === 'create' && <TextField type={'password'} label='Password' {...register("password", { required: true })} error={!!errors.password}  helperText={errors.password && "Password es requerido"} variant='outlined' className="mb-4 w-full" />}
                    <TextField disabled={type === 'view'} label='Fecha Nacimiento' type='date' {...register("birthDate", { required: true, min:maxBirthDate, max:minBirthDate })} error={errors.birthDate} helperText={errors.birthDate && "Fecha de Nacimiento  es requerido"} inputProps={{ min: maxBirthDate, max: minBirthDate }}  variant='outlined' className="mb-4 w-full" />
                    <TextField
                        select
                        label="Rol"
                        variant="outlined"
                        SelectProps={{ native: true }}
                        className="w-full mb-5"
                        {...register("role", { required: true })}
                        error={errors.role}
                        helperText={errors.role && "User type is required"}
                    >
                        {}
                        <option key="landlord" value="landlord">landlord</option>
                        <option key="renter" value="renter">renter</option>
                    </TextField>
                    {type !== 'view' && <Button type='submit' className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">{nameButton}</Button>}
                </>
            ) : (
                <p>Loading...</p>
            )}
        </Box>
    );
}
