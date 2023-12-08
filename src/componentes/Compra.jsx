import React, {useEffect, useContext, useState} from 'react';
import {firebase} from '../firebase';
import {UsuarioContext} from '../context/UsuarioProvider';
import { ToastContainer,Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import 'moment/locale/es'
import ComprasFormulario from './ComprasFormulario';




    function Compra() {

    
        const {usuario} = useContext(UsuarioContext)
        const [compras, setCompras] = useState([])
        
        
        useEffect(() => {
        
        const db = firebase.firestore() 
        const verCompras = async () => {
            db.collection("compras").orderBy("fecha", "desc").limit(6).onSnapshot((query) => {
              const docs = [];
              query.forEach((doc) => {
                docs.push({ ...doc.data(), id: doc.id });
              });
              setCompras(docs);
            });
          };   
       
            verCompras();
          }, []);         
          


    return (
        <div>
            <ComprasFormulario/>


            <div className="content-wrapper"> 
       

       <div className="container-fluid mt-5">

       <div className="col-xs-2">
       <h3>Compras</h3>

<>
{
   
   (usuario.rol === 'admin' || usuario.rol === 'propietario' ) && <>
   
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
                 <td>{moment(compra.fecha).format("MMM D YYYY")}</td>
                 <td>{compra.lista.map(elemento => <li key={elemento.id} className="d-flex flex-column mb-1">
                        <span>{`${elemento.producto} - ${elemento.unidades} Unid - ${elemento.peso} Kg `}</span>
                        </li>)}<b><span>Total $ {compra.total}</span></b></td>
                 
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

export default Compra
