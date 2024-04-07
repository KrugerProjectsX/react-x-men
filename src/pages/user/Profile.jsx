import { useParams } from "react-router-dom";
import Header from "../../components/Header";

import checkUserLogged from "../../services/actions";
import UserFormHook from "../../components/UserFormHook";


const Profile = () => {
  let { userId }  = useParams();
  checkUserLogged();
  return (
    <>
    <Header/>

      <div>Profile</div>
      {/* <UserFormHook type={'create'}/> */}
      <UserFormHook type={'view'} id={userId}/> 
    </>
  );
};

export default Profile;
