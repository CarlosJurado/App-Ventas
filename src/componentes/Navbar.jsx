import React, {useContext} from 'react';
import {UsuarioContext} from '../context/UsuarioProvider';

export default function Navbar() {
    const {usuario, cerrarSesion, iniciarSesion} = useContext(UsuarioContext)

    return (

<div className="wrapper">
        <nav className="main-header navbar navbar-expand navbar-white navbar-light sidebar-collapse sidebar-mini">
        
        <ul className="navbar-nav">
            <li className="nav-item">
            <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
            </li>
        
        </ul>
 
        <ul className="navbar-nav ml-auto">
                <div >
                            {
                                usuario.email ? (
                                    <button className="btn btn-dark" onClick={cerrarSesion}>Salir</button>
                                ) : (
                                    <button className="btn btn-dark" onClick={iniciarSesion}>Ingresar</button>
                                )
                            }
                </div>
        </ul>
</nav>
</div>

        
    )
}
