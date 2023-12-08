import React, {useEffect, useState, useContext} from 'react';
import { db, firebase } from "../firebase";
import {UsuarioContext} from '../context/UsuarioProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrashAlt} from '@fortawesome/free-solid-svg-icons'
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function ClientesLista() {
    

    const {usuario} = useContext(UsuarioContext)
    const [clientes, setClientes] = useState([])
    
    
    
    const verClientes   = async () => {
      db.collection("clientes").onSnapshot((querySnapshot) => {
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id });
        });
        setClientes(docs);
      });
    };
  
    const eliminarCliente = async (id) => {
      if (window.confirm("Borrar Cliente?")) {
        await db.collection("clientes").doc(id).delete();
        toast.warning('Cliente Eliminado');
      }
    };
  
    useEffect(() => {
      verClientes();
    }, []);       
       


    return (
      <div className="content-wrapper"> 
        
    <>
{
   
   (usuario.rol === 'admin' || usuario.rol === 'propietario' ) && <>



                <h3>Eliminar de Clientes</h3>

                <table className="table table-striped">
                        <thead>
                            <tr>
                            <th scope="col">Cliente</th>
                            <th scope="col">Dirección</th>
                            <th scope="col">Teléfono</th> 
                                                     
                      {usuario.rol === 'admin' && <><th scope="col"></th></>}</tr>
                        </thead>
                        
                        <tbody>

                        {clientes.map((item) =>  {
                          return (
                            <tr key={item.id}>
                          <td>{item.cliente}</td>
                          <td>{item.direccion}</td>
                          <td>{item.telefono}</td>    
                                       
                          <td>  
                        {( usuario.rol === 'admin' || usuario.rol === 'propietario' ) && <><button className="btn btn-danger float-right" onClick={() => eliminarCliente(item.id)}><FontAwesomeIcon icon={faTrashAlt}/>
                        </button></>}
                        </td>
                        </tr>                        
                        );
                      })}
                        </tbody>
                </table>
                <ToastContainer draggable={false} transition={Zoom} autoClose={3000}/> 
          
            </>
          } </>
       </div>
    )
  }
    

    export default ClientesLista

