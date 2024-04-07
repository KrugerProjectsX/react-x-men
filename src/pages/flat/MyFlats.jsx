import FlatTable from "../../components/FlatTable";
import Header from "../../components/Header";
import checkUserLogged from "../../services/actions";


export default function MyFlats() {
  checkUserLogged();
  return (
    <>
    
    <Header></Header>
    <h2 className="text-center text-3xl font-bold text-blue-400 mt-8">Mis Pisos</h2>
    <FlatTable type={'my-flats'}></FlatTable>

    </>
    
  )
}
