import React, {useEffect, useContext, useState} from 'react';
import {firebase, db} from '../firebase';
import {UsuarioContext} from '../context/UsuarioProvider';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import 'moment/locale/es'
import DescuentoFormulario from './DescuentoFormulario';
import {Link} from 'react-router-dom';
import {faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



const Descuento = (props) => {

    
    const {usuario} = useContext(UsuarioContext)
    const [descuentos, setDescuentos] = useState([])
    const [autor, setAutor] = useState('')
    const [descuento, setDescuento] = useState('')
 
    
    useEffect(() => {
    
    const db = firebase.firestore() 
    const verDescuentos = async () => {
        db.collection("descuentos").orderBy("order", "desc").limit(6).onSnapshot((query) => {
          const docs = [];
          query.forEach((doc) => {
            docs.push({ ...doc.data(), id: doc.id });
          });
          setDescuentos(docs);
        });
      };   
   
        verDescuentos();
      }, []);         
    
      
      const eliminarDescuento = async (id) => {
        if (window.confirm("Borrar Descuento?")) {
          await db.collection("descuentos").doc(id).delete();
          toast.warning('Descuento eliminado');
        }
      };  

    
    return (
       <div> 

<>
{
   
   (usuario.rol === 'admin' || usuario.rol === 'propietario' || usuario.rol === 'avanzado'  || usuario.rol === 'usuario' ) && <> 
           <DescuentoFormulario/>
          
        <div className="content-wrapper"> 
       
        

        <div className="container-fluid mt-5">

        <div className="col-xs-2">
        <h3>Lista de Descuentos</h3>

      <table className="table table-striped">
      <thead>
  <tr>
      <th scope="col">Cliente</th>
      <th scope="col">Fecha</th>
      <th scope="col">Total</th>
      <th scope="col"></th>                        
  </tr>
  </thead>
 

      <tbody>
  
      {descuentos.map(descuento => (
                
        <tr key={descuento.id}>
           <td>
           {descuento.cliente}           
          </td> 
          <td>
          {moment(descuento.fecha).format("MMM DD YYYY")}
          </td>
          <td>$ {descuento.total}</td>          
          <td>
          <Link to={`/descuento/${descuento.id}`}>                   
          <button className="btn btn-info float-right mr-2" >Detalle</button>
           </Link>
          </td>
          <td> {usuario.rol === 'admin'  ||  usuario.rol === 'propietario' ? (<button className="btn btn-danger float-right" onClick={(event) => eliminarDescuento(descuento.id)} >
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
    

    export default Descuento

