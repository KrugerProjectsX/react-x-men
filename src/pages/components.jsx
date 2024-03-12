import { Box, TextField } from "@mui/material";
import { useRef } from "react";

export default function FlatForm(){
    const city:  = useRef("");    
    const Streat Name:  = useRef("")
    const Streat Number:  = useRef("")
    const Area Size:  = useRef("")
    const Has AC:  = useRef("")
    const Year Built:  = useRef("")
    const Rent Price:  = useRef("")
    const Date Availlable:  = useRef("")

    
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