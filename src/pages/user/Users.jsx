import Header from "../../components/Header"
import UsersTable from "../../components/UserTable"
import checkUserLogged from "../../services/actions"

const Users = () => {
  checkUserLogged()
  return (<>
      <Header></Header>
      <h2 className="text-center text-3xl font-bold text-blue-400 mt-8">Usuarios</h2>
      <UsersTable></UsersTable>
  </>
    )
}

export default Users