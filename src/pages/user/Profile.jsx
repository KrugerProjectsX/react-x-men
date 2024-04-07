import { useParams } from "react-router-dom";
import Header from "../../components/Header";

import checkUserLogged from "../../services/actions";
import UserFormHook from "../../components/UserFormHook";

const Profile = () => {
  let { userId } = useParams();
  checkUserLogged();
  return (
    <>
      <Header />
      <h2 className="text-center text-3xl font-bold text-blue-400 mt-8">Perfil</h2>
     
      <UserFormHook type={"view"} id={userId} />
    </>
  );
};

export default Profile;
