# Mejores Prácticas para Conventional Commits

Guía con ejemplos detallados de commits buenos y malos, errores comunes y cómo evitarlos.

## 1. El Problema de los Commits Vagos

### ❌ MAL: Commits sin contexto

```bash
git commit -m "fix"
git commit -m "update code"
git commit -m "changes"
git commit -m "WIP"
git commit -m "fix bug"
git commit -m "refactor"
```

**Por qué es malo:**

- Imposible entender qué se cambió sin ver el diff
- No se puede buscar en el historial
- Dificulta debugging (¿qué introducir esta regresión?)
- No genera changelog útil

### ✅ BIEN: Commits descriptivos y específicos

```bash
git commit -m "fix(auth): prevenir redirect loop después de logout"
git commit -m "feat(api): añadir endpoint GET /users/:id/orders"
git commit -m "refactor(parser): extraer validación de JSON a función separada"
git commit -m "perf(database): añadir índice compuesto a (user_id, created_at)"
git commit -m "docs(readme): actualizar instrucciones de instalación para Node 20"
```

**Por qué es bueno:**

- Específico sobre qué cambió
- Incluye tipo y scope
- Búsqueda fácil: `git log --grep="auth"`
- Genera changelog automático legible

---

## 2. Modo Verbal: Imperativo vs Pasado

### ❌ MAL: Tiempo pasado o gerundio

```bash
git commit -m "feat: añadí login con Google"
git commit -m "fix: corrigió el error de validación"
git commit -m "refactor: refactorizando el módulo de pagos"
git commit -m "docs: actualicé el README"
git commit -m "chore: actualizadas las dependencias"
```

**Por qué es malo:**

- No sigue la convención de Conventional Commits
- Inconsistente con comandos de Git (`git revert`, `git merge`)
- Menos conciso

### ✅ BIEN: Modo imperativo (como dar una orden)

```bash
git commit -m "feat: añadir login con Google"
git commit -m "fix: corregir error de validación"
git commit -m "refactor: simplificar módulo de pagos"
git commit -m "docs: actualizar README con ejemplos"
git commit -m "chore: actualizar dependencias a últimas versiones"
```

**Por qué es bueno:**

- Sigue la convención estándar
- Consistente con Git: "Esta commit va a... añadir login"
- Más conciso y directo

**Truco:** El commit debe completar la frase: "Si se aplica, este commit va a **\_\_**"

---

## 3. Descripción: Minúscula después de los dos puntos

### ❌ MAL: Primera letra en mayúscula

```bash
git commit -m "feat: Añadir sistema de notificaciones"
git commit -m "fix: Corregir cálculo de impuestos"
git commit -m "docs: Actualizar guía de API"
```

**Por qué es malo:**

- No sigue la especificación de Conventional Commits
- Inconsistente con herramientas de automatización

### ✅ BIEN: Minúscula después de ": "

```bash
git commit -m "feat: añadir sistema de notificaciones"
git commit -m "fix: corregir cálculo de impuestos"
git commit -m "docs: actualizar guía de API"
```

**Excepción:** Nombres propios o acrónimos

```bash
git commit -m "feat: integrar Google Analytics"
git commit -m "fix: corregir parsing de JSON"
git commit -m "build: actualizar Node.js a v20"
```

---

## 4. No Mezclar Tipos de Cambios

### ❌ MAL: Un commit con múltiples cambios no relacionados

```bash
# Commit que hace TODO:
git commit -m "feat: añadir dark mode, corregir bug en login, actualizar README, refactor de utils"

# Cambios en el diff:
# - Nueva feature de tema oscuro (feat)
# - Corrección de bug (fix)
# - Documentación (docs)
# - Refactor no relacionado (refactor)
```

**Por qué es malo:**

- Difícil de revertir si hay problemas
- No puedes cherry-pick la feature sin el bug fix
- Confunde al revisar código
- ¿Qué versión semántica generar? (MINOR por feat? PATCH por fix?)

### ✅ BIEN: Commits atómicos separados

