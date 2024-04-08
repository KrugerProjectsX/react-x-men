import FlatForm from "../../components/FlatForm"
import Header from "../../components/Header"
import checkUserLogged from "../../services/actions";


const FlatUpdate = () => {
  checkUserLogged();
  return (
    <>
    <Header/>
    <h1>FlatUpdate</h1>
    <FlatForm type={'update'} />

    </>
    
  )
}

export default FlatUpdate