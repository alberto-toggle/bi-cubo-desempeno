/** Illustrative cafeteria cycle transcribed from Catálogos maestros, pp. 27–32, 36.
 * Operational evidence folios are demo-only. No bank identifiers are included. */
export const cafeteriaScenario = {
  id: "EVENTO-CF-2026-0001",
  unitId: "unit-017",
  sales: 15000,
  cost: 6000,
  commission: 300,
  purchased: 100,
  sold: 60,
  unitCost: 100,
  stages: [
    {
      id: "E01",
      name: "Presupuesto",
      evidence: "Autorización de suficiencia",
      folio: "DEMO-PRE-001",
      entries: [
        {
          account: "8.02.01.002",
          label: "Presupuesto por ejercer",
          debit: 10000,
          credit: 0,
        },
        {
          account: "8.02.01.001",
          label: "Presupuesto aprobado",
          debit: 0,
          credit: 10000,
        },
      ],
    },
    {
      id: "E02",
      name: "Compra",
      evidence: "Orden de compra autorizada",
      folio: "DEMO-OC-001",
      entries: [
        {
          account: "8.02.01.004",
          label: "Presupuesto comprometido",
          debit: 10000,
          credit: 0,
        },
        {
          account: "8.02.01.002",
          label: "Presupuesto por ejercer",
          debit: 0,
          credit: 10000,
        },
      ],
    },
    {
      id: "E03",
      name: "Recepción",
      evidence: "Recepción de 100 unidades a $100",
      folio: "DEMO-REC-001",
      entries: [
        {
          account: "1.01.05.002",
          label: "Inventario de alimentos y bebidas",
          debit: 10000,
          credit: 0,
        },
        {
          account: "2.01.01.002",
          label: "Proveedores de bienes y servicios",
          debit: 0,
          credit: 10000,
        },
      ],
    },
    {
      id: "E04",
      name: "Venta",
      evidence: "Corte POS: 60 unidades a $250",
      folio: "DEMO-POS-001",
      entries: [
        {
          account: "1.01.03.001",
          label: "Cobros con tarjeta por recibir",
          debit: 15000,
          credit: 0,
        },
        {
          account: "4.01.04.002",
          label: "Venta de cafetería",
          debit: 0,
          credit: 15000,
        },
      ],
    },
    {
      id: "E05",
      name: "Costo",
      evidence: "Salida de inventario de 60 unidades",
      folio: "DEMO-INV-001",
      entries: [
        {
          account: "5.01.01.002",
          label: "Costo de alimentos y bebidas",
          debit: 6000,
          credit: 0,
        },
        {
          account: "1.01.05.002",
          label: "Inventario de alimentos y bebidas",
          debit: 0,
          credit: 6000,
        },
      ],
    },
    {
      id: "E06",
      name: "Liquidación",
      evidence: "Depósito neto de $14,700 y comisión de $300",
      folio: "DEMO-LIQ-001",
      entries: [
        {
          account: "1.01.02.001",
          label: "Bancos moneda nacional",
          debit: 14700,
          credit: 0,
        },
        {
          account: "5.04.01.006",
          label: "Comisiones del adquirente",
          debit: 300,
          credit: 0,
        },
        {
          account: "1.01.03.001",
          label: "Cobros con tarjeta por recibir",
          debit: 0,
          credit: 15000,
        },
      ],
    },
    {
      id: "E07",
      name: "Pago",
      evidence: "Liquidación al proveedor",
      folio: "DEMO-PAG-001",
      entries: [
        {
          account: "2.01.01.002",
          label: "Proveedores de bienes y servicios",
          debit: 10000,
          credit: 0,
        },
        {
          account: "1.01.02.001",
          label: "Bancos moneda nacional",
          debit: 0,
          credit: 10000,
        },
      ],
    },
    {
      id: "E08",
      name: "Cierre",
      evidence: "Cierre de ingresos, costo y comisión",
      folio: "DEMO-CIE-001",
      entries: [
        {
          account: "4.01.04.002",
          label: "Venta de cafetería",
          debit: 15000,
          credit: 0,
        },
        {
          account: "6.01.01.001",
          label: "Resumen de ingresos y gastos",
          debit: 0,
          credit: 15000,
        },
        {
          account: "6.01.01.001",
          label: "Resumen de ingresos y gastos",
          debit: 6300,
          credit: 0,
        },
        {
          account: "5.01.01.002",
          label: "Costo de alimentos y bebidas",
          debit: 0,
          credit: 6000,
        },
        {
          account: "5.04.01.006",
          label: "Comisiones del adquirente",
          debit: 0,
          credit: 300,
        },
      ],
    },
  ],
};
export function reconcileSettlement(
  sales: number,
  deposit: number,
  commission: number,
) {
  return Math.round((sales - deposit - commission) * 100) / 100;
}
