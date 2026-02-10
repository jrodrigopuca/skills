# Referencia Completa de Tipos de Commit

Guía detallada de todos los tipos de commit de Conventional Commits con ejemplos y casos de uso.

## Tipos Principales

### feat - Nueva Funcionalidad

**Cuándo usar:** Cualquier adición de funcionalidad nueva que los usuarios puedan usar.

**Impacto semver:** MINOR (0.X.0)

**Ejemplos:**

```bash
# UI/UX
feat(ui): añadir modo oscuro
feat(navbar): implementar búsqueda con autocomplete
feat(modal): añadir animaciones de transición

# Backend/API
feat(api): crear endpoint de notificaciones
feat(auth): implementar autenticación con OAuth
feat(payments): integrar Stripe como método de pago

# Funcionalidades del producto
feat(export): añadir exportación a PDF
feat(i18n): añadir soporte para portugués
feat(dashboard): implementar widget de métricas en tiempo real

# Características técnicas que habilitan funcionalidad
feat(cache): implementar cache distribuido con Redis
feat(queue): añadir sistema de trabajos en background
```

**Scopes comunes:** `ui`, `api`, `auth`, `payment`, `i18n`, `export`, `search`, `notifications`

---

### fix - Corrección de Errores

**Cuándo usar:** Cualquier corrección que resuelve un comportamiento incorrecto.

**Impacto semver:** PATCH (0.0.X)

**Ejemplos:**

```bash
# Bugs funcionales
fix(login): corregir redirect después de autenticación
fix(cart): prevenir productos duplicados en carrito
fix(validation): manejar emails con caracteres especiales

# Errores de UI
fix(modal): corregir z-index sobre header
fix(table): alinear correctamente columnas en móvil
fix(form): prevenir doble submit al presionar Enter

# Problemas de rendimiento críticos
fix(query): optimizar consulta que causaba timeout
fix(memory): prevenir memory leak en polling

# Errores de integración
fix(api): manejar rate limit de servicio externo
fix(webhook): reintentar envíos fallidos correctamente

# Regresiones
fix: restaurar comportamiento de exportación (regresión en v2.1)
```

**Scopes comunes:** `login`, `cart`, `api`, `form`, `validation`, `ui`, `query`

---

### docs - Documentación

**Cuándo usar:** Cambios solo en archivos de documentación (README, guides, comments).

**Impacto semver:** Ninguno

**Ejemplos:**

```bash
# Documentación de usuario
docs: actualizar guía de instalación
docs(readme): añadir sección de troubleshooting
docs(api): documentar nuevos endpoints

# Documentación técnica
docs(architecture): añadir diagrama de componentes
docs(contributing): actualizar guía de contribución
docs: corregir enlaces rotos en wiki

# Comentarios de código (si es commit dedicado)
docs(utils): añadir JSDoc a funciones de helpers
docs(types): documentar interfaces de TypeScript

# Changelogs y releases
docs(changelog): actualizar para versión 2.0
```

**Scopes comunes:** `readme`, `api`, `guide`, `changelog`, `architecture`

**Nota:** Si la documentación se añade junto con código, usa el tipo del código (`feat`, `fix`) y menciona los docs en el cuerpo.

---

### style - Formato de Código

**Cuándo usar:** Cambios que NO afectan la lógica (espacios, formato, punto y coma, etc.).

**Impacto semver:** Ninguno

**Ejemplos:**

```bash
# Formatters automáticos
style: aplicar Prettier a todos los archivos
style(components): ejecutar ESLint --fix
style: corregir indentación en archivos legacy

# Cambios de convenciones
style(imports): ordenar imports alfabéticamente
style: remover espacios en blanco al final de líneas
style(css): agrupar propiedades por categoría

# Renombrado por convenciones (sin cambio de lógica)
style(variables): renombrar a camelCase consistente
```

**Importante:** Si el renombrado tiene implicaciones funcionales o requiere cambios en múltiples archivos, considera `refactor` en su lugar.

---

### refactor - Refactorización