```bash
# Commit 1: Solo la feature
git commit -m "feat(ui): añadir modo oscuro con toggle persistente"

# Commit 2: Solo el fix
git commit -m "fix(auth): prevenir redirect loop en página de login"

# Commit 3: Solo docs
git commit -m "docs(readme): actualizar ejemplos de configuración"

# Commit 4: Solo refactor
git commit -m "refactor(utils): extraer función de formato de fecha"
```

**Por qué es bueno:**

- Cada commit puede revertirse independientemente
- Cherry-pick selectivo entre branches
- Revisión de código más clara
- Versionado semántico correcto

---

## 5. Longitud de la Descripción

### ❌ MAL: Descripción demasiado larga o demasiado corta

```bash
# Demasiado larga (>72 caracteres)
git commit -m "feat(api): implementar sistema completo de autenticación con JWT incluyendo refresh tokens y revocación de tokens para mejorar seguridad"

# Demasiado corta (vaga)
git commit -m "fix: error"
git commit -m "feat: new thing"
```

**Por qué es malo:**

- Descripción larga: se trunca en `git log --oneline`
- Descripción corta: no da contexto suficiente

### ✅ BIEN: Conciso pero descriptivo (~50 chars, máximo 72)

```bash
# Perfecto: 56 caracteres
git commit -m "feat(api): añadir autenticación JWT con refresh tokens"

# Usar cuerpo para detalles adicionales
git commit -m "feat(api): añadir autenticación JWT con refresh tokens

Implementa:
- Generación de access token (15min) y refresh token (7 días)
- Endpoint POST /auth/refresh para renovar tokens
- Revocación de tokens en logout
- Blacklist de tokens en Redis

Closes #234
"
```

**Por qué es bueno:**

- Descripción clara en una línea
- Cuerpo para contexto adicional
- Fácil de leer en `git log --oneline`

---

## 6. Breaking Changes: Ser Explícito

### ❌ MAL: Breaking change sin indicarlo

```bash
# El commit cambia la API pero no lo indica
git commit -m "feat(api): mejorar estructura de respuestas"

# En el código:
// Antes: { user_id: 1, user_name: "Juan" }
// Ahora: { id: 1, name: "Juan" }
```

**Por qué es malo:**

- Los usuarios actualizan y su código se rompe sin aviso
- No genera versión MAJOR en semver
- No aparece destacado en changelog

### ✅ BIEN: Indicar breaking changes con ! y footer

```bash
# Opción 1: ! después del scope
git commit -m "feat(api)!: cambiar estructura de respuestas a camelCase

BREAKING CHANGE: Los campos de la API ahora usan camelCase.
- user_id → userId
- user_name → userName
- created_at → createdAt

Actualizar código cliente para usar nueva nomenclatura.
Ver guía de migración: docs/api-v2-migration.md
"

# Opción 2: Solo BREAKING CHANGE en footer
git commit -m "refactor(database): normalizar nombres de tablas

BREAKING CHANGE: Las tablas ahora usan plural en inglés.
Ejecutar migración: npm run migrate:v2
"
```

**Por qué es bueno:**

- Genera versión MAJOR (2.0.0)
- Aparece destacado en changelog
- Incluye instrucciones de migración
- Los desarrolladores saben que hay cambios incompatibles

---

## 7. Uso Correcto del Scope

### ❌ MAL: Scopes inconsistentes o demasiado genéricos

```bash
# Inconsistente
git commit -m "feat(Auth): añadir login"           # Mayúscula
git commit -m "feat(authentication): añadir logout" # Nombre diferente
git commit -m "fix(auth_module): corregir token"    # Formato diferente

# Demasiado genérico
git commit -m "feat(app): añadir feature"
git commit -m "fix(code): corregir bug"
git commit -m "refactor(files): cambiar cosas"
```

**Por qué es malo:**

- No se pueden filtrar commits: `git log --grep="^feat(auth)"`
- Changelog desorganizado
- Dificulta entender arquitectura del proyecto

### ✅ BIEN: Scopes consistentes y específicos

Define scopes por componente/módulo al inicio del proyecto:

```bash
# Definir convención (ejemplo):
# Frontend: ui, components, pages, forms, navigation
# Backend: api, database, auth, payments, notifications
# Infra: docker, ci, deploy

# Commits con scopes consistentes:
git commit -m "feat(auth): añadir login con OAuth"
git commit -m "feat(auth): implementar logout"
git commit -m "fix(auth): corregir expiración de tokens"
git commit -m "test(auth): añadir tests de integración"

# Fácil de filtrar:
git log --oneline --grep="^.*\(auth\)"
```

