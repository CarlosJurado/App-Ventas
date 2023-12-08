import React, {useEffect, useContext, useState} from 'react';
import {firebase, db} from '../firebase';
import {UsuarioContext} from '../context/UsuarioProvider';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment';
import 'moment/locale/es';
import {faTrashAlt} from '@fortawesome/free-solid-svg-icons';




    function Pedidos() {

    
        const {usuario} = useContext(UsuarioContext)
        const [pedidos, setPedidos] = useState([])
        
        
    
        
        useEffect(() => {  
        const db = firebase.firestore() 
        const verPedidos = async () => {
            db.collection("pedidos").orderBy("order", "desc").onSnapshot((query) => {
              const docs = [];
              query.forEach((doc) => {
                docs.push({ ...doc.data(), id: doc.id });
              });
              setPedidos(docs);
            });
          };   
            verPedidos();
          }, []);         
         
          const eliminarRegistro = async (id) => {
            if (window.confirm("Borrar registro?")) {
                await db.collection("pedidos").doc(id).delete();
                toast.warning('Registro eliminado');
              }
          };
            

      

    return (
        <div>
        


            <div className="content-wrapper"> 
       

       <div className="container-fluid mt-5">

       <div className="col-xs-2">
       <h3 align ="center">Pedidos</h3>

<>
{
   
   (usuario.rol === 'admin' || usuario.email ) && <>
   
             <table className="table table-striped">
             <thead>
         <tr>
             <th scope="col">Fecha</th>
             <th scope="col">Cliente</th>
             <th scope="col">Pedido</th>
             <th scope="col">Vendedor</th>
                                   
         </tr>
         </thead>
         <tbody>
         {pedidos.map(pedido => (
          <tr key={pedido.id}>
          <td>{moment(pedido.fecha).format("MMM D YYYY")}</td>
          <td>{pedido.cliente}</td> 

          <td>{pedido.lista.map(elemento => <li key={elemento.id} className="d-flex flex-column mb-1">
                        <span>{`${elemento.producto} - ${elemento.unidades} Unid - ${elemento.peso} Kg `}</span>
                        </li>)}<b><span>Total $ {pedido.total}</span></b></td>

                <td>{pedido.nombre}</td> 
                 <td>{usuario.rol === 'admin' || usuario.rol === 'propietario' ? (
                                <button className="btn btn-danger float-right" onClick={(event) => eliminarRegistro(pedido.id)} >
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

export default Pedidos
