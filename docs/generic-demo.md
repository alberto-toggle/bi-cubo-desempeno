# Variante genérica de demostración

Rama de trabajo: `demo/generic-performance`. La rama `main` conserva la versión anterior.

## Datos

`python3 scripts/generate-generic-demo.py` genera conjuntamente catálogos, portafolio, histórico financiero e indicadores. El generador no lee documentos del cliente. Incluye 36 establecimientos genéricos y una asignación geográfica ficticia; los nombres geográficos del mapa son públicos y no representan instalaciones reales.

Los importes históricos están expresados en centavos; el portafolio utiliza pesos. Ventas y rentas son componentes del mismo ingreso, sin duplicar utilidades. La fórmula de utilidades sigue siendo ingresos menos costos y gastos. Las medias móviles son una simulación, no una fórmula confirmada por el cliente.

## Roles y privacidad

- Administrador: información financiera ficticia, catálogos y configuración. El control «Ocultar cifras» pertenece a la barra de la aplicación y enmascara importes; también desmonta gráficos financieros, mapas y asistente, y deshabilita exportación. Su estado se reinicia al cambiar de sesión.
- Staff: vistas de indicadores sin importes ni gráficos financieros. Consulta exclusivamente `performance.json`, que no contiene importes, mediante su servicio y estado propios. Las rutas de configuración y catálogos continúan reservadas al administrador.
- Ambos usan nombres genéricos completos. No se aplica ofuscación de identidades en el flujo de esta variante.

Las credenciales, sesiones y permisos siguen siendo una simulación de frontend. Los archivos públicos contienen únicamente datos ficticios. Una implementación real requiere autorización y filtrado de datos en servidor; el control de privacidad visual no es una frontera de seguridad.

## Composición

- Detalle: histórico mensual (36 meses inicialmente), comparativos, metas y ficha mediante pestañas. La información operativa adicional permanece plegada.
- Utilidades y metas: gráficas primero; resumen y tabla de establecimientos en otras pestañas.
- Cubo: representación del cubo primero; resumen, evolución y territorio separados.
- Vista general y directorio conservan su estructura.

Las preferencias locales de sesión y propuestas de catálogo utilizan claves distintas de la versión anterior para no reutilizar información del navegador.
