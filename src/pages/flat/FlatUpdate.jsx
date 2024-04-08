import FlatForm from "../../components/FlatForm"
import Header from "../../components/Header"
import checkUserLogged from "../../services/actions";


const FlatUpdate = () => {
  checkUserLogged();
  return (
    <>
    <Header/>
    <h2 className="text-center text-3xl font-bold text-blue-400 mt-8">Modificar Piso</h2>
    <FlatForm type={'update'} />

    </>
    
  )
}

export default FlatUpdate