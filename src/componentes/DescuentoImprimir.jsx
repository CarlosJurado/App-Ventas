import React, {useEffect, useState, useContext} from 'react';
import {UsuarioContext} from '../context/UsuarioProvider';
import moment from 'moment';
import 'moment/locale/es';
import { useParams } from 'react-router-dom';



const DescuentoImprimir = () => {

    
  const {id} = useParams()
  const {usuario} = useContext(UsuarioContext)
  const [descuento, setDescuento] = useState({})
  const [lista, setLista] = useState([])

  useEffect(() => {
    const obtenerDatos = async () => {
      const data = await fetch(`https://cloudfunctions.net/descuento/api/descuento/${id}`)
      const datos = await data.json()
      
      setDescuento(datos)
      setLista(datos.lista)
  }
    obtenerDatos()
  }, [id])


 function printData() {
  var style = '<style>';  
  style = style + 'table {width: 100%; font: 30px Hind;}';
  style = style + 'table, th, td {border: 0px ; border-collapse: collapse;';
  style = style + "padding: 6px}";
  style = style + '</style>';
  var newWindow
 const divToPrint=document.getElementById('printMe');
 newWindow = window.open('','Print-Window');
 newWindow.document.open();      
 newWindow.document.write(style);
 newWindow.document.write('<html><body onload="window.print()">'+divToPrint.innerHTML+'</body></html>');
 newWindow.print(); 
}

  return (
    <div className="content-wrapper"> 
                   <>
{ usuario.email  ? (    <>

          <div id="printMe" >
  
 

    
        <table className="table">

        <thead className="text-center">
        
        <tr><td align="center" colspan="5"><h2>DESCUENTO</h2></td></tr>
        <tr><td align="center" colspan="5"><b>COMERCIALIZADORA</b></td></tr>
        <tr><td align="center" colspan="5">Regimen Común</td></tr>
        <tr><td align="center" colspan="5">NIT 90909090-1</td></tr>
        <tr><td align="center" colspan="5">CRA 10 BIS # 10 A - 28</td></tr>
        <tr><td align="center" colspan="5">Telefonos</td></tr>
        <tr><td align="center" colspan="5"></td></tr>
        <tr><td align="center" colspan="5">311 555 9999 - 311 777 0000</td></tr>        
        <tr><td align="center" colspan="5"></td></tr>
        <tr><td align="center" colspan="5">Cliente: <b>{descuento.cliente}</b></td></tr>
        <tr><td align="center" colspan="5"></td></tr>        
        <tr><td align="center" colspan="5">{moment(descuento.fecha).format('LL')}</td></tr>
        <tr><td align="center" colspan="5">Vendedor: {descuento.nombre}</td></tr>
        <tr><td align="center" colspan="5"></td></tr>
        <tr><td align="center" colspan="5"></td></tr>        
          
          <tr>
            <th align="center" colspan="1">Cant</th>
            <th align="center" colspan="1">Producto</th>
            <th align="center" colspan="1">Peso</th>
            <th align="center" colspan="1">Precio</th>
            <th align="center" colspan="1">Subtotal</th>
          </tr>
        </thead>
        <tbody> 
        {
                lista.map(item => ( 

        <>  <tr key={item.id}>
            <td  align="center" colspan="1">{item.unidades}</td>
            <td  align="left" colspan="1">{item.producto}</td>
            <td align="center" colspan="1">{item.peso} Kg</td>
            <td align="center" colspan="1">$ {item.precio}</td>
            <td align="center" colspan="1">$ {item.subtotal}</td>
          </tr>


        </>


          ))}  
   
        </tbody>
<th></th>
<th></th>

<th align="center" colspan="4">TOTAL: $ {descuento.total}</th>
<th></th>
    
      </table>
      <br/>      
<div align="center" colspan="4"><h2>DESCUENTO</h2></div>

<br/>
<br/>
<br/>
<br/>
</div>

<button onClick={() => printData()} className="btn btn-success float-right" ><i class="fas fa-print"/>Imprimir</button>
  
  </>) : (
    <></>
  )}
       



</>

</div>

  )
}

export default DescuentoImprimir