**Cuándo usar:** Cambios en el código que NO añaden funcionalidad NI corrigen bugs. Mejoran la estructura o legibilidad.

**Impacto semver:** Ninguno (a menos que incluya cambio de API pública)

**Ejemplos:**

```bash
# Extracción de código
refactor(auth): extraer lógica de validación a helpers
refactor(components): dividir componente grande en subcomponentes
refactor(api): mover lógica de negocio a capa de servicio

# Simplificación
refactor(validation): simplificar lógica con early returns
refactor(utils): reemplazar loops por métodos de array
refactor(state): migrar de Context API a Zustand

# Reorganización de estructura
refactor: reorganizar estructura de carpetas por dominio
refactor(types): consolidar interfaces duplicadas
refactor(config): centralizar configuración de env vars

# Modernización de código
refactor: migrar class components a hooks
refactor(api): convertir callbacks a async/await
refactor: reemplazar var por const/let
```

**Scopes comunes:** `auth`, `api`, `components`, `utils`, `state`, `config`

---

### perf - Mejoras de Rendimiento

**Cuándo usar:** Cambios que mejoran el rendimiento sin añadir funcionalidad ni corregir bugs.

**Impacto semver:** PATCH (0.0.X) - mejora la experiencia del usuario

**Ejemplos:**

```bash
# Optimización de consultas
perf(database): añadir índices a queries frecuentes
perf(api): implementar paginación en listados grandes
perf(query): reducir N+1 queries con eager loading

# Optimización de frontend
perf(images): implementar lazy loading de imágenes
perf(bundle): dividir bundle en chunks por ruta
perf(render): memoizar componentes pesados con React.memo

# Caching
perf(api): añadir cache de 5min a endpoints estáticos
perf(compute): cachear resultados de cálculos costosos
perf(assets): añadir CDN para archivos estáticos

# Optimización de algoritmos
perf(search): reemplazar búsqueda linear por binary search
perf(sort): usar quicksort en lugar de bubble sort
```

**Nota:** Incluye benchmarks o métricas en el cuerpo cuando sea posible:

```bash
perf(query): añadir índice a user_email

Reduce tiempo de búsqueda de usuarios por email
de ~800ms a ~12ms en tablas de 1M+ registros.
```

---

### test - Tests

**Cuándo usar:** Añadir tests nuevos o corregir tests existentes sin cambiar código de producción.

**Impacto semver:** Ninguno

**Ejemplos:**

```bash
# Tests nuevos
test(auth): añadir tests para login flow
test(utils): cubrir edge cases de formatDate
test(api): añadir tests de integración para pagos

# Tipos de tests
test(unit): añadir tests unitarios para validators
test(e2e): añadir tests end-to-end para checkout
test(integration): testear integración con API externa

# Mejoras de tests
test(fixtures): añadir factory para datos de prueba
test: incrementar cobertura de utils a 90%
test(mocks): actualizar mocks de API a v2

# Corrección de tests (sin cambio de lógica)
test(auth): corregir test flaky de timeout
test: actualizar snapshots después de cambio de UI
```

**Scopes comunes:** `unit`, `e2e`, `integration`, `fixtures`

---

### build - Sistema de Build

**Cuándo usar:** Cambios en el sistema de build, herramientas o dependencias externas.

**Impacto semver:** Ninguno (a menos que afecte compatibilidad)

**Ejemplos:**

```bash
# Dependencias
build(deps): actualizar React de 17 a 18
build(deps): bump lodash de 4.17.20 a 4.17.21
build: actualizar todas las dependencias menores

# Herramientas de build
build(webpack): optimizar configuración de producción
build(vite): migrar de webpack a Vite
build(tsconfig): habilitar strict mode

# Package managers
build: migrar de npm a pnpm
build(package): añadir scripts de pre-commit

# Docker y contenedores
build(docker): actualizar imagen base a Node 20
build(docker): optimizar Dockerfile con multi-stage

# Configuración de compilación
build(babel): añadir plugin de optimización
build(esbuild): configurar tree shaking
```

**Scopes comunes:** `deps`, `webpack`, `vite`, `docker`, `babel`, `npm`

