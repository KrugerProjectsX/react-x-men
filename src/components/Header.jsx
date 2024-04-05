import React, {useEffect, useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuTransitions from "./MenuTransitions";
import { getUserLogged } from '../services/users.js';
import { Link } from 'react-router-dom';


export default function Header() {
    const [user, setUser] = useState(null);
    const [activeButton, setActiveButton] = useState(null);

    const processData = async () => {
        await getUserData();
    }

    const getUserData = async () => {
        const responseUser = await getUserLogged();
        setUser(responseUser);
    }
    useEffect(() => {
        processData();
    }, [])
    
    return (
        <div>
            <AppBar position="static">
                <Toolbar className={'bg-white'}>
                    <div className={'flex items-center m-4'}>
                        <img className="pointer-events-none my-auto w-24 lg:w-40 md:w-32"  alt="My SVG"/>

                    </div>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                    </Typography>
                    <div className={'flex items-center justify-center mr-2'}>
                        <Button className={'text-secondary'} component={Link} to="/dashboard"  >Home</Button>
                        {user && (user.role === 'landlord' || user.role === 'admin' ) && <Button component={Link} to="/myflats" className={'text-secondary'}  onClick={() => setActiveButton('myflats')}>Mis Pisos</Button>}
                        <Button className={'text-secondary'} component={Link} to="/flats">Pisos</Button>
                        { user && user.role ==='admin' && <Button className={'text-secondary'} component={Link} to="/users">Usuarios</Button>}
                    </div>
                    <MenuTransitions user={user} setUser={setUser}/>
                </Toolbar>
            </AppBar>
        </div>
    );
}