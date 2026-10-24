# Demo con catálogos originales y cifras ficticias

Rama de trabajo: `demo/generic-performance`. La rama `main` conserva la versión anterior.

## Datos

`python3 scripts/generate-generic-demo.py` genera portafolio, histórico financiero e indicadores a partir de `src/data/master-units.json` y `src/data/unit-catalog-relations.json`.

El padrón activo toma como fuente nominal **RELACIÓN DE INSTALACIONES.pdf**: 86 instalaciones. Se excluyen las tres cuentas administrativas y cualquier dato bancario. Se conserva como complemento de la presentación el Predio Agrícola Xocolatl: 87 referencias activas en total. Los identificadores existentes se conservan solo cuando la correspondencia es clara; las altas tienen identificadores nuevos y ubicaciones pendientes de confirmar, sin inventar coordenadas ni regiones.

La conciliación está registrada en `docs/catalog-reconciliation.json`. Los restaurantes y cines numerados del catálogo maestro no se asignan arbitrariamente a instalaciones con nombre: se retiran de esta versión y se incorporan los nombres de la relación. Se conservan por separado Hotel Centenario y Hotel Bicentenario. Se corrige la errata «DEFFENSA» y se normalizan acentos; no se usa la numeración repetida del PDF como clave técnica.

Todos los importes, metas, personal y métricas operativas siguen siendo ficticios. El generador utiliza una semilla estable por identificador para conservar las cifras de las unidades existentes al reordenar el padrón. Los centros de nuevas unidades utilizan una plantilla simulada del mismo giro; no representan relaciones oficiales. Las unidades anteriores que no figuran en la relación quedan documentadas para conciliación posterior, no se mezclan con el padrón activo.

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
