import React, {useEffect, useContext, useState} from 'react';
import {firebase} from '../firebase';
import {UsuarioContext} from '../context/UsuarioProvider';
import { ToastContainer,Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import 'moment/locale/es'
import VentasFormulario from './VentasFormulario';
import {Link} from 'react-router-dom';


const Venta = (props) => {

    
    const {usuario} = useContext(UsuarioContext)
    const [ventas, setVentas] = useState([])
    const [autor, setAutor] = useState('')
    const [venta, setventa] = useState('')
 
    
    useEffect(() => {
    
    const db = firebase.firestore() 
    const verVentas = async () => {
        db.collection("ventas").orderBy("order", "desc").limit(6).onSnapshot((query) => {
          const docs = [];
          query.forEach((doc) => {
            docs.push({ ...doc.data(), id: doc.id });
          });
          setVentas(docs);
        });
      };   
   
        verVentas();
      }, []);         
      


    
    return (
       <div> 

<>
{
   
   (usuario.rol === 'admin' || usuario.rol === 'propietario' || usuario.rol === 'avanzado'  || usuario.rol === 'usuario' ) && <> 
           <VentasFormulario/>
          
        <div className="content-wrapper"> 
       
        

        <div className="container-fluid mt-5">

        <div className="col-xs-2">
        <h3>Lista de ventas</h3>

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
  
      {ventas.map(venta => (
                
        <tr key={venta.id}>
           <td>
           {venta.cliente}           
          </td> 
          <td>
          {moment(venta.fecha).format("MMM DD YYYY")}
          </td>
          <td>$ {venta.total}</td>          
          <td>
          <Link to={`/venta/${venta.id}`}>                   
          <button className="btn btn-info float-right mr-2" >Detalle</button>
           </Link>
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
    

    export default Venta

