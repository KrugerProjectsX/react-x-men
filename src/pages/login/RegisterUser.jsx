
import Header from '../../components/Header'
import UserFormHook from '../../components/UserFormHook'

const RegisterUser = () => {
  return (
    <>
 
 <h2 className="text-center text-3xl font-bold text-blue-400 mt-8">Registro de Usuario</h2>
     
    <UserFormHook type={'create'}/>
  </>
  )
}

export default RegisterUser