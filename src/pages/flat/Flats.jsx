import FlatTable from "../../components/FlatTable";
import Header from "../../components/Header";
import checkUserLogged from "../../services/actions";


const Flats = () => {
  checkUserLogged();
  return (
    <div>
      <Header></Header>
      <FlatTable type={'all-flats'}></FlatTable>
    </div>
  );
};

export default Flats;
