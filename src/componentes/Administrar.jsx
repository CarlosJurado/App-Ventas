import React, {useEffect, useState, useContext} from 'react'
import {functions, db} from '../firebase'
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {UsuarioContext} from '../context/UsuarioProvider';

const Administrar = (props) => {

    const [email, setEmail] = useState('')
    const [usuarios, setUsuarios] = useState([])
    const {usuario} = useContext(UsuarioContext)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async() => {
        try {
            const res = await db.collection('usuarios').get()
            setUsuarios(res.docs.map(doc => doc.data()))
        } catch (error) {
            toast.error('Error');
        }
    }

    const administrador = (email) => {
        if(!email.trim()){
            toast.warning('Email Vacio');
            return
        }
        const agregarRol = functions.httpsCallable('agregarAdministrador');
        
        agregarRol({email: email})
            .then(res => {
                console.log(res)
                if(res.data.error){
                    toast.error('Permisos Insuficientes');
                    return
                }
                db.collection('usuarios').doc(email).update({rol: 'admin'}).then(res => {
                    toast.success('Usuario Actualizado');
                    fetchData()
                })
            })
            .catch(error => toast.error('Error'))

        setEmail('')
    }

    const eliminarAdministrador = (email) => {
        if(!email.trim()){
            toast.error('Debe rellenar todos los campos');
            return
        }
        const agregarRol = functions.httpsCallable('eliminarAdministrador');
        
        agregarRol({email: email})
            .then(res => {
                console.log(res)
                if(res.data.error){
                    return toast.error('Permisos Insuficientes');
                }
                db.collection('usuarios').doc(email).update({rol: 'normal'}).then(res => {
                    toast.success('Usuario Actualizado');
                    fetchData()
                })
            })
            .catch(error => toast.error('Error'))

        setEmail('')
    }


        const agregarPropietario = (email) => {
        if(!email.trim()){
            toast.warning('Debe rellenar todos los campos');
            return
        }
        const agregarRol = functions.httpsCallable('agregarPropietario');
        
        agregarRol({email: email})
            .then(res => {
                console.log(res)
                if(res.data.error){
                    return toast.error('Permisos Insuficientes');
                }
                db.collection('usuarios').doc(email).update({rol: 'propietario'}).then(res => {
                    toast.success('Usuario Actualizado');
                    fetchData()
                })
            })
            .catch(error => toast.error('Error'))

        setEmail('')
    }


    const agregarAvanzado = (email) => {
        if(!email.trim()){
            toast.error('Debe rellenar todos los campos');
            return
        }
        const agregarRol = functions.httpsCallable('agregarAvanzado');
        
        agregarRol({email: email})
            .then(res => {
                console.log(res)
                if(res.data.error){
                    return toast.error('Permisos Insuficientes');
                }
                db.collection('usuarios').doc(email).update({rol: 'avanzado'}).then(res => {
                    toast.success('Usuario Actualizado');
                    fetchData()
                })
            })
            .catch(error => toast.error('Error'))

        setEmail('')
    }

    const agregarUsuario = (email) => {
        if(!email.trim()){
            toast.error('Debe rellenar todos los campos');
            return
        }
        const agregarRol = functions.httpsCallable('agregarUsuario');
        
        agregarRol({email: email})
            .then(res => {
                console.log(res)
                if(res.data.error){
                    return toast.error('Permisos Insuficientes');
                }
                db.collection('usuarios').doc(email).update({rol: 'usuario'}).then(res => {
                    toast.success('Usuario Actualizado');
                    fetchData()
                })
            })
            .catch(error => toast.error('Error'))

        setEmail('')
    }
 



    const eliminarUsuario = (email) => {
        if(!email.trim()){
            toast.warning('Debe rellenar todos los campos');
            return
        }
        const agregarRol = functions.httpsCallable('eliminarUsuario');
        
        agregarRol({email: email})
            .then(res => {
                console.log(res)
                if(res.data.error){
                    return toast.error('Permisos Insuficientes');
                }
                db.collection('usuarios').doc(email).update({rol: 'normal'}).then(res => {
                    toast.success('Usuario Actualizado');
                    fetchData()
                })
            })
            .catch(error => toast.error('Error'))

        setEmail('')
    }

    return (
        <div className="content-wrapper"> 
         {(usuario.rol === 'admin' ) && <>
            <h3>Administrar Permisos</h3>
           
            {
                usuarios.map(usuario => (
                    <div key={usuario.uid} className='mb-2'>
                        {usuario.email} - Permiso: {usuario.rol}
                        {
                            usuario.rol === 'admin' ? (
                                <button className="btn btn-danger btn-sm mx-2" onClick={() => eliminarAdministrador(usuario.email)}>Eliminar Admin</button>
                            ) : (
                                <>
                                    <button className="btn btn-warning btn-sm mx-2" onClick={() => administrador(usuario.email)}>Admin</button>
                                    <button className="btn btn-info btn-sm mr-2" onClick={() => agregarPropietario(usuario.email)}>Propietario</button>
                                    <button className="btn btn-info btn-sm mr-2" onClick={() => agregarAvanzado(usuario.email)}>Avanzado</button>
                                    <button className="btn btn-secondary btn-sm mr-2" onClick={() => agregarUsuario(usuario.email)}>Usuario</button>
                                    <button className="btn btn-success btn-sm mr-2" onClick={() => eliminarUsuario(usuario.email)}>Normal</button>
                                </>
                            )
                        }
                    </div>
                ))
            }
                        <ToastContainer draggable={false} transition={Zoom} autoClose={3000}/>
         </>}  
        </div> 
    )
}

export default Administrar