**Por qué es bueno:**

- Historial organizado por módulo
- Fácil de buscar y filtrar
- Changelog agrupado por área

**Documentar scopes en CONTRIBUTING.md:**

```markdown
## Scopes del proyecto

- `auth`: Autenticación y autorización
- `api`: Endpoints REST
- `database`: Modelos, migraciones, queries
- `ui`: Componentes de interfaz
- `payments`: Integración con Stripe
```

---

## 8. Cuándo Usar el Cuerpo del Commit

### ❌ MAL: Toda la información en una línea

```bash
# Demasiada info en el subject
git commit -m "fix(cache): corregir race condition cuando múltiples workers procesan el mismo evento simultáneamente añadiendo lock optimista con version field"
```

**Por qué es malo:**

- Excede 72 caracteres
- Se trunca en herramientas
- Difícil de leer

### ✅ BIEN: Subject conciso, detalles en el cuerpo

```bash
git commit -m "fix(cache): prevenir race condition en write concurrente

Añade lock optimista usando campo version para evitar que
múltiples workers escriban el mismo registro simultáneamente.

Antes: El worker más lento sobrescribía el trabajo del rápido.
Ahora: El segundo write detecta conflicto y reintenta.

Reduce errores de datos inconsistentes de ~50/día a 0.

Fixes #456
Related: #234
"
```

**Por qué es bueno:**

- Subject conciso y legible
- Cuerpo explica "qué" y "por qué"
- Incluye contexto y resultados
- Referencias a issues

**Usa cuerpo cuando:**

- La descripción no cabe en 72 caracteres
- Necesitas explicar "por qué" (motivación)
- Hay múltiples cambios relacionados
- Incluyes breaking changes
- Añades referencias a issues/PRs

**No uses cuerpo cuando:**

- El cambio es obvio: `docs: fix typo in README`
- Es mantenimiento simple: `chore: update dependencies`

---

## 9. Footers: Referencias y Metadata

### ❌ MAL: Referencias desorganizadas o en lugares incorrectos

```bash
# En el cuerpo sin estructura
git commit -m "feat: añadir export

También cierra el issue #123 y #456 y fue revisado por @tech-lead
"

# Formato incorrecto
git commit -m "fix: corregir bug

CLOSES #123
FIXES #456
"
```

**Por qué es malo:**

- Los footers tienen formato específico
- Herramientas no pueden parsear referencias
- No se cierran automáticamente los issues

### ✅ BIEN: Footers estructurados al final

```bash
git commit -m "feat(export): añadir exportación a CSV y Excel

Implementa exportación de reportes en dos formatos.
Los archivos se generan en background para datasets grandes.

Closes #123
Fixes #456, #789
See also: #234
Reviewed-by: @tech-lead
Co-authored-by: María García <maria@example.com>
"
```

**Footers comunes:**

```bash
Closes #123              # Cierra issue
Fixes #123               # Corrige issue
Resolves #123            # Resuelve issue
See also: #123           # Referencia relacionada
Refs: #123               # Referencia

BREAKING CHANGE: ...     # Cambio incompatible
Reviewed-by: @user       # Revisor
Co-authored-by: Name <email>  # Co-autor
Acked-by: @user          # Aprobado por
Signed-off-by: Name <email>   # Firmado por
```

---

## 10. Commits Atómicos por Funcionalidad

### ❌ MAL: Commits que mezclan setup, implementación y docs

```bash
# Un único commit gigante
git commit -m "feat: añadir sistema de pagos

- Instalar Stripe SDK
- Crear migrations de tabla payments
- Implementar lógica de checkout
- Añadir tests
- Actualizar documentación
- Configurar webhooks
- Añadir validaciones
- Refactorizar utilidades de precio
"
```

**Por qué es malo:**

- Difícil de revisar (cambios en 20+ archivos)
- No se puede revertir parcialmente
- Git bisect inútil (demasiado amplio)
- Conflictos de merge complejos

### ✅ BIEN: Serie de commits lógicos y secuenciales

