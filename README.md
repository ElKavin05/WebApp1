# Hasta la quincena

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
