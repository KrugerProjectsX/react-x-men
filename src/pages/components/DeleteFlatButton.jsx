import { Button } from "@mui/material";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

const DeleteFlatButton = ({ id, setFlat }) => {
  const refDoc = doc(db, "flats", id);
  const remove = async () => {
    await deleteDoc(refDoc);
    setFlat((prev) => !prev);
  };
  return (
    <>
      <Button variant="contained" onClick={remove}>
        Remove
      </Button>
    </>
  );
};

export default DeleteFlatButton;
