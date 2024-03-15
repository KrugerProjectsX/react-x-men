import {Box, Button, TextField} from "@mui/material";
import {useRef} from "react";
import {doc,updateDoc} from "firebase/firestore";
import { db } from "../firebase";

export default function UserForm({type}){
    const firsNameRef=useRef('');
    const lastNameRef=useRef('');
    const emailRef=useRef('');
    const birthRef=useRef('');
    const passwordRef=useRef('');

    const id =JSON.parse(localStorage.getItem('user_logged'));
    console.log("no tiene "+id)
    const ref=doc(db,'users',id);
    const currentDate = new Date().toJSON().slice(0, 10);
    const today = new Date();
    const maxBirthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()).toISOString().split('T')[0];
    const minBirthDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate()).toISOString().split('T')[0];

    const handleUpdateUser= async (e)=>{
        e.preventDefault();
        const user={
            firsName: firsNameRef.current.value,
            lastName: lastNameRef.current.value,
            email: emailRef.current.value,
            birth: birthRef.current.value,
        }
        if (type=== "create"){
         // user = {...user, password: passwordRef.current.value}
        }

        if (type === "update"){
          await updateDoc(ref, user);
        }
        await updateDoc(ref,user);
    }
    return(
        <>
            <Box
                component="form"
                onSubmit={handleUpdateUser}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    maxWidth: '400px',
                    margin: '0 auto',
                    padding: '1rem',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
            >
                <TextField inputRef={firsNameRef} label="First Name" variant="outlined" />
                <TextField inputRef={lastNameRef} label="Last Name" variant="outlined" />
                <TextField inputRef={emailRef} type="email" label="Email" variant="outlined" />
                <TextField inputRef={passwordRef} type="password" label="Password" variant="outlined" />
                <TextField inputRef={birthRef} type="date" defaultValue={currentDate} inputProps={{ min:minBirthDate , max: maxBirthDate}} label="Birth Date" variant="outlined" />
                <Button type="submit" variant="contained"
                className={'bg-primary hover:bg-primary2'}
                >Save</Button>
            </Box>
        </>
    );
}