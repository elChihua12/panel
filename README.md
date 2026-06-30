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
    └── os-semanal.html          (+ .jsx)  ← React, montado con Babel
```

## API Keys (se guardan solo en tu navegador)

- **Anthropic** (`panel.v5.api_key`): se configura en **⚙ Ajustes** del panel y la comparten todos los módulos (Selector, Flujo, Planificador, Analizador, etc.). Centralizada — la guardas una vez.
- **Financial Modeling Prep** (`panel.v5.fmp_key`): se configura dentro del Analizador (⚙ API Keys). Gratis en financialmodelingprep.com (250 consultas/día). Da datos de mercado en vivo sin servidor. Opcional: sin ella, el Analizador funciona en modo manual.

## Agregar herramienta nueva

1. Subir el HTML a `tools/`.
2. Editar `index.html`, buscar `const ALL_TOOLS = [` y agregar 1 objeto al array.
3. Commit. Listo.

---
v2.0 · entrega 2 · jun 2026 — Selector más ancho, API key central, Analizador con FMP, OS Semanal, bloques con horario real
