## Context

Ver `proposal.md` (Why) y `specs/auditor-management/spec.md` (comportamiento). Estado actual: `AuditorService` (`src/app/services/auditor.service.ts`) solo expone get/create/remove sobre la coleccion `auditors`; la pagina ADMIN `pages/auditor/create/` tiene boton Edit sin handler y form solo de alta con `name/lastName/email` required. El proyecto ya usa Material Dialog (`edit-audit` -> `CkeditorComponent`) y `MatSnackBar` para feedback. Firestore rules no estan en el repo; se asume que quien puede crear/borrar auditores puede actualizarlos.

## Goals / Non-Goals

**Goals:**
- Creacion y edicion ADMIN de auditores via un dialogo unico con dos modos (sin `auditor` en `data` = crear con email editable; con `auditor` = editar con email read-only) y aviso de historicos.
- La pagina `/auditor` queda en descripcion + boton "Nuevo auditor" + lista; se elimina el formulario fijo de alta.
- Reutilizar validacion y feedback existentes (required, patron de email, snackbar) sin nuevas dependencias.

**Non-Goals:**
- Cambio de email, sincronizacion `users`/Auth, backfill de copias embebidas en `audits`, cambios de rutas/guards/roles, historial de cambios del auditor.

## Decisions

- **Dialogo unico crear/editar vs dos flujos.** Elegido un solo componente con modo segun `data.auditor?`: evita duplicar validaciones y mantiene UX simetrica; la pagina pierde el form fijo y gana un boton "Nuevo auditor" sobre la lista. Alternativa de dos dialogos descartada: duplicaba form y validacion.
- **Nuevo metodo de update con `updateDoc` parcial `{name, lastName}`.** Rationale: escritura minima, no toca `email`/`id`, consistente con `addDoc/deleteDoc` ya usados. Alternativa `setDoc` con merge descartada: mas amplia sin beneficio.
- **Precarga por `@Inject(MAT_DIALOG_DATA)` + cierre con resultado.** El dialogo recibe el `Auditor` seleccionado y devuelve los valores editados; el componente lista invoca el update y recarga via el observable existente `getAuditors()`. Alternativa de servicio con estado compartido descartada: innecesaria para un flujo puntual.
- **Email disabled, sin texto adicional.** Se muestra deshabilitado para preservar contexto; sin indicacion de baja+alta.
- **Aviso de historicos como texto fijo en el dialogo.** Sin logica adicional: las copias en `auditItems[].auditor` quedan como snapshot intencional (integridad de auditoria).

## Risks / Trade-offs

- [Risk] Sin rules en el repo, un `updateDoc` podria fallar por permisos aunque create/delete funcionen → Mitigacion: el dialogo mantiene datos y muestra error con reintento (ver spec); verificar rules en consola Firebase antes de implementar.
- [Risk] Edicion concurrente (dos ADMIN editan el mismo auditor) con last-write-wins → Mitigacion aceptada: ventana pequena, sin lock; documentado como trade-off.
- [Risk] Nombres con espacios/casing inconsistente vs filtro por `name` en reportes (`audit-report.component.ts`) → Mitigacion: `trim()` al guardar; sin normalizacion mayor (fuera de alcance).
- [Trade-off] Historicos muestran nombre viejo → Asumido como integridad, comunicado via aviso; no hay migracion de datos.

## Migration Plan

- Sin migracion de datos ni despliegue especial: cambio contenido en `auditors`, pagina ADMIN existente. Rollback: revertir el commit del dialogo + metodo (la coleccion queda intacta salvo docs ya editados, que conservan valores validos).

## Open Questions

- Ninguna que cambie spec, enfoque o tasks. Detalle menor deferible: textos exactos del dialogo/aviso (espanol vs ingles actual mixto) se fijan al implementar.
