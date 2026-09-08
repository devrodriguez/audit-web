## 1. Servicio

- [x] 1.1 Agregar `updateAuditor` parcial (`name`, `lastName` con `trim`) en `AuditorService` y verificar que compila la app sin errores de tipos
- [x] 1.2 Verificar en consola Firebase que el rol ADMIN puede actualizar docs de `auditors` (o registrar el error de permisos observado)

## 2. Dialogo de edicion

- [x] 2.1 Crear componente de dialogo con form precargado (`name`, `lastName` required; `email` deshabilitado) y verificar que abre desde una llamada de prueba con datos mock
- [x] 2.2 Agregar aviso fijo de historicos inalterados + validacion (Guardar deshabilitado si invalido) y verificar visualmente ambos estados
- [x] 2.3 Implementar Guardar (retorna valores) y Cancelar (sin cambios) y verificar que el dialogo cierra con el resultado esperado en cada caso
- [x] 2.4 Declarar el dialogo en el modulo correspondiente y verificar que `ng serve` compila sin errores

## 3. Integracion en pagina de auditores

- [x] 3.1 Conectar el boton Edit del menu al dialogo pasando el auditor seleccionado y verificar que abre precargado
- [x] 3.2 Persistir cambios via `updateAuditor`, recargar la lista y mostrar feedback (exito/error sin cerrar ante fallo) y verificar cada escenario manualmente
- [x] 3.3 Agregar boton "Nuevo auditor" que abre el dialogo en modo creacion y verificar que abre con campos vacios
- [x] 3.4 Implementar modo creacion en el dialogo (email editable con validacion de formato + `createAuditor`) y eliminar el formulario fijo de alta de la pagina
- [x] 3.5 Verificar flujo completo en `http://localhost:4200/auditor`: crear valido, crear con email invalido (bloqueado), editar, cancelar, guardar vacio (bloqueado), error simulado

## 4. Validacion final

- [x] 4.1 Ejecutar `openspec validate "edit-auditor-data" --json` y verificar que pasa, y correr `npx ng build` (Node 16.14.0) para verificar que no hay regresiones de compilacion
