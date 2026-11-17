# Salones y estancias de demostración

Fuente de espacios: IMG-20261113-WA0123.jpg, tarifas publicadas 2026. Son tarifas de referencia, no importes de reservas ni ingresos. La base de cobro y condiciones están por confirmar. Valores tapados se conservan nulos.

Vinculación explícita al catálogo: Hotel del Ejército y Fuerza Aérea (unit-018), Restaurante C.A.S.M.R. (unit-011), Centro Deportivo Lomas de Sotelo (unit-016), Hotel Centenario (unit-019), Hotel Santa Lucía (unit-038), Centro Comercial Santa Lucía (unit-030), Deportivo Bicentenario H.C.M. (unit-099), Hotel Bicentenario de la Independencia (unit-055) y Restaurante Lomas de Sotelo (unit-081).

Pendiente: Restaurante Bicentenario del Hco. Col. Mil. en Puebla. No se vincula automáticamente a Restaurante Puebla (unit-087). Figura en la consulta global; requiere confirmación para aparecer en ese detalle.

La ocupación mensual es días-espacio con reserva confirmada / días-espacio calendario. El porcentaje diario es espacios con reserva confirmada / espacios consultados. No es ocupación por horas. Tentativas y cancelaciones no suman. República completo/cuarto y Puebla salón/terraza se consideran conjuntos compartidos, bloqueados completos conservadoramente en la demo; validar reglas reales de subdivisión antes de producción.

Reservas, personas, habitaciones y movimientos son sintéticos deterministas. Las estancias se evalúan al día 15 a las 12:00 del periodo seleccionado, no respecto al reloj real. No se registra ni envía ninguna reserva o movimiento. No se calcula rendimiento financiero a partir de tarifas.

Arquitectura: catálogo separado en features/demo/event-spaces, escenarios en occupancy-fixtures, adaptador en services/demo-occupancy, cálculos y tipos en features/occupancy/model, componentes de presentación tipados y controladores de vista separados. Importes e identidades pasan por la política de privacidad de la demo antes de mostrarse.

## Ajuste de consulta e ingresos
- Consulta por fecha, salón y solicitante como prioridad; sin alta ni edición de reservas.
- Selector de mes/año con primitivas Select Base UI compartidas y meses es-MX.
- Importe por reserva basado en su modalidad y tarifa de referencia. Pagos ficticios deterministas (sin pago, anticipo del 50% o pago completo).
- Solo confirmadas suman al contratado; cobrado + pendiente = contratado. Tarifas desconocidas se excluyen y se contabilizan aparte. No se calculan utilidades.
- KPIs: corte simulado día 15 del periodo, próximas reservas e importes del mes. No se presenta ese corte histórico como el día real de hoy. Privacidad financiera y alias por rol conservados.
