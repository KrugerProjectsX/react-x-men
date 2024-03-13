import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import Modal from "@mui/material/Modal";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

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
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  const refDoc = doc(db, "flats", id);

  const [open, setOpen] = useState(false);

  const [user, setUser] = useState({
    name: "",
    age: 0,
    hasDog: false,
  });

  const name = useRef("");
  const age = useRef(0);
  const hasDog = useRef(false);

  const getUsers = async () => {
    const response = await getDoc(refDoc);
    setUser(response.data());
  };

  const handleOpen = async () => {
    await getUsers();
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateDoc(refDoc, {
      name: name.current.value,
      age: age.current.value,
      hasDog: hasDog.current.checked,
    });
    handleClose();
    setFlat((prev) => !prev);
  };

  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>Edit</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form className="title" onSubmit={handleSubmit}>
            <h2 className="title">Update user info</h2>
            <TextField
              inputRef={name}
              defaultValue={user.name}
              label="Name"
              variant="outlined"
              type="text"
              sx={{ marginBottom: "10px" }}
            />
            <br />
            <TextField
              inputRef={age}
              defaultValue={user.age}
              label="Age"
              variant="outlined"
              type="number"
            />
            <br />
            <div>
              <Switch
                {...label}
                defaultChecked={user.hasDog}
                inputRef={hasDog}
              />
              <label htmlFor="switch">Has a dog</label>
            </div>
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
