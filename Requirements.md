# 📋 REQUERIMIENTOS DEL SISTEMA - FORMATO ENTERPRISE PROMPTING

## FASE 1: CORE DEL SISTEMA (Fundamentos)

### MÓDULO: Gestión de Productos

**Catálogo Maestro de Productos:**
Necesito un sistema para administrar el catálogo completo de productos. Cada producto debe tener una estructura jerárquica donde existe un producto padre (modelo base) y productos hijos (variantes por talla y color). Por ejemplo, una zapatilla Nike Air Max es el producto padre, y cada combinación de talla y color es un producto hijo.

Cada producto debe almacenar: nombre comercial, descripción corta para listados, descripción larga para página de detalle, marca, categoría principal, subcategorías, precio base, precio de venta al público, costo de adquisición (para cálculo de márgenes), peso y dimensiones para cálculo de envíos, estado (activo, inactivo, agotado, descontinuado), múltiples imágenes (mínimo 6 por producto), código de barras único, SKU único, fecha de creación y última modificación.

Para las variantes, necesito una matriz de tallas y colores donde cada combinación genera automáticamente un SKU hijo vinculado al SKU padre. Cada variante debe poder tener su propio código de barras, stock independiente y opcionalmente precio diferenciado.

**Búsqueda y Filtrado Avanzado:**
Implementa un buscador que permita encontrar productos por nombre, SKU, código de barras, marca, categoría. Los filtros deben poder combinarse: filtrar por rango de precio, por disponibilidad de stock, por marca, por categoría, por talla, por color, por estado. Los resultados deben mostrarse en tabla con paginación, permitir ordenar por nombre, precio, stock, fecha de creación.

**Importación y Exportación Masiva:**
Necesito poder subir productos masivamente mediante archivo Excel con validación automática de datos. El sistema debe detectar errores como SKUs duplicados, códigos de barras repetidos, precios inválidos, campos obligatorios vacíos. También debe permitir exportar el catálogo completo a Excel para auditorías o respaldo.

**Gestión de Imágenes:**
Cada producto debe soportar múltiples imágenes que se puedan cargar mediante drag and drop, reordenar arrastrando, eliminar individualmente, marcar una como principal. Las imágenes deben mostrarse en miniatura en el listado y en galería completa en la vista de detalle.

---

### MÓDULO: Gestión de Inventario en Tiempo Real

**Control de Stock Multi-Ubicación:**
El inventario debe manejarse por ubicaciones físicas. Necesito poder definir ubicaciones como "Tienda Principal", "Almacén Central", "Sucursal Norte", etc. Cada producto debe mostrar su stock disponible en cada ubicación de forma independiente.

Cuando se registra una venta en cualquier canal (tienda física o web), el stock debe descontarse automáticamente en menos de un segundo. Si alguien está comprando online y un vendedor vende el mismo producto en tienda física al mismo tiempo, el sistema debe manejar esto con reservas temporales.

**Reservas de Stock:**
Cuando un cliente agrega un producto al carrito en la web, el sistema debe crear una reserva temporal de ese stock por 15 minutos. Si el cliente no completa la compra, la reserva se libera automáticamente. Si completa el pago, la reserva se convierte en descuento definitivo del inventario.

**Movimientos de Inventario:**
Necesito registrar todos los movimientos de stock: entradas (compras a proveedores), salidas (ventas), ajustes (correcciones por inventario físico), traspasos entre ubicaciones, devoluciones de clientes, mermas o productos dañados. Cada movimiento debe guardar: fecha y hora exacta, usuario que lo realizó, motivo, cantidad, ubicación origen y destino, referencia del documento.

**Alertas de Stock Bajo:**
El sistema debe permitir configurar un stock mínimo por producto. Cuando el stock disponible sea menor al mínimo, debe aparecer una alerta visual en el dashboard y opcionalmente enviar notificación por email al administrador.

**Inventario Cíclico:**
Necesito una función para realizar inventarios físicos por ubicación. El sistema debe permitir escanear productos con lector de código de barras móvil, comparar las cantidades escaneadas vs las registradas en sistema, mostrar diferencias, permitir ajustar el stock con justificación obligatoria del ajuste.

---

### MÓDULO: Clientes y CRM

**Base de Datos Unificada de Clientes:**
Cada cliente debe tener un registro único identificado por su número de documento (DNI o RUC). No importa si compra en tienda física o web, debe ser el mismo registro. 

