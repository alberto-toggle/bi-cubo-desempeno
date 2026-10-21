# GTyG Platform · Panorama

Base independiente para explorar la plataforma de inteligencia operativa y financiera de GTyG. La marca de interfaz es Panorama; el repositorio no queda limitado a un módulo BI.

## Desarrollo

```sh
npm ci
npm run dev -- --port 3000
```

El servidor lo inicia el desarrollador. Node 22.13+ recomendado. Fuentes locales: no dependen de Google Fonts en ejecución.

- `/`: panorama inicial con indicadores y gráficas de datos sintéticos.
- `/playground`: 46 bloques agrupados, buscador y navegación colapsable.
- `/settings/appearance`: cuatro paletas y tres tipografías con vista previa y persistencia local.

## Arquitectura

- `src/features`: módulos de producto, apariencia, shell y playground.
- `src/store`: Redux Toolkit, proveedor por instancia, hooks tipados e inyección de repositorios.
- `src/services`: contrato de carga; el adaptador demo lee `public/demo/overview.json`.
- `src/features/overview`: validación del contrato, cálculos derivados, thunk con cancelación y protección contra respuestas obsoletas, estados de carga/error/reintento.
- `src/components/ui`: primitivas compartidas basadas en Base UI.
- `src/components/blocks/21st-dev` y `src/components/blocks/paceui`: adaptaciones aisladas de proveedores; no dependen del dominio.
- `src/lib/playground-catalog.json`: inventario y procedencia de cada bloque.
- `vendor-sources`: respuestas originales de los registros descargados.

Para conectar un backend, implementar `OverviewRepository` e inyectarlo en `makeStore`. Los componentes no conocen el origen de los datos. No se requiere Postman ni un servidor de mocks para esta carga de JSON local.

La apariencia usa tokens CSS y preferencias validadas. Se conserva en este navegador y se sincroniza entre pestañas; no representa todavía una política global de administrador ni autenticación/permisos. Los bloques de terceros conservan algunos colores propios para mostrar fielmente sus diseños originales.

## Procedencia del playground

30 bloques de 21st.dev y 16 de PaceUI. Se volvieron a descargar 45 fuentes originales; se reutilizaron las adaptaciones existentes compatibles con React 19, Recharts 3 y Base UI para ejecutarlas sin duplicar primitivas por bloque. Cada vista enlaza su fuente.

Excepción: `reaviz/area-chart-1` no pudo descargarse nuevamente (registro sin disponibilidad y URL 403). Se conservó la versión previamente descargada en Boletera, con su atribución. No se sustituyó por Area Chart 2.

## Alcance y datos

Todo valor del panorama es sintético; no es un reporte oficial. Las cifras se derivan de un único fixture para mantener consistencia. La contribución mostrada es ingresos menos costos del fixture, no utilidad neta contable.

Los documentos iniciales tienen diferencias de conteos y clasificaciones; todavía no se fijan como catálogos definitivos. Esta entrega prepara arquitectura, identidad configurable y laboratorio visual; los flujos funcionales del BI se definirán con el equipo.

## Verificación

```sh
npm run typecheck
npm run lint
npm run build
```

Las pruebas cubren preferencias inválidas, consistencia de cálculos, validación de datos, error/reintento, cancelación y concurrencia de solicitudes.

## Demo e interno

`src/app/(demo)` contiene las pantallas presentables; `src/app/(internal)/playground` tiene su layout de laboratorio. La URL `/playground` sigue disponible directamente, sin enlaces desde la demo. Un route group organiza layouts y dependencias: **no es un control de acceso**. Si se requiere excluirlo del despliegue de cliente, hay que implementar una restricción de servidor o separarlo en otro despliegue.

La visibilidad se deriva exclusivamente del rol autenticado: administrador recibe nombres y ubicaciones completos; staff ve `•••• ` seguido del alias estable y ubicación reservada. El widget Demo no modifica esta política. `features/demo/identity-policy.ts` proyecta los campos visibles. Los fixtures siguen siendo públicos: la futura API deberá autorizar y proyectar los campos antes de enviarlos al navegador.

El hero usa planos de vidrio animados propios, con tokens de material, fallback sin backdrop-filter y respeto por movimiento reducido. Se revisaron Liquid Glass de UI Layouts en toggle-landing y los materiales de Boletera como referencia, sin importar dependencias de aquellos productos.

## Recorrido de demo (perfiles provisionales)

