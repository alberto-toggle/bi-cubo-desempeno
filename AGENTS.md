# GTyG Platform
- Next App Router, TypeScript estricto, Tailwind 4 y Base UI.
- Panorama GTyG es la marca de demo; gtyg-platform es la plataforma técnica.
- No iniciar servidores. Revisar primero el servidor existente en el puerto 3000; preguntar solo si no está disponible.
- Separar features, dominio, datos, servicios, estado y componentes.
- Playground y bloques de proveedores no son dependencias del producto.
- Toda simulación debe indicar su procedencia. No incluir cuentas bancarias reales.
- Apariencia mediante tokens; temas y fuentes intercambiables sin modificar componentes.
- Redux Toolkit para estado compartido y cargas asíncronas; estado local para interacciones.
- Preservar atribuciones. Primitivas Base UI compartidas; adaptaciones de proveedores aisladas.
- Este proyecto es una demo: priorizar rapidez de iteración, calidad visual y flujos simulados creíbles.
- No crear, ampliar ni ejecutar tests automatizados (unitarios, integración o end-to-end), salvo petición explícita del usuario. No ejecutar npm test como parte rutinaria de los cambios.
- Validar los flujos afectados manualmente en el navegador. Usar typecheck, lint o build cuando el cambio lo justifique; no ejecutar todos de forma automática en cada ajuste.
- Leer node_modules/next/dist/docs antes de modificar patrones del framework.

## Arquitectura de la demo y reutilización futura

- Aunque los datos y operaciones sean simulados, mantener tipado, claridad,
  accesibilidad y separación de responsabilidades que permitan reutilizar las
  piezas en una implementación real. No implementar servicios reales ni ampliar
  el alcance como consecuencia de preparar esa reutilización.
- Mantener rutas y layouts centrados en composición y navegación. Organizar las
  funcionalidades en `src/features/` y separar presentación, reglas de negocio,
  acceso a datos y estado.
- Los componentes visuales reciben datos y callbacks tipados. No deben conocer
  credenciales demo, fixtures, servicios, cálculos de negocio ni políticas de
  acceso. Resolver esas responsabilidades en la capa correspondiente.
- Centralizar datos ficticios en fixtures tipadas y operaciones simuladas en
  servicios explícitos de demo. Mantener contratos pequeños que permitan
  sustituirlos por servicios reales sin reescribir la presentación.
- Extraer componentes y hooks cuando tengan una responsabilidad propia o un uso
  compartido real. Evitar componentes monolíticos, duplicación, parches por vista
  y abstracciones especulativas; preferir piezas pequeñas y nombres claros.
- Mantener una única fuente de verdad para filtros, selección y estados del
  flujo. Calcular datos derivados en lugar de duplicarlos en estado local.
- Aislar persistencia, temporizadores y efectos del navegador; limpiar sus
  recursos y permitir reiniciar los flujos de demo de forma predecible.
- Mantener las políticas de visibilidad por rol fuera de los componentes
  presentacionales y del widget de demo. Aplicarlas también a detalles y
  exportaciones. La simulación de permisos no sustituye autorización de servidor.

## Calidad de los componentes

- Escribir componentes de producto en TypeScript estricto con props y estados
  tipados. No ocultar problemas con `any`, `@ts-ignore` o aserciones injustificadas.
- Reutilizar primitivas Base UI, tokens semánticos y materiales compartidos.
  Mantener paleta, tipografía y acabado independientes; evitar colores y estilos
  específicos de tema dentro de componentes funcionales.
- Evaluar los bloques del playground antes de incorporarlos al producto. Extraer
  o adaptar las piezas a su ubicación definitiva conservando atribuciones; no
  importar scaffolding ni datos de ejemplo del playground en vistas de producto.
- Mantener HTML semántico, navegación por teclado, foco visible y comportamiento
  responsive. Las animaciones deben respetar movimiento reducido y no impedir
  la interacción ni la lectura de los datos.
- Separar carga, vacío, error y éxito cuando el flujo los requiera. Mantener
  skeletons coherentes con el componente y simulaciones claramente identificadas.
- Estas prácticas no añaden requisitos de tests automatizados: sigue vigente la
  instrucción de no crearlos ni ejecutarlos salvo petición explícita. Informar
  qué se comprobó y qué quedó pendiente; compilar no equivale a verificar la UI.

- Compartir las reglas de distribución entre vistas y skeletons: usar los layouts
  y contratos de clases de cada funcionalidad para columnas, espacios y alturas.
  Mantener contenido real y placeholders separados; no duplicar esos contratos
  ni añadir lógica de carga a componentes puramente presentacionales.
