# 🤖 Agent Skills Collection

Colección de 3 skills reutilizables para agentes de IA que mejoran la calidad del código y las mejores prácticas de desarrollo.

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
- 📄 **Idioma:** Español
- 📊 **Tamaño:** ~2,200 líneas

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
```

### Opción 3: Clonar repositorio

```bash
git clone https://github.com/jrodrigopuca/skills.git
cd skills

# Copiar a tu directorio de skills
cp -r using-jsdoc ~/.agents/skills/
cp -r using-commit ~/.agents/skills/
cp -r build-report ~/.agents/skills/
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
| **using-commit** | ❌ No existe         | Conventional Commits con JIRA + español                  |
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
