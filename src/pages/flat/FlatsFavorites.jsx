import FlatTable from "../../components/FlatTable";
import Header from "../../components/Header";
import checkUserLogged from "../../services/actions";

const FlatsFavorites = () => {
  checkUserLogged();
  return (
    <>
    <div>
      <Header></Header>
            <h2 className="text-center text-3xl font-bold text-blue-400 mt-8"> Favoritos Pisos</h2>
            <FlatTable type={'favorites-flats'}/>
        </div>
    </>

  )
}

export default FlatsFavorites