Los datos a capturar son: tipo de documento (DNI, RUC, CE, Pasaporte), número de documento (único en el sistema), nombres completos o razón social, email, teléfono o celular, dirección completa, distrito, ciudad, referencias de ubicación, fecha de nacimiento o fecha de aniversario (para promociones), género, cómo conoció la tienda, fecha de registro, estado (activo, inactivo, bloqueado).

**Validación Automática con APIs:**
Cuando el vendedor o el cliente ingresa un DNI o RUC, el sistema debe consultar automáticamente la API de RENIEC o SUNAT y autocompletar los datos (nombre, razón social, dirección fiscal). Esto evita errores de digitación y acelera el registro.

**Historial de Compras Omnicanal:**
En la ficha del cliente debe mostrarse un historial completo de todas sus compras sin importar el canal. Cada compra debe mostrar: fecha, canal (tienda física o web), productos comprados, monto total, método de pago, comprobante generado, estado de la entrega si fue online. El historial debe poder filtrarse por fechas, por canal, por estado.

**Segmentación de Clientes:**
Necesito poder clasificar automáticamente a los clientes en segmentos según su comportamiento: clientes nuevos (primera compra hace menos de 30 días), clientes frecuentes (más de 5 compras), clientes VIP (compras mayores a cierto monto), clientes inactivos (sin compras hace más de 6 meses). Estos segmentos deben calcularse automáticamente.

**Programa de Fidelización:**
Los clientes deben acumular puntos por cada compra. La regla debe ser configurable (por ejemplo: 1 punto por cada sol gastado). Los puntos acumulados deben poder canjearse como descuento en futuras compras tanto en tienda física como en web. El sistema debe mostrar el saldo actual de puntos en la ficha del cliente y permitir ajustes manuales con justificación.

**Crédito o Saldo a Favor:**
Algunos clientes pueden tener saldo a favor por devoluciones o pagos adelantados. Este saldo debe poder usarse como método de pago en cualquier canal. El sistema debe llevar un registro de movimientos del saldo con fecha, concepto, monto, saldo anterior y saldo nuevo.

---

## FASE 2: PUNTO DE VENTA (POS) TIENDA FÍSICA

### MÓDULO: Interface de Venta

**Pantalla Principal de Ventas:**
La interface del vendedor debe ser simple e intuitiva. En la pantalla principal debe haber: un buscador de productos destacado (puede buscar por nombre, SKU o escanear código de barras), un área que muestre el carrito de compra actual con los productos agregados, el subtotal acumulado, botones grandes para finalizar venta o cancelar.

**Agregar Productos al Carrito:**
El vendedor debe poder agregar productos de tres formas: escaneando el código de barras con el lector, buscando por nombre o SKU en el buscador, navegando por categorías en un menú visual. Al agregar un producto, debe mostrarse una confirmación visual, el producto debe aparecer en el carrito con su imagen miniatura, nombre, precio unitario, cantidad agregada.

**Modificar Carrito:**
Para cada producto en el carrito, el vendedor debe poder: cambiar la cantidad (con botones + y - o escribiendo el número), eliminar el producto completamente, aplicar un descuento individual al producto (con permiso especial si es necesario), ver el stock disponible en tiempo real.

**Búsqueda y Selección de Cliente:**
Antes o durante la venta, el vendedor debe poder buscar al cliente por DNI, RUC, nombre o teléfono. Si el cliente existe, debe mostrarse su información y permitir seleccionarlo. Si no existe, debe haber un botón para registrarlo rápidamente capturando solo los datos esenciales: tipo y número de documento, nombre, email, teléfono.

**Aplicar Promociones y Descuentos:**
El sistema debe aplicar automáticamente las promociones vigentes cuando se agregan productos al carrito. Por ejemplo, si hay un 2x1 activo en una categoría, al agregar el segundo producto el descuento debe aparecer automáticamente. El vendedor también debe poder aplicar descuentos manuales por monto fijo o porcentaje con autorización según el rol del usuario.

**Cupones de Descuento:**
El vendedor debe poder ingresar un código de cupón proporcionado por el cliente. El sistema debe validar que el cupón exista, esté vigente, no haya sido usado si es de un solo uso, sea aplicable a los productos en el carrito. Si es válido, aplicar el descuento automáticamente.

---

### MÓDULO: Proceso de Pago