```bash
# Commit 1: Dependencias
git commit -m "build(deps): añadir Stripe SDK"

# Commit 2: Base de datos
git commit -m "feat(database): añadir migración de tabla payments"

# Commit 3: Lógica core
git commit -m "feat(payments): implementar flujo de checkout con Stripe"

# Commit 4: Webhooks
git commit -m "feat(payments): añadir handler de webhooks de Stripe"

# Commit 5: Validaciones
git commit -m "feat(payments): añadir validación de montos y monedas"

# Commit 6: Tests
git commit -m "test(payments): añadir tests de integración"

# Commit 7: Docs
git commit -m "docs(payments): documentar API de pagos"
```

**Por qué es bueno:**

- Cada commit es autocontenido
- Fácil de revisar paso a paso
- Se puede revertir cualquier pieza
- Git bisect funciona correctamente
- Historia clara del desarrollo

---

## 11. Errores Comunes con Tipos

### ❌ MAL: Tipo incorrecto para el cambio

```bash
# Feature disfrazada de fix
git commit -m "fix: añadir validación de contraseña fuerte"
# Debería ser: feat(auth): añadir requisitos de contraseña fuerte

# Refactor que corrige un bug
git commit -m "refactor: mejorar lógica de cálculo"
# Si corrige comportamiento incorrecto, debería ser: fix

# Chore para cambio significativo
git commit -m "chore: cambiar estructura de base de datos"
# Debería ser: refactor(database)! (breaking change)

# Style con cambio funcional
git commit -m "style: renombrar función calculateSum"
# Si el renombrado tiene implicaciones, debería ser: refactor
```

### ✅ BIEN: Tipo apropiado según el impacto

```bash
# Nueva funcionalidad → feat
git commit -m "feat(auth): añadir requisitos de contraseña fuerte"

# Corrección de comportamiento incorrecto → fix
git commit -m "fix(calculator): corregir redondeo de decimales"

# Mejora sin cambio de funcionalidad → refactor
git commit -m "refactor(utils): simplificar lógica de validación"

# Cambio estructural que rompe compatibilidad → con !
git commit -m "refactor(database)!: migrar a Prisma schema

BREAKING CHANGE: Los modelos ahora usan el formato de Prisma.
Ejecutar: npx prisma migrate deploy
"

# Solo formato sin cambio de lógica → style
git commit -m "style: aplicar Prettier a todo el proyecto"
```

**Guía rápida de decisión:**

```
¿Añade funcionalidad nueva?
├─ Sí → feat
└─ No ┐
       │
       ¿Corrige un bug/comportamiento incorrecto?
       ├─ Sí → fix
       └─ No ┐
              │
              ¿Mejora rendimiento?
              ├─ Sí → perf
              └─ No ┐
                     │
                     ¿Cambia estructura/código sin cambiar funcionalidad?
                     ├─ Sí → refactor
                     └─ No → style/docs/chore/test/build/ci
```

---

## 12. Ejemplos del Mundo Real

### Ejemplo Completo: Feature con Breaking Change

```bash
git commit -m "feat(api)!: añadir paginación a listado de usuarios

Implementa paginación cursor-based para mejor rendimiento.
Reemplaza paginación offset/limit tradicional.

Cambios en respuesta:
- Añade campos 'cursor' y 'hasMore'
- Elimina campos 'total' y 'pages'
- Nuevo parámetro opcional 'cursor' en query

Beneficios:
- 80% más rápido en tablas grandes (>1M registros)
- Evita problema de página desincronizada
- Preparado para infinite scroll

GET /api/users?limit=20&cursor=abc123

Respuesta:
{
  \"data\": [...],
  \"cursor\": \"xyz789\",
  \"hasMore\": true
}

BREAKING CHANGE: La respuesta ya no incluye 'total' ni 'pages'.
Actualizar código cliente para usar paginación cursor-based.
Ver guía: docs/api/pagination-migration.md

Closes #789
Reviewed-by: @backend-lead
"
```

### Ejemplo Completo: Fix con Contexto Técnico

