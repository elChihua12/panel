# 🏠 panel

Centro de operaciones personal. Hosteado en GitHub Pages.

🔗 **Live:** [elchihua12.github.io/panel](https://elchihua12.github.io/panel/)

## Estructura

```
panel/
├── index.html        ← Dashboard principal
└── tools/            ← Herramientas embebidas
    ├── guia-ia.html
    ├── orquestador.html
    ├── roadmap.html
    ├── malla.html
    ├── plan-finanzas.html
    ├── flujo.html
    ├── 15-opciones.html
    ├── opciones-filtrado.html
    ├── analizador.html          ← Equity research · datos en vivo vía Financial Modeling Prep
    ├── generador.html           ← Selector Tiempo Libre
    ├── planificador.html        ← Planificador de Salidas
    ├── checklist-farmacia.html  (+ .jsx)  ← React, montado con Babel
    ├── os-semanal.html          (+ .jsx)  ← React, montado con Babel
    └── generador-estudio-qf.html          ← Generador de Unidades · Modelo de Estudio QF
```

## API Keys (se guardan solo en tu navegador)

- **Anthropic** (`panel.v5.api_key`): se configura en **⚙ Ajustes** del panel y la comparten todos los módulos (Selector, Flujo, Planificador, Analizador, etc.). Centralizada — la guardas una vez.
- **Financial Modeling Prep** (`panel.v5.fmp_key`): se configura dentro del Analizador (⚙ API Keys). Gratis en financialmodelingprep.com (250 consultas/día). Da datos de mercado en vivo sin servidor. Opcional: sin ella, el Analizador funciona en modo manual.

## Agregar herramienta nueva

Subir el HTML a `tools/` **no basta**: el panel solo muestra lo que está declarado en
`index.html`. Hay que tocar dos arrays:

1. Copiar el HTML a `tools/mi-tool.html`.
2. En `index.html`, buscar `const ALL_TOOLS = [` y agregar 1 objeto en la categoría que
   corresponda:
   `{ id: 'mi-tool', icon: '🧪', name: 'Mi Tool', desc: 'Qué hace', href: 'tools/mi-tool.html', status: 'live' }`
   El `id` debe ser único (lo usan pines, agenda y bloques macro).
3. En `index.html`, buscar `const CREATIONS = [` y agregar la entrada arriba de todo con
   la fecha ISO del día (la bitácora va de más nuevo a más viejo).
4. Opcional: enlazarla desde `AGENDA` o `MACRO_BLOCKS` usando su `id` en `toolId`.
5. `git add . && git commit && git push`. GitHub Pages publica solo en ~1 min.

Herramienta que existe en `tools/` pero no aparece en el panel = falta el paso 2.

---
v2.0 · entrega 2 · jun 2026 — Selector más ancho, API key central, Analizador con FMP, OS Semanal, bloques con horario real
