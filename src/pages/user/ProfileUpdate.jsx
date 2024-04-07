import Header from "../../components/Header";
import UserFormHook from "../../components/UserFormHook";

const ProfileUpdate = () => {
  return (
    <>
      <Header></Header>
      <h1>PROFILE</h1>
      <UserFormHook type={"update"}></UserFormHook>
    </>
  );
};

export default ProfileUpdate;