---

### ci - Integración Continua

**Cuándo usar:** Cambios en configuración de CI/CD y scripts de automatización.

**Impacto semver:** Ninguno

**Ejemplos:**

```bash
# GitHub Actions
ci: añadir workflow de tests en pull requests
ci(actions): configurar deploy automático a staging
ci: añadir job de lint y type-check

# Otros sistemas CI
ci(jenkins): actualizar pipeline de producción
ci(gitlab): añadir stage de security scanning
ci(circleci): optimizar cache de dependencias

# Configuración de deploy
ci(vercel): configurar variables de entorno
ci(netlify): añadir redirects y headers
ci(heroku): actualizar buildpacks

# Automatizaciones
ci: añadir bot de releases automáticas
ci(dependabot): configurar actualizaciones semanales
ci: añadir comentarios de cobertura en PRs
```

**Scopes comunes:** `actions`, `jenkins`, `gitlab`, `circleci`, `deploy`

---

### chore - Tareas de Mantenimiento

**Cuándo usar:** Tareas rutinarias que no modifican código de producción ni tests. Catch-all para cambios que no encajan en otros tipos.

**Impacto semver:** Ninguno

**Ejemplos:**

```bash
# Mantenimiento general
chore: actualizar .gitignore
chore: limpiar archivos obsoletos
chore(deps): actualizar dependencias de desarrollo

# Configuración de herramientas
chore(eslint): actualizar reglas de linting
chore(prettier): añadir configuración de formato
chore(husky): configurar git hooks

# Metadatos del proyecto
chore(license): añadir archivo LICENSE
chore(package): actualizar metadatos de package.json
chore: añadir código de conducta

# Limpieza de código
chore: remover código comentado
chore: eliminar dependencias sin uso
chore(logs): remover console.logs de desarrollo
```

**Scopes comunes:** `deps`, `config`, `eslint`, `prettier`, `husky`

**Nota:** `chore` es controversial - algunos equipos prefieren evitarlo y usar tipos más específicos.

---

### revert - Revertir Commit

**Cuándo usar:** Revertir un commit anterior que causó problemas.

**Impacto semver:** Depende del commit revertido

**Formato especial:**

```bash
revert: <header del commit revertido>

This reverts commit <hash>.

<razón de la reversión>
```

**Ejemplos:**

```bash
# Reversión simple
revert: feat(auth): añadir OAuth

This reverts commit a1b2c3d4.

Causaba conflict con existing auth system.

# Con contexto adicional
revert: perf(query): optimizar búsqueda de usuarios

This reverts commit e5f6g7h8.

La optimización causaba resultados incorrectos cuando
el índice no estaba sincronizado. Reverting hasta que
tengamos una solución más robusta.

Refs: #456
```

---

## Tipos Adicionales (Opcionales)

Algunos equipos añaden tipos extra según sus necesidades:

### security - Seguridad

```bash
security(auth): parchar vulnerabilidad XSS en inputs
security(deps): actualizar biblioteca con CVE conocido
security: añadir rate limiting a API pública
```

### hotfix - Corrección Urgente en Producción

```bash
hotfix(payment): corregir fallo crítico en procesamiento
hotfix(api): resolver timeout en endpoint de reportes
```

### wip - Work in Progress (Trabajo en Progreso)

```bash
wip(feature): implementación parcial de multi-tenant
wip: explorando arquitectura de microservicios
```

**Nota:** `wip` es controvertido - muchos equipos prefieren no hacer commit de código incompleto.

### release - Commits de Release

```bash
release: bump version to 2.0.0
release: prepare v1.5.0
```

---

## Breaking Changes (Cambios Incompatibles)

No es un tipo, sino un **modificador** que se aplica a cualquier tipo:

### Sintaxis con !

```bash
feat(api)!: cambiar formato de respuesta
fix(auth)!: corregir validación de tokens
refactor(database)!: renombrar tablas
```

### Sintaxis con BREAKING CHANGE en footer

```bash
feat(api): añadir versionado de endpoints

BREAKING CHANGE: Los endpoints ahora requieren /v2/ en la ruta.
```

