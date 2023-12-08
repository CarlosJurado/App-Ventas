import React, {useContext} from 'react';
import {UsuarioContext} from '../context/UsuarioProvider'
import Administrar from './Administrar';
import Venta from './Venta';



const Inicio = () => {
    const {usuario} = useContext(UsuarioContext)

    return (
        <div> 
                    {
                         usuario.rol === 'admin' && <><Administrar usuario={usuario} /></>
                    }
                    {
                        usuario.rol === 'propietario' && <><Venta /></>
                    }    
                    {
                        usuario.rol === 'avanzado' && <><Venta /></>
                    }
                    {
                        usuario.rol === 'usuario' && <><Venta /></>
                    }
                     {
                        usuario.rol === 'normal'  && <><Venta /></>
                    }
    
       
     
                </div>

        )
    }

export default Inicio;
