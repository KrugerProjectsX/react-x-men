import { Alert } from "@mui/material";

const AlertMessage = ({ message, type, accion }) => {
  return (
    <>
      <Alert severity={type} onClose={() => setShowAlert(false)}>
        {message} {accion} correctamente
      </Alert>
    </>
  );
};

export default AlertMessage;
