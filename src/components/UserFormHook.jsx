import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";  
import { useForm } from "react-hook-form";
import { useDispatch , useSelector} from "react-redux";
import { addUserToFirestore, getUser, updateUser } from "../redux/states/UsersSlice";
import { useNavigate , useParams} from "react-router-dom";
import { decode, encode } from "../utilities/encryption";
import AlertMessage from "./AlertMessage";
import Swal from 'sweetalert2';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";


export default function UserFormHook({ type }) {
  const user= JSON.parse(localStorage.getItem("user_logged"));
  const roleLoged= localStorage.getItem("role");

  const data = useSelector((state)=>state.users.usersArray);
  const userLogged = useSelector((state)=>state.users.user);
  const dispatch = useDispatch();
  const {userId} = useParams();
console.log(userId,"userId")
  useEffect(() => {
    dispatch(getUser(userId))
 }, [])

 useEffect(() => {
    setValue("firstName",userLogged.firstName);
    setValue("lastName",userLogged.lastName);
    setValue("email",userLogged.email);
    setValue("birthDate",userLogged.birthDate);
    setValue("role",userLogged.role);
 }, [userLogged])

    const currentDate = new Date().toJSON().slice(0, 10);
    const navigate= useNavigate();
    const { handleSubmit, register, setValue, formState: { errors } } = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            birthDate: currentDate,
            password: '',
        },
    });


    
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
    
    
        if (type === 'create') {
            try {
            let resp= await dispatch(addUserToFirestore({ ...data, birthDate: formattedDate, password: passwordCode.toString() }));
        
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
           data["id"]=userId;
          await dispatch(updateUser({ ...data, birthDate: formattedDate })); 
          Swal.fire({
            title: "Buen trabajo!",
            text: "Usuario Editado Correctamente!!",
            icon: "success"
          });
           navigate("/users", { replace: true });

        }
    }

    const inputRole=()=>{
        if(roleLoged === 'admin') {
            return(<TextField
                select
                label="Rol"
                variant="outlined"
                SelectProps={{ native: true }}
                className="w-full mb-5"
                disabled={type === 'view'} 
                {...register("role", { required: true })}
                error={errors.role}
                helperText={errors.role && "User type is required"}
            >
                {roleLoged==='admin'&&<option key="admin" value="admin">admin</option>}
                <option key="landlord" value="landlord">landlord</option>
                <option key="renter" value="renter">renter</option>
            </TextField>)
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
                    
                    <TextField disabled={type === 'view'} label={type==='view'?"":"Nombre"} {...register("firstName", { required: true , minLength: { value: 2, message: 'Ingresa al menos 2 carácteres' }})} error={!!errors.firstName} helperText={errors.firstName && "Nombre es requerid, incluir dos caracteres "} variant='outlined' className="mb-4 w-full" />
                    <TextField disabled={type === 'view'} label= {type==='view'?"":"Apellidos" }{...register("lastName", { required: true , minLength: { value: 2, message: 'Ingresa al menos 2 carácteres' }})} error={!!errors.lastName} helperText={errors.lastName && "Apellidos es requerido, incluir dos caracteres"} variant='outlined' className="mb-4 w-full" />
                    <TextField disabled={type === 'view'} type='email' label={type==='view'?"":'Email'  }{...register("email", { required: true ,pattern: { value: /^\S+@\S+$/i, message: 'El e-mail no es valido'}})} error={!!errors.email} helperText={errors.email && "Email es requerido"} variant='outlined' className="mb-4 w-full" />
                    {type === 'create' && <TextField type={'password'} label={type==='view'?"":'Password' } {...register("password", { required: true,  pattern: { value: /^(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,15}$/, message: 'El password no es valido'}  })} error={!!errors.password}  helperText={errors.password && "Password es requerido, Minimo 6 caracteres, Al menos 1 caracter especial"} variant='outlined' className="mb-4 w-full" />}
                    <TextField disabled={type === 'view'} label={type==='view'?"":'Fecha Nacimiento'} type='date' {...register("birthDate", { required: true, min:maxBirthDate, max:minBirthDate })} error={errors.birthDate} helperText={errors.birthDate && "Fecha de Nacimiento  es requerido"} inputProps={{ min: maxBirthDate, max: minBirthDate }}  variant='outlined' className="mb-4 w-full" />
                    {inputRole()}
                    {type !== 'view' && <Button type='submit' className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">{nameButton}</Button>}
                </>
            ) : (
                <p>Loading...</p>
            )}
        </Box>
    );
}
