import React, { useEffect, useContext, useState } from "react";
import { firebase, db } from "../firebase";
import { UsuarioContext } from "../context/UsuarioProvider";
import { ToastContainer, toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import "moment/locale/es";
import PedidoFormulario from "./PedidoFormulario";
import { faCheck, faTrashAlt, faCheckDouble, faUserCheck} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Pedido() {
    const { usuario } = useContext(UsuarioContext);

    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        const db = firebase.firestore();
        const verPedidos = async () => {
            db.collection("pedidos")
                .orderBy("order", "desc")
                .onSnapshot((query) => {
                    const docs = [];
                    query.forEach((doc) => {
                        docs.push({ ...doc.data(), id: doc.id, complete: false });
                    });
                    setPedidos(docs);
                });
        };

        verPedidos();
    }, []);

    const eliminarRegistro = async (id) => {
        if (window.confirm("¿Borrar registro?")) {
            try {
                await db.collection("pedidos").doc(id).delete();
                setPedidos((prev) => {
                    let index = prev.findIndex((item) => item.id === id);
                    let pedidosNuevos = [...prev];
                    pedidosNuevos.splice(index, 1);
                    return [...pedidosNuevos];
                });
                toast.warning("Registro eliminado");
            } catch (error) {
                toast.error("Ha ocurrido un error");
            }
        }
    };

    const cambiarColor = async (id) => {
        let index = pedidos.findIndex((item) => item.id === id);

        if (window.confirm("¿" + (pedidos[index].completado ? "Desmarcar" : "Marcar") + " como completado?")) {
            try {
                
              await db.collection('pedidos').doc(id).update({
                completado: !pedidos[index].completado
              })
                setPedidos((prev) => {
                    let pedidosNuevos = [...prev];
                    pedidosNuevos[index].completado = !pedidosNuevos[index].completado;
                    return [...pedidosNuevos];
                });
                toast.success("Pedido actualizado");
                
            } catch (error) {
                toast.error("Ha ocurrido un error");
            }
        }
    }
   
      let estiloCompletado = {
        color: "#000",
        backgroundColor: '#ffc107'    
    };

  
    const cambiarVisado = async (id) => {
        let index = pedidos.findIndex((item) => item.id === id);

        if (window.confirm("¿" + (pedidos[index].visado ? "Desmarcar" : "Marcar") + " como visado?")) {
            try {
                
              await db.collection('pedidos').doc(id).update({
                visado: !pedidos[index].visado
              })
                setPedidos((prev) => {
                    let pedidosNuevos = [...prev];
                    pedidosNuevos[index].visado = !pedidosNuevos[index].visado;
                    return [...pedidosNuevos];
                });
                toast.success("Pedido actualizado");
                
            } catch (error) {
                toast.error("Ha ocurrido un error");
            }
        }
    }
   

    let estiloVisado = {
        textDecoration: 'line-through',
        backgroundColor: '#000', 
        color: "#fff",
    }; 


    const cambiarEnviado = async (id) => {
        let index = pedidos.findIndex((item) => item.id === id);

        if (window.confirm("¿" + (pedidos[index].enviado ? "Desmarcar" : "Marcar") + " como Enviado?")) {
            try {
                
              await db.collection('pedidos').doc(id).update({
                enviado: !pedidos[index].enviado
              })
                setPedidos((prev) => {
                    let pedidosNuevos = [...prev];
                    pedidosNuevos[index].enviado = !pedidosNuevos[index].enviado;
                    return [...pedidosNuevos];
                });
                toast.success("Pedido actualizado");
                
            } catch (error) {
                toast.error("Ha ocurrido un error");
            }
        }
    }
   

    let estiloEnviado = {
        backgroundColor: '#FE0000', 
        color: "#fff",
    }; 



    return (
        <div>
            {(usuario.rol === "admin" ||
                usuario.rol === "propietario" ||
                usuario.rol === "avanzado" ||
                usuario.rol === "usuario") && (
                <>
                    <PedidoFormulario />
                    <div className="content-wrapper">
                        <div className="container-fluid mt-5">
                            <div className="col-xs-2">
                                <h3>Lista de pedidos</h3>

                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col">Fecha</th>
                                            <th scope="col">Cliente</th>
                                            <th scope="col">Pedido</th>
                                            <th scope="col">Vendedor</th>
                                            <th scope="col">Listo</th>
                                            <th scope="col">Visado</th>
                                            <th scope="col">Confirmado</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {pedidos.map((pedido) => (
                                            <tr key={pedido.id}  style={pedido.completado ? estiloCompletado : {} } >
                                                <td style={pedido.visado ? estiloVisado : {} }>
                                                    {moment(pedido.fecha).format("MMM D YYYY")}
                                                   {/*  {pedido.completado && (
                                                        <p>
                                                            <em> (completado) </em>
                                                        </p>
                                                    )} */}
                                                </td>
                                                <td style={pedido.visado ? estiloVisado : {} }>{pedido.cliente}</td>
                                                <td style={pedido.visado ? estiloVisado : {} }>
                                                    {pedido.lista.map((elemento) => (
                                                        <li key={elemento.id} className="d-flex flex-column mb-1">
                                                            <span>{`${elemento.producto} - ${elemento.unidades} Unid - ${elemento.peso} Kg `}</span>
                                                        </li>
                                                    ))}
                                                    <b>
                                                        <span>Total $ {pedido.total}</span>
                                                    </b>
                                                </td>
                                                <td style={pedido.enviado ? estiloEnviado : {} }>{pedido.nombre}</td>
                                               
                                                <td>
                                                    {" "}
                                                    <button
                                                        className="btn btn-warning float-right"
                                                        onClick={(event) => cambiarColor(pedido.id)}
                                                    >
                                                        <FontAwesomeIcon icon={faCheck} />
                                                    </button>
                                                </td>


                                                <td>
                                                    {" "}
                                                    <button
                                                        className="btn btn-info float-right"
                                                        onClick={(event) => cambiarVisado(pedido.id)}
                                                    >
                                                        <FontAwesomeIcon icon={faCheckDouble} />
                                                    </button>
                                                </td>
                                               
                                                <td>
                                                {usuario.rol === "admin" || usuario.rol === "propietario" ? (
                                                    <button
                                                        className="btn btn-success float-right"
                                                        onClick={(event) => cambiarEnviado(pedido.id)}
                                                    >
                                                        <FontAwesomeIcon icon={faUserCheck} />
                                                    </button>
                                                     ) : (
                                                        <></>
                                                    )}
                                                </td>


                                                <td>
                                                    {usuario.rol === "admin" || usuario.rol === "propietario" ? (
                                                        <button
                                                            className="btn btn-danger float-right"
                                                            onClick={(event) => eliminarRegistro(pedido.id)}
                                                        >
                                                            <FontAwesomeIcon icon={faTrashAlt} />
                                                        </button>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <ToastContainer draggable={false} transition={Zoom} autoClose={3000} />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Pedido;
