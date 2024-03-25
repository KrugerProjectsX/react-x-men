import Header from "../components/Header";
import UsersTable from "../components/UserTable";
import checkUserLogged from "../services/actions";

const Home = () => {

  checkUserLogged();
  
  return (
    <div>
      <Header></Header>
      <UsersTable></UsersTable>
    </div>
  );
};

export default Home;
 