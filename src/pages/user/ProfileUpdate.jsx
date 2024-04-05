import Header from "../../components/Header";
import UserForm from "../../components/UserForm";

const ProfileUpdate = () => {
  return (
    <>
      <Header></Header>
      <h1>PROFILE update</h1>
      <UserForm type={"update"}></UserForm>
    </>
  );
};

export default ProfileUpdate;
