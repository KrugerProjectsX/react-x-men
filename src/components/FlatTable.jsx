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
import { useNavigate } from "react-router-dom";
import * as React from 'react';


const FlatTable = ({type}) => {

    const ref= collection(db, "flats");
    const refFav = collection(db, "favorites");
    const userId= JSON.parse(localStorage.getItem("user_logged"));
    const navigate= useNavigate();
    const [open, setOpen] = useState(false);
     const getData= async()=>{
     
        if (type=== "all-flats"){
          const data = await getDocs(ref);
          const allFlats = [];
          for(const item of data.docs){
              
              const search = query(refFav, where("userId", "==",userId ), where('flatId','==',item.id));
              const dataFav = await getDocs(search);
              let favorite =false;
              if(dataFav.docs.length > 0){
                  favorite = dataFav.docs[0].id;
              }
              const flatsWithFav = {...item.data(), id: item.id, favorite: favorite};
              allFlats.push(flatsWithFav)
          }
          setFlats(allFlats);

        }
        if (type=== "favorite-flats"){
          const search = query(refFav, where("userId", "==",userId ) );
          const data = await getDocs(search);
          const allFlats = [];
          for (const item of data.docs){
              const refFlat = doc(db, "flats", item.data().flatId);
              const dataFlat = await getDoc(refFlat);
              allFlats.push({...dataFlat.data(), id: dataFlat.id, favorite: item.id});
          }

          setFlats(allFlats);

        }
        if (type=== "my-flats"){
    
             const search = query(ref, where("user", "==", userId)); 
             const data= await getDocs(search);
             const rows = data.docs.maps((item)=>{
                return {...item.data(),id: item.id}
             })

        }
     }

     const handleClick =()=> {
      navigate ("/addflat")
    }

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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
   
      <h1>Flats</h1>
      <button onClick={handleClick}> 
        Agregar Piso
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