```bash
git commit -m "fix(websocket): prevenir memory leak en conexiones largas

Resuelve memory leak causado por listeners no removidos en
eventos de disconnect/reconnect.

Problema:
- Cada reconexión añadía nuevos event listeners
- En conexiones de >24h, ~500MB de memoria leaked
- Causaba eventual crash de Node por OOM

Solución:
- Usar removeAllListeners() en cleanup
- Implementar WeakMap para referencias de listeners
- Añadir timeout de cleanup después de disconnect

Testing:
- Stress test de 1000 reconexiones: memoria estable
- Sin leaks detectados en heap dumps
- Reducción de 95% en uso de memoria después de 24h

Fixes #1234
Related: #890, #765
"
```

### Ejemplo Completo: Refactor Multi-Módulo

```bash
git commit -m "refactor(api,database): extraer query builder a librería

Consolida lógica duplicada de construcción de queries SQL
en los módulos de users, orders y products.

Antes:
- Cada módulo tenía su propio query builder (300+ líneas duplicadas)
- Bugs de SQL injection en module users y orders
- Inconsistencia en manejo de filtros

Después:
- Librería compartida en lib/query-builder.ts (150 líneas)
- Validación centralizada previene SQL injection
- API consistente: builder.select().where().orderBy()

Sin cambios funcionales, solo reorganización de código.
Tests existentes pasan sin modificación.

Related: #456
"
```

---

## 13. Cuándo NO Seguir las Reglas al Pie de la Letra

### Commits de Merge

```bash
# Git genera estos automáticamente
Merge pull request #123 from feature/dark-mode

# O en merge directo
Merge branch 'feature/payments' into main
```

**No necesitan formato de Conventional Commits.**

### Commits de Revert

```bash
# Git genera el formato
Revert "feat(auth): añadir OAuth"

This reverts commit a1b2c3d4e5f6.
```

**El formato de revert ya es estándar.**

### Commits de Desarrollo Local (Antes de Push)

Durante desarrollo local puedes hacer commits más informales:

```bash
git commit -m "wip: experimentando con query optimization"
git commit -m "tmp: checkpoint antes de refactor grande"
```

**Pero antes de push, haz squash/rebase interactivo:**

```bash
# Combinar commits de desarrollo en uno bien formado
git rebase -i main

# Resultado final limpio
git commit -m "perf(database): optimizar consulta de reportes"
```

---

## 14. Checklist Antes de Hacer Commit

Usa esta checklist para validar tus commits:

```
✅ El tipo es correcto (feat/fix/docs/etc)?
✅ El scope es específico y consistente?
✅ La descripción está en modo imperativo?
✅ La descripción tiene minúscula después de ": "?
✅ La descripción es concisa (<72 caracteres)?
✅ El commit es atómico (un solo cambio lógico)?
✅ Los tests pasan?
✅ El código compila sin errores?
✅ Incluye BREAKING CHANGE si cambia API?
✅ Tiene cuerpo si necesita contexto?
✅ Los footers referencian issues correctamente?
✅ No hay archivos no relacionados en el commit?
```

---

## 15. Anti-Patrones Comunes

### 1. El Commit "Cambios Varios"

```bash
❌ git commit -m "chore: cambios varios del día"
✅ Hacer commits separados por tema
```

### 2. El Commit "Fix Typo" (En Commit Anterior)

```bash
❌ git commit -m "fix: typo en commit anterior"
✅ git commit --amend  # Si no has hecho push
✅ git rebase -i       # Si puedes reescribir historia
```

### 3. El Commit "Final" (Y luego hay 5 más)

```bash
❌ git commit -m "feat: version final"
❌ git commit -m "feat: version final 2"
❌ git commit -m "feat: ahora si final"
✅ git commit -m "feat(module): descripción clara del cambio"
```

### 4. Commits de "Debugging"

```bash
❌ git commit -m "debug: añadir console.logs"
❌ git commit -m "test: probando algo"
✅ No hacer commit de código de debugging
✅ Usar git stash para cambios temporales
```

### 5. Commits Masivos los Viernes

```bash
❌ git commit -m "feat: todo lo que hice esta semana"
✅ Hacer commits incrementales durante el desarrollo
✅ Usar feature branches con commits organizados
```

---

## 16. Referencias a Tickets JIRA

Cuando trabajas con JIRA, incluir referencias a tickets es esencial para trazabilidad.

