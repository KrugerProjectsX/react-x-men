import FlatForm from "../../components/FlatForm";
import Header from "../../components/Header";
import checkUserLogged from "../../services/actions";

const AddFlats = () => {
  checkUserLogged();
  return (
    <>
      <Header></Header>
      <FlatForm type={"create"}></FlatForm>
    </>
  );
};

export default AddFlats;
