import FlatTable from "../../components/FlatTable";
import Header from "../../components/Header";


const Flats = () => {
  return (
    <div>
      <Header></Header>
      <FlatTable type={'all-flats'}></FlatTable>
    </div>
  );
};

export default Flats;
