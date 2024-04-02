import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";  
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addUserToFirestore } from "../redux/states/UsersSlice"; 

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
    let nameButton = 'Create';
 
    const onSubmit = async (data) => {
        const formattedDate = `${data.birthDate.getFullYear()}-${(data.birthDate.getMonth() + 1).toString().padStart(2, '0')}-${data.birthDate.getDate().toString().padStart(2, '0')}`;
        data.birthDate = formattedDate.toString();
    
        if (type === 'create') {
            dispatch(addUserToFirestore(data));
        }
        /**
        if (type === 'update') {
            dispatch(updateUserInFirestore(data)); 
        } */
    }

    return (
        <Box component={'form'} onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4 border rounded">
            {userLoaded ? (
                <>
                    <TextField disabled={type === 'view'} label="First Name" {...register("firstName", { required: true })} error={!!errors.firstName} helperText={errors.firstName && "First name is required"} variant='outlined' className="mb-4 w-full" />
                    <TextField disabled={type === 'view'} label="Last Name" {...register("lastName", { required: true })} error={!!errors.lastName} helperText={errors.lastName && "Last name is required"} variant='outlined' className="mb-4 w-full" />
                    <TextField disabled={type === 'view'} type='email' label='Email' {...register("email", { required: true })} error={!!errors.email} helperText={errors.email && "Email is required"} variant='outlined' className="mb-4 w-full" />
                    {type === 'create' && <TextField type={'password'} label='Password' {...register("password", { required: true })} error={!!errors.password}  helperText={errors.password && "Password is required"} variant='outlined' className="mb-4 w-full" />}
                    <TextField disabled={type === 'view'} label='Birth Date' type='date' {...register("birthDate", { required: true })} error={errors.birthDate} helperText={errors.birthDate && "Birth date is required"} variant='outlined' className="mb-4 w-full" />
                    <TextField
                        select
                        label="User Type"
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
