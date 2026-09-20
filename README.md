# Apostar es fácil. Hablar del tema, no.

Infografía interactiva sobre apuestas online en adolescentes en Argentina, basada en la encuesta nacional del
Observatorio Humanitario de Cruz Roja Argentina (2025).

- **Desktop:** un lienzo horizontal de cinco columnas que se escala para entrar completo en la ventana.
- **Mobile / tablet:** las cinco secciones se apilan y se recorren con scroll vertical, con una barra de progreso fija.
- **Animaciones:** los porcentajes cuentan hasta su valor real, las barras y los puntos se dibujan al entrar en pantalla,
  y el fondo tiene símbolos "$" casi invisibles que huyen del cursor. Se respeta `prefers-reduced-motion`.

## Desarrollo

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # typecheck + build de producción
npm run lint
```

React 19 + TypeScript + Vite. Sin librerías de animación ni de gráficos: todo es CSS y `requestAnimationFrame`.

## Estructura

- `src/components/` — `Infografia` (composición), `Bloques` (las cinco secciones y sus datos), `CountUp`, `Reveal`,
  `DollarField` (fondo de "$"), `ProgressRail` (barra de progreso mobile).
- `src/lib/` — hooks (`useInView`, `useMediaQuery`) y utilidades.
- `src/App.css` — estilos del lienzo desktop, de la versión mobile y de las animaciones.
- `docs/` — fuentes y datos usados para armar y verificar la infografía.

## Fuente de los datos

Observatorio Humanitario de Cruz Roja Argentina (2025). _Apuestas Online y Adolescencia: construyendo entornos
seguros_. Argentina.
[Informe completo (PDF)](https://cruzroja.org.ar/observatorio-humanitario/wp-content/uploads/2025/12/INFORME-APUESTAS-ONLINE-Y-ADOLESCENCIA-pdf.pdf).

Encuesta presencial autoadministrada: 11.421 casos válidos, 231 escuelas, 16 provincias, adolescentes de 13 a 18 años,
trabajo de campo entre el 18 de agosto y el 3 de octubre de 2025.

Dos cifras de la infografía no están publicadas tal cual en el informe, sino calculadas con los tamaños de cada grupo
(dataset en `docs/`): **76%** de exposición a publicidad y **86%** que habla poco o nada del tema en el hogar. Ambas son
promedios ponderados de los tres grupos según vínculo con la práctica, y así se aclara en la propia infografía.

## Autoría

Visualización: [Franco Guiragossian](https://www.linkedin.com/in/fguiragossian/).