**Métodos de Pago Múltiples:**
El sistema debe soportar varios métodos de pago que pueden combinarse en una misma venta: efectivo (con cálculo automático de vuelto), tarjeta de débito o crédito (integrado con el POS bancario del local), transferencia bancaria o billeteras digitales como Yape o Plin (el vendedor confirma manualmente la recepción), puntos de fidelización del cliente, saldo a favor del cliente, crédito (para clientes autorizados).

**Pago Mixto:**
El cliente debe poder pagar con varios métodos en una misma compra. Por ejemplo: pagar S/50 en efectivo y S/30 con tarjeta. El sistema debe permitir ir agregando pagos parciales hasta completar el total. Debe mostrar claramente cuánto falta por pagar en cada momento.

**Cálculo de Vuelto:**
Cuando el pago es en efectivo, el vendedor ingresa el monto recibido del cliente y el sistema calcula y muestra en grande el vuelto a entregar. Debe sugerir la denominación de billetes y monedas para dar el vuelto de forma óptima.

**Validación de Pagos:**
Antes de finalizar la venta, el sistema debe validar que el monto total pagado sea exactamente igual al total de la venta. Si hay diferencia, mostrar error y no permitir continuar. Si todo está correcto, permitir finalizar.

---

### MÓDULO: Generación de Comprobantes

**Emisión Automática de Comprobantes:**
Al finalizar la venta, el sistema debe generar automáticamente el comprobante electrónico según el tipo de cliente: boleta de venta si es persona natural con DNI, factura si es empresa con RUC. El comprobante debe generarse en formato XML según estándares de SUNAT, firmarse digitalmente con el certificado de la empresa, enviarse al OSE (Operador de Servicios Electrónicos) para validación.

**Impresión de Tickets:**
Una vez validado el comprobante, el sistema debe enviar a imprimir automáticamente en la impresora térmica: encabezado con datos de la empresa, número de comprobante, datos del cliente, detalle de productos comprados (cantidad, descripción, precio unitario, subtotal), subtotal, IGV, total, métodos de pago usados, puntos ganados o saldo de puntos si aplica, mensaje de agradecimiento.

La impresión debe abrir automáticamente el cajón de dinero conectado a la impresora.

**Envío Digital del Comprobante:**
El sistema debe enviar automáticamente por email el comprobante en formato PDF al correo del cliente. Si el cliente no tiene email registrado, debe mostrar advertencia pero permitir continuar.

**Registro de Venta:**
Cada venta debe quedar registrada con: número único de venta, fecha y hora exacta, vendedor que la realizó, cliente (puede ser genérico si no se identifica), productos vendidos con cantidades y precios, descuentos aplicados, subtotal e IGV, total, métodos de pago, comprobante generado (tipo, serie, número), estado (completada, anulada, devuelta).

---

### MÓDULO: Gestión de Caja

**Apertura de Caja:**
Cada vendedor debe abrir su caja al inicio del turno. Debe registrar: fecha y hora de apertura, vendedor responsable, monto inicial en efectivo (arqueo de billetes y monedas por denominación), total del monto inicial.

**Movimientos de Caja:**
Durante el día pueden ocurrir movimientos además de ventas: ingresos por pagos de créditos anteriores, egresos por gastos menores, retiro parcial de efectivo para depositar al banco. Cada movimiento debe registrarse con: tipo (ingreso o egreso), monto, concepto obligatorio, autorizado por.

**Cierre de Caja:**
Al final del turno, el vendedor debe cerrar su caja registrando: fecha y hora de cierre, arqueo final de efectivo (contar billetes y monedas por denominación), total vendido en efectivo según sistema, total vendido en tarjeta según sistema, total vendido en otros métodos, total esperado en caja, diferencia entre lo contado y lo esperado (faltante o sobrante).

El sistema debe generar un reporte de cierre mostrando: ventas del turno, métodos de pago, descuentos aplicados, comprobantes emitidos, movimientos de caja, arqueo final. Este reporte debe poder imprimirse.

---

## FASE 3: TIENDA ONLINE (E-COMMERCE)

### MÓDULO: Catálogo y Navegación

**Página de Inicio:**
La página principal debe mostrar: slider o banner rotativo con promociones destacadas, categorías principales con imágenes atractivas, productos destacados o más vendidos, productos nuevos recientemente agregados, sección de marcas disponibles, footer con información de contacto, redes sociales, políticas.

