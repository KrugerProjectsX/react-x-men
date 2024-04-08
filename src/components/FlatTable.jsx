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
  TextField,
} from "@mui/material";
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import Pagination from "@mui/material/Pagination";
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddBoxIcon from '@mui/icons-material/AddBox';


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
import TableSortLabel from '@mui/material/TableSortLabel';

const FlatTable = ({ type }) => {
  const user = JSON.parse(localStorage.getItem("user_logged"));
  const data = useSelector((state) => state.flats.flatsArray);
  const [showAlert, setShowAlert] = useState(false);
  const [flag, setFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    city: "",
    minAreaSize: "",
    maxAreaSize: "",
    minRentPrice: "",
    maxRentPrice: ""
});


const { city, minAreaSize, maxAreaSize, minRentPrice, maxRentPrice } = filters;
  const [citysFiltered, setCitysFiltered] = useState([]);
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

  useEffect(() => {
    setLoading(true);
    switch (type) {
      case "all-flats":
        dispatch(fetchFlats(user)).finally(() => setLoading(false));
        break;
      case "favorites-flats":
        dispatch(favoriteFlat(user)).finally(() => setLoading(false));
        break;
      case "my-flats":
        dispatch(myFlats(user)).finally(() => setLoading(false));
        break;
      default:
        setLoading(false);
        break;
    }
  }, [dispatch, type, user]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };


  const filteredData = data.filter((flat) => {
    return (
      flat.city.toLowerCase().includes(city.toLowerCase()) &&
      (!minAreaSize || flat.areaSize >= parseInt(minAreaSize)) &&
      (!maxAreaSize || flat.areaSize <= parseInt(maxAreaSize)) &&
      (!minRentPrice || flat.rentPrice >= parseInt(minRentPrice)) &&
      (!maxRentPrice || flat.rentPrice <= parseInt(maxRentPrice))
    );
  });

console.log(citysFiltered, "filtrado city")
  
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

  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = filteredData.sort((a, b) => {
    if (orderBy === "city") {
      return order === "asc" ? a.city.localeCompare(b.city) : b.city.localeCompare(a.city);
    } else if (orderBy === "areaSize") {
      return order === "asc" ? a.areaSize - b.areaSize : b.areaSize - a.areaSize;
    } else if (orderBy === "rentPrice") {
      return order === "asc" ? a.rentPrice - b.rentPrice : b.rentPrice - a.rentPrice;
    }
    return 0;
  });

  const paginatedData = sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);


  const tableFlats = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <CircularProgress color="success" className="text-green-500" />
        </div>
      );
    }

    if (data.length === 0) {
      if(type==="my-flats")
      {
        return (
          <>
            <div className="flex justify-center items-center h-screen text-lg text-gray-700">
              No hay datos en esta página, Agrega pisos con el boton superior izquierdo. .
            </div>
          </>
        );
      }
      
      if(type==="favorites-flats")
      {
        return (
          <>
            <div className="flex justify-center items-center h-screen text-lg text-gray-700">
              No hay datos en esta página, Agrega pisos favoritos desde la página <a href="/dashboard"> Home</a>.
            </div>
          </>
        );
      }
     
    }

    return (
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead className="bg-gray-50" >
            <TableRow>
              <TableCell
                align="right"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
              <TableSortLabel
                active={orderBy === 'city'}
                direction={orderBy === 'city' ? order : 'asc'}
                onClick={() => handleRequestSort('city')}
                hideSortIcon={false}
              >
                *Ciudad
                </TableSortLabel>
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
                <TableSortLabel
                active={orderBy === 'areaSize'}
                direction={orderBy === 'areaSize' ? order : 'asc'}
                onClick={() => handleRequestSort('areaSize')}
                hideSortIcon={false}
              >
                *Área(m2)
                </TableSortLabel>
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
              ><TableSortLabel
              active={orderBy === 'rentPrice'}
              direction={orderBy === 'rentPrice' ? order : 'asc'}
              onClick={() => handleRequestSort('rentPrice')}
              hideSortIcon={false}
            > 
                *Precio de Renta
                </TableSortLabel>
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
            {sortedData
              .map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell className="px-6 py-4 whitespace-nowrap">{row.city}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">{row.streetName}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">{row.streetNumber}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">{row.areaSize}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">{row.hasAc ? "Si" : "No"}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">{row.yearBuilt}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap"><strong>$</strong> {row.rentPrice}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">{row.dateAvailable}</TableCell>

                  {type === "all-flats" && (
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      {!row.favorite && (
                        <Button onClick={() => addFavorite(row.id)}>
                          <AddIcon className="text-green-500" />
                        </Button>
                      )}
                      {row.favorite && (
                        <Button onClick={() => removeFavorite(row.favorite)}>
                          <FavoriteIcon className="text-red-400" />
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
        <div className="flex justify-center mt-4">
          <Pagination
            count={Math.ceil(data.length / itemsPerPage)}
            page={page}
            onChange={handleChangePage}
            variant="outlined"
            shape="rounded"
          />
        </div>
      </TableContainer>
    );
  };

  return (
    <div>
      {type === "my-flats" && (
       <button onClick={handleClick} className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded mb-4">
       <AddBoxIcon />
     </button>
      )}

<div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '10px' }}>
                <TextField
                    name="city"
                    label="Ciudad"
                    variant="outlined"
                    size="small"
                    value={filters.city}
                    onChange={handleFilterChange}
                    style={{ marginRight: '10px' }}
                />
                <TextField
                    name="minAreaSize"
                    label="Área Mínima"
                    variant="outlined"
                    size="small"
                    value={filters.minAreaSize}
                    onChange={handleFilterChange}
                    style={{ marginRight: '10px' }}
                />
                <TextField
                    name="maxAreaSize"
                    label=" Área Max"
                    variant="outlined"
                    size="small"
                    value={filters.maxAreaSize}
                    onChange={handleFilterChange}
                    style={{ marginRight: '10px' }}
                />
                <TextField
                    name="minRentPrice"
                    label="Renta Min"
                    variant="outlined"
                    size="small"
                    value={filters.minRentPrice}
                    onChange={handleFilterChange}
                    style={{ marginRight: '10px' }}
                />
                <TextField
                    name="maxRentPrice"
                    label="Renta Max"
                    variant="outlined"
                    size="small"
                    value={filters.maxRentPrice}
                    onChange={handleFilterChange}
                    style={{ marginRight: '10px' }}
                />
                
            </div>
            </div>
      {tableFlats()}
    
    </div>
  );
};

export default FlatTable;