### ❌ MAL: Referencias inconsistentes o en lugar incorrecto

```bash
# Vago - no se sabe qué ticket
git commit -m "feat: añadir feature del ticket"

# Formato inconsistente en el mismo proyecto
git commit -m "feat: añadir login PROJ-123"  # En subject
git commit -m "[PROJ-124] fix: corregir bug"  # Entre corchetes
git commit -m "feat: añadir registro (#PROJ-125)"  # Con #

# Múltiples tickets sin contexto
git commit -m "fix: varios fixes

JIRA: PROJ-1, PROJ-2, PROJ-3, PROJ-4, PROJ-5"

# Mezclar tickets de diferentes proyectos sin orden
git commit -m "fix: corregir bugs

JIRA: BACKEND-123, FRONTEND-456, MOBILE-789, API-234"
```

**Por qué es malo:**

- Formato inconsistente dificulta búsquedas
- No se sabe cuál es el ticket principal
- Múltiples tickets sugiere commit no atómico
- Dificulta integración automática con JIRA

### ✅ BIEN: Referencias claras y consistentes

```bash
# Opción 1: Footer con JIRA: (RECOMENDADO)
git commit -m "feat(auth): implementar login con OAuth2

Añade soporte para Google y GitHub OAuth.
Incluye refresh automático de tokens.

JIRA: PROJ-1234"

# Opción 2: Footer con Refs:
git commit -m "fix(checkout): corregir cálculo de impuestos

Refs: PROJ-456"

# Opción 3: Subject con prefijo (si lo requiere el equipo)
git commit -m "[PROJ-789] feat(payments): integrar Stripe"

# Múltiples tickets relacionados (con ticket principal primero)
git commit -m "fix(api): resolver issues de validación

Corrige validación inconsistente en endpoints de usuario
y producto que causaban errores 400 inesperados.

JIRA: PROJ-456 (principal)
Related: PROJ-123, PROJ-789"

# Combinado con GitHub issues y JIRA
git commit -m "feat(export): añadir exportación a Excel

Closes #234
JIRA: PROJ-567"
```

**Por qué es bueno:**

- Formato consistente en todo el proyecto
- Fácil de buscar: `git log --grep="PROJ-456"`
- Integración automática con JIRA
- Claro cuál es el ticket principal

---

### Formatos de Referencia JIRA

#### Formato 1: Footer con JIRA: (Más Limpio)

```bash
# Ventajas: No afecta el subject, fácil de parsear
git commit -m "feat(dashboard): añadir widget de ventas

JIRA: PROJ-1234"

# Con múltiples tickets
git commit -m "refactor(api): consolidar endpoints de autenticación

JIRA: PROJ-456, PROJ-789, PROJ-890"
```

**Cuándo usar:**

- Proyectos que priorizan Conventional Commits limpio
- Cuando el ticket no es crítico para entender el commit
- Equipos que usan múltiples sistemas (GitHub + JIRA)

#### Formato 2: Prefijo en Subject (Más Visible)

```bash
# Ventajas: Visible en git log --oneline
git commit -m "[PROJ-1234] feat(dashboard): añadir widget de ventas"

# Variante con scope después
git commit -m "PROJ-1234 feat(dashboard): añadir widget de ventas"

# Con múltiples (no recomendado)
git commit -m "[PROJ-456,PROJ-789] fix(api): corregir validación"
```

**Cuándo usar:**

- Política de empresa lo requiere
- Integración JIRA requiere ticket en subject
- Búsqueda visual en `git log --oneline` es prioritaria

**Desventaja:** Alarga el subject (recordar límite de 72 caracteres)

#### Formato 3: Footer con Refs: (Genérico)

```bash
# Compatible con múltiples sistemas
git commit -m "fix(login): prevenir redirect loop

Refs: PROJ-456"

# Con URL completa
git commit -m "feat(api): añadir endpoint de notificaciones

Refs: https://company.atlassian.net/browse/PROJ-1234"
```

**Cuándo usar:**

- Quieres formato genérico (no específico a JIRA)
- También referencias a documentos, wikis, etc.

---

### Un Ticket vs Múltiples Tickets

#### ❌ MAL: Muchos tickets = commit no atómico

