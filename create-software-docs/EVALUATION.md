# Evaluación: `create-software-docs`

> Evaluación inicial: 2026-03-06
> Re-evaluación post-cambios: 2026-03-06
> Archivos: 56 markdown (excluyendo este archivo)
> Tamaño total actual: ~134 KB / ~3,784 líneas

---

## Resumen ejecutivo

| Dimensión    | Inicial | Actual     | Comentario                                                                                |
| ------------ | ------- | ---------- | ----------------------------------------------------------------------------------------- |
| Completitud  | 9/10    | **9.5/10** | Se añadieron downgrade rules, validation levels, parallelization guidance                 |
| Contexto LLM | 6/10    | **8/10**   | Context Loading Strategy + lazy loading + handoff parcial resuelven el problema principal |
| Performance  | 7.5/10  | **8.5/10** | Fast path + parallelization + validation levels son mejoras materiales                    |
| Diseño       | 8.5/10  | **9/10**   | Centralización de update/reconcile + validation levels bien integrados                    |

---

## 1. Completitud — 9.5/10

La skill está prácticamente completa. Cubre:

- Orquestación con workflow claro de 12 sub-skills
- 3 modos operativos (`generate`, `update`, `reconcile`)
- Contratos compartidos para sub-skills documentales y no-documentales
- Artefactos de handoff estructurados entre etapas
- Templates para cada tipo de documento (10 templates específicos + convenciones + contrato)
- Quality checklist, diagram patterns, evidence model
- Reglas de escalación (validation finding → cleanup candidate → remaining issue → known issue)
- Especializaciones locales por sub-skill
- ~~No hay guía de "context budget"~~ — **Resuelto.** Se añadió `## Context Loading Strategy` con lazy loading por etapa y `### Hard constraint`.
- ~~No hay criterio de abort/downgrade~~ — **Resuelto.** Se añadió `## Downgrade Rules` con orden de degradación explícito.
- ~~No hay versionado~~ — **Pendiente.** No se añadió nota de versión ni compatibilidad.

---

## 2. Optimización para ventana de contexto — 8/10

### Métricas de tamaño

| Concepto                              | Inicial  | Actual   | Cambio           |
| ------------------------------------- | -------- | -------- | ---------------- |
| Total skill (sin EVALUATION.md)       | ~133 KB  | ~134 KB  | +1 KB            |
| `sub-skill-handoffs.md`               | 22 KB    | 19 KB    | **-3 KB**        |
| Orchestrator `SKILL.md`               | 12 KB    | 19.4 KB  | +7.5 KB          |
| `sub-skills/README.md`                | 5.5 KB   | 2.8 KB   | **-2.7 KB**      |
| `common.md`                           | 1.6 KB   | 1.5 KB   | -0.1 KB          |
| Nuevo: `update-reconcile-guidance.md` | —        | 1.7 KB   | +1.7 KB          |
| Sub-skill SKILL.md (promedio)         | ~2.8 KB  | ~2.6 KB  | **-0.2 KB c/u**  |
| Local specializations (promedio)      | ~0.83 KB | ~0.68 KB | **-0.15 KB c/u** |
| `diagrams.md`                         | ~7 KB    | ~7 KB    | sin cambio       |

El peso neto total apenas subió (~1 KB), pero la distribución mejoró sustancialmente. El overhead creció en el orchestrator (que se lee siempre) pero se redujo en los archivos que se cargan por paso.

### Problemas detectados y estado

1. **`sub-skill-handoffs.md` demasiado grande con Examples Appendix duplicado.**
   - ~~645 líneas con ~150 líneas de ejemplos repetidos en Sección 4~~ — **Resuelto.** El contenido duplicado fue eliminado. Archivo bajó de 22 KB a 19 KB.
   - **Pendiente menor:** La descripción interna (`## Structure of This Contract`) aún menciona "plus an examples appendix" y "4. examples appendix..." pero la sección ya no existe. Este vestigio debe limpiarse.

2. **Redundancia sistémica de update/reconcile (~25+ repeticiones).**
   - ~~La frase "preserve still-valid content when operating in update or reconcile mode" aparece en cada sub-skill, orchestrator, contratos y templates~~ — **Resuelto.** Se creó `references/contracts/update-reconcile-guidance.md` (~1.7 KB) como referencia canónica. Las frases repetitivas fueron removidas de todos los sub-skills individuales, local specializations, y `common.md`.

3. **Duplicación orchestrator ↔ sub-skills/README.md.**
   - ~~Ambos listan el orden de ejecución, roles y flujo de artefactos~~ — **Resuelto.** El README fue reducido de 5.5 KB a 2.8 KB. Ahora es un índice ligero que referencia al orchestrator como fuente canónica.

4. **Tres capas de referencia con solapamiento.**
   - `common.md` → template específico → local specialization presentaban solapamiento. — **Parcialmente mitigado.** Los local specialization files fueron adelgazados y `common.md` delega a `update-reconcile-guidance.md`. Aún existe la cadena de tres capas, pero el solapamiento real es menor.

5. **Pipeline de known issues sobre-ingeniado.**
   - 5 shapes estructurados con ~8-12 campos cada uno y "translation guidance" para cada transformación. — **Sin cambio.** La Context Loading Strategy mitiga el impacto (no se cargan todos los shapes a la vez), pero sigue siendo más complejo de lo necesario para proyectos simples.

### Estimación de tokens por paso de ejecución