- `/login`: login inspirado en Modern & Stunning Sign In, con accesos para autollenar y contraseña visible en las ayudas.
- `/`: panorama financiero con filtro de periodo y segmento, contribución por unidad y exportación CSV.
- `/establishments`: directorio con búsqueda por identidad visible y detalle por unidad.
- `/establishments/demo-03`: división y segmentos de centros de negocio, incluyendo cafetería en unidad deportiva.
- `/catalogs`: consulta del modelo de dimensiones documental (solo administrador).
- `/settings/appearance`: personalización (solo administrador).

Credenciales exclusivamente ficticias:

| Perfil | Correo | Contraseña |
| --- | --- | --- |
| Administrador | admin@panorama.demo | Panorama2026! |
| Staff | staff@panorama.demo | Panorama2026! |

Roles provisionales: administrador consulta nombres y ubicaciones completos y administra apariencia; staff consulta nombres con prefijo ofuscado y alias. Búsqueda, exportación, detalles y etiquetas usan la misma política de presentación, sin preferencia de visibilidad en Redux ni en el widget.

Sesión simulada por pestaña en sessionStorage, duración ocho horas, con expiración, restauración y salida. No se guarda la contraseña. NO es un mecanismo de seguridad real: fixtures públicos y lógica cliente se usan solo para la demostración. En producción deben reemplazarse por autenticación y autorización en servidor, entregando únicamente campos permitidos.

`public/demo/portfolio.json` contiene seis unidades completamente ficticias; no son el padrón oficial. Todas las nuevas vistas derivan sus cifras de ese fixture a través de un repositorio y thunk. Los documentos fundamentan la separación división/segmento, las dimensiones maestras y centros de negocio/costo; los nombres, cifras, estados, permisos y diseño de pantallas son supuestos demo. No se importaron números de cuentas bancarias ni nombres reales.

## Cargas y verificación en dos pasos

El login incluye un widget Demo con autollenado y una preferencia opcional de verificación en dos pasos. Se guarda validada en `gtyg.demo-preferences.v1` de localStorage; tema y fuente siguen en `gtyg.appearance.v1`. Las contraseñas y el desafío pendiente no se guardan. La sesión permanece en sessionStorage.

Código ficticio `123456`, vigencia dos minutos y máximo cinco intentos por desafío. Reenviar renueva la vigencia sin reiniciar el contador; volver al acceso cancela el desafío. Solo se crea la sesión después del código correcto cuando está activada esta opción. No se envían correos ni existe un segundo factor de producción.

Las rutas de demo tienen skeletons por tipo de vista y transiciones de entrada. Se simula una preparación de 350 ms al navegar y 450 ms al abrir el login, además de los estados de carga reales del repositorio. La validación demo tarda 600 ms. El movimiento respeta prefers-reduced-motion y los temporizadores de presentación se limpian al desmontar.

El login no describe el negocio y usa metadatos genéricos. El widget azul comparte la opción «Mostrar controles y ayudas» entre login y vistas internas (`showHelp` en las preferencias demo). Ocultarlas no desactiva dos pasos ni cambia permisos. Durante el desafío, «Dejar 10 segundos para expirar» acorta la vigencia sin extender desafíos expirados; la cuenta regresiva muestra la expiración y la validación rechaza ese código hasta reenviarlo.

Sin sesión válida se ocultan nombres y ubicaciones con una máscara fija. Para staff el prefijo ofuscado no contiene caracteres del nombre real; el alias permite reconocer y buscar cada establecimiento.

Playground / Autenticación: Sign In de jahed (`/playground/21st-dev/sign-in-jahed`), descargado desde 21st mediante MCP (registro directo respondió 403). Original en `vendor-sources/21st-sign-in-jahed.json`; adaptación aislada con ancho del contenedor, labels accesibles, animaciones CSS locales y movimiento reducido. Los callbacks son simulados y no registran contraseñas. No sustituye el acceso del producto.

El acceso de la app utiliza una adaptación del diseño Sign In de jahed: `features/auth/access-layout.tsx` y `login.css`. Conserva la lógica propia de acceso, dos pasos y ayudas demo, sin depender del playground. La card se centra sobre un fondo y la composición SVG de `access-artwork.tsx` usa tokens del tema; en móvil se omite la columna decorativa. El bloque original sigue disponible en playground.

