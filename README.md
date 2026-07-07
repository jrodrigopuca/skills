# 🤖 Agent Skills Collection

Colección de 9 skills reutilizables para agentes de IA que mejoran la calidad del código y las mejores prácticas de desarrollo.

## 📚 Skills Disponibles

### [using-jsdoc](using-jsdoc/)

**Guía completa de JSDoc para JavaScript y TypeScript**

Documenta código JavaScript y TypeScript con JSDoc siguiendo estándares profesionales. Incluye sintaxis de tags, expresiones de tipos, patrones para funciones, clases, genéricos y mejores prácticas con ejemplos.

- ✅ Referencia completa de 50+ tags JSDoc
- ✅ Integración con TypeScript
- ✅ Ejemplos buenos vs malos
- ✅ Tipo expressions y genéricos
- 📄 **Idioma:** Inglés
- 📊 **Tamaño:** ~1,200 líneas

**Activadores:** "document this function", "add JSDoc", "document with JSDoc"

---

### [using-commit](using-commit/)

**Guía de Conventional Commits para mensajes estructurados**

Escribe commits siguiendo Conventional Commits con tipos estándar, scopes, breaking changes y referencias a JIRA. Automatiza changelogs y versionado semántico.

- ✅ 11 tipos de commit con ejemplos
- ✅ Formato para breaking changes
- ✅ Referencias a tickets JIRA
- ✅ 15+ mejores prácticas detalladas
- ✅ Configuración de validación automática
- 📄 **Idioma:** Inglés (triggers bilingües)
- 📊 **Tamaño:** ~1,100 líneas

**Activadores:** "hacer commit", "mensaje de commit", "conventional commits"

---

### [build-report](build-report/)

**Generador de reportes estructurados de builds Node.js**

Analiza outputs de compilación (TypeScript, ESLint, Webpack, Vite) y genera reportes con diagnóstico, priorización y enlaces a documentación oficial para resolución.

- ✅ Soporte para TypeScript, ESLint, Webpack, Vite
- ✅ Parseo automático con regex patterns
- ✅ Agrupación por patrones y root cause
- ✅ Priorización automática (🔴 🟡 🟢 ⚪)
- ✅ Enlaces a documentación oficial (no duplica soluciones)
- ✅ Análisis de dependencias entre errores
- ✅ Executive summary para triage rápido
- 📄 **Idioma:** Bilingüe (English | Español)
- 📊 **Tamaño:** ~2,600 líneas

**Activadores:** "analyze build output", "parse build errors", "build report", "analizar errores de compilación"

---

### [test-report](test-report/)

**Triage de tests fallidos con detección de causas raíz**

Analiza output de test runners (Jest, Vitest, Playwright, pytest) y genera un reporte priorizado: agrupa fallos por causa raíz, detecta cascadas de fixtures rotas, separa regresiones reales de snapshots viejos y detecta tests flaky. Hermana de build-report.

- ✅ Soporte para Jest, Vitest, Playwright, pytest y JUnit XML
- ✅ Clasificación: cascada / regresión / snapshot / flaky / infra
- ✅ Detección de flaky tests con heurísticas y estrategias de fix
- ✅ "23 fallos → 3 causas → plan ordenado"
- 📄 **Idioma:** Inglés (triggers bilingües)

**Activadores:** "analyze test results", "test report", "failing tests", "flaky tests", "analizar tests", "tests fallidos"

---

### [create-component-docs](create-component-docs/)

**Generador de documentación de componentes UI**

Crea documentación completa de componentes incluyendo arquitectura, API/props, ejemplos de uso, issues conocidos y diagramas de flujo. Compatible con React, Vue, Angular y Web Components.

- ✅ Templates listos para copiar
- ✅ Formato estándar de props/API
- ✅ Diagramas Mermaid para arquitectura
- ✅ Formato de known issues con severidad
- ✅ Enlaces a documentación oficial (no duplica contenido)
- 📄 **Idioma:** Bilingüe (English | Español)
- 📊 **Tamaño:** ~500 líneas

**Activadores:** "document component", "component documentation", "documentar componente", "documentación de componente"

---

### [create-software-docs](create-software-docs/)

**Orquestador de documentación de proyecto**

Genera o actualiza la documentación completa de un proyecto (`docs/`) coordinando 12 sub-skills especializadas: overview, arquitectura, guía de desarrollo, ADRs, runbooks, modelo de datos, API, glosario, known issues, validación y limpieza. Soporta modos `generate`, `update` y `reconcile`.

