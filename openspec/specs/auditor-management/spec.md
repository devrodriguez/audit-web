## Purpose

Permite a administradores crear y corregir auditores desde un dialogo unico, manteniendo el email como llave de acceso y dejando los historicos de auditoria inalterados.

## Requirements

### Requirement: Editar nombre y apellido del auditor via dialogo
El sistema SHALL permitir a un usuario ADMIN editar el nombre y apellido de un auditor existente mediante el dialogo unico de datos con los valores precargados.

#### Scenario: Abrir dialogo de edicion
- **WHEN** el ADMIN elige Edit en el menu de un auditor de la lista
- **THEN** el sistema abre un dialogo con los campos nombre y apellido precargados con los valores actuales y el email visible pero no editable

#### Scenario: Guardar cambios validos
- **WHEN** el ADMIN modifica nombre y/o apellido con valores no vacios y confirma Guardar
- **THEN** el sistema actualiza el documento del auditor, cierra el dialogo y refleja los nuevos valores en la lista

#### Scenario: Cancelar sin cambios
- **WHEN** el ADMIN cierra o cancela el dialogo sin confirmar
- **THEN** el sistema no modifica ningun dato y la lista permanece igual

### Requirement: Email del auditor solo-lectura
El sistema SHALL mostrar el email del auditor en el dialogo de edicion como solo-lectura y SHALL rechazar cualquier intento de modificarlo por esta via.

#### Scenario: Email no editable
- **WHEN** el ADMIN abre el dialogo de edicion
- **THEN** el sistema muestra el email deshabilitado sin permitir su modificacion

### Requirement: Validacion de campos
El sistema SHALL exigir nombre y apellido no vacios y SHALL impedir guardar mientras alguno sea invalido.

#### Scenario: Campos vacios bloquean guardado
- **WHEN** el ADMIN vacia el nombre o el apellido
- **THEN** el sistema muestra error de requerido y mantiene deshabilitada la accion Guardar

### Requirement: Aviso de historicos inalterados
El sistema SHALL mostrar en el dialogo un aviso indicando que las auditorias y reportes historicos conservan el nombre con el que fueron firmados.

#### Scenario: Aviso visible
- **WHEN** el ADMIN abre el dialogo de edicion
- **THEN** el sistema muestra el aviso de historicos inalterados antes de confirmar

### Requirement: Crear auditor via el mismo dialogo
El sistema SHALL permitir a un usuario ADMIN crear un auditor mediante el mismo dialogo de datos, con nombre, apellido y email editables, en lugar de un formulario fijo en la pagina.

#### Scenario: Abrir dialogo de creacion
- **WHEN** el ADMIN pulsa "Nuevo auditor"
- **THEN** el sistema abre el dialogo con los campos vacios, el titulo de creacion y el email editable

#### Scenario: Guardar auditor nuevo valido
- **WHEN** el ADMIN completa nombre, apellido y un email con formato valido y confirma Guardar
- **THEN** el sistema crea el documento del auditor, cierra el dialogo y muestra el nuevo auditor en la lista

#### Scenario: Email invalido bloquea el guardado en creacion
- **WHEN** el ADMIN ingresa un email con formato invalido en modo creacion
- **THEN** el sistema muestra error de formato y mantiene deshabilitada la accion Guardar

### Requirement: Manejo de errores de guardado
El sistema SHALL informar al ADMIN cuando el guardado falle y SHALL mantener el dialogo abierto con los datos ingresados para reintentar.

#### Scenario: Fallo de guardado
- **WHEN** ocurre un error al persistir los cambios
- **THEN** el sistema muestra un mensaje de error y no cierra el dialogo ni altera la lista