```bash
git commit -m "fix: varios fixes de esta semana

JIRA: PROJ-100, PROJ-101, PROJ-102, PROJ-103,
      PROJ-104, PROJ-105, PROJ-106

- Corregí el bug del login
- Arreglé la paginación
- Actualicé los estilos
- Refactoricé el API
- Documenté el código"
```

**Problema:** Un commit hace demasiadas cosas, difícil de revertir y revisar.

#### ✅ BIEN: Commits atómicos con un ticket principal

```bash
# Commit 1: Un ticket, un fix
git commit -m "fix(auth): prevenir redirect loop después de logout

JIRA: PROJ-100"

# Commit 2: Otro ticket, otro fix
git commit -m "fix(pagination): corregir cálculo de páginas totales

JIRA: PROJ-101"

# Commit 3: Tercer ticket
git commit -m "style(ui): actualizar paleta de colores

JIRA: PROJ-102"
```

#### ✅ ACEPTABLE: Múltiples tickets si están relacionados

```bash
# Varios bugs del mismo módulo con misma causa raíz
git commit -m "fix(validation): resolver validación inconsistente

Unifica lógica de validación que estaba duplicada.
Resuelve errores en formularios de login, registro y perfil.

JIRA: PROJ-456 (principal)
Also fixes: PROJ-123, PROJ-234"
```

**Criterio:** Los tickets están relacionados y la solución es una sola.

---

### Integración con Herramientas

#### Configuración de Commitlint para JIRA

```javascript
// commitlint.config.js
module.exports = {
	extends: ["@commitlint/config-conventional"],
	plugins: ["commitlint-plugin-jira-rules"],
	rules: {
		// Requiere ticket JIRA en footer
		"jira-task-id-min-length": [2, "always"],
		"jira-task-id-max-length": [2, "always"],
		"jira-task-id-separator": [2, "always", "-"],
	},
	// O validación custom
	parserPreset: {
		parserOpts: {
			headerPattern: /^(\[([A-Z]+-\d+)\]\s)?(.*)$/,
			headerCorrespondence: ["whole", "ticket", "subject"],
		},
	},
};
```

#### Git Hook para Validar JIRA

```bash
# .husky/commit-msg
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Extraer mensaje del commit
commit_msg=$(cat "$1")

# Verificar que contiene referencia JIRA
if ! echo "$commit_msg" | grep -qE '(JIRA: [A-Z]+-[0-9]+|\[[A-Z]+-[0-9]+\])'; then
  echo "❌ Error: El commit debe incluir referencia JIRA"
  echo "Formatos válidos:"
  echo "  - [PROJ-123] feat: descripción"
  echo "  - JIRA: PROJ-123 (en footer)"
  exit 1
fi

echo "✓ Referencia JIRA encontrada"
```

#### Buscar Commits por Ticket JIRA

```bash
# Buscar ticket específico
git log --all --grep="PROJ-1234"

# Con formato bonito
git log --all --grep="PROJ-1234" --oneline --decorate

# Todos los commits de un proyecto
git log --all --grep="PROJ-" --oneline

# En un rango de fechas
git log --all --grep="PROJ-456" --since="2026-01-01" --until="2026-01-31"

# Ver archivos modificados
git log --all --grep="PROJ-789" --name-only
```

---

### Ejemplos del Mundo Real

#### Ejemplo 1: Feature Nueva con JIRA

```bash
git commit -m "feat(notifications): implementar notificaciones push

Añade soporte para envío de notificaciones push a través
de Firebase Cloud Messaging.

Características:
- Segmentación por tipo de usuario
- Programación de envíos
- Tracking de apertura
- Template system para contenido

Requiere:
- Variables de env: FCM_SERVER_KEY, FCM_SENDER_ID
- Tabla 'push_tokens' (ver migración)

JIRA: NOTIF-234
Closes #456
"
```

#### Ejemplo 2: Bug Fix con Múltiples Tickets

```bash
git commit -m "fix(payment): resolver errores de procesamiento

Corrige race condition en procesamiento de pagos concurrentes
que causaba doble cobro en transacciones simultáneas.

Implementa lock pesimista a nivel de base de datos y
idempotency tokens para prevenir duplicados.

Anteriormente reportado en:
- Checkout móvil (Android/iOS)
- Checkout web con auto-retry
- Webhook de confirmación tardía

JIRA: PAY-678 (principal)
Also fixes: PAY-234, PAY-456
Refs: docs/payment-flow.md
"
```

