import React, {useEffect, useState, useContext} from 'react';
import {UsuarioContext} from '../context/UsuarioProvider';
import moment from 'moment';
import 'moment/locale/es';
import {Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import { isElementOfType } from 'react-dom/test-utils';





const ReporteRutas = () => {
    
    
    const {usuario} = useContext(UsuarioContext)
    
    
    const [listaR, setListaR] = useState([])    
    const [listaD, setListaD] = useState([])    
    const [rutas, setRutas] = useState([])
    const [devoluciones, setDevoluciones] = useState([])
    
    useEffect(() => {
      const obtenerDatosR = async () => {
        const dataR = await fetch(`https://cloudfunctions.net/rutas/api/rutas/`)
        const datosR = await dataR.json()
        
        setRutas(datosR)
        setListaR(datosR.listaR)
        console.log(datosR)
    }
    obtenerDatosR()
    }, [])   
   

    
    useEffect(() => {
        const obtenerDatosD = async () => {
          const dataD = await fetch(`https://cloudfunctions.net/devoluciones/api/devoluciones/`)
          const datosD = await dataD.json()
          
          setDevoluciones(datosD)
          setListaD(datosD.lista)
        }
        obtenerDatosD()
    }, []) 
    

   /*  var suma='0';  
    
    rutas.forEach(function(elemento, indice) {
        suma += elemento["ruta"];
    });
    console.log('Las rutas suman: ' + suma); */

    var obj = {};

    for(var index in rutas){
        obj[rutas[index]['fecha']] = rutas[index]['total'];
      }

      for(index in devoluciones){
        if(obj.hasOwnProperty(devoluciones[index]['fecha'])){
          obj[devoluciones[index]['fecha']] += devoluciones[index]['total'];
        }else{
          obj[devoluciones[index]['fecha']] = devoluciones[index]['total'];
        }
      }


      var result = [];
    for(var key in obj){
    result.push({fecha:key, val:obj[key]});
    }
    console.log(result);
/* 

 {rutas.map(ruta => (
            <TableRow >        
                <TableCell key={ruta.fecha, ruta.ruta}>
                {ruta.lista.map(salida => <li key={salida.fecha} 
                className="d-flex flex-column mb-1">
                <span>{`${salida.producto} - ${salida.unidades} Unid - ${salida.peso} Kg `}</span>
                </li>)}
              </TableCell>
            </TableRow>
              ))}


              



    const rutasJson = [
        {
            title:'Fecha',
            field:'fecha'
        },
        {
            title:'Ruta',
            field:'ruta'
        },
        {
            title:'Turno',
            field:'turno'
        },
        { 
            lista: [
                {
                title: 'Producto',
                field: 'producto' 
                },                           
                {
                title:'Unidades',
                field:'unidades',
                type:'numeric'
                },
                {
                title:'Peso',
                field:'peso',
                type:'numeric'
                },]},
    ]
        
 console.log(rutasJson)
         
        const devJson = [
            {
                title:'Fecha',
                field:'fecha'
            },
            {
                title:'Ruta',
                field:'ruta'
            },
            {
                title:'Turno',
                field:'turno'
            },
            { 
                lista: [
                    {
                    title: 'Producto',
                    field: 'producto' 
                    },                           
                    {
                    title:'Unidades',
                    field:'unidades',
                    type:'numeric'
                    },
                    {
                    title:'Peso',
                    field:'peso',
                    type:'numeric'
                    },]},
        ]
    

const total = {rutasJson=devolucionesJson.filter(x=>x.fecha === elemento.fecha)}
 */


    return (
        <div className="content-wrapper"> 

<Table>
        <TableHead>
          <TableRow>
            <TableCell>Fecha</TableCell>            
            <TableCell>Ruta</TableCell>
            <TableCell>Turno</TableCell>
            <TableCell>Salida</TableCell> 
            <TableCell  >Devolucion</TableCell>  
            </TableRow>
        </TableHead>


        <TableBody>
                      
             {rutas.map(ruta => (
            <TableRow >        
                <TableCell key={ruta.fecha, ruta.ruta}>
                {ruta.lista.map(salida => <li key={salida.fecha} 
                className="d-flex flex-column mb-1">
                <span>{`${salida.producto} - ${salida.unidades} Unid - ${salida.peso} Kg `}</span>
                </li>)}
              </TableCell>
            </TableRow>
              ))}

              {devoluciones.map(dev => (
            <TableRow >
              <TableCell key={dev.fecha, dev.ruta}>
              {dev.lista.map(dev => <li key={dev.fecha} 
                className="d-flex flex-column mb-1">
                <span>{`${dev.producto} - ${dev.unidades} Unid - ${dev.peso} Kg `}</span>
                </li>)}
              </TableCell>
            </TableRow>
            ))}

              
               
         
        </TableBody>
      </Table>





            
        </div>
    )
}

export default ReporteRutas
