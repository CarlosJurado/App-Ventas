import React, {useEffect, useContext, useState} from 'react';
import {firebase, db} from '../firebase';
import {UsuarioContext} from '../context/UsuarioProvider';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment';
import 'moment/locale/es';
import {faTrashAlt} from '@fortawesome/free-solid-svg-icons';





    function Compras() {

    
        const {usuario} = useContext(UsuarioContext)
        const [compras, setCompras] = useState([])
                
        
        
        
        useEffect(() => {  
        const db = firebase.firestore();
        const verCompras = async () => {
            db.collection("compras").orderBy("order", "desc").limit(60).onSnapshot((query) => {
              const docs = [];
              query.forEach((doc) => {
                docs.push({ ...doc.data(), id: doc.id });
              });
              setCompras(docs);
            });
          };   
            verCompras();
          }, []);         
      
          const eliminarRegistro = async (id) => {
            if (window.confirm("Borrar registro?")) {
                await db.collection("compras").doc(id).delete();
                toast.warning('Registro eliminado');
              }
          };
            
    return (
        <div>
        

<>
{
   
   (usuario.rol === 'admin' || usuario.rol === 'propietario' ) && <>
   

            <div className="content-wrapper"> 
       

       <div className="container-fluid mt-5">

       <div className="col-xs-2">
       <h3 align=""center>Total Compras</h3>

             <table className="table">
             <thead>
         <tr>
             
             <th scope="col">Fecha</th>
             <th scope="col">Productos</th>
                                   
         </tr>
         </thead>
         <tbody>

         {compras.map(compra => (
                 <tr key={compra.id}>
                 <td>{moment(compra.fecha).format("MMM DD YYYY")}</td>
                 <td>{compra.lista.map(elemento => <li key={elemento.id} className="d-flex flex-column mb-1">
                        <span>{`${elemento.producto} - ${elemento.unidades} Unid - ${elemento.peso} Kg `}</span>
                        </li>)}<b><span>Total $ {compra.total}</span></b></td>
                        <td>{usuario.rol === 'admin' || usuario.rol === 'propietario' ? (
                 <button className="btn btn-danger float-right" onClick={(event) => eliminarRegistro(compra.id)} >
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
</div>
    )
}

export default Compras
