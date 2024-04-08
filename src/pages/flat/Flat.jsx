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
    <h1>View Flat</h1>
    <FlatForm type={'view'} id={idFlat}/>
    <Messages flatId={idFlat}/> 
    </>
    )
}

export default Flat