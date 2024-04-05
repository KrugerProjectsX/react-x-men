import Header from "../../components/Header"
import UsersTable from "../../components/UserTable"
import checkUserLogged from "../../services/actions"

const Users = () => {
  checkUserLogged()
  return (<>
      <Header></Header>
       <h1>Usuarios</h1>
      <UsersTable></UsersTable>
  </>
    )
}

export default Users