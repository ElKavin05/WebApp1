# CashPlan

Aplicación web local para proyectar el saldo al final de cada día, detectar el primer saldo negativo y probar cambios en una simulación separada.

La barra de preferencias permite elegir el país y adaptar automáticamente la moneda, los separadores numéricos y el formato de fecha. La interfaz puede mostrarse en español o inglés y dispone de apariencia clara y nocturna.

Cada plan puede usar un período quincenal de 15 días, mensual de 30 días o una fecha final personalizada. La simulación conserva su propio período y nunca modifica el plan original.

## Cómo abrirla

La opción más sencilla es abrir `index.html` con un navegador moderno. No necesita instalación ni conexión a internet.

Si el navegador limita la apertura directa de archivos locales, inicia un servidor desde esta carpeta:

```powershell
python -m http.server 8080
```

Después visita `http://localhost:8080`.

## Datos

Los datos viven solo en la memoria de la pestaña. No se guardan en el navegador ni se envían a ningún servicio, y se pierden al actualizar o cerrar la página.

## Páginas públicas

La navegación y el pie de página enlazan la herramienta, `como-funciona.html`,
`guias.html`, `privacidad.html`, `contacto.html` y `acerca.html`. Las tres guías
abordan planificación quincenal, cobros estimados y lectura del saldo diario.
Son archivos HTML estáticos: funcionan sin un servidor de rutas ni JavaScript.
Desde la herramienta, las páginas informativas se abren en otra pestaña para
preservar el plan en memoria. El contenido editorial está en español.

El ejemplo de «Cómo funciona» sigue `buildExample` de `core.js`: saldo inicial
150, pagos de 50, 55 y 70 y cobro de 600; primer déficit al cuarto día (−25),
saldo final 575. Reducir el pago de 70 a 40 en la simulación deja un saldo final
605 y elimina los días negativos.

Responsable del proyecto: CirenCore. Contacto: cirencore.contact@gmail.com.
Antes de publicar, revisar los registros y la política del alojamiento real. No se ha integrado publicidad:
la sección de AdSense describe una integración futura y no sustituye su
configuración ni los controles de consentimiento necesarios.

## Aprende a planificar

`guias.html` es la portada editorial y conserva su URL anterior. Reúne cinco
artículos prácticos: dinero hasta el próximo cobro, planificación quincenal,
retrasos de cobro, planificación en papel y digital, y errores de saldo.
`planificacion-quincenal.html` amplía la guía existente. Las referencias
`saldo-diario.html` y `cobros-estimados.html` siguen disponibles como ayuda de uso.
Cada artículo identifica a CirenCore, incluye un ejemplo ficticio y enlaza la
herramienta y lecturas relacionadas. Los archivos son HTML estático y no
requieren nuevas dependencias ni servicios externos.