**Navegación por Categorías:**
El menú principal debe mostrar las categorías organizadas jerárquicamente: categorías principales con subcategorías desplegables. Al hacer clic en una categoría, debe llevarte a una página que muestre todos los productos de esa categoría con imágenes, nombre, precio, etiqueta si está en descuento o es nuevo.

**Filtros y Ordenamiento:**
En las páginas de categorías o resultados de búsqueda, debe haber un panel lateral con filtros: por rango de precio (con sliders para mínimo y máximo), por marca (checkboxes), por talla disponible, por color, por disponibilidad (en stock o agotados). Los productos deben poder ordenarse por: relevancia, menor precio, mayor precio, más nuevos, más vendidos, mejor calificados.

**Buscador Inteligente:**
El buscador debe aparecer destacado en el header. Debe buscar en nombre del producto, descripción, marca, categoría, SKU. Debe mostrar sugerencias mientras el usuario escribe. Debe ser tolerante a errores de escritura (búsqueda difusa).

---

### MÓDULO: Página de Producto

**Galería de Imágenes:**
Debe mostrar todas las imágenes del producto en una galería. La imagen principal debe ser grande y permitir hacer zoom al pasar el mouse. Debajo deben aparecer miniaturas de todas las imágenes para navegar entre ellas. Opcionalmente permitir vista de 360 grados si se cargaron las imágenes necesarias.

**Información del Producto:**
Debe mostrar claramente: nombre del producto, marca, código SKU, precio actual (destacado y en grande), precio anterior tachado si está en oferta, porcentaje de descuento si aplica, disponibilidad en stock (en stock, pocas unidades, agotado), descripción corta en bullet points, descripción larga en formato rich text.

**Selector de Variantes:**
Si el producto tiene variantes de talla y color, debe mostrarse: selector de talla con botones para cada talla disponible, selector de color con muestras visuales de cada color, al seleccionar una combinación debe actualizarse: imagen principal si esa variante tiene foto específica, SKU específico de la variante, precio si la variante tiene precio diferente, disponibilidad en stock de esa combinación específica.

**Selector de Cantidad:**
Debe haber un selector de cantidad con botones + y - y campo numérico editable. Si el cliente intenta agregar más cantidad del stock disponible, debe mostrar error. Si el stock es limitado (por ejemplo quedan solo 3 unidades), debe mostrar advertencia "Solo quedan X unidades".

**Botón Agregar al Carrito:**
Debe ser prominente y llamativo. Al hacer clic: validar que se haya seleccionado talla y color si aplica, validar que la cantidad sea válida, agregar al carrito creando reserva temporal del stock, mostrar confirmación visual (modal o notificación), actualizar el contador del carrito en el header.

**Productos Relacionados:**
Al final de la página debe mostrarse una sección "También te puede interesar" con 4-6 productos relacionados: de la misma categoría, de la misma marca, o comprados frecuentemente junto con este producto.

---

### MÓDULO: Carrito de Compras

**Vista del Carrito:**
El carrito debe mostrar todos los productos agregados con: imagen miniatura, nombre, variante seleccionada (talla y color), precio unitario, selector de cantidad (que actualice el subtotal al cambiar), botón para eliminar producto, subtotal del producto (precio x cantidad). Al final debe mostrar: subtotal de todos los productos, descuentos aplicados si hay, costo de envío (calculado o "a calcular"), total final.

**Actualización Automática:**
Al cambiar cantidades o eliminar productos, el carrito debe recalcularse automáticamente sin recargar la página. Debe validar en cada cambio que haya stock suficiente.

**Cupones de Descuento:**
Debe haber un campo para ingresar código de cupón con botón "Aplicar". Al aplicar, validar el cupón y si es válido, mostrar el descuento aplicado y recalcular el total. Debe mostrarse el cupón aplicado con opción de removerlo.

**Carrito Persistente:**
El contenido del carrito debe guardarse para que si el usuario cierra la pestaña y vuelve después, sus productos sigan ahí. Debe funcionar incluso si el usuario no ha iniciado sesión.

**Botón de Checkout:**
Debe haber un botón destacado "Proceder al pago" o "Finalizar compra" que lleve al proceso de checkout. Solo debe habilitarse si hay productos en el carrito y el stock está disponible.

---

### MÓDULO: Proceso de Checkout

