import FlatForm from "../../components/FlatForm";
import Header from "../../components/Header";
import checkUserLogged from "../../services/actions";

const AddFlats = () => {
  checkUserLogged();
  return (
    <>
      <Header></Header>
      <h2 className="text-center text-3xl font-bold text-blue-400 mt-8">Crear Piso</h2>
      <FlatForm type={"create"}></FlatForm>
    </>
  );
};

export default AddFlats;
