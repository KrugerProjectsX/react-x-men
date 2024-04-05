import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import UserForm from "../../components/UserForm";
import checkUserLogged from "../../services/actions";


const Profile = () => {
  let { userId }  = useParams();
  checkUserLogged();
  return (
    <>
    <Header/>

      <div>Profile</div>
      {/* <UserFormHook type={'create'}/> */}
      <UserForm type={'view'} id={userId}/> 
    </>
  );
};

export default Profile;
