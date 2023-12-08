import React, {createContext, useState, useEffect} from 'react'
import {auth, firebase, db} from '../firebase'

export const UsuarioContext = createContext()

const UsuarioProvider = (props) => {

    const dataUsuarioInicial = {email: null, nombre: null, uid: null, activo: null}
    const [usuario, setUsuario] = useState(dataUsuarioInicial)

    useEffect(() => {
        detectarUsuario()
    }, [])

    const detectarUsuario = () => {
        auth.onAuthStateChanged(userChange => {
            if(userChange){
                userChange.getIdTokenResult().then(idTokenResult => {
                     
                    if (!!idTokenResult.claims.admin) {                                      
                        setUsuario({email: userChange.email, nombre: userChange.displayName, uid: userChange.uid, activo: true, rol: 'admin'})
                    } else if(!!idTokenResult.claims.propietario){                   
                        setUsuario({email: userChange.email, nombre: userChange.displayName, uid: userChange.uid, activo: true, rol: 'propietario'})
                    }else if(!!idTokenResult.claims.avanzado){                   
                        setUsuario({email: userChange.email, nombre: userChange.displayName, uid: userChange.uid, activo: true, rol: 'avanzado'})
                    }else if(!!idTokenResult.claims.usuario){                   
                        setUsuario({email: userChange.email, nombre: userChange.displayName, uid: userChange.uid, activo: true, rol: 'usuario'})
                    }else {                   
                        setUsuario({email: userChange.email, nombre: userChange.displayName, uid: userChange.uid, activo: true, rol: 'normal'})
                    }
                })
            }else{
                setUsuario({email: null, nombre: null, uid: null, activo: false, rol: null})
            }
        })
    }

  
    const iniciarSesion = async() => {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const res = await auth.signInWithPopup(provider)
            
            const existe = await db.collection('usuarios').doc(res.user.email).get()
            
            if(!existe.exists){
                await db.collection('usuarios').doc(res.user.email).set({
                    email: res.user.email,
                    nombre: res.user.displayName,
                    uid: res.user.uid,
                    rol: 'normal'
                })
            }

        } catch (error) {
            
        }
    }

    const cerrarSesion = () => {
        auth.signOut()
    }

    return (
        <UsuarioContext.Provider value={{usuario, iniciarSesion, cerrarSesion}}>
            {props.children}
        </UsuarioContext.Provider>
    )
}

export default UsuarioProvider