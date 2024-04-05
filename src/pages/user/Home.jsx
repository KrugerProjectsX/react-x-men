import FlatTable from "../../components/FlatTable";
import Header from "../../components/Header";
import UsersTable from "../../components/UserTable";
import checkUserLogged from "../../services/actions";

const Home = () => {

  checkUserLogged();
  
  return (
    <div>
      <Header></Header>
      <FlatTable type={'favorites-flats'}></FlatTable>
    </div>
  );
};

export default Home;
 