import React, {useEffect, useContext, useState} from 'react';
import {firebase, db} from '../firebase';
import {UsuarioContext} from '../context/UsuarioProvider';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment';
import 'moment/locale/es'
import {faTrashAlt} from '@fortawesome/free-solid-svg-icons'
import {Link} from 'react-router-dom';


function Ventas() {

    
    const {usuario} = useContext(UsuarioContext)
    const [ventas, setVentas] = useState([])
    
    useEffect(() => {
    const db = firebase.firestore() 
    const verVentas = async () => {
        db.collection("ventas").orderBy("order", "desc").limit(350).onSnapshot((querySnapshot) => {
          const docs = [];
          querySnapshot.forEach((doc) => {
            docs.push({ ...doc.data(), id: doc.id });
          });
          setVentas(docs);
        });
      };
        verVentas();
      }, []);  
    
      const eliminarVenta = async (id) => {
        if (window.confirm("Borrar Venta?")) {
          await db.collection("ventas").doc(id).delete();
          toast.warning('Venta eliminada');
        }
      };                 
         
    return (
      
           
<>
{    
    (usuario.rol === 'admin' || usuario.rol === 'propietario' ) && <>

    
        <div className="content-wrapper"> 
       

        <div className="container-fluid mt-5">

        <div className="col-xs-2">
        <h2 align="center">Lista de ventas</h2>

              <table className="table table-striped">
              <thead>
          <tr>
              <th scope="col">Cliente</th>
              <th scope="col">Fecha</th>
              <th scope="col">Total</th>
              <th scope="col">Vendedor</th>
              <th scope="col"></th>                        
          </tr>
          </thead>
          <tbody>

          {ventas.map(venta => (
                  <tr key={venta.id}>
                   <td>
                   {venta.cliente}           
                  </td> 
                  <td>
                  {moment(venta.fecha).format("MMM DD YYYY")}
                  </td>
                  <td>$ {venta.total}</td>
                  <td>{venta.nombre}</td>
                  <td>
                  <Link to={`/venta/${venta.id}`}>                   
                  <button className="btn btn-info float-right mr-2" >Detalle</button>
                   </Link>
                  </td>
                  <td> {usuario.rol === 'admin'  ||  usuario.rol === 'propietario' ? (<button className="btn btn-danger float-right" onClick={(event) => eliminarVenta(venta.id)} >
                    <FontAwesomeIcon icon={faTrashAlt}/></button>):(<></>)} 
                    </td>
                  </tr>
                   ))}

          </tbody>
          </table>
         







                <ToastContainer draggable={false} transition={Zoom} autoClose={3000}/> 
</div>
</div>
</div>
         </>}</>
 
   
    )
    }
    

    export default Ventas

