import React, { useEffect, useState, useContext, useMemo } from "react";
import { UsuarioContext } from "../context/UsuarioProvider";
import moment from "moment";
import "moment/locale/es";

const Inventario = () => {
    const { usuario } = useContext(UsuarioContext);
    const [listaV, setListaV] = useState([]);
    const [listaB, setListaB] = useState([]);
    const [ventas, setVentas] = useState([]);
    const [bodegas, setBodegas] = useState([]);
    const [search, setSearch] = useState("");
    const [fechaDesde, setFechaDesde] = useState("2020-01-01");
    const [fechaHasta, setFechaHasta] = useState("");

    useEffect(() => {
        const obtenerDatosB = async () => {
            const dataB = await fetch(`https://cloudfunctions.net/bodegas/api/appbodegas/`);
            const datosB = await dataB.json();
            setBodegas(datosB);
            setListaB(datosB.listaB);
        };
        obtenerDatosB();
    }, []);

    useEffect(() => {
        const obtenerDatosV = async () => {
            const dataV = await fetch(`https://cloudfunctions.net/ventas/api/appventas/`);
            const datosV = await dataV.json();
            setVentas(datosV);
            setListaV(datosV.listaV);
        };
        obtenerDatosV();
    }, []);

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

    function ordenarObjPorFecha(obj) {
        return Object.fromEntries(
            Object.entries(obj).sort((a, b) => {
                let fechaA = a[1].fecha.split("-");
                let fechaB = b[1].fecha.split("-");
                let dateA = new Date(fechaA[0], Number(fechaA[1]) - 1, fechaA[2]);
                let dateB = new Date(fechaB[0], Number(fechaB[1]) - 1, fechaB[2]);
                if (dateA > dateB) {
                    return 1;
                }
                if (dateA < dateB) {
                    return -1;
                }
                return 0;
            })
        );
    }

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

    function reduceArr(arr) {
        return arr.reduce((acum, item) => {
            if (item.lista) {
                item.lista.forEach((concepto) => {
                    if (concepto.producto) {
                        const productoNombre = concepto.producto;
                        if (!acum[productoNombre]) {
                            acum[productoNombre] = { unidades: 0, peso: 0 };
                        }

                        if (concepto.unidades) {
                            acum[productoNombre].unidades += parseInt(concepto.unidades);
                        }

                        if (concepto.peso) {
                            acum[productoNombre].peso += parseInt(concepto.peso);
                        }
                        acum[productoNombre].fecha = item.fecha;
                    }
                });
                return acum;
            }
        }, {});
    }

    const ventasTotales = useMemo(() => {
        let ventasFiltradas = filtrarPorFecha(ventas);

        let ventasOrdenadas = ordenarArrPorFecha(ventasFiltradas);

        let ventasReduce = reduceArr(ventasOrdenadas);

        return ordenarObjPorFecha(ventasReduce);
    }, [search, ventas, fechaDesde, fechaHasta]);

    const bodegasTotales = useMemo(() => {
        let bodegaFiltrada = filtrarPorFecha(bodegas);

        let bodegaSort = ordenarArrPorFecha(bodegaFiltrada);

        let bodegaReduce = reduceArr(bodegaSort);

        return ordenarObjPorFecha(bodegaReduce);
    }, [search, bodegas, fechaDesde, fechaHasta]);

    const doRequest = (url) => {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then((response) => response.json())
                .then((response) => resolve(response))
                .catch((fail) => reject(fail));
        });
    };

    const sources = [
        "https://cloudfunctions.net/bodegas/api/appbodegas/",
        "https://cloudfunctions.net/ventas/api/appventas/",
    ];

    const datasources = sources.map(async (source) => await doRequest(source));

    Promise.all(datasources).then((allRequests) => {
        const newValues = { unidades: 0, ventas: 0, diferencia: 0, peso: 0 };
        const [bodegas, ventas] = allRequests;

        if (!bodegas || !ventas) {
            return 0;
        }
        const data = {};
        bodegas.map((bodega) => {
            if (bodega.lista) {
                bodega.lista.map((listaObjeto) => {
                    if (listaObjeto.producto) {
                        const newProperty = listaObjeto.producto;

                        if (!data[newProperty]) {
                            data[newProperty] = { ...newValues };
                        }

                        if (listaObjeto.unidades) {
                            data[newProperty].unidades += parseInt(listaObjeto.unidades);
                        }
                    }
                });
            }
        });
        ventas.map((venta) => {
            if (venta.lista) {
                venta.lista.map((ventaObjeto) => {
                    if (ventaObjeto.producto) {
                        const newProperty = ventaObjeto.producto;
                        if (data[newProperty] && ventaObjeto.unidades) {
                            data[newProperty].ventas += parseInt(ventaObjeto.unidades);
                        }
                    }
                });
            }
        });
        // Obteniendo diferencias
        Object.keys(data).map((producto) => {
            data[producto].diferencia = data[producto].unidades - data[producto].ventas;
        });
    });

    return (
        <div className="content-wrapper">
        
        
        <table className="table table-striped table-responsive">
            <thead>
                <tr>
                    <th><label>Desde</label><input
            max={fechaHasta}
            type="date"
            placeholder="Buscar Fecha"
            onChange={(e) => setFechaDesde(e.target.value)}
        /></th>
        <th><label>Hasta</label>
        <input
            min={fechaDesde}
            type="date"
            placeholder="Buscar Fecha"
            onChange={(e) => setFechaHasta(e.target.value)}
        />
        </th>
                </tr>
                <tr>
                    <th scope="col">Bodega</th>
                    <th scope="col">Ventas</th>
                    <th scope="col">Total</th>
                    <th scope="col">Peso</th>
                </tr>
            </thead>
            <tbody>
                {Object.keys(bodegasTotales).map((propiedad) => (
                    <tr key={propiedad}>
                        <td>
                            {propiedad}<br/><b> {bodegasTotales[propiedad].unidades} Unids </b> {" "}
                            {bodegasTotales[propiedad].peso} Kg
                        </td>
                        {ventasTotales[propiedad] ? (
                            <>
                                <td>
                                    {propiedad} <br/> <b> {ventasTotales[propiedad].unidades} Unids </b> {" "}
                                    {ventasTotales[propiedad].peso} Kg
                                </td>
                                <td>
                                    {Number(bodegasTotales[propiedad].unidades) -
                                        Number(ventasTotales[propiedad].unidades)}{" "}
                                    Unids
                                </td>
                                <td>
                                    {Number(bodegasTotales[propiedad].peso) - Number(ventasTotales[propiedad].peso)}{" "}
                                    Kg
                                </td>
                            </>
                        ) : (
                            <>
                                <td style={{ textAlign: "center" }}>0</td>
                                <td>{bodegasTotales[propiedad].unidades} Unids</td>
                                <td>{bodegasTotales[propiedad].peso} Kg</td>
                            </>
                        )}
                    </tr>
                ))}
                {Object.keys(ventasTotales).map((propiedad) => (
                    <tr key={propiedad}>
                        {!bodegasTotales[propiedad] && (
                            <>
                            <td>{propiedad}</td>
                            <td></td>
                                <td>
                                    {propiedad} <br/> <b> {ventasTotales[propiedad].unidades} Unids </b> {" "}
                                    {ventasTotales[propiedad].peso} Kg
                                </td>
                                <td>
                                    {Number(ventasTotales[propiedad].unidades)}{" "}
                                    Unids
                                </td>
                                <td>
                                    {Number(ventasTotales[propiedad].peso)}{" "}
                                    Kg
                                </td>
                            </>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
};

export default Inventario;