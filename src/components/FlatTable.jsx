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
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';

import { useDispatch, useSelector } from "react-redux";
import {
  deleteFlat,
  favoriteFlat,
  fetchFlats,
  myFlats,
} from "../redux/states/FlatSlice";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import ButtonGroup from "@mui/material/ButtonGroup";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const FlatTable = ({ type }) => {
  const user = JSON.parse(localStorage.getItem("user_logged"));
  const data = useSelector((state) => state.flats.flatsArray);
  const [showAlert, setShowAlert] = useState(false);
  const [flag, setFlag] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  if (type === "all-flats") {
    useEffect(() => {
      setLoading(true);
      dispatch(fetchFlats(user)).finally(() => setLoading(false));
    }, [dispatch]);
  }

  if (type === "favorites-flats") {
    useEffect(() => {
      setLoading(true);
      dispatch(favoriteFlat(user)).finally(() => setLoading(false));
    }, [dispatch]);
  }

  if (type === "my-flats") {
    useEffect(() => {
      setLoading(true);
      dispatch(myFlats(user)).finally(() => setLoading(false));
    }, [dispatch]);
  }

  const handleDelete = (id) => {
    dispatch(deleteFlat(id));
  };

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/addflat", { replace: true });
  };

  const addFavorite = async (id) => {
    //TODO:  verificar si ya existe esta relacion entre el flat id y userId
    const data = { userId: user, flatId: id };
    await addDoc(collection(db, "favorites"), data);
    Swal.fire({
      title: "Agregado a favoritos!",
      text: "Piso agregado Correctamente!!",
      icon: "success",
    });
    navigate("/my-favorites-flats", { replace: true });
    setFlag(!flag);
  };
  
  const removeFavorite = async (id) => {
    const refRemoveFav = await doc(db, "favorites", id);
    let result = await Swal.fire({
      title: "Estás seguro que desea quitar de favoritos?",
      showDenyButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`,
    });
    if (result.isConfirmed) {
      await deleteDoc(refRemoveFav);
      window.location.reload();
    } else if (result.isDenied) {
      Swal.fire("Changes are not saved", "", "info");
    }
  };

  const removeMyFlat = async (id) => {
    const refRemoveFlat = await doc(db, "flats", id);
    let result = await Swal.fire({
      title: "Estás seguro que desea quitar mi piso?",
      showDenyButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`,
    });

    if (result.isConfirmed) {
      await deleteDoc(refRemoveFlat);
      //navigate("/dashboard", { replace: true })
      window.location.reload();
    } else if (result.isDenied) {
      Swal.fire("Changes are not saved", "", "info");
    }
  };

  const tableFlats = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <CircularProgress color="success" className="text-green-500" />
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <>
          <div className="flex justify-center items-center h-screen">
            No hay datos en esta página
          </div>
        </>
      );
    }

    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell
                align="right"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Ciudad
              </TableCell>
              <TableCell
                align="right"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nombre de Calle
              </TableCell>
              <TableCell
                align="right"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Número de Calle
              </TableCell>
              <TableCell
                align="right"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Área(m2)
              </TableCell>
              <TableCell
                align="right"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                has AC
              </TableCell>
              <TableCell
                align="right"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Año de construcción
              </TableCell>
              <TableCell
                align="right"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Precio de Renta
              </TableCell>
              <TableCell
                align="right"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Fecha Disponible
              </TableCell>
             
              <TableCell
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                align="right"
              >
                Acciones
              </TableCell>
              
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

                {type === "all-flats" && (
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    {!row.favorite && (
                      <Button onClick={() => addFavorite(row.id)}>
                       <AddIcon/>
                      </Button>
                    )}
                    {row.favorite && (
                      <Button onClick={() => removeFavorite(row.favorite)}>
                      <CancelIcon/>  
                      </Button>
                    )}
                    <Button href={`/flat/${row.id}`}>
                      <VisibilityIcon />
                    </Button>
                  </TableCell>
                )}

                
                    {type === "my-flats" && (
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                      <ButtonGroup
                        variant="text"
                        size="small"
                        aria-label="Basic button group"
                      >
                        
                    <Button href={`/flat/${row.id}`}>
                      <VisibilityIcon />
                    </Button>
                      <Button href={`/flat/edit/${row.id}`}>
                        <EditIcon></EditIcon>
                      </Button>

                      <Button onClick={() => removeMyFlat(row.id)}>
                      <DeleteIcon />
                    </Button>
                    </ButtonGroup>
                    </TableCell>
                    )}
                    {type === "favorites-flats" && (
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                      <ButtonGroup
                        variant="text"
                        size="small"
                        aria-label="Basic button group"
                      >
                      
                      <Button onClick={() => removeFavorite(row.favorite)}>
                      <DeleteIcon />
                    </Button>
                    </ButtonGroup>
                    </TableCell>
                    )}
                  
                  

                 
              
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div>
      {type === "my-flats" && (
        <button onClick={handleClick}>Agregar Flat</button>
      )}

      {tableFlats()}
    </div>
  );
};

export default FlatTable;