React Bits / Navegación: Branched Menu e Infinite Menu están en `/playground/react-bits/branched-menu` y `/playground/react-bits/infinite-menu`. Fuentes originales del registro oficial guardadas en `vendor-sources/react-bits-*.json`. Adaptaciones: refs sincronizadas después del render, demos locales y gráficos SVG propios para la esfera WebGL. Branched Menu incluye sus dependencias Hugeicons.

El sidebar de producto adapta la geometría de ramas a un componente TypeScript reutilizable (`components/navigation/branched-navigation.tsx`), con enlaces Next y disclosures Base UI. Conserva navegación reducida a iconos, panel móvil y filtro por rol; Infinite Menu permanece exclusivo del playground.

### Arquitectura de apariencia

`src/theme/` es la capa visual reutilizable, sin dependencias de features ni Redux:

- `config.ts`: catálogo de temas y fuentes, valores iniciales y validación.
- `palettes.css`: valores de color. Cada tema declara el contrato completo para permitir vistas previas anidadas sin heredar colores de otro tema.
- `tokens.css`: contrato semántico (`--background`, `--primary`, `--sidebar`, estados y gráficas). Los componentes consumen estos tokens, nunca nombres de temas.
- `typography.css`: familias de fuente; `tailwind.css`: adaptación a utilidades Tailwind.
- `materials.css`: vidrio y elevación compartidos, independientes de los controles demo.
- `browser.ts`: aplicación al DOM y restauración antes de la primera pintura desde el mismo catálogo.

La feature `appearance` administra selección y Redux; el provider persiste la preferencia y sincroniza pestañas. El azul de `features/demo/demo-materials.css` es independiente por diseño. Los bloques originales del playground conservan sus estilos de proveedor y no forman parte del contrato visual de producto. Para agregar un tema, registrarlo en `config.ts` e implementar todos los valores en `palettes.css`; las pruebas verifican la integridad del contrato y la paridad entre arranque y cambios de tema.

### Universo documental y simulación ampliada

`src/data/master-units.json` contiene las 54 unidades del catálogo propuesto (pp. 5–6); no se suman a las 86 filas de la relación de instalaciones, pendiente de conciliación. No se incorporan cuentas bancarias. `reference-catalogs.json` conserva centros de negocio, centros de costo y sublíneas con su página de origen.

`node scripts/generate-portfolio.mjs` regenera determinísticamente `public/demo/portfolio.json`. Los nombres proceden del documento; importes, estados operativos y asignaciones de centros son simulados. Cada total mensual se deriva de sus centros. El filtro por segmento proyecta solo los centros pertinentes, incluso cuando pertenecen a una unidad de otra división.

El mapa reutilizable está en `src/components/maps`, con procedencia y licencia en `SOURCE.md`. Las ubicaciones y filtros geográficos se muestran solo en modo completo del administrador. Es una simulación de permisos de interfaz: los datos de demo son públicos y esto no sustituye autorización de servidor.

El detalle `unit-017` incluye el ciclo independiente de cafetería documentado en pp. 27–32 y 36. Sus cifras no se suman de nuevo al portafolio. Los catálogos permiten registrar propuestas de alta, modificación e inactivación con motivo e historial local (`gtyg.catalog-proposals.v1`); permanecen pendientes y no alteran el catálogo base.

### Acabados y marca

Apariencia mantiene tres preferencias independientes: `theme`, `font` y `finish` (`original` o `crystal`). El acabado Cristal aplica Liquid Glass selectivo a enlaces activos/hover del sidebar y botones secundarios. Capas decorativas conservan transparencias, reflejos y bordes pulidos con desenfoque mínimo de 1 px, sin refracción ni distorsión SVG. Fondos, tarjetas, tablas y ventanas emergentes permanecen sólidos, sin mesh gradients. Órbita (`violet`) se migra a Prisma al restaurar preferencias antiguas. Navegadores sin backdrop-filter o con transparencia reducida reciben superficies sólidas.

Liquid Glass de UI Layouts se encuentra en `/playground/ui-layouts/liquid-glass`, categoría **Materiales y efectos**, aislado de la aplicación. Su `SOURCE.md` documenta procedencia, licencia y adaptaciones.

Los iconos de navegador y Apple se regeneran con `node scripts/generate-icons.mjs` a partir de las rutas SVG de `PanoramaMark`. Next los publica mediante las convenciones `icon.svg` y `apple-icon.png`.

Liquid Metal Hero de chowlol202 está disponible únicamente en `/playground/21st-dev/liquid-metal-hero`. El login conserva su dibujo original.
