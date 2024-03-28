import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import Modal from "@mui/material/Modal";
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  border: "2px solid #FFFFF",
  borderRadius: "32px",
  boxShadow: 24,
  p: 4,
};

function ShowModal({ id, setFlat }) {
  const currentDate = new Date().toJSON().slice(0, 10);
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  const refDoc = doc(db, "flats", id);

  const [open, setOpen] = useState(false);

  const [flat, setFlatId] = useState({
    city: "",
    streetName:"",
    streetNumber:"",
    areaSize: "",
    hasAc: false,
    yearBuilt:5,
    rentPrice:0,
    dateAvailable: "",
  });

  const city = useRef("");
  const streetName = useRef("");
  const streetNumber = useRef(0);
  const areaSize = useRef(0);
  const hasAc = useRef(false);
  const yearBuilt = useRef(0);
  const rentPrice = useRef(0);
  const dateAvailable = useRef("");

  const getFlats = async () => {
    const response = await getDoc(refDoc);
    setFlatId(response.data());
  };

  const handleOpen = async () => {
    await getFlats();
    setOpen(true);
  };
 
  console.log("flat"+ flat)
  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateDoc(refDoc, {
      city: city.current.value,
      streetName: streetName.current.value,
      streetNumber: streetNumber.current.value,
      areaSize: areaSize.current.value,
      hasAc: hasAc.current.checked,
      yearBuilt: yearBuilt.current.value,
      rentPrice: rentPrice.current.value,
      dateAvailable: dateAvailable.current.value,    });
    handleClose();
    setFlat((prev) => !prev);
  };

  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}><ModeEditOutlineIcon/></Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form className="title" onSubmit={handleSubmit}>
            <h2 className="title">Update Flat info</h2>
            <TextField
          label="City"
          inputRef={city}
          defaultValue={flat.city}
          variant="outlined"
          fullWidth
          className="mb-4"
        />
        <TextField
          label="Street name"
          inputRef={streetName}
          defaultValue={flat.streetName}
          variant="outlined"
          fullWidth
          className="mb-4"
        />
        <TextField
          label="Street number"
          inputRef={streetNumber}
          defaultValue={flat.streetNumber}
          variant="outlined"
          fullWidth
          className="mb-4"
        />
        <TextField
          label="Area size"
          type="number"
          inputRef={areaSize}
          defaultValue={flat.areaSize}
          variant="outlined"
          fullWidth
          className="mb-4"
        />
        <Box className="flex items-center mb-4">
          <Switch {...label}
                defaultChecked={flat.hasAc} inputRef={hasAc} color="primary" />
          <label>Has AC</label>
        </Box>
        <TextField
          label="Year built"
          type={"number"}
          inputProps={{ min: 1900, max: 2050 }}
          inputRef={yearBuilt}
          defaultValue={flat.yearBuilt}
          variant="outlined"
          fullWidth
          className="mb-4"
        />
        <TextField
          label="Rent price"
          type={"number"}
          inputRef={rentPrice}
          defaultValue={flat.rentPrice}
          variant="outlined"
          fullWidth
          className="mb-4"
        />
        <TextField
          label="Date Available"
          type={"date"}
          defaultValue={flat.dateAvailable}
          inputRef={dateAvailable}
          variant="outlined"
          fullWidth
          className="mb-4"
        />
            <br />
           
            <Button variant="contained" type="submit" sx={{ width: "220px" }}>
              Update
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default ShowModal;
