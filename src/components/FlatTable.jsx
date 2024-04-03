
import { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ShowModal from "./ShowModal";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { useDispatch, useSelector } from "react-redux";
import { deleteFlat, fetchFlats } from "../redux/states/FlatSlice";
import { useNavigate } from "react-router-dom";

const FlatTable = ({type}) => {

  const data = useSelector((state)=>state.flats.flatsArray);

  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(fetchFlats());
  },[dispatch])

  const handleDelete=(id)=>{
    dispatch(deleteFlat(id));
  }

  const navigate= useNavigate();
  const handleClick =()=> {
    navigate ("/addflat")
  }

  return (
    <div>
      <h1>Flats</h1>
 
      <button onClick={handleClick}> 
        Agregar Flat
      </button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">Ciudad</TableCell>
              <TableCell align="right">Nombre de Calle</TableCell>
              <TableCell align="right">Número de Calle</TableCell>
              <TableCell align="right">Área(m2)</TableCell>
              <TableCell align="right">has AC</TableCell>
              <TableCell align="right">Año de construcción</TableCell>
              <TableCell align="right">Precio de Renta</TableCell>
              <TableCell align="right">Date Available</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="right">{row.flat.city}</TableCell>
                <TableCell align="right">{row.flat.streetName}</TableCell>
                <TableCell align="right">{row.flat.streetNumber}</TableCell>
                <TableCell align="right">{row.flat.areaSize}</TableCell>
                <TableCell align="right">{row.flat.hasAc ? "Si" : "No"}</TableCell>
                <TableCell align="right">{row.flat.yearBuilt}</TableCell>
                <TableCell align="right">{row.flat.rentPrice}</TableCell>
                <TableCell align="right">{row.flat.dateAvailable}</TableCell>
                <TableCell align="right">
                  <ShowModal idFlat={row.id}/>
                </TableCell>
                <TableCell align="right">
                <span className='icon red'
                        onClick={()=>handleDelete(row.id)}>
                          <DeleteOutlineIcon/>
                        
                      </span>
                </TableCell>
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default FlatTable;