- ✅ 12 sub-skills especializadas con contratos de handoff
- ✅ Basado en evidencia del repositorio (no inventa)
- ✅ Soporta monorepos con scope por app/package/servicio
- ✅ Validación con niveles minimal/standard/full
- 📄 **Idioma:** Bilingüe (English | Español)

**Activadores:** "document this project", "generate project docs", "documentar el proyecto"

---

### [create-changelog](create-changelog/)

**Generador de CHANGELOG.md y release notes desde conventional commits**

El payoff de using-commit: extrae el historial de commits, lo clasifica en secciones Keep a Changelog, infiere el bump de versión (major/minor/patch), reescribe los subjects en lenguaje de usuario y filtra el ruido interno.

- ✅ Formato Keep a Changelog con links de comparación
- ✅ Inferencia de semver bump con regla 0.x
- ✅ Edición para humanos (síntomas, no implementación)
- ✅ Release notes como artefacto separado
- ✅ Soporte monorepo (changelog por paquete)
- 📄 **Idioma:** Inglés (triggers bilingües)

**Activadores:** "generate changelog", "release notes", "prepare the release", "generar changelog", "notas de versión"

---

### [create-agents-docs](create-agents-docs/)

**Generador de AGENTS.md — instrucciones para agentes de IA**

Genera o actualiza archivos AGENTS.md siguiendo el [estándar abierto](https://agents.md/): setup, comandos de build/test verificados, convenciones de código y gotchas del proyecto. README para humanos, AGENTS.md para agentes.

- ✅ Basado en evidencia del repo (nunca inventa comandos)
- ✅ Soporte para monorepos con archivos anidados (closest-file-wins)
- ✅ Modos generate y update (preserva reglas manuales)
- ✅ Compatibilidad con CLAUDE.md, Copilot, Cursor, Gemini CLI
- ✅ Output token-eficiente (< 150 líneas)
- 📄 **Idioma:** Inglés (triggers bilingües)

**Activadores:** "create AGENTS.md", "generate agent instructions", "crear AGENTS.md", "instrucciones para agentes"

---

### [context-compactor](context-compactor/)

**Compactación de contexto en archivos markdown**

Guarda decisiones, pasos y contexto de sesiones largas en `.context/` del proyecto, con scripts CLI (`ccinit`, `ccsave`, `ccnote`, `cclist`, `ccgrep`) y templates para decisiones, procedimientos y estado.

- ✅ Scripts bash instalables en `~/.local/bin`
- ✅ Templates para decision/steps/context
- ✅ Fallback sin scripts (crea archivos directamente)
- 📄 **Idioma:** Inglés (triggers bilingües)

**Activadores:** "guardar contexto", "compactar", "offload"

---

## 🚀 Instalación

### Opción 1: Instalar todas las skills

```bash
npx skills add https://github.com/jrodrigopuca/skills
```

### Opción 2: Instalar skill específica

```bash
# JSDoc skill
npx skills add https://github.com/jrodrigopuca/skills --skill using-jsdoc

# Conventional Commits skill
npx skills add https://github.com/jrodrigopuca/skills --skill using-commit

# Build Report skill
npx skills add https://github.com/jrodrigopuca/skills --skill build-report

# Component Docs skill
npx skills add https://github.com/jrodrigopuca/skills --skill create-component-docs

# Software Docs skill
npx skills add https://github.com/jrodrigopuca/skills --skill create-software-docs

# Context Compactor skill
npx skills add https://github.com/jrodrigopuca/skills --skill context-compactor

# Test Report skill
npx skills add https://github.com/jrodrigopuca/skills --skill test-report

# Changelog skill
npx skills add https://github.com/jrodrigopuca/skills --skill create-changelog

# AGENTS.md skill
npx skills add https://github.com/jrodrigopuca/skills --skill create-agents-docs
```

### Opción 3: Clonar repositorio

```bash
git clone https://github.com/jrodrigopuca/skills.git
cd skills

# Copiar a tu directorio de skills
cp -r using-jsdoc ~/.agents/skills/
cp -r using-commit ~/.agents/skills/
cp -r build-report ~/.agents/skills/
cp -r create-component-docs ~/.agents/skills/
cp -r create-software-docs ~/.agents/skills/
cp -r context-compactor ~/.agents/skills/
cp -r test-report ~/.agents/skills/
cp -r create-changelog ~/.agents/skills/
cp -r create-agents-docs ~/.agents/skills/
```

## 💡 Uso

Una vez instaladas, las skills se activan automáticamente cuando el contexto lo requiere:

### Ejemplos con using-jsdoc

```javascript
// Pregunta al agente:
// "Document this validation function with JSDoc"

function validateEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// El agente usará la skill y generará:
/**
 * Validates email address format using RFC 5322 simplified regex.
 * Does not verify deliverability, only basic structure.
 * @param {string} email - Email address to validate.
 * @returns {boolean} True if format is valid, false otherwise.
 * @example
 * validateEmail('user@example.com');  // true
 * validateEmail('invalid-email');     // false
 */
function validateEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

### Ejemplos con using-commit

```bash
# Pregunta al agente:
# "Help me write a commit message for this authentication feature"

# El agente usará la skill y sugerirá:
git commit -m "feat(auth): implementar login con OAuth2

Añade soporte para autenticación mediante Google y GitHub.
Incluye manejo de tokens y refresh automático.

JIRA: AUTH-123
Closes #456"
```

### Ejemplos con build-report

```bash
# Pregunta al agente:
# "Analyze this build output and create a report"

npm run build 2>&1 | pbcopy  # Copia el output

# El agente usará la skill y generará:
# ================================
# 🔴 BUILD FAILED
#
# 📊 Executive Summary
# Build failed with 3 critical TypeScript errors and 2 ESLint warnings.
#
# ❌ Errors
#
# Error 1: TS2345 - Type Mismatch
# src/utils/helper.ts:23:15
# Argument of type 'string' is not assignable to parameter of type 'number'
#
# Solution:
# [Code example with fix]
#
# 🎯 Next Steps
# 1. ✅ Fix type conversion in helper.ts line 23
# 2. ✅ Install missing @types/node package
# ...
```

## 📖 Estructura de Skills

Cada skill sigue el formato estándar de Agent Skills:

```
skill-name/
├── SKILL.md              # Definición principal con instrucciones
└── references/           # Documentación detallada (opcional)
    ├── reference-1.md
    └── reference-2.md
```

### Frontmatter en SKILL.md

```yaml
---
name: skill-name
description: Clear description with "Use when" and "Trigger with" clauses
license: MIT
---
```

## 🎯 Filosofía de las Skills

Estas skills están diseñadas siguiendo el **patrón Anthropics/progressive disclosure**:

- ✅ **SKILL.md conciso** (~300-400 líneas) con instrucciones esenciales
- ✅ **Referencias separadas** para contenido detallado
- ✅ **Carga bajo demanda** - solo se lee lo necesario
- ✅ **Ejemplos prácticos** con casos buenos y malos
- ✅ **Tamaño apropiado** (~1,000-2,500 líneas total)

## 🤝 Contribuir

Las contribuciones son bienvenidas! Para añadir una nueva skill:

1. Fork este repositorio
2. Crea una nueva skill siguiendo la estructura estándar
3. Asegúrate de incluir:
   - Frontmatter con name, description, license
   - Instrucciones claras paso a paso
   - Ejemplos prácticos
   - Referencias detalladas si es necesario
4. Envía un Pull Request

### Guidelines para Skills

- **Name:** kebab-case, sin prefijo "using-" a menos que sea establecido
- **Description:** Incluye "Use when..." y "Trigger with..." clauses
- **Size:** SKILL.md: 300-500 líneas, Referencias: 300-800 líneas cada una
- **Language:** English preferible (español aceptable para mercado hispanohablante)
- **Examples:** Incluye ejemplos ❌ MAL vs ✅ BIEN

## 📊 Comparación con Otras Skills

Estas skills llenan vacíos en el ecosistema:

| Skill            | Estado en Ecosistema | Nuestro Enfoque                                          |
| ---------------- | -------------------- | -------------------------------------------------------- |
| **using-jsdoc**  | ❌ No existe         | Referencia completa de JSDoc con 50+ tags                |
| **using-commit** | ❌ No existe         | Conventional Commits con JIRA + triggers bilingües       |
| **build-report** | ❌ No existe         | Triage y análisis de builds - complementa docs oficiales |

**Filosofía de build-report:**  
No duplica documentación oficial de TypeScript/ESLint/Webpack. Se enfoca en **parsing, agrupación, priorización y enlaces** a docs oficiales.

## 📝 Licencia

Este proyecto está bajo la licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 🔗 Enlaces

- [Skills.sh](https://skills.sh/) - Marketplace de agent skills
- [Conventional Commits](https://www.conventionalcommits.org/) - Especificación
- [JSDoc](https://jsdoc.app/) - Documentación oficial
- [Agent Skills Spec](https://agentskills.io/) - Especificación de formato

---

**¿Tienes ideas para nuevas skills?** Abre un [issue](https://github.com/jrodrigopuca/skills/issues) o envía un PR!
