## Why

La pagina `/auditor` promete "Cree, actualice y elimine auditores" pero el boton Edit del menu no hace nada (`create-auditor.component.html`) y `AuditorService` no tiene metodo de actualizacion. Los ADMIN no pueden corregir nombre/apellido sin borrar y recrear, lo que rompe asignaciones por email.

## What Changes

- Agregar edicion de datos del auditor (Opcion A): `name` y `lastName` editables, `email` visible pero solo-lectura.
- Conectar el boton Edit existente a un dialogo dedicado (Material Dialog) con form precargado, validacion required y acciones Guardar/Cancelar.
- Agregar `updateAuditor(id, {name, lastName})` en `AuditorService` via `updateDoc`.
- Mostrar aviso en el dialogo: los reportes/auditorias historicas conservan el nombre con el que se firmaron (las copias embebidas en `audits[].auditItems[].auditor` no se reescriben).
- Sin cambios de roles/rutas: sigue ADMIN-only; sin sincronizacion con `users`/Auth; cambio de email se resuelve via baja+alta + reasignacion (fuera de alcance).

## Capabilities

### New Capabilities
- `auditor-management`: gestion del ciclo de vida del auditor desde la pagina ADMIN — crear, listar, borrar (existente) y ahora editar nombre/apellido via dialogo con email read-only y aviso de historicos.

### Modified Capabilities
- (vacío — no hay specs previas que modificar)

## Impact

- Afecta: `src/app/services/auditor.service.ts` (nuevo metodo update), `src/app/pages/auditor/create/*` (menu Edit + dialogo nuevo), patron Material Dialog ya usado en `edit-audit`/`ckeditor`.
- No afecta: `users`/Auth, guards, rutas, navbar, `experience`, reportes, reglas de Firestore (no hay rules en repo; se asume ADMIN ya puede escribir `auditors`).
- Riesgo conocido (fuera de alcance pero registrado): `AuthGuard` hace `resolve(true)` aun tras redirigir y `experience` filtra en cliente por email.
