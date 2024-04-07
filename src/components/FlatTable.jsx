
import { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";


import { useDispatch, useSelector } from "react-redux";
import { deleteFlat, favoriteFlat, fetchFlats, myFlats } from "../redux/states/FlatSlice";
import {  useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import ButtonGroup from "@mui/material/ButtonGroup";

const FlatTable = ({type}) => {
  const user= JSON.parse(localStorage.getItem("user_logged"))
  const data = useSelector((state)=>state.flats.flatsArray);
  const [showAlert, setShowAlert] = useState(false);
  const [flag, setFlag ] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();


  if (type === 'all-flats') {

  useEffect(()=>{
    dispatch(fetchFlats(user));
  },[dispatch])

  }

  if (type === 'favorites-flats') {

    useEffect(()=>{
      
      dispatch(favoriteFlat(user));
    

    },[dispatch])

    }

    if (type === 'my-flats' ) {
  
      useEffect(()=>{
        dispatch(myFlats(user));


      },[dispatch])

      }

  
  const handleDelete=(id)=>{
    dispatch(deleteFlat(id));
  }

  const navigate= useNavigate(); 
  const handleClick =()=> {
    navigate ("/addflat")
  }

 
  const addFavorite = async (id) => {
    //TODO:  verificar si ya existe esta relacion entre el flat id y userId
    const data = {userId: userId, flatId:id}
    await addDoc(refFav, data);
    setFlag(!flag);
}
const removeFavorite = async (id) => {
    
    const refRemoveFav = doc(db,"favorites",id)
    await deleteDoc(refRemoveFav);
    setFlag(!flag);
    
}


  return (
    <div>
      {type==="my-flats"&&(<button onClick={handleClick}> 
        Agregar Flat
      </button>)}
 
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ciudad</TableCell>
              <TableCell align="right" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre de Calle</TableCell>
              <TableCell align="right" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número de Calle</TableCell>
              <TableCell align="right"className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >Área(m2)</TableCell>
              <TableCell align="right" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">has AC</TableCell>
              <TableCell align="right" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Año de construcción</TableCell>
              <TableCell align="right" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio de Renta</TableCell>
              <TableCell align="right" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Disponible</TableCell>
              {(type === 'all-flats'|| type=== 'favorite-flats') && <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" align="right"></TableCell>}
              <TableCell
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                align="right"
              >
                Acciones
              </TableCell>
                        <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="right">{row.city}</TableCell>
                <TableCell align="right">{row.streetName}</TableCell>
                <TableCell align="right">{row.streetNumber}</TableCell>
                <TableCell align="right">{row.areaSize}</TableCell>
                <TableCell align="right">{row.hasAc ? "Si" : "No"}</TableCell>
                <TableCell align="right">{row.yearBuilt}</TableCell>
                <TableCell align="right">$ {row.rentPrice}</TableCell>
                <TableCell align="right">{row.dateAvailable}</TableCell>
              
                {(type === 'all-flats'|| type=== 'favorite-flats') && <TableCell className="px-6 py-4 whitespace-nowrap" >
                                {!row.favorite && <Button onClick={()=>addFavorite(row.id)}>Add Favorite</Button>}
                                {row.favorite && <Button onClick={()=>removeFavorite(row.favorite)}>Remove Favorite</Button>}
                            </TableCell> }
                            <TableCell className="px-6 py-4 whitespace-nowrap">
                            <ButtonGroup variant="text"  size="small" aria-label="Basic button group">
              
                                <Button href={`/flat/${row.id}`} > <VisibilityIcon /></Button>
                                {type === 'my-flats' && <Button href={`/flat/edit/${row.id}`} ><EditIcon></EditIcon></Button>}
                                </ButtonGroup>
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