**Datos del Cliente:**
Si el usuario está logueado, autocompletar sus datos guardados. Si no, pedir: tipo y número de documento, nombres completos o razón social, email obligatorio, teléfono obligatorio. Debe tener checkbox "Crear cuenta" para que se registre automáticamente.

**Dirección de Envío:**
Pedir: dirección completa, distrito (lista desplegable), ciudad o provincia, referencias de ubicación, opción de agregar nota especial para el delivery.

Debe permitir guardar múltiples direcciones si el usuario tiene cuenta. Debe poder seleccionar entre direcciones guardadas o agregar nueva.

**Método de Envío:**
Mostrar opciones: envío a domicilio (con costo calculado según distrito y peso), recojo en tienda (sin costo, click & collect). Al seleccionar envío a domicilio, calcular y mostrar el costo, estimar fecha de entrega. Si selecciona recojo en tienda, mostrar dirección de la tienda y horarios disponibles.

**Método de Pago:**
Mostrar opciones disponibles: tarjeta de débito o crédito, transferencia bancaria, Yape o Plin, pago contra entrega (solo si está habilitado). Al seleccionar tarjeta, debe integrarse con la pasarela de pagos mostrando formulario seguro.

**Resumen del Pedido:**
Debe mostrarse un resumen completo: productos con cantidades e imágenes, subtotal, descuentos, costo de envío, total a pagar, datos de envío confirmados, método de pago seleccionado.

**Botón Confirmar Pedido:**
Al hacer clic, validar todos los datos, procesar el pago si es tarjeta, descontar definitivamente del stock, generar el pedido con número único, enviar email de confirmación al cliente, redirigir a página de confirmación.

---

### MÓDULO: Mi Cuenta

**Login y Registro:**
Debe haber formularios para que los usuarios creen cuenta con email y contraseña, inicien sesión, recuperen contraseña olvidada mediante email.

**Perfil de Usuario:**
El cliente logueado debe poder: ver y editar sus datos personales, cambiar contraseña, ver su saldo de puntos de fidelización, ver su historial de puntos (ganados y canjeados), ver saldo a favor si tiene.

**Mis Pedidos:**
Mostrar listado de todos sus pedidos con: número de pedido, fecha, estado (pendiente de pago, pagado, en preparación, enviado, entregado, cancelado), total, botón para ver detalle. En el detalle mostrar: productos comprados, datos de envío, método de pago, comprobante descargable, tracking de envío si aplica.

**Direcciones Guardadas:**
Permitir administrar direcciones de envío: agregar nueva, editar existente, eliminar, marcar una como principal.

**Lista de Deseos:**
Los usuarios deben poder agregar productos a favoritos o lista de deseos desde la página de producto. Debe poder ver todos sus productos guardados y moverlos al carrito fácilmente.

---

## FASE 4: FACTURACIÓN ELECTRÓNICA

### MÓDULO: Generación de Comprobantes

**Configuración Inicial:**
Debe permitir configurar: datos de la empresa (RUC, razón social, nombre comercial, dirección fiscal), certificado digital para firma electrónica (subir archivo .pfx y contraseña), datos del OSE contratado (URL del servicio, usuario, contraseña), series de comprobantes (serie para boletas, serie para facturas, serie para notas de crédito).

**Generación de XML:**
Al finalizar una venta, el sistema debe construir automáticamente el archivo XML del comprobante según el formato estándar de SUNAT: estructura UBL 2.1, incluir todos los datos requeridos (emisor, receptor, productos, totales), calcular correctamente el IGV, aplicar redondeos según normativa.

**Firma Digital:**
El XML generado debe firmarse digitalmente usando el certificado configurado. La firma debe agregarse al XML en el formato que SUNAT requiere.

**Envío al OSE:**
El XML firmado debe enviarse al OSE vía web service (SOAP). Debe manejar la respuesta: si es aceptado, guardar el CDR (Constancia de Recepción), si es rechazado, registrar el error y permitir reintentos.

**Generación de PDF:**
Generar automáticamente el PDF del comprobante con: encabezado con datos de la empresa, número del comprobante, datos del cliente, detalle de productos, subtotal e IGV, total en números y letras, código QR con resumen del comprobante, representación impresa del comprobante electrónico.

---

### MÓDULO: Tipos de Comprobantes

**Boletas de Venta:**
Para ventas a consumidores finales con DNI. Serie debe empezar con B. Debe permitir emitir sin identificar al cliente (cliente genérico) si el monto es menor al límite establecido.

