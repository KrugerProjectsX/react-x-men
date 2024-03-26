import { collection, getDocs, query, where } from "firebase/firestore";

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
import { db } from "../firebase";

const FlatTable = ({type}) => {

    const ref= collection(db, "flats");
    const userId= JSON.parse(localStorage.getItem("user_logged"));

     const getData= async()=>{
     
        if (type=== "all-flats"){


        }
        if (type=== "favorite-flats"){


        }
        if (type=== "my-flats"){
    
             const search = query(ref, where("user", "==", userId)); 
             const data= await getDocs(search);
             const rows = data.docs.maps((item)=>{
                return {...item.data(),id: item.id}
             })

        }
     }

     console.log(rows);
    useEffect(()=>{
        getData();
    },[])

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
                  <ShowModal id={row.id} setFlat={setFlat} />
                </TableCell>
                <TableCell align="right">
                  <DeleteFlatButton
                    id={row.id}
                    setFlat={setFlat}
                  >
                   </DeleteFlatButton>
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
