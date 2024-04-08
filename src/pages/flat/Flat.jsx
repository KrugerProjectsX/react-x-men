import React from 'react'
import Header from '../../components/Header'
import FlatForm from '../../components/FlatForm'
import Messages from '../../components/Messages'
import { useParams } from 'react-router-dom'
import checkUserLogged from '../../services/actions'

const Flat = () => {
  checkUserLogged();
    let { idFlat }  = useParams();
  return (
    <>
    <Header/>
    <h2 className="text-center text-3xl font-bold text-blue-400 mt-8">Informacion de Pisos</h2>
    <div className="grid grid-cols-2 gap-4">
  <div className="col-span-1">
    <FlatForm type={'view'} id={idFlat}/>
  </div>
  <div className="col-span-1">
    <Messages flatId={idFlat}/>
  </div>
</div>
    </>
    )
}

export default Flat