# panel · centro de operaciones

Repo de mantención del dashboard. Todo se edita **acá**, no en la web de GitHub.

- Repo: https://github.com/elchihua12/panel (rama `main`)
- Live: https://elchihua12.github.io/panel/ (GitHub Pages, publica ~1 min después del push)

## Estructura

- `index.html` — el panel completo: HTML + CSS + JS en un solo archivo, sin build ni
  dependencias. Se abre directo en el navegador para probar.
- `tools/*.html` — cada herramienta es un HTML autónomo que el panel embebe en un iframe.
- `tools/*.jsx` — fuente React de las tools que se montan con Babel en el navegador
  (`checklist-farmacia`, `os-semanal`). Si se edita el `.jsx` hay que reflejarlo en el
  `.html` que lo carga.

## Datos que gobiernan el panel

Están todos juntos en `index.html`, en un bloque `<script>` antes de la lógica:

| Array | Qué controla |
|---|---|
| `ALL_TOOLS` | Inventario completo, agrupado por categoría. Lo que se ve en el panel. |
| `CREATIONS` | Bitácora cronológica (más nueva arriba, fecha ISO). |
| `AGENDA` | Bloques recurrentes por hora y día. Referencia tools por `toolId`. |
| `MACRO_BLOCKS` | Bloques grandes de la jornada. También referencian `toolId`. |

Cada `MACRO_BLOCKS` lleva además un `ctx` (`casa` · `tarde` · `pop` · `solo`) que
traduce el bloque al contexto del Generador de Tiempo Libre. El panel publica el del
bloque en curso en `panel.v5.ctx` y esa herramienta lo usa para preseleccionar. **Si
agregas un bloque, ponle su `ctx`** — sin él la preselección queda muda para esa franja.

Reglas: el `id` de una tool es la llave que usan pines, agenda y bloques — único y estable.
`days` va de 0 (domingo) a 6 (sábado). `status`: `live` (local), `drive`, `notion`.
`external: true` para lo que abre fuera del panel.

## Agregar o cambiar una herramienta

Ver la receta en `README.md`. El error clásico: subir el HTML a `tools/` y no declararlo
en `ALL_TOOLS` — el archivo queda publicado pero invisible en el panel.

Chequeo rápido de huérfanos:

```bash
for f in tools/*.html; do n=$(basename "$f"); grep -q "tools/$n" index.html || echo "HUERFANO: $n"; done
```

`analizador.html` sale como huérfano a propósito: el panel apunta a la versión de Vercel
(que tiene backend), no a la copia local.

## API keys

Nunca se commitean. Viven en `localStorage` del navegador del usuario:
`panel.v5.api_key` (Anthropic, se configura en ⚙ Ajustes y la comparten los módulos) y
`panel.v5.fmp_key` (Financial Modeling Prep, dentro del Analizador).

## Flujo de trabajo

1. Editar, abrir `index.html` en el navegador y verificar.
2. `git add . && git commit -m "..." && git push`
3. Confirmar en la URL live.

El historial viejo son commits "Add files via upload" (subidas por la web). Desde acá,
mensajes descriptivos.
