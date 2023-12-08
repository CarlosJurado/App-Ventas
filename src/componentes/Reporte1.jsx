import React, {useEffect, useState, useContext} from 'react';
import {UsuarioContext} from '../context/UsuarioProvider';
import MaterialTable from "material-table";
import { useParams } from 'react-router-dom';



function ReporteVentas() {
    
    
    const {id} = useParams()
    const {usuario} = useContext(UsuarioContext)
               
    
    const [venta, setVenta] = useState([])
    
    
    
    useEffect(() => {
      const obtenerDatos = async () => {
        const data = await fetch(`https://cloudfunctions.net/ventas/api/appventas/`)
        const datos = await data.json()
        
        setVenta(datos)                              
    }
    obtenerDatos()
    }, [id])          


    const columns = [
    {
      title:'Fecha',
      field: 'fecha'
    },
    {
      title:'Venta',
      field: '[{venta.producto} - {venta.unidades} Unid - {venta.peso} Kg]'
    },
    {
        title:'Total',
        field: 'total'
      },
    {
      title:'Vendedor',
      field: 'nombre'
    },

 ];


    return (
      <div className="content-wrapper"> 
    
    
    <>
{
   
   (usuario.rol === 'admin' || usuario.rol === 'propietario' ) && <>


        <MaterialTable
         columns={columns}
          data={venta}
         title="Lista de Ventas"
        />          

               
            </>
          } </>
       </div>
    )
  }
    

    export default ReporteVentas

