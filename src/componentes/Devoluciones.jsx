import React, {useEffect, useContext, useState} from 'react';
import {firebase} from '../firebase';
import {UsuarioContext} from '../context/UsuarioProvider';
import { ToastContainer,Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import 'moment/locale/es'
import DevolucionesFormulario from './DevolucionesFormulario';




    function Devoluciones() {

    
        const {usuario} = useContext(UsuarioContext)
        const [devoluciones, setDevoluciones] = useState([])
        
        
        useEffect(() => {
        
        const db = firebase.firestore() 
        const verDevolucion = async () => {
            db.collection("devoluciones").orderBy("fecha", "desc").limit(6).onSnapshot((query) => {
              const docs = [];
              query.forEach((doc) => {
                docs.push({ ...doc.data(), id: doc.id });
              });
              setDevoluciones(docs);
            });
          };   
       
          verDevolucion();
          }, []);         
          


    return (
        <div>
            <DevolucionesFormulario/>


            <div className="content-wrapper"> 
       

       <div className="container-fluid mt-5">

       <div className="col-xs-2">
       <h3 align="center">Devoluciones</h3>

<>
{
   
   (usuario.rol === 'admin' || usuario.email ) && <>
   
             <table className="table table-striped">
             <thead>
         <tr>
             <th scope="col">Fecha</th>
             <th scope="col">Ruta</th>
             <th scope="col">Turno</th>
             <th scope="col">Devoluciones</th>
                                   
         </tr>
         </thead>
         <tbody>

         {devoluciones.map(devolucion => (
                 <tr key={devolucion.id}>
                 <td>{moment(devolucion.fecha).format("MMM D YYYY")}</td>
                 <td>{devolucion.ruta}</td> 
                 <td>{devolucion.turno}</td> 
                 <td>{devolucion.lista.map(elemento => <li key={elemento.id} className="d-flex flex-column mb-1">
                        <span>{`${elemento.producto} - ${elemento.unidades} Unid - ${elemento.peso} Kg `}</span>
                        </li>)}<b><span>Total $ {devolucion.total}</span></b></td>
                 
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

export default Devoluciones;
