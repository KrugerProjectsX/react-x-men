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
import DeleteFlatButton from "./DeleteFlatButton";
import { db } from "../../firebase";

const FlatList = () => {
  const [flats, setFlats] = useState([]);
  const [flat, setFlat] = useState(false);
  const flatsCollectionRef = collection(db, "flats");

  const getFlat = async () => {
    const data = await getDocs(flatsCollectionRef);
    const userData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    console.log(userData);
    setFlats(userData);
  };

  useEffect(() => {
    getFlat();
  }, [flat]);

  return (
    <div>
      <h1>Flats</h1>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Has Dog</TableCell>
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
                <TableCell align="right">
                  {row.hasDog ? "true" : "false"}
                </TableCell>
                <TableCell align="right">{row.city}</TableCell>
                <TableCell align="right">{row.streetName}</TableCell>
                <TableCell align="right">{row.streetNumber}</TableCell>
                <TableCell align="right">{row.areaSize}</TableCell>
                <TableCell align="right">{row.hasAc}</TableCell>
                <TableCell align="right">{row.yearBuilt}</TableCell>
                <TableCell align="right">{row.rentPrice}</TableCell>
                <TableCell align="right">{row.dateAvailable}</TableCell>

                <TableCell align="right">
                  <ShowModal id={row.id} setFlag={setFlat} />
                </TableCell>
                <TableCell align="right">
                  <DeleteFlatButton
                    id={row.id}
                    setFlag={setFlat}
                  ></DeleteFlatButton>
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
