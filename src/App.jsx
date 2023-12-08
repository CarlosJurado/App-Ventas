import React, {useContext} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {UsuarioContext} from './context/UsuarioProvider';

import Navbar from './componentes/Navbar';
import Sidebar from './componentes/Sidebar';
import Footer from './componentes/Footer';

import Administrar from './componentes/Administrar';
import Inicio from './componentes/Inicio';
import Clientes from './componentes/Clientes';
import Pedidos from './componentes/Pedidos'
import Venta from './componentes/Venta';
import Ventas from './componentes/Ventas';
import Compra from './componentes/Compra'
import Compras from './componentes/Compras'
import Imprimir from './componentes/Imprimir';
import DescuentoImprimir from './componentes/DescuentoImprimir';
import Ruta from './componentes/Ruta';
import Rutas from './componentes/Rutas';
import Pedido from './componentes/Pedido';
import Devoluciones from './componentes/Devoluciones';
import DevolucionesTotal from './componentes/DevolucionesTotal';
import ReporteCyV from './componentes/ReporteCyV';
import ReporteRutas from './componentes/ReporteRutas'
import ClientesTodos from './componentes/ClientesTodos';
import ClientesLista from './componentes/ClientesLista';
import Bodega from './componentes/Bodega';
import Reportes from './componentes/Reportes';
import Reporte from './componentes/Reporte';
import ReporteVentas from './componentes/ReporteVentas';
import Inventario from './componentes/Inventario';
import Descuento from './componentes/Descuento';






const App = () => {
  const {usuario} = useContext(UsuarioContext)


    return (
      
      
          <>
              <Router>
               <Sidebar/>

               <Navbar />
                <div className="container my-4 .col-xs-12 .col-sm-6 .col-lg-8"> 
              <Switch>
                  <Route path="/venta/:id">                    
                  <Imprimir/>
                  </Route>
                  <Route path="/descuento/:id">                    
                  <DescuentoImprimir/>
                  </Route>
                  
                  <Route component={Venta} path="/venta"/>
                  <Route component={Ventas} path="/ventas" exact/>

                  <Route component={Descuento} path="/descuento"/>
                                    
                  <Route component={Reportes} path="/reportes"/>
                  <Route component={Reporte} path="/reporte"/>
                  <Route component={Inventario} path="/inventario"/>
                  <Route component={ReporteVentas} path="/reporteventas"/>


                  <Route component={Pedido} path="/pedido"/>
                  <Route component={Pedidos} path="/pedidos" exact/>

                  <Route component={Clientes} path="/clientes" exact/>

                  <Route component={Bodega} path="/bodega" exact/>
                  
                  <Route component={Ruta} path="/ruta"/>
                  <Route component={Rutas} path="/rutas"/>
                  <Route component={ReporteRutas} path="/reporterutas" exact/>

                  <Route component={Devoluciones} path="/devolucion"/>
                  <Route component={DevolucionesTotal} path="/devoluciones"/>
                                    
                  <Route component={Compra} path="/compra" exact />   
                  <Route component={Compras} path="/compras" exact />   
                  <Route component={ClientesTodos} path="/listaclientes"/>
                  <Route component={ClientesLista} path="/clientesborrar"/>
                  <Route component={ReporteCyV} path="/reportecyv" exact/>

                  <Route component={Administrar} path="/administrar" exact/>                  
                  <Route component={Inicio} path="/" exact/>
                
              </Switch>
                </div> 
                </Router>
                 <Footer />
    </>
  
      );
  }
  
  export default App;
  