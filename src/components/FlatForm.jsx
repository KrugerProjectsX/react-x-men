import { Box, Button, Switch, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addFlatToFirestore } from "../redux/states/FlatSlice";

const FlatForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const currentDate = new Date().toJSON().slice(0, 10);
  const navigate = useNavigate();
 
  const dispatch = useDispatch();

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
      user: JSON.parse(localStorage.getItem("user_logged"))
    }

    dispatch(addFlatToFirestore(flat));
    let param = 'C';
    navigate(`/dashboard`, { replace: false, state: { param } });
  };

  return (
    <div>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-sm mx-auto mt-8 p-6 bg-white rounded-lg shadow-md"
      >
        <TextField
          label="City"
          {...register("city", { required: true })}
          variant="outlined"
          fullWidth
          className="mb-4"
        />
        {errors.city && <p>Este campo es requerido.</p>}
        <TextField
          label="Street name"
          {...register("streetName", { required: true })}
          variant="outlined"
          fullWidth
          className="mb-4"
        />
        {errors.streetName && <p>Este campo es requerido.</p>}
        <TextField
          label="Street number"
          {...register("streetNumber", { required: true })}
          variant="outlined"
          fullWidth
          className="mb-4"
        />
         {errors.streetNumber && <p>Este campo es requerido.</p>}
        <TextField
          label="Area size"
          type="number"
          {...register("areaSize", { required: true })}
          variant="outlined"
          fullWidth
          className="mb-4"
        />
        {errors.areaSize && <p>Este campo es requerido.</p>}
        <Box className="flex items-center mb-4">
          <Switch {...register("hasAc",  )} color="primary" />
          <label>Has AC</label>
        </Box>
        <TextField
          label="Year built"
          type={"number"}
          inputProps={{ min: 1900, max: 2050 }}
          {...register("yearBuilt", { required: true })}
          variant="outlined"
          fullWidth
          className="mb-4"
        />
         {errors.yearBuilt && <p>Este campo es requerido.</p>}
        <TextField
          label="Rent price"
          type={"number"}
          {...register("rentPrice", { required: true })}
          variant="outlined"
          fullWidth
          className="mb-4"
        />
         {errors.rentPrice && <p>Este campo es requerido.</p>}
        <TextField
          label="Date Available"
          type={"date"}
          defaultValue={currentDate}
          {...register("dateAvailable", { required: true })}
          variant="outlined"
          fullWidth
          className="mb-4"
        />
         {errors.dateAvailable && <p>Este campo es requerido.</p>}
       
        <Button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Agregar Piso
        </Button>
      </Box>
      
    </div>
  );
};

export default FlatForm;
