import React, { useEffect, useState, useContext, useMemo } from "react";
import {UsuarioContext} from '../context/UsuarioProvider';
import moment from 'moment';
import 'moment/locale/es';

const Reportes = () => {
    const {usuario} = useContext(UsuarioContext)

    const [listaV, setListaV] = useState([]);
    const [listaD, setListaD] = useState([]);

    const [ventas, setVentas] = useState([]);
    const [descuentos, setDescuentos] = useState([]);
    const [search, setSearch] = useState("");

    const [fechaDesde, setFechaDesde] = useState("1980-01-01");
    const [fechaHasta, setFechaHasta] = useState("");

    useEffect(() => {
        const obtenerDatosV = async () => {
            const dataV = await fetch(`https://cloudfunctions.net/ventas/api/appventas`);
            const datosV = await dataV.json();
            const dataD = await fetch("https://cloudfunctions.net/descuentos/api/appdescuentos");
            const datosD = await dataD.json();

            setVentas(datosV);
            setListaV(datosV.lista);
            setDescuentos(datosD);
            setListaD(datosD.lista);
        };
        obtenerDatosV();
    }, []);

    function filtrarPorFecha(arr) {
        return arr.filter((item) => {
            let fechaItem = item.fecha.split("-");
            let dateItem = new Date(fechaItem[0], Number(fechaItem[1]) - 1, fechaItem[2]);
            let dateDesde, dateHasta;
            if (fechaDesde) {
                let fd = fechaDesde.split("-");
                dateDesde = new Date(fd[0], Number(fd[1]) - 1, fd[2]);
            }
            if (fechaHasta) {
                let fh = fechaHasta.split("-");
                dateHasta = new Date(fh[0], Number(fh[1]) - 1, fh[2]);
            }
            if (fechaDesde && !fechaHasta) {
                return dateDesde <= dateItem;
            }
            if (fechaDesde && fechaHasta) {
                return dateDesde <= dateItem && dateItem <= dateHasta;
            }
        });
    }

    function ordenarArrPorFecha(arr) {
        return arr.sort((a, b) => {
            let fechaA = a.fecha.split("-");
            let fechaB = b.fecha.split("-");
            let dateA = new Date(fechaA[0], Number(fechaA[1]) - 1, fechaA[2]);
            let dateB = new Date(fechaB[0], Number(fechaB[1]) - 1, fechaB[2]);
            if (dateA > dateB) {
                return 1;
            }
            if (dateA < dateB) {
                return -1;
            }
            return 0;
        });
    }

    let ventasFiltradas = useMemo(() => {
        let ventasFiltradas = ventas.filter((venta) => venta.nombre.toLowerCase().includes(search.toLowerCase()));

        let ventasOrdenadas = ordenarArrPorFecha(ventasFiltradas);
        return filtrarPorFecha(ventasOrdenadas);
    }, [search, ventas, fechaDesde, fechaHasta]);

    let total = useMemo(() => {
        return ventasFiltradas.reduce((valor, elemento) => valor + elemento.total, 0);
    }, [ventasFiltradas]);

    let conceptosUnicos = useMemo(() => {
        let obj = {};
        ventasFiltradas.map((item) => {
            if (item.lista) {
                item.lista.map((concepto) => {
                    if (concepto.producto) {
                        const productoNombre = concepto.producto;
                        if (!obj[productoNombre]) {
                            obj[productoNombre] = { unidades: 0, peso: 0 };
                        }

                        if (concepto.unidades) {
                            obj[productoNombre].unidades += parseInt(concepto.unidades);
                        }

                        if (concepto.peso) {
                            obj[productoNombre].peso += parseFloat(concepto.peso);
                        }
                    }
                });
            }
        });
        return obj;
    }, [ventasFiltradas]);

    let descuentoFiltrado = useMemo(() => {
        return descuentos.filter((descuento) => {
            return (
                ventasFiltradas.findIndex(
                    (item) =>
                        item.cliente.toLowerCase() === descuento.cliente.toLowerCase() &&
                        item.fecha === descuento.fecha &&
                        item.nombre.toLowerCase() === descuento.nombre.toLowerCase()
                ) >= 0
            );
        });
    }, [descuentos, fechaDesde, fechaHasta, search]);

    let totalDescuento = useMemo(() => descuentoFiltrado.reduce((valor, elemento) => valor + elemento.total, 0), [
        descuentoFiltrado,
    ]);

    function buscarDescuento(venta) {
        let index = descuentos.findIndex(
            (item) =>
                item.cliente.toLowerCase() === venta.cliente.toLowerCase() &&
                item.fecha === venta.fecha &&
                item.nombre.toLowerCase() === venta.nombre.toLowerCase()
        );
        return index >= 0 ? descuentos[index].total : 0;
    }

    function formatNum(num) {
        return Number(num).toLocaleString("es", { maximumFractionDigits: 2 });
    }


 

    return (
        <div className="content-wrapper">
            <table className="table table-striped">
                <thead>

                    <tr>
                        <th scope="col">
                            <div className="form-group">
                                <label>Desde</label>
                                <input
                                    className="form-control"
                                    max={fechaHasta}
                                    type="date"
                                    placeholder="Buscar Fecha"
                                    onChange={(e) => setFechaDesde(e.target.value)}
                                />
                                <label>Hasta</label>
                                <input
                                    className="form-control"
                                    min={fechaDesde}
                                    type="date"
                                    placeholder="Buscar Fecha"
                                    onChange={(e) => setFechaHasta(e.target.value)}
                                /><br/>
                                  <input
                                    type="text"
                                    placeholder="Buscar Vendedor"
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                        </th>                        
                        
                     </tr>
                    <tr>
                        <th scope="col">Venta</th>
                        <th scope="col">Descuento</th>
                        <th scope="col">Total</th>
                    </tr>
                </thead>

                <tbody>
                    {ventasFiltradas.map((venta) => (
                        <tr key={venta.id}>
                            <td>
                                <table className="w-100 table table-bordered m-0 p-0">
                                    <tbody>
                                        <tr className="text-center">
                                            <td>
                                                <b>{venta.fecha}</b>
                                            </td>
                                            <td colSpan="2">
                                                <b>{venta.cliente}</b>
                                            </td>
                                            <td >
                                                <b>{venta.nombre}</b>
                                            </td>
                                          
                                        </tr>
                                        {venta.lista.map((ventaLista) => (
                                            <tr key={venta.id + "-" + ventaLista.producto} className="bg-transparent">
                                                <td style={{ width: "40%" }} className="p-1">
                                                    {ventaLista.producto}
                                                </td>
                                                <td style={{ width: "20%", textAlign: "center" }} className="p-1">
                                                    {ventaLista.unidades} Unid
                                                </td>
                                                <td style={{ width: "20%", textAlign: "center" }} className="p-1">
                                                {formatNum(ventaLista.peso)} Kg
                                                </td>
                                                <td style={{ width: "20%", textAlign: "center" }} className="p-1">
                                                    $ {formatNum(ventaLista.subtotal)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </td>
                                        <td style={{textAlign: "center" }} class="align-middle">$ {formatNum(buscarDescuento(venta))}</td>
                                        <td style={{textAlign: "center" }} class="align-middle">$ <b>{formatNum(venta.total - buscarDescuento(venta))}</b></td>
                          
                        </tr>
                    ))}
                                <tr align="center"><h3>Totales</h3></tr>
                    <tr>
                       <table className="w-100 table table-bordered m-0 p-0">
                            {Object.keys(conceptosUnicos).map((propiedad) => (
                                 <tbody>
                                <tr key={propiedad} className="bg-transparent">
                                <td style={{ width: "40%" }} className="p-1">{propiedad}</td>
                                <td style={{ width: "25%", textAlign: "center" }} className="p-1">
                                    <b> {conceptosUnicos[propiedad].unidades} Unids </b>  {" "}
                                </td> 
                                <td style={{ width: "35%", textAlign: "center" }} className="p-1">
                                    {formatNum(conceptosUnicos[propiedad].peso)} Kg
                                </td> 
                               
                                </tr>
                                </tbody>
                            ))}
                            </table>
                        <td style={{textAlign: "center" }} class="align-middle"> $ {formatNum(totalDescuento)}</td>
                        <td style={{textAlign: "center" }} class="align-middle">$ <b> {formatNum(total - totalDescuento)}</b></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Reportes;
