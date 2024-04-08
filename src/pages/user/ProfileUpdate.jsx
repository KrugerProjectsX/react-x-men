import Header from "../../components/Header";
import UserFormHook from "../../components/UserFormHook";
import checkUserLogged from "../../services/actions";

const ProfileUpdate = () => {
  checkUserLogged();
  return (
    <>
      <Header></Header>

      <h2 className="text-center text-3xl font-bold text-blue-400 mt-8"> Editar Perfil Usuario</h2>
      <UserFormHook type={"update"}></UserFormHook>
    </>
  );
};

export default ProfileUpdate;
