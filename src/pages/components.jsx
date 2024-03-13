import { Box, TextField } from "@mui/material";
import { useRef } from "react";

export default function FlatForm(){
    const city  = useRef("");    
    const streatName  = useRef("")
    const streatNumber  = useRef("")
    const areaSize  = useRef("")
    const hasAc  = useRef("")
    const yearBuilt  = useRef("")
    const rentPrice  = useRef("")
    const dateAvailable  = useRef("")
    const ref= collection()

    
    const handleSubmit =(FormData)= void =() {
        e.preventDefault();
    }
    return(
        <Box component={"form"}>
            
            <TextField label="City" variant="outlined" />
            <TextField label="Streat Name" variant="outlined" />
            <TextField label="Streat Number" variant="outlined" />
            <TextField label="Area Size" variant="outlined" />
            <TextField label="Has AC" variant="outlined" />
            <TextField label="Year Built" variant="outlined" />
            <TextField label="Rent Price" variant="outlined" />
            <TextField label="Date Available" variant="outlined" />
            <button type={"Submit"} className="" />
        </Box>
    )
}