| Archivo                        | Inicial     | Actual                          |
| ------------------------------ | ----------- | ------------------------------- |
| Orchestrator SKILL.md          | ~3,000      | ~4,900                          |
| Sub-skill SKILL.md             | ~750        | ~650                            |
| `common.md`                    | ~400        | ~380                            |
| Template específico            | ~800        | ~800                            |
| Local specialization           | ~200        | ~170                            |
| `diagrams.md` (arq.)           | ~1,800      | ~1,800                          |
| `sub-skill-handoffs.md`        | ~5,500      | **~0** (no se carga completo)   |
| `update-reconcile-guidance.md` | —           | ~425 (solo si update/reconcile) |
| **Total por paso (generate)**  | **~12,500** | **~8,700**                      |
| **Total por paso (update)**    | **~12,500** | **~9,125**                      |

La mejora clave: el handoff contract ya no necesita cargarse completo gracias a la Context Loading Strategy que indica cargar solo las secciones relevantes. Esto ahorra ~5.5K tokens por paso en el caso ideal.

- Para modelos con 128K-200K de contexto: cómodo.
- Para modelos con 32K de contexto: ahora manejable (antes problemático).

---

## 3. Performance / Eficiencia de ejecución — 8.5/10

### Fortalezas

- La arquitectura modular permite que cada paso cargue solo sus archivos
- El orden de ejecución es lógico y bien definido
- Los artefactos de handoff estructurados permiten output consumible entre etapas sin ambigüedad
- Las activation rules evitan generar documentos que no aplican
- Los contratos (`document-subskill.md`, `non-document-subskill.md`) normalizan expectativas sin rigidez excesiva
- La separación de `validate` → `cleanup` → `known-issues` es conceptualmente limpia
- ~~No hay instrucción de paralelización~~ — **Resuelto.** El orchestrator ahora permite batch paralelo para documentos opcionales post-core con reglas claras de cuándo es seguro.
- ~~No hay fast path para proyectos simples~~ — **Resuelto.** Se añadió `### 4.1 Fast Path for Simple Projects` con 6 pasos base, expansión opcional solo cuando hay evidencia clara.
- ~~12 pasos secuenciales sin alternativa~~ — **Mitigado.** El fast path reduce a 6 pasos para proyectos simples. La paralelización del batch opcional reduce el tiempo efectivo para proyectos medianos/complejos.

### Debilidades residuales

- El re-validation condicional ("if cleanup performs meaningful edits, run validate again") sigue pudiendo crear loops, aunque ahora la elección de validation level (`minimal` para re-validación editorial) lo hace más controlable.
- El orchestrator SKILL.md creció a ~19.4 KB y se carga en cada paso. Parte de ese contenido (Context Loading Strategy, Downgrade Rules, Validation Levels) podría extraerse a una referencia separada que solo se cargue en la fase de planificación.

---

## 4. Calidad de diseño — 9/10

### Fortalezas consolidadas

- Filosofía de "no inventar hechos" y evidencia como principio rector
- Sistema de confidence labels consistente y bien definido
- Los templates son esqueletos mínimos, no murallas de texto
- La separación de responsabilidades entre sub-skills es clara
- Los contratos evitan que sub-skills dupliquen template content en sus SKILL.md
- El approach de `update`/`reconcile` es sofisticado y práctico
- Centralización de reglas update/reconcile en `update-reconcile-guidance.md` elimina repetición sistémica
- Validation levels (`minimal`, `standard`, `full`) bien integrados en validate, cleanup y orchestrator
- El Validation Artifact ahora incluye `validationLevel` y `deferredChecks`, propagando awareness de cobertura real
- Cleanup ahora consume el validation level y deferred checks, evitando asumir cobertura que no existió

---

## Mejoras implementadas

| #   | Recomendación                                         | Estado                                                                              |
| --- | ----------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 1   | Eliminar Examples Appendix de `sub-skill-handoffs.md` | **Parcial** — contenido eliminado, vestigio en TOC pendiente                        |
| 2   | Reducir `sub-skills/README.md`                        | **Cumplida** — de 5.5 KB a 2.8 KB, sin duplicación                                  |
| 3   | Centralizar reglas update/reconcile                   | **Cumplida** — nuevo `update-reconcile-guidance.md`, prosa removida de ~12 archivos |
| 4   | Añadir Context Loading Strategy                       | **Cumplida** — 5 etapas con archivos explícitos + hard constraint + downgrade rules |
| 5   | Fast path para proyectos simples                      | **Cumplida** — 6 pasos base con expansión condicional                               |

### Mejoras adicionales (no solicitadas)

- **Validation Levels**: tres niveles (`minimal`, `standard`, `full`) con criterios claros y propagación de `deferredChecks`
- **Parallelization rules**: batch paralelo post-core con reglas de seguridad
- **Cleanup awareness**: consume validation level y deferred checks
- **Validation Artifact ampliado**: incluye `validationLevel` y `deferredChecks`

---

## Pendientes

1. **Vestigio en `sub-skill-handoffs.md`:** `## Structure of This Contract` aún menciona "plus an examples appendix" y "4. examples appendix for canonical reference shapes and mappings" pero la sección ya no existe. Limpiar.
2. **Orchestrator pesado (~19.4 KB).** Es el archivo que se carga en cada paso. Evaluar extraer Context Loading Strategy, Downgrade Rules, y Validation Levels a `references/orchestration-policy.md` para mantener el orchestrator por debajo de ~12 KB y cargar la política solo en la fase de planificación.
3. **Pipeline de known issues sin simplificar.** 5 shapes estructurados con 8-12 campos cada uno. La Context Loading Strategy mitiga el impacto, pero sigue siendo más complejo de lo necesario para proyectos simples.
4. **Sin versionado.** No hay nota de versión ni compatibilidad en la skill.
