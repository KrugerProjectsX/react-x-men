import Header from "../../components/Header";
import UserFormHook from "../../components/UserFormHook";

const ProfileUpdate = () => {
  return (
    <>
      <Header></Header>

      <h2 className="text-center text-3xl font-bold text-blue-400 mt-8"> Editar Perfil Usuario</h2>
      <UserFormHook type={"update"}></UserFormHook>
    </>
  );
};

export default ProfileUpdate;
