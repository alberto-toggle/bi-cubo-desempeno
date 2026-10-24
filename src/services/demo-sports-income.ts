/** Categorías de las capturas de referencia; importes y ponderaciones completamente ficticios. */
const monthlyCategories = [
  "CASILLERO EXTRA",
  "FAMILIAR EXTRA",
  "MENS FAM CIVIL ANTERIOR",
  "MENS FAM MIL ACT GG. JJ. OO.",
  "MENS FAM MIL ACT TROPA",
  "MENS FAM MIL RET GG. JJ. OO.",
  "MENS FAM MIL RET TROPA",
  "MENS IND CIVIL",
  "MENS IND CIVIL 2X1",
  "MENS IND CON DER GG. JJ. OO.",
  "MENS IND MIL ACT GG. JJ. OO.",
  "MENS IND MIL ACT TROPA",
  "MENS IND MIL RET GG. JJ. OO.",
  "MENS IND MIL RET TROPA",
  "PLAN COMISIONADO MENSUAL",
];
const registrationCategories = [
  "INSC FAM MIL ACT GG. JJ. OO.",
  "INSC FAM MIL ACT TROPA",
  "INSC FAM MIL RET GG. JJ. OO.",
  "INSC IND CIVIL",
  "INSC IND CIVIL 2X1",
  "INSC IND MIL ACT GG. JJ. OO.",
  "INSC IND MIL ACT TROPA",
  "INSC IND MIL RET GG. JJ. OO.",
  "REINSC FAM CIVIL ANTERIOR",
];
function distribute(total: number, labels: string[]) {
  const weights = labels.map((_, i) => 2 + ((i * 7) % 11));
  const sum = weights.reduce((a, b) => a + b, 0);
  let allocated = 0;
  return labels.map((label, i) => {
    const value =
      i === labels.length - 1
        ? total - allocated
        : Math.round((total * weights[i]) / sum);
    allocated += value;
    return { label, value };
  });
}
/** Todos los importes son centavos: cada desglose conserva exactamente su total. */
export function demoSportsIncome(revenue: number) {
  const monthly = Math.round(revenue * 0.88);
  const registrations = revenue - monthly;
  return {
    monthly: { total: monthly, items: distribute(monthly, monthlyCategories) },
    registrations: {
      total: registrations,
      items: distribute(registrations, registrationCategories),
    },
  };
}
