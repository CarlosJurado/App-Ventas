import React, {useEffect, useState, useContext} from 'react';
import {UsuarioContext} from '../context/UsuarioProvider';
import MaterialTable from "material-table";
import { useParams } from 'react-router-dom';



function ClientesTodos() {
    
    
    const {id} = useParams()
    const {usuario} = useContext(UsuarioContext)
               
    
    const [cliente, setCliente] = useState([])
    
    
    useEffect(() => {
      const obtenerDatos = async () => {
        const data = await fetch(`https://cloudfunctions.net/clientes/api/appclientes/`)
        const datos = await data.json()
        
        setCliente(datos)                              
    }
    obtenerDatos()
    }, [id])          


    const columns = [
    {
      title:'Cliente',
      field: 'cliente'
    },
    {
      title:'Direccion',
      field: 'direccion'
    },
    {
      title:'Telefono',
      field: 'telefono'
    },

 ];


    return (
      <div className="content-wrapper"> 
    
    
    <>
{
   
   (usuario.rol === 'admin' || usuario.rol === 'propietario' || usuario.rol === 'avanzado' ) && <>


        <MaterialTable
         columns={columns}
          data={cliente}
         title="Lista de Clientes"
        />          

               
            </>
          } </>
       </div>
    )
  }
    

    export default ClientesTodos

