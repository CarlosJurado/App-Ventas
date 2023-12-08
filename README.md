Sistema de Ventas e Inventario creado con React [Create React App](https://github.com/facebook/create-react-app).

# DESCRIPCION

El sistema maneja todo el flujo de inventarios incluyendo:

- Clientes
- Compras
- Ventas
- Descuentos
- Pedidos
- Rutas
- Devoluciones
- Recepciones
- Reportes

## SECCIONES

El sistema cuenta con las siguientes secciones:

### Administración de Usuarios

![ADMIN](public/examples/1.jpg "Panel de permisos de usuarios (disponible solo para administradores)")

- Panel de permisos de usuarios (disponible solo para administradores)

### Clientes

![CLIENTES](public/examples/4.jpg "Sección para guardar clientes y enviarlos a la API en Cloud Google para su consulta en tiempo real al momento de realizar una venta")

- Sección para guardar clientes y enviarlos a la API en Cloud Google para su consulta en tiempo real al momento de realizar una venta

### Compras

![COMPRAS](public/examples/7.jpg "Sección para agregar compras")

- Sección para agregar compras

### Ventas

![VENTAS](public/examples/2.jpg "Sección para ingresar una venta")

- Sección para ingresar una venta

![VENTAS-1](public/examples/2-1.jpg "Permite buscar clientes guardados en la sección de clientes")

- Permite buscar clientes guardados en la sección de clientes

![VENTAS-2](public/examples/2-2.jpg "Permite calcular el precio por unidades o por peso y realiza la validación del campo correspondiente")

- Permite calcular el precio por unidades o por peso y realiza la validación del campo correspondiente

![VENTAS-3](public/examples/2-3.jpg "Verifica que exista un producto añadido en la lista antes de guardar la venta")

- Verifica que exista un producto añadido en la lista antes de guardar la venta

![VENTAS-4](public/examples/2-4.jpg "Producto añadido a la lista y venta guardada")

- Producto añadido a la lista y venta guardada

### Descuentos

![DESCUENTO](public/examples/3.jpg "Permite añadir descuentos en una sección independiente para anexarlos a los reportes y verificarlos")

- Permite añadir descuentos en una sección independiente para anexarlos a los reportes y verificarlos

### Reportes

![REPORTES](public/examples/5.jpg "Se pueden generar reportes de ventas utilizando filtros de fechas y vendedor")

- Se pueden generar reportes de ventas utilizando filtros de fechas y vendedor

### Inventario

![INVENTARIO](public/examples/5.jpg "El módulo inventario realiza el calculo de las compras y las ventas realizadas")

- El módulo inventario realiza el calculo de las compras y las ventas realizadas

## AdminLTE

EL sistema utiliza la plantilla [AdminLTE](https://adminlte.io/),
AdminLTE es un tema de panel de control y panel de administración de código abierto construido sobre Bootstrap.

## Firebase

Se utiliza [Firebase](https://firebase.google.com/) para bases de datos en tiempo real,
autenticación de usuarios y backend a través de Functions.

## Cloud Functions

La carpeta Usuarios debe ser desplegada de forma independiente a través de [Cloud Functions](https://firebase.google.com/docs/functions?hl=es-419)

# Scripts Disponibles

En el proyecto del directorio, puede ejecutar:

### `npm start`

Ejecuta la aplicación en modo de desarrollo.<br />
Ingresa a [http://localhost:3000](http://localhost:3000) para verla en el navegador.

La página se recargará si realiza modificaciones.<br />
También verá cualquier error de lint en la consola.

### `npm test`

Lanza el test runner en modo interactivo.<br />
Ver la sección sobre [running tests](https://facebook.github.io/create-react-app/docs/running-tests) para mas informacion.

### `npm run build`

Crea la aplicación para producción en la carpeta `build`<br />
Esto optimiza la compilación para obtener el mejor rendimiento.

### Despliegue

Se pueden encontrar las opciones de despliegue aquí: https://firebase.google.com/docs/hosting?hl=es-419