**Facturas:**
Para ventas a empresas con RUC. Serie debe empezar con F. Obligatorio identificar al cliente con RUC válido. Validar que el RUC exista consultando API de SUNAT.

**Notas de Crédito:**
Para anular comprobantes o hacer devoluciones. Debe referenciar al comprobante original. Tipos: anulación total, anulación parcial, descuento global, descuento por ítem. Debe devolver los productos al stock si es por devolución.

**Notas de Débito:**
Para ajustes que aumentan el monto del comprobante original. Menos común pero debe soportarse.

---

### MÓDULO: Gestión de Comprobantes

**Registro de Comprobantes:**
Cada comprobante emitido debe guardarse con: número correlativo único, tipo (01, 03, 07, 08), serie, número, fecha y hora de emisión, cliente (puede ser NULL si es genérico), monto total, estado (pendiente, aceptado, rechazado, anulado), XML generado, PDF generado, CDR recibido del OSE, respuesta del OSE, errores si los hubo.

**Consulta de Comprobantes:**
Debe haber una sección para buscar comprobantes emitidos por: rango de fechas, tipo de comprobante, serie y número, cliente, estado. Los resultados deben mostrar información resumida y permitir ver detalle, descargar XML, descargar PDF, imprimir, reenviar por email.

**Resumen Diario:**
Al final del día, generar automáticamente el Resumen Diario de boletas (si se emitieron boletas) y enviarlo a SUNAT. Esto es obligatorio para boletas electrónicas.

**Comunicación de Baja:**
Permitir dar de baja comprobantes emitidos por error. Generar el XML de comunicación de baja, enviarlo a SUNAT, registrar la respuesta. El comprobante debe marcarse como anulado pero conservar el registro.

---

## FASE 5: PROMOCIONES Y MARKETING

### MÓDULO: Motor de Promociones

**Creación de Promociones:**
Debe permitir crear diferentes tipos de descuentos: descuento por porcentaje sobre el total, descuento por monto fijo, producto X por Y (ejemplo: 2x1, 3x2), descuento progresivo (más compras, más descuento), descuento por categoría, descuento por marca, descuento por producto específico.

Para cada promoción configurar: nombre descriptivo, tipo de descuento, valor del descuento, condiciones de aplicación, fecha y hora de inicio, fecha y hora de fin, canales donde aplica (solo tienda, solo web, ambos), puede combinarse con otras promociones (sí o no), uso máximo por cliente, uso máximo global.

**Cupones de Descuento:**
Crear cupones con: código único (generado automáticamente o personalizado), tipo de descuento (porcentaje o monto fijo), valor del descuento, monto mínimo de compra requerido, cantidad de usos permitidos (ilimitado o número específico), usos por cliente (uno o múltiples), vigencia (fechas de inicio y fin), productos o categorías aplicables, canales donde funciona.

**Aplicación Automática:**
Las promociones configuradas como automáticas deben aplicarse sin intervención al agregar productos al carrito. Debe mostrarse claramente qué descuento se aplicó y por qué. Si hay múltiples promociones aplicables, aplicar la más beneficiosa para el cliente o la que tenga mayor prioridad configurada.

**Validación de Promociones:**
Al aplicar una promoción o cupón, validar: que esté vigente, que no haya alcanzado su límite de usos, que se cumplan las condiciones (monto mínimo, productos específicos), que el cliente no haya alcanzado su límite de uso. Mostrar mensajes claros si una promoción no aplica y por qué.

---

### MÓDULO: Programa de Puntos

**Acumulación de Puntos:**
Configurar la regla de acumulación: cuántos soles equivalen a un punto (ejemplo: 1 punto por cada S/10 gastados). Al completar una venta, calcular automáticamente los puntos ganados y agregarlos al saldo del cliente. No acumular puntos sobre envíos, solo sobre productos.

**Canje de Puntos:**
Configurar la regla de canje: cuántos puntos equivalen a cuánto descuento (ejemplo: 100 puntos = S/10 de descuento). Durante el checkout, permitir al cliente elegir cuántos puntos quiere canjear. Validar que tenga suficientes puntos. Aplicar el descuento y descontar los puntos del saldo.

**Historial de Puntos:**
Para cada cliente, llevar un registro detallado: fecha y hora del movimiento, tipo (ganados por compra, canjeados, ajuste manual, expirados), cantidad de puntos, referencia (número de venta o pedido), saldo anterior, saldo nuevo.