#### Ejemplo 3: Refactor Grande con Referencia

```bash
git commit -m "refactor(database): migrar de MySQL a PostgreSQL

Requisito:
JIRA: INFRA-890

Cambios:
- Actualizar drivers y configuración
- Adaptar queries específicas de MySQL
- Migrar tipos de datos incompatibles
- Actualizar tests de integración

BREAKING CHANGE: Requiere PostgreSQL 14+
Migration guide: docs/postgres-migration.md
Downtime esperado: 2 horas
"
```

---

### Tabla de Referencia Rápida JIRA

| Situación                    | Formato Recomendado     | Ejemplo                                                        |
| ---------------------------- | ----------------------- | -------------------------------------------------------------- |
| **Un ticket, footer**        | `JIRA: PROJ-123`        | Ver Ejemplo 1 arriba                                           |
| **Un ticket, subject**       | `[PROJ-123] tipo: desc` | `[PROJ-123] feat: añadir login`                                |
| **Múltiples relacionados**   | Principal + Also fixes  | Ver Ejemplo 2 arriba                                           |
| **Ticket + GitHub issue**    | Ambos en footers        | `Closes #456\nJIRA: PROJ-123`                                  |
| **Sin ticket (excepcional)** | Explicar en cuerpo      | `chore: actualizar deps\n\n(No JIRA: mantenimiento rutinario)` |
| **Ticket de otro equipo**    | Incluir prefijo         | `JIRA: BACKEND-456\nRelated: FRONTEND-789`                     |

---

### Cuándo NO Incluir Ticket JIRA

Algunos commits no necesitan ticket:

```bash
# Mantenimiento rutinario
git commit -m "chore: actualizar dependencias"

# Fix de typos
git commit -m "docs: corregir typos en README"

# Formateo automático
git commit -m "style: aplicar Prettier"

# Merge commits
Merge branch 'feature/payments' into main

# Revert commits
Revert "feat: añadir feature problemática"
```

**Pero si tu equipo requiere ticket para TODO**, usa tickets genéricos:

- `MAINT-001` para mantenimiento
- `DOCS-001` para documentación
- `TECH-001` para deuda técnica

---

## Recursos de Validación Automática

### Setup con Husky + Commitlint

```bash
# Instalar
npm install --save-dev @commitlint/cli @commitlint/config-conventional husky

# Configurar commitlint
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js

# Setup husky
npx husky install
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

Ahora los commits no válidos serán rechazados:

```bash
$ git commit -m "añadí un feature"
⧗   input: añadí un feature
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]

✖   found 2 problems, 0 warnings
```

### Setup con Commitizen (Commits Interactivos)

```bash
npm install --save-dev commitizen cz-conventional-changelog

# Configurar
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

Hacer commits interactivos:

```bash
$ npx cz

? Select the type of change that you're committing: (Use arrow keys)
❯ feat:     A new feature
  fix:      A bug fix
  docs:     Documentation only changes
  style:    Changes that don't affect the code meaning
  refactor: A code change that neither fixes a bug nor adds a feature
  perf:     A code change that improves performance
  test:     Adding missing tests
```

---

## Tabla de Referencia Rápida

| Situación               | ❌ MAL                     | ✅ BIEN                             |
| ----------------------- | -------------------------- | ----------------------------------- |
| **Modo verbal**         | "añadí login"              | "añadir login"                      |
| **Mayúsculas**          | "feat: Añadir..."          | "feat: añadir..."                   |
| **Longitud**            | >72 caracteres en subject  | <72 chars, detalles en cuerpo       |
| **Vago**                | "fix bug"                  | "fix(auth): prevenir redirect loop" |
| **Mezclar cambios**     | feat + fix + docs en uno   | commits separados                   |
| **Breaking change**     | No indicarlo               | usar ! o BREAKING CHANGE            |
| **Scope inconsistente** | Auth, authentication, AUTH | auth (siempre)                      |
| **Sin contexto**        | "update"                   | tipo + scope + descripción clara    |
