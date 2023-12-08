import React, {useEffect, useState, useContext} from 'react';
import { db, firebase } from "../firebase";
import {UsuarioContext} from '../context/UsuarioProvider';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrashAlt} from '@fortawesome/free-solid-svg-icons'


function Clientes() {

    

    const {usuario} = useContext(UsuarioContext)
    const [clientes, setClientes] = useState([])
    const [cliente, setCliente] = useState('')
    
    const [nombre, setNombre] = useState('')
    const [direccion, setDireccion] = useState('')
    const [telefono, setTelefono] = useState('')        
    const [autor, setAutor] = useState('')

    
    const verClientes = async () => {
      db.collection("clientes").orderBy("fecha", "desc").limit(5).onSnapshot((querySnapshot) => {
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
    
       


    const agregarCliente = async (e) => {
        e.preventDefault()     
        if(!cliente.trim() || !direccion.trim() || !telefono.trim()){
            toast.error('Debe rellenar todos los campos');
            return
        }
        try {
            const db = firebase.firestore()           
            const nuevoCliente = {                
                cliente: cliente,
                direccion: direccion,
                telefono: telefono,
                autor: db.collection('usuarios').doc(usuario.nombre),
                nombre: usuario.nombre,
                fecha: Date.now(),
                uid: usuario.uid
            }

            const data = await db.collection('clientes').add(nuevoCliente)

            setClientes([
                ...clientes,
                {id: data.id, ...nuevoCliente}
            ])

            
            setCliente('')
            setDireccion('')
            setTelefono('')


        } catch (error) {
            toast.error('No se pudo guardar')            
        }
        toast.success('Cliente Guardado')
    }







    return (
      <div className="content-wrapper"> 
    
    
    <>
{
   
   (usuario.rol === 'admin' || usuario.rol === 'propietario' || usuario.rol === 'avanzado'  || usuario.rol === 'usuario' ) && <>




            <div className="row">
               <div className="col-md-12">
               <h3 align="center">Agregar Cliente</h3>

               <form onSubmit={agregarCliente}>
                        
                        <input 
                            type="text" 
                            placeholder='Cliente' 
                            className='form-control mb-2' 
                            onChange={e => setCliente(e.target.value)}
                            value={cliente}
                        />
                        <input 
                            type="text" 
                            placeholder='Dirección' 
                            className='form-control mb-2' 
                            onChange={e => setDireccion(e.target.value)}
                            value={direccion}
                        />
                        <input 
                            type="number" 
                            placeholder='Teléfono' 
                            className='form-control mb-2' 
                            onChange={e => setTelefono(e.target.value)}
                            value={telefono}
                        />
                        <button className='btn btn-primary btn-block' type='submit'>
                            Guardar Cliente                            
                        </button>
                    </form>
                </div> 
                </div> 


                <h3>Lista de Clientes</h3>

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
                        {usuario.rol === 'admin' && <><button className="btn btn-danger float-right" onClick={() => eliminarCliente(item.id)}><FontAwesomeIcon icon={faTrashAlt}/>
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
    

    export default Clientes

