# Demo con catálogos originales y cifras ficticias

Rama de trabajo: `demo/generic-performance`. La rama `main` conserva la versión anterior.

## Datos

`python3 scripts/generate-generic-demo.py` genera portafolio, histórico financiero e indicadores a partir de los catálogos originales autorizados. Se recuperan los 54 establecimientos, ubicaciones, regiones, divisiones, segmentos, giros y catálogos relacionados de `main`. Las relaciones de centros y nombres de programas se conservan en `src/data/unit-catalog-relations.json`, sin importes ni pesos originales.

El generador lee esos catálogos pero no los sobrescribe. Todos los importes, metas, ponderaciones de programas, personal e indicadores siguen siendo simulados; no se recuperan cifras del cliente. Las cifras de los primeros 36 identificadores conservan la fórmula de la variante genérica; los 18 adicionales usan la misma simulación. Los centros reciben partes iguales de cada importe simulado, conservando el total en centavos.

Los importes históricos están expresados en centavos; el portafolio utiliza pesos. Ventas y rentas son componentes del mismo ingreso, sin duplicar utilidades. La fórmula de utilidades sigue siendo ingresos menos costos y gastos. Las medias móviles son una simulación, no una fórmula confirmada por el cliente.

## Roles y privacidad

- Administrador: información financiera ficticia, catálogos y configuración. El control «Ocultar cifras» pertenece a la barra de la aplicación y enmascara importes; también desmonta gráficos financieros, mapas y asistente, y deshabilita exportación. Su estado se reinicia al cambiar de sesión.
- Staff: vistas de indicadores sin importes ni gráficos financieros. Consulta exclusivamente `performance.json`, que no contiene importes, mediante su servicio y estado propios. Las rutas de configuración y catálogos continúan reservadas al administrador.
- Ambos usan los nombres originales autorizados completos. No se aplica ofuscación de identidades en el flujo de esta variante.

Las credenciales, sesiones y permisos siguen siendo una simulación de frontend. Los archivos públicos contienen identidades del catálogo autorizado y cifras ficticias. Una implementación real requiere autorización y filtrado de datos en servidor; el control de privacidad visual no es una frontera de seguridad.

## Composición

- Detalle: histórico mensual (36 meses inicialmente), comparativos, metas y ficha mediante pestañas. La información operativa adicional permanece plegada.
- Utilidades y metas: gráficas primero; resumen y tabla de establecimientos en otras pestañas.
- Cubo: representación del cubo primero; resumen, evolución y territorio separados.
- Vista general y directorio conservan su estructura.

Las preferencias locales de sesión y propuestas de catálogo utilizan claves distintas de la versión anterior para no reutilizar información del navegador.
