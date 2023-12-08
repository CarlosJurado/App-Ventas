import React, { Component } from "react";
import * as firebase from "firebase";
import { UsuarioContext } from "../context/UsuarioProvider";
import "moment/locale/es";
import { ToastContainer, toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const db = firebase.firestore();

class PedidoFormulario extends Component {
    static contextType = UsuarioContext;

    constructor(props) {
        super(props);

        this.state = {
            cliente: "",
            clienteInput: "",
            loadingClientes: true,
            clientes: [],
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

        this.clientesTimeout = null;
    }

    updateState(obj) {
        const newState = { ...this.state, ...obj };

        newState.total = newState.lista.reduce((valor, elemento) => valor + elemento.subtotal, 0);

        this.setState(newState);
    }

    handleFecha = (event) => {
        this.updateState({ fecha: event.target.value });
    };

    handleCliente = (event) => {
        this.updateState({ cliente: event.target.value });
    };

    handleClienteInput = (event) => {
        let input = event.target.value;

        this.updateState({
            clienteInput: input,
            loadingClientes: true,
            clientes: [],
        });

        if (this.clientesTimeout) clearTimeout(this.clientesTimeout);

        this.clientesTimeout = setTimeout(async () => {
            const { clienteInput } = this.state;

            let clientes = [];

            if (clienteInput) {
                try {
                    let data = await fetch("https://cloudfunctions.net/clientes/api/appclientes");
                    let dataJson = await data.json();
                    clientes = dataJson
                        .filter((item) => {
                            return item.cliente.toLowerCase().includes(input.toLowerCase().trim());
                        })
                } catch (err) {
                    toast.error("Ha ocurrido un error al intentar buscar cliente.");
                }
            }

            this.updateState({ loadingClientes: false, clientes });
        }, 1000);
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

        const { lista, producto, unidades, peso, precio, subtotal: tmpSubtotal } = this.state;

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

        const { cliente, fecha, lista } = this.state;
        const { usuario } = this.context;
        const clienteTrim = cliente.trim();
        const fechaTrim = fecha.trim();

        if (!clienteTrim) return toast.error("Elige un Cliente.");
        if (!fechaTrim) return toast.error("Ingresa una Fecha.");
        if (lista.length === 0) return toast.error("Agrega un producto a la lista.");

        const total = lista.reduce((valor, elemento) => valor + elemento.subtotal, 0);

        const pedido = {
            fecha: fechaTrim,
            cliente: clienteTrim,
            lista,
            total,
            uid: usuario.uid,
            completado: false,
            visado: false,
            enviado: false,
            nombre: usuario.nombre,
            order: Date.now(),
            autor: db.collection("usuarios").doc(usuario.nombre),
        };

        try {
            await db.collection("pedidos").add(pedido);

            this.updateState({
                cliente: "",
                fecha: "",
                lista: [],
                producto: "",
                unidades: "",
                peso: "",
                precio: "",
                subtotal: "unidades",
                order: Date.now(),
            });

            toast.success("Pedido Guardado.");
        } catch (error) {
            return toast.error("Error al guardar.");
        }
    };

    render() {
        const {
            clienteInput,
            loadingClientes,
            fecha,
            clientes,
            cliente,
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
                <h3 align="center">Agregar pedido</h3>

                <form>
                    <label>Fecha</label>
                    <input
                        onChange={this.handleFecha}
                        value={fecha}
                        placeholder="Fecha"
                        className="form-control mb-2"
                        type="date"
                    ></input>

                    <input
                        onChange={this.handleClienteInput}
                        value={clienteInput}
                        placeholder="Cliente"
                        className="form-control mb-2"
                        type="text"
                    ></input>

                    <div className="bg-secondary p-2 d-flex flex-column">
                        {!clienteInput ? (
                            <span>Ingresa para buscar</span>
                        ) : loadingClientes && clienteInput ? (
                            <span>Cargando clientes...</span>
                        ) : clientes.length === 0 ? (
                            <span>No se hallaron clientes.</span>
                        ) : (
                            <div className="d-flex align-items-center flex-wrap">
                                {clientes.map((cliente, i) => (
                                    <div key={cliente.cliente} className="form-check px-4">
                                        <input
                                            type="radio"
                                            name="cliente"
                                            id={`cliente-${i}`}
                                            value={cliente.cliente}
                                            onChange={this.handleCliente}
                                            className="form-check-input"
                                        ></input>

                                        <label htmlFor={`cliente-${i}`} className="ml-1 form-check-label">
                                            {cliente.cliente}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <input
                        onChange={this.handleCliente}
                        value={cliente}
                        placeholder="Cliente"
                        className="form-control my-2"
                        type="text"
                    ></input>

                    <h4>Productos</h4>

                    <select
                        onChange={this.handleProducto}
                        value={producto}
                        variant="outlined"
                        className="form-control my-2"
                    >
                        <option value="">Seleccione un producto</option>
                        <option value="Doblecrema">Doblecrema</option>
                        <option value="Doblecrema TM">Doblecrema TM</option>
                        <option value="Doblecrema M">Doblecrema M</option>
                        <option value="Doblecrema Tajado">Doblecrema Tajado</option>
                        <option value="Doblecrema TM Tajado">Doblecrema TM Tajado</option>
                        <option value="Doblecrema M Tajado">Doblecrema M Tajado</option>
                        <option value="Doblecrema Tajado GR">Doblecrema Tajado GR</option>
                        <option value="Campesino Descremado">Campesino Descremado</option>
                        <option value="Campesino Descremado ESP">Campesino Desc ESP</option>
                        <option value="Campesino Criollo">Campesino Criollo</option>
                        <option value="Campesino Criollo ESP">Campesino Criollo ESP</option>
                        <option value="Cuajada">Cuajada</option>
                        <option value="Costeño Porcionado">Costeño Porcionado</option>
                        <option value="Costeño Bloque">Costeño Bloque</option>
                        <option value="Costeño Granel">Costeño Granel</option>
                        <option value="Paipa Pequeño">Paipa Pequeño</option>
                        <option value="Paipa Mediano">Paipa Mediano</option>
                        <option value="Paipa Grande">Paipa Grande</option>
                        <option value="Queso Pera">Queso Pera</option>
                        <option value="Suero 10 Unds">Suero 10 Unds</option>
                        <option value="Recorte">Recorte</option>
                        <option value="Masas">Masas</option>
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

                    <button className="btn btn-secondary btn-block" onClick={this.handleAgregarProducto}>
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
                                    <td>{elemento.unidades}</td>
                                    <td>{elemento.producto}</td>
                                    <td>{elemento.peso} Kg</td>
                                    <td>$ {elemento.precio}</td>
                                    <td>$ {elemento.subtotal}</td>

                                    <td>
                                        <button
                                            className="btn btn-danger btn-block"
                                            onClick={(event) => this.handleEliminarProducto(event, i)}
                                        >
                                            X
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>
                                    <strong>TOTAL:</strong>
                                </td>
                                <td>
                                    <strong>$ {total}</strong>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <button className="btn btn-primary btn-block" onClick={this.handleGuardar}>
                    Guardar pedido
                </button>

                <ToastContainer draggable={false} transition={Zoom} autoClose={1500}></ToastContainer>
            </div>
        );
    }
}

export default PedidoFormulario;
