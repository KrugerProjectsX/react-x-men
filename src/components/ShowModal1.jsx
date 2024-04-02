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

function ShowModal({ name }) {
   

  return (
    <div>
      <Button><ModeEditOutlineIcon/></Button>
      <Modal
        
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        
      </Modal>
    </div>
  );
}

export default ShowModal;