**Impacto semver:** MAJOR (X.0.0)

**Cuándo es breaking change:**

- Cambios en API pública que requieren actualización de código
- Eliminación de funcionalidad existente
- Cambio de comportamiento esperado
- Cambios en formato de datos (requests/responses)
- Requisitos nuevos de configuración

---

## Tabla de Referencia Rápida

| Tipo       | Descripción                                 | Semver            | Requiere scope |
| ---------- | ------------------------------------------- | ----------------- | -------------- |
| `feat`     | Nueva funcionalidad                         | MINOR (0.X.0)     | Recomendado    |
| `fix`      | Corrección de bug                           | PATCH (0.0.X)     | Recomendado    |
| `docs`     | Solo documentación                          | -                 | Opcional       |
| `style`    | Formato (sin cambio en lógica)              | -                 | Opcional       |
| `refactor` | Cambio de código (sin feat ni fix)          | -                 | Recomendado    |
| `perf`     | Mejora de rendimiento                       | PATCH (0.0.X)     | Recomendado    |
| `test`     | Tests                                       | -                 | Opcional       |
| `build`    | Sistema build, dependencias                 | -                 | Opcional       |
| `ci`       | CI/CD                                       | -                 | Opcional       |
| `chore`    | Mantenimiento (no afecta código producción) | -                 | Opcional       |
| `revert`   | Revertir commit anterior                    | Varía             | No             |
| **!**      | Breaking change (cualquier tipo + !)        | **MAJOR (X.0.0)** | -              |

---

## Scopes por Capa de Aplicación

### Frontend

- `ui`, `components`, `pages`, `layout`, `theme`, `styles`
- `form`, `modal`, `table`, `navigation`, `sidebar`, `header`
- `hooks`, `context`, `state`, `store`, `redux`

### Backend

- `api`, `routes`, `controllers`, `middleware`, `handlers`
- `service`, `repository`, `model`, `entity`, `dto`
- `database`, `migrations`, `seeds`, `queries`

### Autenticación y Autorización

- `auth`, `login`, `register`, `jwt`, `oauth`, `permissions`

### Infraestructura

- `docker`, `k8s`, `terraform`, `aws`, `gcp`, `azure`
- `cache`, `queue`, `worker`, `scheduler`, `logger`

### Herramientas

- `config`, `utils`, `helpers`, `validators`, `formatters`
- `types`, `interfaces`, `schemas`, `constants`

### Funcionalidades de Negocio

- `payments`, `billing`, `invoices`, `subscriptions`
- `notifications`, `emails`, `sms`, `push`
- `search`, `filters`, `export`, `import`
- `i18n`, `localization`, `translations`

---

## Comandos Git Útiles

```bash
# Ver commits por tipo
git log --oneline --grep="^feat"
git log --oneline --grep="^fix"

# Ver breaking changes
git log --oneline --grep="BREAKING CHANGE"
git log --oneline --grep="!"

# Filtrar por scope
git log --oneline --grep="^feat(api)"

# Estadísticas de tipos de commit
git log --oneline | grep -oE "^[a-z]+(\(.*\))?" | sort | uniq -c | sort -rn

# Ver commits desde última versión
git log v1.0.0..HEAD --oneline --no-merges

# Generar changelog manual
git log --oneline --no-merges --format="- %s" v1.0.0..HEAD
```

---

## Herramientas de Validación

### Commitlint Configuration

```javascript
// commitlint.config.js
module.exports = {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"type-enum": [
			2,
			"always",
			[
				"feat",
				"fix",
				"docs",
				"style",
				"refactor",
				"perf",
				"test",
				"build",
				"ci",
				"chore",
				"revert",
			],
		],
		"scope-case": [2, "always", "lower-case"],
		"subject-case": [2, "always", "lower-case"],
		"subject-full-stop": [2, "never", "."],
		"header-max-length": [2, "always", 72],
	},
};
```

### Commitizen Config

```json
{
	"config": {
		"commitizen": {
			"path": "cz-conventional-changelog"
		}
	}
}
```
