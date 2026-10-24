# Demo con catálogos originales y cifras ficticias

Rama de trabajo: `demo/generic-performance`. La rama `main` conserva la versión anterior.

## Datos

`python3 scripts/generate-generic-demo.py` genera portafolio, histórico financiero e indicadores a partir de los catálogos originales autorizados. Se recuperan los 54 establecimientos, ubicaciones, regiones, divisiones, segmentos, giros y catálogos relacionados de `main`. Las relaciones de centros y nombres de programas se conservan en `src/data/unit-catalog-relations.json`, sin importes ni pesos originales.

El generador lee esos catálogos pero no los sobrescribe. Todos los importes, metas, ponderaciones de programas, personal e indicadores siguen siendo simulados; no se recuperan cifras del cliente. Las cifras de los primeros 36 identificadores conservan la fórmula de la variante genérica; los 18 adicionales usan la misma simulación. Los centros reciben partes iguales de cada importe simulado, conservando el total en centavos.

El catálogo incorpora cinco referencias nominales de la presentación: Hotel Bicentenario de la Independencia (distinto de Hotel Centenario), Centro de Promoción Social Defensa, Corredor Gastronómico, Predio Agrícola Xocolatl y Centro Ecuestre Defensa. Sus códigos `UN-DEMO-*` son provisionales; su ubicación permanece por confirmar y se excluyen del mapa hasta conciliarla. No se renombran los restaurantes/cines numerados sin una correspondencia documental. Total: 59 referencias; no representa un padrón definitivo.

Los importes históricos están expresados en centavos; el portafolio utiliza pesos. Ventas y rentas son componentes del mismo ingreso, sin duplicar utilidades. La fórmula de utilidades sigue siendo ingresos menos costos y gastos. Las medias móviles son una simulación, no una fórmula confirmada por el cliente. El desglose financiero distribuye el gasto simulado sin duplicarlo; otros ingresos/gastos tiene signo e incorpora rentas cuando corresponda. Los datos operativos se generan en `demo-unit-operations.ts`.

## Roles y privacidad

- Administrador: información financiera ficticia, catálogos y configuración. El control «Ocultar cifras» pertenece a la barra de la aplicación y enmascara importes; también desmonta gráficos financieros, mapas y asistente, y deshabilita exportación. Su estado se reinicia al cambiar de sesión.
- Staff: vistas de indicadores sin importes ni gráficos financieros. Consulta exclusivamente `performance.json`, que no contiene importes, mediante su servicio y estado propios. Las rutas de configuración y catálogos continúan reservadas al administrador.
- Ambos usan los nombres originales autorizados completos. No se aplica ofuscación de identidades en el flujo de esta variante.

Las credenciales, sesiones y permisos siguen siendo una simulación de frontend. Los archivos públicos contienen identidades del catálogo autorizado y cifras ficticias. Una implementación real requiere autorización y filtrado de datos en servidor; el control de privacidad visual no es una frontera de seguridad.

## Composición

- Detalle: responsable a la izquierda en escritorio; resultados con tres años calendario (36 posiciones, meses futuros nulos), medias por año sobre las barras, comparativos y metas juntos. Tabla financiera en pestaña independiente, con mermas para tiendas/restaurantes, finiquitos para hoteles y utilidad bruta para granjas. Deportivos abre con socios, movimientos, ingresos y accesos diarios/mensuales.
- Utilidades y metas: entrada inicial del administrador; índice por capítulos y navegación anterior/siguiente en el orden de las referencias, con gráficas, programas, capacidad y resultados por unidad. Colores documentales centralizados e independientes del tema.
- Cubo: representación del cubo primero; resumen, evolución y territorio separados.
- Vista general y directorio conservan su estructura.

Las preferencias locales de sesión y propuestas de catálogo utilizan claves distintas de la versión anterior para no reutilizar información del navegador.

El histórico sintético incluye 2020–2022 como base de cálculo para medias móviles. Estos años no entran en el comparativo anual 2023–2026 ni en su media de referencia. Los comparativos de detalle admiten columnas verticales y tabla, evitando que una preferencia antigua de barras horizontales altere la referencia. El mostaza de 2026 es #BF9000.

Las tablas por capítulo conservan las columnas documentales: restaurantes (horarios, capacidad y meta, más distribución restaurante/salones); hoteles (capacidad y meta, ocupación acumulada ponderada por habitaciones-noches y ocupación mensual); deportivos (capacidad, usuarios, locales/salón y utilidad deportiva); centros comerciales (locales, vacantes, precios por planta y distribución tienda/locales); estacionamientos (capacidad desglosada); cines (salas/VIP y servicios complementarios). Los porcentajes de meta, ocupación y participación tienen denominadores distintos y se rotulan por separado. Las cifras, horarios y desgloses son simulados, no datos operativos del cliente. `demo-chapter-tables.ts` genera los modelos tipados; `DocumentReportTable` solo presenta celdas y formateadores.
