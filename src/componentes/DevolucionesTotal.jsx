import React, {useEffect, useContext, useState} from 'react';
import {firebase, db} from '../firebase';
import {UsuarioContext} from '../context/UsuarioProvider';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment';
import 'moment/locale/es';
import {faTrashAlt} from '@fortawesome/free-solid-svg-icons';





    function DevolucionesTotal() {

    
        const {usuario} = useContext(UsuarioContext)
        const [devoluciones, setDevoluciones] = useState([])
                
        
        
        
        useEffect(() => {  
        const db = firebase.firestore();
        const verDevolucion = async () => {
            db.collection("devoluciones").orderBy("order", "desc").onSnapshot((query) => {
              const docs = [];
              query.forEach((doc) => {
                docs.push({ ...doc.data(), id: doc.id });
              });
              setDevoluciones(docs);
            });
          };   
            verDevolucion();
          }, []);         
      
          const eliminarRegistro = async (id) => {
            if (window.confirm("Borrar registro?")) {
                await db.collection("devoluciones").doc(id).delete();
                toast.warning('Registro eliminado');
              }
          };
            
    return (
        <div>
        


            <div className="content-wrapper"> 
       

       <div className="container-fluid mt-5">

       <div className="col-xs-2">
       <h3 align="center">Total Devoluciones</h3>

<>
{
   
   (usuario.rol === 'admin' || usuario.email ) && <>
   
             <table className="table table-striped">
             <thead>
         <tr>
             <th scope="col">Fecha</th>
             <th scope="col">Ruta</th>
             <th scope="col">Turno</th>
             <th scope="col">Productos</th>
                                   
         </tr>
         </thead>
         <tbody>

         {devoluciones.map(devolucion => (
                 <tr key={devolucion.id}>
                 <td>{moment(devolucion.fecha).format("MMM DD YYYY")}</td>
                 <td>{devolucion.ruta}</td> 
                 <td>{devolucion.turno}</td> 
                 <td>{devolucion.lista.map(elemento => <li key={elemento.id} className="d-flex flex-column mb-1">
                        <span>{`${elemento.producto} - ${elemento.unidades} Unid - ${elemento.peso} Kg `}</span>
                        </li>)}<b><span>Total $ {devolucion.total}</span></b></td>
                        <td>{usuario.rol === 'admin' || usuario.rol === 'propietario' ? (
                 <button className="btn btn-danger float-right" onClick={(event) => eliminarRegistro(devolucion.id)} >
                     <FontAwesomeIcon icon={faTrashAlt}/></button>) : (<></> )}
                 </td>
                 </tr>

))}
         </tbody>
         </table>
        

        
        </>
}






</>

               <ToastContainer draggable={false} transition={Zoom} autoClose={3000}/> 
</div>
</div>
</div>
        </div>
    )
}

export default DevolucionesTotal
