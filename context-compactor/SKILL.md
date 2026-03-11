---
name: context-compactor
description: >
  Sistema de compactación de contexto para evitar saturación de la ventana de contexto.
  Guarda decisiones, pasos, y contexto en archivos markdown organizados.
  Trigger: Cuando el usuario menciona "guardar contexto", "compactar", "offload", o cuando la conversación se vuelve muy larga.
license: MIT
metadata:
  author: jrodrigopuca
  version: "1.0"
---

## Cuándo Usar

- Cuando la ventana de contexto está cerca de agotarse
- Cuando hay decisiones importantes que documentar
- Cuando un proceso tiene muchos pasos que no caben en contexto
- Cuando el usuario dice "guarda esto", "compacta", "offload"
- Para guardar estado antes de cambios grandes
- Al final de sesiones largas para resumir

## Instalación (una vez)

```bash
# 1. Copiar scripts a ~/.local/bin/
mkdir -p ~/.local/bin
cp -r ~/.config/opencode/skill/context-compactor/assets/scripts/* ~/.local/bin/
chmod +x ~/.local/bin/cc*

# 2. Agregar alias al ~/.zshrc
cat >> ~/.zshrc << 'EOF'

# Context Compactor - Comandos de compactación de contexto
alias ccinit="~/.local/bin/ccinit"
alias ccsave="~/.local/bin/ccsave"
alias ccnote="~/.local/bin/ccnote"
alias cclist="~/.local/bin/cclist"
alias ccgrep="~/.local/bin/ccgrep"
EOF

# 3. Recargar shell
source ~/.zshrc
```

## Comandos

| Comando  | Descripción                        | Ejemplo                                |
| -------- | ---------------------------------- | -------------------------------------- |
| `ccinit` | Inicializa .context en el proyecto | `ccinit`                               |
| `ccsave` | Guarda contexto rápido             | `ccsave "título" "contenido" decision` |
| `ccnote` | Crea nota con template completo    | `ccnote "título del proceso" steps`    |
| `cclist` | Lista todas las notas              | `cclist` o `cclist decision`           |
| `ccgrep` | Busca en todas las notas           | `ccgrep "jwt"`                         |

### Uso detallado

```bash
# Inicializar en un proyecto (hacer una sola vez)
ccinit

# Guardado rápido
ccsave "Auth con JWT" "Elegimos JWT con refresh tokens por simplicidad" decision

# Crear nota con template
ccnote "Setup de desarrollo local" steps
ccnote "Arquitectura de pagos" decision

# Ver qué tenés guardado
cclist              # Todas
cclist decision     # Solo decisiones
cclist steps        # Solo pasos

# Buscar
ccgrep "auth"
ccgrep "2024"
```

## Estructura de Archivos

```
{workdir}/
└── .context/
    ├── README.md
    ├── decisions/
    │   ├── 2024-01-15-auth-architecture.md
    │   └── 2024-02-20-database-choice.md
    ├── steps/
    │   └── 2024-01-10-setup-local.md
    └── context/
        └── 2024-01-05-proyecto-inicio.md
```

## Tipos de Notas

### 1. Decision (decisiones/)

Para decisiones importantes con contexto y consecuencias.

**Template automático**:

```markdown
# Decisión: {título}

> Fecha: {timestamp}

## Contexto

{¿Por qué se tomó esta decisión?}

## Opciones consideradas

- **Opción A**: ...
- **Opción B**: ...

## Decisión final

{Qué se eligió y por qué}

## Consecuencias

- Positivas: ...
- Negativas: ...

## Estado

- [ ] Pendiente
- [ ] Implementado

## Tags

#context #decision
```

### 2. Steps (steps/)

Para procesos y procedimientos.

**Template automático**:

```markdown
# Pasos: {título}

> Fecha: {timestamp}

## Objetivo

{Qué se logra}

## Paso 1: {título}

**Acción**: ...
**Resultado**: ...

## Verificación

{Cómo confirmar}

## Troubleshooting

- Problema: ...
  - Solución: ...
```

### 3. Context (context/)

Para estado general e información.

**Template automático**:

```markdown
# Contexto: {título}

> Fecha: {timestamp}

## Estado actual

{Qué está pasando}

## Información clave

- ...

## Preguntas abiertas

- [ ] ...

## Próximos pasos

- [ ] ...
```

## Reglas de Oro

1. **Siempre pregunta antes de compactar** - No guardes nada sin approval del usuario
2. **Sé específico con títulos** - "auth-flow-jwt" > "nota1"
3. **Guarda el "por qué"** - El contexto futuro necesitará entender las decisiones
4. **Usa templates** - Consistencia facilita búsqueda después
5. **Referencia desde contexto** - Cuando guardes algo, decí "Lo guardé en .context/decisions/auth-flow.md"
6. **El usuario es el owner** - Son sus notas, puede editar, borrar, lo que quiera

## Workflow de Compactación

```
1. Identificar qué compactar
2. Elegir tipo (decision/step/context)
3. Crear archivo (ccnote o ccsave)
4. Resumir en 2-3 líneas lo esencial
5. Referenciar el archivo en chat
6. MOSTRAR al usuario dónde quedó
```

## Ejemplo de Uso

**Usuario**: "Guarda lo que hicimos sobre la arquitectura de auth"

**Tú**: "Lo guardo. ¿Querés que sea una decisión, pasos, o contexto general?"

**Usuario**: "Decisión"

**Tú**: (ejecuta) → Listo, lo guardé en `.context/decisions/2024-01-auth-architecture.md`.

```
Decisión: Arquitectura de Auth
├── Elegimos JWT con refresh tokens
├── Porque es simple y escalable
└── Tags: #context #decision #auth
```

**Usuario**: "Perfecto, después lo veo"

**Tú**: "Dale, cuando quieras ver todo lo guardado usá `cclist`, o buscá algo específico con `ccgrep 'auth'`"

## Assets

- **Scripts**: Ver [scripts/](assets/scripts/) para los scripts bash
- **Template**: Ver [assets/template.md](assets/template.md) para template general
