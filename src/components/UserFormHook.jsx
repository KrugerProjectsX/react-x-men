import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";  
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addUserToFirestore, updateUser } from "../redux/states/UsersSlice";
import { useNavigate } from "react-router-dom";

export default function UserFormHook({ type }) {
    const currentDate = new Date().toJSON().slice(0, 10);
   
    const { handleSubmit, register, setValue, formState: { errors } } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            birthDate: currentDate
        },
    });

    const dispatch = useDispatch();
    const [userLoaded, setUserLoaded] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const today = new Date();
    const minBirthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()).toISOString().split('T')[0];
    const maxBirthDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate()).toISOString().split('T')[0];
  
    let nameButton = 'Create';
 
    const onSubmit = async (data) => {
        const formattedDate = new Date(data.birthDate).toISOString().slice(0, 10);

        if (type === 'create') {
            try {
                 await dispatch(addUserToFirestore({ ...data, birthDate: formattedDate }));
                
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
