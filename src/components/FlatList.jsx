import { collection, getDocs } from "firebase/firestore";

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

import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import { useLocation } from "react-router-dom";
import AlertMessage from "./AlertMessage";
const FlatList = () => {
  const location = useLocation();
  const [param, setParam] = useState(location.state && location.state.param);
  const [flats, setFlats] = useState([]);
  const [flat, setFlat] = useState(false);
  const flatsCollectionRef = collection(db, "flats");
  const [showAlert, setShowAlert] = useState(false);
  const [open, setOpen] = useState(false);

  const showAlertForParamC = (oldParam) => {
    if (oldParam && (oldParam === "C"||oldParam === "E") ) {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 10000);
 
    }
  };
  
  const getFlat = async () => {
    const data = await getDocs(flatsCollectionRef);
    const userData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    showAlertForParamC(param);
    setFlats(userData);
  };
  useEffect(() => {
    if (param && (param === "C" || param === "E")) {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 10000);
    }
  }, [param]);
  
  useEffect(() => {
    console.log("Actualiza ",showAlert); // Muestra el valor actualizado de showAlert
  }, [showAlert]);


  useEffect(() => {
    getFlat();
  }, [flat]);

  const handleClose = (newParam) => {
    setOpen(false);
    setParam(newParam); // Actualiza param con el nuevo valor
    showAlertForParamC(newParam);
  };

 
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/addflat");
  };

  return (
    <div>
      <h1>Flats</h1>
      <button onClick={handleClick}>Agregar Piso</button>
      {showAlert && param === "E" && (
        <AlertMessage message={"Pisos"} type={"success"} accion={"editado"} />
      )}
      {showAlert && param === "C" && (
        <AlertMessage message={"Pisos"} type={"success"} accion={"agregado"} />
      )}
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
            {flats.map((row) => (
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
                <TableCell align="right">{row.rentPrice}</TableCell>
                <TableCell align="right">{row.dateAvailable}</TableCell>

                <TableCell align="right">
                  <ShowModal
                    onClose={handleClose}
                    title="Modal Title"
                    id={row.id}
                    setFlat={setFlat}
                  />
                </TableCell>
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default FlatList;
