import React, { Component } from "react";
import * as firebase from "firebase";
import { UsuarioContext } from "../context/UsuarioProvider";
import "moment/locale/es";
import { ToastContainer, toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const db = firebase.firestore();

class DevolucionesFormulario extends Component {
  static contextType = UsuarioContext;

  constructor(props) {
    super(props);

    this.state = {
      ruta: "",
      turno:'',     
      fecha: "",
      lista: [],
      producto: "",
      unidades: "",
      peso: "",
      precio: "",
      subtotal: "unidades",
      total: 0,
      order: Date.now(),
    };

   
  }

  updateState(obj) {
    const newState = { ...this.state, ...obj };

    newState.total = newState.lista.reduce(
      (valor, elemento) => valor + elemento.subtotal,
      0
    );

    this.setState(newState);
  }

  handleFecha = (event) => {
    this.updateState({ fecha: event.target.value });
  };

  handleRuta = (event) => {
    this.updateState({ ruta: event.target.value });
  };
  
  handleTurno = (event) => {
    this.updateState({ turno: event.target.value });
  };


  handleProducto = (event) => {
    this.updateState({ producto: event.target.value });
  };

  handleUnidades = (event) => {
    this.updateState({ unidades: event.target.value });
  };

  handlePeso = (event) => {
    this.updateState({ peso: event.target.value });
  };

  handlePrecio = (event) => {
    this.updateState({ precio: event.target.value });
  };

  handleSubtotal = (event) => {
    this.updateState({ subtotal: event.target.value });
  };

  handleAgregarProducto = (event) => {
    event.preventDefault();

    const {
      lista,
      producto,
      unidades,
      peso,
      precio,
      subtotal: tmpSubtotal,
    } = this.state;

    const productoTrim = producto.trim();
    const unidadesTrim = unidades.trim();
    const pesoTrim = peso.trim();
    const precioTrim = precio.trim();

    if (!productoTrim) return toast.error("Por favor elige un producto.");
    if (!unidadesTrim) return toast.error("Rellena el campo unidades.");
    if (!pesoTrim) return toast.error("Ingresa el peso.");
    if (!precioTrim) return toast.error("Ingresa el precio.");

    const subtotal =
      tmpSubtotal === "unidades"
        ? Number.parseInt(unidadesTrim) * Number.parseFloat(precioTrim)
        : Number.parseFloat(pesoTrim) * Number.parseFloat(precioTrim);

    this.updateState({
      lista: [
        ...lista,
        {
          producto: productoTrim,
          unidades: unidadesTrim,
          peso: pesoTrim,
          precio: precioTrim,
          subtotal,
        },
      ],
      producto: "",
      unidades: "",
      peso: "",
      precio: "",
      subtotal: "unidades",
    });
  };

  handleEliminarProducto = (event, index) => {
    event.preventDefault();

    const { lista } = this.state;

    this.updateState({
      lista: lista.filter((_, i) => i !== index),
    });
  };

  handleGuardar = async (e) => {
    e.preventDefault();

    const { ruta, turno, fecha, lista } = this.state;
    const { usuario } = this.context;

    const rutaTrim = ruta.trim();
    const turnoTrim = turno.trim();
    const fechaTrim = fecha.trim();

    if (!rutaTrim) return toast.error("Elige una ruta.");
    if (!turnoTrim) return toast.error("Ingresa un turno.");
    if (!fechaTrim) return toast.error("Ingresa una fecha.");
    if (lista.length === 0)
      return toast.error("Agrega un producto a la lista.");

    const total = lista.reduce(
      (valor, elemento) => valor + elemento.subtotal,
      0
    );

    const devolucion = {
      fecha: fechaTrim,
      ruta: rutaTrim,
      turno: turnoTrim,
      lista,
      total,
      uid: usuario.uid,
      nombre: usuario.nombre,
      order: Date.now(),
      autor: db.collection("usuarios").doc(usuario.nombre),
    };

    try {
      await db.collection("devoluciones").add(devolucion);

      this.updateState({
        ruta: "",
        turno: '',
        fecha: "",
        lista: [],
        producto: "",
        unidades: "",
        peso: "",
        precio: "",
        subtotal: "unidades",
        order: Date.now(),
      });

      toast.success("Devolucion guardada.");
    } catch (error) {
      return toast.error("Error al guardar.");
    }
  };

  render() {
    const {     
      fecha,
      ruta,
      turno,
      lista,
      producto,
      unidades,
      peso,
      precio,
      subtotal,
      total,
    } = this.state;

    return (
      <div className="content-wrapper">
        <h3 align="center">Agregar devolucion</h3>

        <form>

        <label>Fecha</label>
        <input
            onChange={this.handleFecha}
            value={fecha}
            placeholder ="Fecha" 
            className="form-control mb-2"
            type="date"
          ></input>
         

       
         <select
            onChange={this.handleRuta}
            value={ruta}
            variant="outlined"
            className="form-control my-2"
          >
            <option value="">Seleccione una ruta</option>            
            <option value="1">Ruta 1</option>
            <option value="2">Ruta 2</option>           
            <option value="2">Ruta 3</option>
          </select>
        
          <select
            onChange={this.handleTurno}
            value={turno}
            variant="outlined"
            className="form-control my-2"
          >
            <option value="">Seleccione un turno</option>            
            <option value="AM">Mañana</option>
            <option value="PM">Tarde</option>           
            
          </select>

     
          <h4>Productos</h4>

          <select
            onChange={this.handleProducto}
            value={producto}
            variant="outlined"
            className="form-control my-2"
          >
            <option value="">Seleccione un producto</option>
            <option value="1">Producto 1</option>
            <option value="2">Producto 2</option>
            <option value="3">Producto 3</option>
          </select>

          <input
            onChange={this.handleUnidades}
            value={unidades}
            placeholder="Unidades"
            className="form-control my-2"
            type="number"
          ></input>

          <input
            onChange={this.handlePeso}
            value={peso}
            placeholder="Peso KG"
            className="form-control my-2"
            type="number"
          ></input>

          <input
            onChange={this.handlePrecio}
            value={precio}
            placeholder="Precio"
            className="form-control my-2"
            type="number"
          ></input>

          <select
            onChange={this.handleSubtotal}
            value={subtotal}
            variant="outlined"
            className="form-control my-2"
          >
            <option value="unidades">Calcular subtotal por unidades</option>
            <option value="peso">Calcular subtotal por peso</option>
          </select>

          <button
            className="btn btn-secondary btn-block"
            onClick={this.handleAgregarProducto}
          >
            Añadir Producto #{lista.length + 1}
          </button>
        </form>

       
              <div className="flex-grow-1 flex-column">
              <table className="table table-striped">
              <thead>
          <tr>
              <th scope="col">Unid</th>
              <th scope="col">Prod</th>
              <th scope="col">Peso</th>
              <th scope="col">Precio</th>
              <th scope="col">Sub</th>
          
          </tr>
          </thead>

          <tbody>
          {lista.map((elemento, i) => (
                  <tr key={elemento.id}>
                   <td>
                  {elemento.unidades}                 
                  </td> 
                  <td>
                  {elemento.producto}                                 
                  </td>
                  <td>
                  {elemento.peso} Kg
                  </td>
                  <td>
                  $ {elemento.precio}                  
                  </td>
                  <td>
                  $ {elemento.subtotal}                 
                  </td>                           
                                                             
                  <td>
                  <button
                  className="btn btn-danger btn-block"
                  onClick={(event) => this.handleEliminarProducto(event, i)}>
                  X
                </button>                  
                  </td>    
           
                </tr>  

  ))}  
  </tbody>
  
      <tr>                          
      <td></td><td></td><td></td><td><strong>TOTAL:</strong></td>
                <td><strong>$ {total}</strong></td>
               </tr>  
      </table>

</div>
           
      

        <button
          className="btn btn-primary btn-block"
          onClick={this.handleGuardar}>
          Guardar devolucion
        </button>

        <ToastContainer
          draggable={false}
          transition={Zoom}
          autoClose={1500}
        ></ToastContainer>
      </div>
    );
  }
}


export default DevolucionesFormulario;
