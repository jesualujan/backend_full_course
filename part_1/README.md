# 🎨 Reglas de Formato — Prettier

Este proyecto utiliza una configuración de Prettier optimizada para entornos backend, con énfasis en claridad, consistencia y estructuras mantenibles.

## 📐 Configuración `.prettierrc`

```json
{
  "singleQuote": true, // Comillas simples para JS/TS
  "semi": true, // Siempre usar punto y coma
  "trailingComma": "es5", // Coma al final en objetos/arrays
  "printWidth": 100, // Líneas más anchas para estructuras backend
  "tabWidth": 2, // Ancho de tabulaciones
  "useTabs": false, // Espacios en lugar de tabs
  "bracketSpacing": true, // Espacio entre llaves: { foo: bar }
  "arrowParens": "always", // Siempre usar paréntesis en funciones flecha: (x) => x
  "endOfLine": "lf", // Salto de línea estilo Unix
  "embeddedLanguageFormatting": "auto" // Formatea bloques embebidos (HTML, GraphQL, etc)
}
```
