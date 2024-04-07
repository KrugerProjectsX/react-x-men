import { Box, Button, Switch, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addFlatToFirestore, getFlat, updateFlat } from "../redux/states/FlatSlice";
import Alert from "@mui/material/Alert";
import Swal from 'sweetalert2';
import ButtonGroup from "@mui/material/ButtonGroup";
import { useEffect } from "react";

const FlatForm = ({type}) => {
  console.log(type,"type")
  const userId=JSON.parse(localStorage.getItem("user_logged"));
  const getFlatId = useSelector((state)=>state.flats.flat);
  const {idFlat} = useParams();
  const dispatch = useDispatch();
  console.log(idFlat,"flat id")
  useEffect(() => {
    dispatch(getFlat(idFlat));
  }, [dispatch]);
 
  useEffect(() => {
    setValue("city", getFlatId.city);
    setValue("rentPrice", getFlatId.rentPrice);
    setValue("areaSize", getFlatId.areaSize);
    setValue("hasAc", getFlatId.hasAc);
    setValue("yearBuilt", getFlatId.yearBuilt);
    setValue("streetNumber", getFlatId.streetNumber);
    setValue("streetName", getFlatId.streetName);
    setValue("dateAvailable", getFlatId.dateAvailable);
  }, [getFlatId]);
  const {
    register,
    handleSubmit, setValue,
    formState: { errors },
  } = useForm(
    {
      defaultValues: {
      city: "",
      streetName: "",
      streetNumber: "",
      areaSize: "",
      hasAc: "",
      yearBuilt: "",
      rentPrice: "",
      dateAvailable: "",
      user: "",
      },}
  );
  const currentDate = new Date().toJSON().slice(0, 10);
  const navigate = useNavigate();

  let nameButton=type==="create"?"Crear":"Modificar";

  const onSubmit = async (data) => {
    const flat = {
      city: data.city,
      streetName: data.streetName,
      streetNumber: data.streetNumber,
      areaSize: data.areaSize,
      hasAc: data.hasAc,
      yearBuilt: data.yearBuilt,
      rentPrice: data.rentPrice,
      dateAvailable: data.dateAvailable,
      user: userId,
    };
    if(type=== "create")
    {  await dispatch(addFlatToFirestore(flat));
      let param = "C";
      Swal.fire({
        title: "Creado correctamente!",
        text: "Piso creado correctamente.",
        icon: "success"
      });
      navigate(`/dashboard`, { replace: false, state: { param } });
    }
  
    if(type=== "update")
    {  
      console.log(data)
      data["id"] = idFlat;
      data["user"]=userId;
      await dispatch(updateFlat(data));
      console.log("edito")
      Swal.fire({
        title: "Editado correctamente!",
        text: "Piso editado correctamente.",
        icon: "success"
      });
      navigate(`/myflats`, { replace: true });
    }
  };

  const handeClikCancel=()=>{
    if(type==="update"){
    navigate("/myflats", { replace: true });
    return;
    }
    if(type==="view"){
      navigate("/dashboard", { replace: true });
      return;
    }
  }
  return (
    <div>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-sm mx-auto mt-8 p-6 bg-white rounded-lg shadow-md"
      >
        <TextField
          label= {type === "view" || type === "update" ? "" : "Ciudad"}
          {...register("city", { required: "Ciudad es obligatorio" })}
          variant="outlined"
          fullWidth
          className="mb-4"
          disabled={type === "view"}
        />
        {errors.city && (
          <Alert className="mb-3" severity="warning">
            {errors.city.message}
          </Alert>
        )}
        <TextField
          label={type === "view" || type === "update" ? "" : "Nombre Calle"} 
          {...register("streetName", {
            required: "Nombre Calle es obligatorio",
          })}
          variant="outlined"
          fullWidth
          className="mb-4"
          disabled={type === "view"}
        />
        {errors.streetName && (
          <Alert className="mb-3" severity="warning">
            {errors.streetName.message}
          </Alert>
        )}
        <TextField
          label={type === "view" || type === "update" ? "" :"Número Calle" } 
          {...register("streetNumber", { required: " Número Calle es obligatorio" })}
          variant="outlined"
          fullWidth
          className="mb-4"
          disabled={type === "view"}
        />
        {errors.streetNumber && (
          <Alert className="mb-3" severity="warning">
            {errors.streetNumber.message}
          </Alert>
        )}
        <TextField
          label={type === "view" || type === "update" ? "" : "Tamaño Área"}
          type="number"
          {...register("areaSize", { required: "Tamaño Área es obligatorio" })}
          variant="outlined"
          fullWidth
          className="mb-4"
          disabled={type === "view"}
        />
        {errors.areaSize && (
          <Alert className="mb-3" severity="warning">
            {errors.areaSize.message}
          </Alert>
        )}
        <Box className="flex items-center mb-4">
          <Switch {...register("hasAc")} color="primary" />
          <label>Has AC</label>
        </Box>
        <TextField
          label={type === "view" || type === "update" ? "" : "Año Construcción"} 
          type={"number"}
          inputProps={{ min: 1900, max: 2050 }}
          {...register("yearBuilt", { required: " Año Construcción es obligatorio" })}
          variant="outlined"
          fullWidth
          className="mb-4"
          disabled={type === "view"}
        />
        {errors.yearBuilt && (
          <Alert className="mb-3" severity="warning">
            {errors.yearBuilt.message}
          </Alert>
        )}
        <TextField
          label= {type === "view" || type === "update" ? "" :"Precio Renta" } 
          type={"number"}
          {...register("rentPrice", { required: "Precio Renta es obligatorio" })}
          variant="outlined"
          fullWidth
          className="mb-4"
          disabled={type === "view"}
        />
        {errors.rentPrice && (
          <Alert className="mb-3" severity="warning">
            {errors.rentPrice.message}
          </Alert>
        )}
        <TextField
          label= {type === "view" || type === "update" ? "" : "Fecha Disponible"} 
          type={"date"}
          defaultValue={currentDate}
          {...register("dateAvailable", { required: "Fecha Disponible es obligatorio" })}
          variant="outlined"
          fullWidth
          className="mb-4"
          disabled={type === "view"}
        />
        {errors.dateAvailable && (
          <Alert className="mb-3" severity="warning">
            {errors.dateAvailable.message}
          </Alert>
        )}
<ButtonGroup className="flex justify-center space-x-4"variant="text"  size="small" aria-label="Basic button group">
        <Button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
         {nameButton}
        </Button>
        <Button
          onClick={handeClikCancel}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
         Cancelar
        </Button>
        </ButtonGroup>
      </Box>
    </div>
  );
};

export default FlatForm;