**Expiración de Puntos:**
Los puntos deben poder configurarse para expirar después de cierto tiempo. Ejecutar proceso automático que expire puntos antiguos y registre el movimiento.

---

## FASE 6: REPORTES Y ANALYTICS

### MÓDULO: Dashboard Ejecutivo

**KPIs Principales:**
Mostrar en tiempo real: ventas del día (monto total), ventas del mes actual, ventas del año, comparativo con periodo anterior, cantidad de transacciones, ticket promedio, productos más vendidos hoy, stock valorizado total, clientes nuevos del mes.

Usar gráficos visuales: números grandes y destacados para métricas principales, indicadores de tendencia (flecha arriba o abajo), gráficos de líneas para evolución temporal.

**Gráficos de Tendencias:**
Incluir: gráfico de ventas diarias del último mes, gráfico de ventas mensuales del último año, gráfico comparativo de ventas por canal (tienda vs web), gráfico de categorías más vendidas.

---

### MÓDULO: Reportes de Ventas

**Reporte de Ventas por Periodo:**
Permitir seleccionar rango de fechas y generar reporte mostrando: total vendido, cantidad de transacciones, ticket promedio, ventas por canal, ventas por método de pago, ventas por vendedor, ventas por categoría de producto, tendencia diaria dentro del periodo.

**Reporte de Ventas por Producto:**
Mostrar para cada producto en el periodo seleccionado: cantidad vendida, monto total vendido, margen obtenido (si se tiene el costo), porcentaje sobre ventas totales, tendencia (si está subiendo o bajando).

**Reporte de Ventas por Cliente:**
Mostrar ranking de mejores clientes: monto total comprado, cantidad de compras, ticket promedio, última compra, categorías que más compra.

---

### MÓDULO: Reportes de Inventario

**Reporte de Stock Actual:**
Listar todos los productos mostrando: SKU, nombre, categoría, ubicación, cantidad en stock, stock valorizado (cantidad x costo), estado, días de inventario (estimación de cuántos días durará el stock actual).

**Reporte de Movimientos:**
Filtrar por tipo de movimiento y fechas mostrando: fecha, tipo de movimiento, producto, cantidad, ubicación, usuario, referencia.

**Reporte de Productos Agotados:**
Listar productos con stock cero o bajo stock mínimo para facilitar decisiones de reposición.

**Reporte de Valorización:**
Mostrar el valor total del inventario sumando cantidad en stock por costo de cada producto. Agrupar por categoría, marca o ubicación.

---

### MÓDULO: Reportes Contables

**Libro de Ventas:**
Generar reporte con formato de libro de ventas según normativa de SUNAT: fecha de emisión, tipo de comprobante, serie y número, tipo de documento del cliente, número de documento, nombre o razón social, base imponible, IGV, total.

Permitir exportar a Excel para importar en sistemas contables.

**Reporte de Caja:**
Por cada cierre de caja mostrar: vendedor, fecha y hora, monto inicial, ventas en efectivo, ventas en tarjeta, otros ingresos, egresos, monto esperado, monto contado, diferencia.

**Reporte de Comisiones:**
Si se manejan comisiones por vendedor, calcular automáticamente: total vendido por vendedor, comisión aplicable según reglas configuradas, comisión ganada en el periodo.

---

## FASE 7: CONFIGURACIÓN Y ADMINISTRACIÓN

### MÓDULO: Usuarios y Permisos

**Gestión de Usuarios:**
Crear usuarios del sistema con: nombre completo, email (usado como username), contraseña encriptada, rol asignado, estado (activo o inactivo), foto de perfil opcional, fecha de creación.

**Roles y Permisos:**
Definir roles predefinidos: Administrador (acceso total), Supervisor (puede ver todo, hacer cambios limitados), Vendedor (solo POS y consultas básicas), Bodeguero (solo inventario).

Para cada rol, configurar permisos granulares: qué módulos puede ver, qué acciones puede realizar (crear, editar, eliminar), qué reportes puede generar, límites operativos (ejemplo: descuento máximo que puede aplicar).

**Registro de Actividad:**
Llevar log de acciones críticas: quién accedió al sistema, cuándo, qué acciones realizó (creó producto, editó precio, hizo venta, aplicó descuento), IP desde donde se conectó.

---

### MÓDULO: Configuración General

