import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import { getDocs, query, where, collection, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Box, MenuItem, Select, Slider, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from "@mui/material/Paper";

import VisibilityIcon from '@mui/icons-material/Visibility';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";
import Pagination from '@mui/material/Pagination';

export default function UsersTable() {
  const ref = collection(db, "users");
  const refFlats = collection(db, "flats");
  const [userType, setUserType] = useState("");
  const [flatsCounter, setFlatsCounter] = useState("");
  const [valueSlider, setValueSlider] = React.useState([18, 120]);
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState([]);

  const getData = async () => {
    setLoading(true);
    let arrayWhere = [];

    if (userType) {
      arrayWhere.push(where("role", "==", userType));
    }

    const today = new Date();
    const minBirthDate = new Date(
      today.getFullYear() - valueSlider[0],
      today.getMonth(),
      today.getDate()
    )
      .toISOString()
      .split("T")[0];
    const maxBirthDate = new Date(
      today.getFullYear() - valueSlider[1],
      today.getMonth(),
      today.getDate()
    )
      .toISOString()
      .split("T")[0];
    if (valueSlider && valueSlider.length > 1) {
      arrayWhere.push(where("birthDate", ">=", maxBirthDate));
      arrayWhere.push(where("birthDate", "<=", minBirthDate));
    }

    const searchUser = query(ref, ...arrayWhere);

    const data = await getDocs(searchUser);
    const usersSet = []; // Conjunto para almacenar usuarios únicos

    // Iterar sobre los usuarios y agregarlos al conjunto
    for (const item of data.docs) {
      const search = query(refFlats, where("user", "==", item.id));
      const dataFlats = await getDocs(search);

      if (flatsCounter) {
        const flatsValue = flatsCounter.split("-");
        if (flatsValue.length > 1) {
          const min = flatsValue[0];
          const max = flatsValue[1];
          if (dataFlats.docs?.length < min || dataFlats.docs?.length > max) {
            continue;
          }
        } else {
          if (flatsValue[0] === "61+") {
            if (dataFlats.docs?.length < 61) {
              continue;
            }
          }
        }
      }
      const userWithFlats = {
        ...item.data(),
        id: item.id,
        flats: dataFlats.docs?.length,
      };

      usersSet.push(userWithFlats);
    }
    setLoading(false);
    setUsers(usersSet);
  };

  useEffect(() => {
    getData();
  }, [userType, flatsCounter, valueSlider]);

  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

 
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');

  const removeUser = async (id) => {
    const refRemoveFav = await doc(db, "users", id);
    let result = await Swal.fire({
      title: "Estás seguro que desea Eliminar este Usuario?",
      showDenyButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`,
    });
    if (result.isConfirmed) {
      await deleteDoc(refRemoveFav);
      window.location.reload();
    } else if (result.isDenied) {
      Swal.fire("No se a podido eliminar.", "", "info");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = users.slice((page - 1) * itemsPerPage, page * itemsPerPage).sort((a, b) => {
    if (order === 'asc') {
      return a[orderBy] < b[orderBy] ? -1 : 1;
    } else {
      return b[orderBy] < a[orderBy] ? -1 : 1;
    }
  });
  
  const tablaUsers = () => {
    if(loading){
      return (<div className="flex justify-center items-center h-screen">
      <CircularProgress color="success" className="text-green-500" />
    </div>
    )
    }

    return (
     
    <div className="overflow-x-auto">
    <TableContainer component={Paper}>
      <Table  sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead className="bg-gray-50">
          <TableRow>
            <TableCell align="right" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <TableSortLabel
                active={orderBy === 'firstName'}
                direction={orderBy === 'firstName' ? order : 'asc'}
                onClick={() => handleRequestSort('firstName')}
                hideSortIcon={false}
              >
              *Nombre
              </TableSortLabel>
            </TableCell>
            <TableCell align="right" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
            <TableSortLabel
                active={orderBy === 'lastName'}
                direction={orderBy === 'lastName' ? order : 'asc'}
                onClick={() => handleRequestSort('lastName')}
                hideSortIcon={false}
              >
              *Apellido
              </TableSortLabel>
            </TableCell>
            <TableCell align="right" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
              Email
            </TableCell>
            <TableCell align="right" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
              Fecha Nacimiento
            </TableCell>
            <TableCell align="right" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
              Role
            </TableCell>
            <TableCell align="right" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
            <TableSortLabel
                active={orderBy === 'flats'}
                direction={orderBy === 'flats' ? order : 'asc'}
                onClick={() => handleRequestSort('flats')}
                hideSortIcon={false}
              >
              *Cantidad Pisos
              </TableSortLabel>
            </TableCell>
            <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody >
          {sortedData.map((row) => (
            <TableRow key={row.id}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell className="px-6 py-4 whitespace-nowrap">{row.firstName}</TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">{row.lastName}</TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">{row.email}</TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">{row.birthDate}</TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">{row.role}</TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">{row.flats}</TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">
                <ButtonGroup variant="text" size="small" aria-label="Basic button group">
                  <Button href={`/profile/edit/${row.id}`}>
                    <EditIcon />
                  </Button>
                  <Button onClick={() => removeUser(row.id)}>
                    <DeleteIcon />
                  </Button>
                </ButtonGroup>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <div className="flex justify-center mt-4">
      <Pagination
        count={Math.ceil(users.length / itemsPerPage)}
        page={page}
        onChange={handleChangePage}
        variant="outlined"
        shape="rounded"
      />
    </div>
  </div>
    );
  };

  return (
    <>
      <Box
        component="form"
        className="flex space-x-4 mx-auto max-w-screen-md mb-4"
      >
        <div className="flex items-center space-x-4">
          <TextField
            select
            label="User Type"
            variant="outlined"
            SelectProps={{ native: true }}
            className="w-40"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option key="none" value=""></option>
            <option key="landlord" value="landlord">
              Landlords
            </option>
            <option key="renter" value="renter">
              Renters
            </option>
            <option key="admin" value="admin">
              Admins
            </option>
          </TextField>

          <TextField
            select
            label="Flats Counter"
            variant="outlined"
            SelectProps={{ native: true }}
            className="w-40"
            value={flatsCounter}
            onChange={(e) => setFlatsCounter(e.target.value)}
          >
            <option key="none" value=""></option>
            <option key="0-5" value="0-5">
              0-5
            </option>
            <option key="6-20" value="6-20">
              6-20
            </option>
            <option key="21-60" value="21-60">
              21-60
            </option>
            <option key="61+" value="61+">
              61+
            </option>
          </TextField>
        </div>
        <div className={"w-full"}>
          <Typography id="input-slider" gutterBottom>
            Años
          </Typography>
          <Slider
            max={120}
            min={18}
            step={10}
            value={valueSlider}
            onChange={(e, newValue) => setValueSlider(newValue)}
            getAriaLabel={() => "Age Range"}
            valueLabelDisplay="auto"
            className="flex-grow"
          />
        </div>
      </Box>

      {tablaUsers()}
    </>
  );
}
