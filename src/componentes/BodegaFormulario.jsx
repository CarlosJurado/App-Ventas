import React, { Component } from "react";
import * as firebase from "firebase";
import { UsuarioContext } from "../context/UsuarioProvider";
import "moment/locale/es";
import { ToastContainer, toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const db = firebase.firestore();

class BodegaFormulario extends Component {
  static contextType = UsuarioContext;

  constructor(props) {
    super(props);

    this.state = {            
      fecha: "",
      lista: [],
      producto: "",
      unidades: "",
      peso: "",      
      order: Date.now(), 
    };
  }

  updateState(obj) {
    const newState = { ...this.state, ...obj };
   
    this.setState(newState);
  }

  handleFecha = (event) => {
    this.updateState({ fecha: event.target.value });
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

  
  handleAgregarProducto = (event) => {
    event.preventDefault();

    const {
      lista,
      producto,
      unidades,
      peso,     
    } = this.state;

    const productoTrim = producto.trim();
    const unidadesTrim = unidades.trim();
    const pesoTrim = peso.trim();    

    if (!productoTrim) return toast.error("Por favor elige un producto.");
    if (!unidadesTrim) return toast.error("Rellena el campo unidades.");
    if (!pesoTrim) return toast.error("Ingresa el peso.");
    
    
    this.updateState({
      lista: [
        ...lista,
        {
          producto: productoTrim,
          unidades: unidadesTrim,
          peso: pesoTrim,    
        },
      ],
      producto: "",
      unidades: "",
      peso: "",
     
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

    const { fecha, lista } = this.state;
    const { usuario } = this.context;

        const fechaTrim = fecha.trim();
    
    if (!fechaTrim) return toast.error("Ingresa una Fecha.");
    if (lista.length === 0)
      return toast.error("Agrega un producto a la lista.");

   
    const bodega = {
      fecha: fechaTrim,      
      lista,     
      uid: usuario.uid,
      nombre: usuario.nombre,
      order: Date.now(),
      autor: db.collection("usuarios").doc(usuario.nombre),
    };

    try {
      await db.collection("bodegas").add(bodega);

      this.updateState({        
        fecha: "",
        lista: [],
        producto: "",
        unidades: "",
        peso: "",       
        order: Date.now(),
      });

      toast.success("Recepción en Bodega Guardada.");
    } catch (error) {
      console.log(error);
      return toast.error("Error al guardar.");
    }
  };

  render() {
    const {    
      fecha,      
      lista,
      producto,
      unidades,
      peso,      
    } = this.state;

    return (
      <div className="content-wrapper">
        <h3 align="center">Agregar recepción bodega</h3>

        <form>

        <label>Fecha</label>
        <input
            onChange={this.handleFecha}
            value={fecha}
            placeholder ="Fecha" 
            className="form-control mb-2"
            type="date"
          ></input>

        
     
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
                  <button
                  className="btn btn-danger btn-block"
                  onClick={(event) => this.handleEliminarProducto(event, i)}>
                  X
                </button>                  
                  </td>    
           
                </tr>  

  ))}  
  </tbody>
  
      </table>

</div>
           
      

        <button
          className="btn btn-primary btn-block"
          onClick={this.handleGuardar}>
          Guardar pedido bodega
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


export default BodegaFormulario;
