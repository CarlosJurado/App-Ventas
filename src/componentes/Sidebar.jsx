import React from 'react';
import {UsuarioContext} from '../context/UsuarioProvider';

export default function Sidebar() {
    const {usuario} = React.useContext(UsuarioContext)
    return (
      



  <aside className="main-sidebar toggled sidebar-dark-primary elevation-4 hold-transition sidebar-mini">
  
  <a href="/" className="brand-link">
    <img src="/dist/img/logoApp.png" alt="App de Ventas" className="brand-image img-circle elevation-3" style={{opacity: '.8'}} />
    <span className="brand-text font-weight-light">Ventas</span>
  </a>

  <div className="sidebar toggled">
    <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image"><i className="nav-icon fas fa-user-circle fa-2x" /></div>
            <div className="info">
               <a href="/">
                    {
                        usuario.email ? usuario.nombre : <h5>App de Ventas</h5>  
                    }
                </a>
            </div>
    </div>
   
    <nav className="mt-2">
    
    {usuario.email ? (
    
      <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="true">
        

       <a href="/venta" className="nav-link active mb-2">
        <li className="nav-item has-treeview menu-open">
            <i className="nav-icon fas fa-dollar-sign" />
            <p>&nbsp; Venta</p>
        </li>
          </a>

          <a href="/descuento" className="nav-link active mb-2"> 
             <li className="nav-item has-treeview menu-open">
                <i className="nav-icon fas fa-user-alt" />
                <p>&nbsp; Descuento</p>          
            </li>
        </a>


          <a href="/pedido" className="nav-link active mb-2">
        <li className="nav-item has-treeview menu-open">
        <i className="nav-icon far fa-calendar-alt" />
            <p>&nbsp; Pedido</p>
        </li>
        </a>

        <a href="/clientes" className="nav-link active mb-2"> 
             <li className="nav-item has-treeview menu-open">
                <i className="nav-icon fas fa-user-alt" />
                <p>&nbsp; Clientes</p>          
            </li>
        </a>

     
       
             
       
        
        {usuario.rol === 'admin' || usuario.rol === 'propietario' || usuario.rol === 'avanzado' ? (
          <>
          <li className="nav-header">Control</li>


    

        <a href="/ruta" className="nav-link mb-2">
        <li className="nav-item mb-2">        
            <i className="nav-icon far fa-circle text-danger" />
            <p className="text">&nbsp; Ruta</p>        
        </li>
        </a>
       
        <a href="/devolucion" className="nav-link mb-2">
        <li className="nav-item mb-2">        
            <i className="nav-icon far fa-circle text-info" />
            <p className="text">&nbsp; Devolucion Ruta</p>        
        </li>
        </a>

        <a href="/bodega" className="nav-link mb-2">
            <li className="nav-item mb-2">      
            <i className="nav-icon far fa-circle text-warning" />
            <p>&nbsp; Recepción Bodega</p>
            </li>
          </a>

        </>
       ) : (<></>)}
        {usuario.rol === 'admin' || usuario.rol === 'propietario' ? (
          <>
 <li className="nav-header">Administración</li>

        <a href="/reportes" className="nav-link active mb-2">
        <li className="nav-item mb-2">          
            <i className="nav-icon far fa-circle text-info" />
            <p>&nbsp; Reportes</p>          
        </li>
        </a>

        <a href="/inventario" className="nav-link active mb-2" >
        <li className="nav-item mb-2">          
            <i className="nav-icon far fa-circle text-success" />
            <p>&nbsp; Inventario</p>          
        </li>
        </a>


        <a href="/rutas" className="nav-link mb-2">
        <li className="nav-item mb-2">          
            <i className="nav-icon far fa-circle text-warning" />
            <p>&nbsp; Todas las rutas</p>          
        </li>
        </a>
        
        <a href="/devoluciones" className="nav-link mb-2">
        <li className="nav-item mb-2">          
            <i className="nav-icon far fa-circle text-danger" />
            <p>&nbsp; Todas las devoluciones</p>          
        </li>
        </a>

        <a href="/compra" className="nav-link mb-2">
        <li className="nav-item has-treeview menu-open">         
            <i className="nav-icon fas fa-handshake" />
            <p>&nbsp; Agregar Compra</p>          
        </li>
        </a>       
        
        <a href="/compras" className="nav-link active mb-2">
        <li className="nav-item has-treeview menu-open">         
            <i className="nav-icon fas fa-handshake" />
            <p>&nbsp; Todas las Compras</p>          
        </li>
        </a>  
        <a href="/ventas" className="nav-link mb-2">
        <li className="nav-item mb-2">        
            <i className="nav-icon far fa-circle text-info" />
            <p className="text">&nbsp; Borrar Venta</p>        
        </li>
        </a>

        <a href="/clientesborrar" className="nav-link mb-2">
        <li className="nav-item mb-2">          
            <i className="nav-icon far fa-circle text-danger" />
            <p>&nbsp; Borrar Cliente</p>          
        </li>
        </a>
        <a href="/listaclientes" className="nav-link mb-2">
        <li className="nav-item mb-2">          
            <i className="nav-icon far fa-circle text-warning" />
            <p>&nbsp; Directorio de Clientes</p>          
        </li>
        </a>
        </>
       ) : (<></>)}
        
      </ul>
      
     ) : (<></> )}
    </nav>
  </div>

</aside>



    )
}