**Datos de la Empresa:**
Configurar: nombre comercial, razón social, RUC, dirección fiscal, teléfonos, emails, redes sociales, logo (se usa en comprobantes y web), horarios de atención.

**Configuración de Comprobantes:**
Definir: series activas para boletas y facturas, numeración actual de cada serie, certificado digital, datos del OSE, plantilla de PDF para comprobantes.

**Configuración de Tienda Online:**
Configurar: nombre de la tienda online, URL del dominio, SEO (título, descripción, keywords), redes sociales, políticas de envío, políticas de devolución, términos y condiciones, métodos de pago habilitados, pasarelas de pago (credenciales), opciones de envío disponibles, costos de envío por zona.

**Configuración de Notificaciones:**
Configurar qué emails se envían automáticamente: confirmación de pedido, cambio de estado de pedido, comprobante electrónico, recuperación de contraseña, alertas de stock bajo, resumen diario de ventas.

---

### MÓDULO: Ubicaciones y Sucursales

**Gestión de Ubicaciones:**
Crear ubicaciones físicas donde se maneja stock: tienda principal, almacén central, sucursales. Para cada ubicación configurar: nombre, dirección completa, responsable, teléfono, horarios, si vende al público o solo almacena.

**Traspasos entre Ubicaciones:**
Permitir solicitar y aprobar traspasos de mercadería entre ubicaciones: seleccionar ubicación origen y destino, seleccionar productos y cantidades a traspasar, generar orden de traspaso, confirmar recepción en destino, automáticamente actualizar stock en ambas ubicaciones.

---

## FASE 8: INTEGRACIONES EXTERNAS

### MÓDULO: Pasarelas de Pago

**Niubiz / Izipay / Culqi:**
Integrar con la pasarela de pagos elegida para procesar pagos con tarjeta en la tienda online. Debe: redirigir al formulario seguro de la pasarela o mostrar formulario embebido, procesar el pago, recibir confirmación de pago exitoso o rechazado, si es exitoso, confirmar el pedido automáticamente, si falla, permitir reintentar.

**Webhooks:**
Implementar endpoint para recibir notificaciones de la pasarela cuando un pago se confirma o cancela. Actualizar automáticamente el estado del pedido según la notificación recibida.

---

### MÓDULO: Courier y Envíos

**Integración con Courier:**
Integrar con API de courier (Olva, Shalom, etc.) para: calcular costo de envío automáticamente según distrito, peso y dimensiones, generar orden de recojo automáticamente al confirmar pedido, obtener código de tracking, consultar estado de envío en tiempo real.

**Gestión de Envíos:**
Listar pedidos pendientes de envío. Permitir imprimir etiquetas de envío con código de barras del tracking. Actualizar estado del pedido cuando el courier confirma recolección o entrega.

---

### MÓDULO: APIs de Validación

**API RENIEC:**
Al registrar cliente con DNI, consultar la API de RENIEC para obtener automáticamente nombres completos, verificar que el DNI sea válido.

**API SUNAT:**
Al registrar cliente con RUC, consultar la API de SUNAT para obtener automáticamente razón social, dirección fiscal, estado del contribuyente, verificar que el RUC esté activo.

---

## FORMATO DE ENTREGA DE CADA FASE

Para cada módulo descrito anteriormente, necesito que generes:

**Pantallas y Vistas:**
Todas las interfaces de usuario necesarias con diseño moderno, responsive, intuitivo. Incluir validaciones visuales, mensajes de error amigables, loaders mientras carga, confirmaciones antes de acciones destructivas.

**Flujos de Usuario:**
Describir paso a paso cómo el usuario interactúa con cada funcionalidad. Considerar casos de uso comunes y casos edge (qué pasa si no hay stock, qué pasa si el pago falla, etc).

**Validaciones:**
Todas las reglas de negocio que deben validarse antes de permitir acciones. Por ejemplo: no permitir vender más stock del disponible, no permitir aplicar descuento mayor al precio del producto, validar que el email tenga formato correcto.

**Mensajes y Notificaciones:**
Qué mensajes se muestran al usuario en cada situación (éxito, error, advertencia, información). Deben ser claros y ayudar al usuario a entender qué pasó y qué debe hacer.

**Responsividad:**
Todas las pantallas deben funcionar correctamente en diferentes dispositivos: desktop (1920px, 1366px), tablet (768px), móvil (375px). Ajustar layouts, ocultar elementos secundarios en móvil si es necesario, hacer botones más grandes para touch.
