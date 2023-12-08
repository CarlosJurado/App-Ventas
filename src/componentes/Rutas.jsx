import React, {useEffect, useContext, useState} from 'react';
import {firebase, db} from '../firebase';
import {UsuarioContext} from '../context/UsuarioProvider';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment';
import 'moment/locale/es';
import {faTrashAlt} from '@fortawesome/free-solid-svg-icons';





    function Rutas() {

    
        const {usuario} = useContext(UsuarioContext)
        const [rutas, setRutas] = useState([])
        
        
        
        
        useEffect(() => {  
        const db = firebase.firestore() 
        const verRutas = async () => {
            db.collection("rutas").orderBy("fecha", "desc").limit(60).onSnapshot((query) => {
              const docs = [];
              query.forEach((doc) => {
                docs.push({ ...doc.data(), id: doc.id });
              });
              setRutas(docs);
            });
          };   
            verRutas();
          }, []);         
         
          const eliminarRegistro = async (id) => {
            if (window.confirm("Borrar registro?")) {
                await db.collection("rutas").doc(id).delete();
                toast.warning('Registro eliminado');
              }
          };
            
    return (
        
        

      
        <>
          {   
         (usuario.rol === 'admin' || usuario.rol === 'propietario'  ) && <>

            <div className="content-wrapper"> 
       
       <div className="container-fluid mt-5">

       <div className="col-xs-2">
       <h3 align="center">Rutas</h3>

   
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

         {rutas.map(ruta => (
                 <tr key={ruta.id}>
                 <td>{moment(ruta.fecha).format("MMM D YYYY")}</td>
                 <td>{ruta.ruta}</td> 
                 <td>{ruta.turno}</td> 
                 <td>{ruta.lista.map(elemento => <li key={elemento.id} className="d-flex flex-column mb-1">
                        <span>{`${elemento.producto} - ${elemento.unidades} Unid - ${elemento.peso} Kg `}</span>
                        </li>)}<b><span>Total $ {ruta.total}</span></b></td>
                 <td>{usuario.rol === 'admin' || usuario.rol === 'propietario' ? (
                 <button className="btn btn-danger float-right" onClick={(event) => eliminarRegistro(ruta.id)} >
                     <FontAwesomeIcon icon={faTrashAlt}/></button>) : (<></> )}
                 </td>
                 </tr>

))}
         </tbody>
         </table>
        

        

               <ToastContainer draggable={false} transition={Zoom} autoClose={3000}/> 
</div>
</div>
</div>
</>
}
</>
        
    )
}

export default Rutas
