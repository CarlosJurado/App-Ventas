import React, {useEffect, useContext, useState} from 'react';
import {firebase, db} from '../firebase';
import {UsuarioContext} from '../context/UsuarioProvider';
import moment from 'moment';
import 'moment/locale/es';
import BodegaFormulario from './BodegaFormulario';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrashAlt} from '@fortawesome/free-solid-svg-icons';


function Bodega() {

    
    const {usuario} = useContext(UsuarioContext)
    
    const [pedidos, setPedidos] = useState([])
    const [autor, setAutor] = useState('')
    
    
    useEffect(() => {
    
    const db = firebase.firestore() 
    const verPedidos = async () => {
        db.collection("bodegas").orderBy("order", "desc").limit(6).onSnapshot((query) => {
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
            await db.collection("bodegas").doc(id).delete();
            toast.warning('Registro eliminado');
          }
      };

    return (
       <div> 
<>
{
   
   (usuario.rol === 'admin' || usuario.rol === 'propietario' || usuario.rol === 'avanzado' ) && <>

           <BodegaFormulario/>
        <div className="content-wrapper"> 
       

        <div className="container-fluid mt-5">

        <div className="col-xs-2">
        <h3>Lista de recepciones</h3>

    
    <table className="table table-striped">
              <thead>
          <tr>
          <th scope="col">Fecha</th>            
              <th scope="col">Recepción Bodega</th>   
              <th></th>
              <th></th>                         
          </tr>
          </thead>
         
      <tbody>

         {pedidos.map(pedido => (
           <tr key={pedido.id}>
                 <td>{moment(pedido.fecha).format("MMM D YYYY")}</td>                 
               
                   <td>{pedido.lista.map(elemento => <li key={elemento.id} className="d-flex flex-column mb-1">
                        <span>{`${elemento.producto} - ${elemento.unidades} Unid - ${elemento.peso} Kg `}</span>
                        </li>)}</td> 
                        <td>{pedido.nombre}</td> 

                        <td> {usuario.rol === 'admin'  ||  usuario.rol === 'propietario' ? (<button className="btn btn-danger float-right" onClick={(event) => eliminarRegistro(pedido.id)} >
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
      </>
        }
      </>
</div>
   
    )
    }
    

    export default Bodega;

