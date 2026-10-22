"""Deterministic demo fixture. Never infers missing amounts from the supplied PDFs."""
import json
from pathlib import Path
root = Path(__file__).resolve().parents[1]
portfolio = json.loads((root / 'public/demo/portfolio.json').read_text())
profiles = []
for i, unit in enumerate(portfolio['units']):
    months = []
    for year in range(2023, 2027):
        for month in range(1, 10 if year == 2026 else 13):
            base = unit['monthly'][(month - 1) % 6]
            factor = 1 if year == 2026 and month <= 6 else ((0.80 + (i % 9) * .02) ** (2026 - year)) * (1 + (month - 3) * .009)
            revenue = round(base['revenue'] * 100 * factor)
            cost = round(base['cost'] * 100 * factor)
            expenses = round(revenue * (0.07 + (i % 4) * .01))
            # Maintenance is included in expenses; investment is separate from operating result.
            maintenance = round(expenses * (0.18 + ((i + month) % 6) * .035))
            investment = round(revenue * (0.08 + (i % 5) * .025)) if (i + month + year) % 3 == 0 else 0
            months.append(dict(period=f'{year}-{month:02}', revenue=revenue, cost=cost, expenses=expenses,
                               maintenance=maintenance, investment=investment))
    targets = {}
    for year in range(2024, 2027):
        prior = sum(r['revenue'] - r['cost'] - r['expenses'] for r in months if r['period'].startswith(str(year-1)))
        targets[str(year)] = max(1, round(prior * (1.02 + (i % 7) * .035)))
    programs = []
    if 'Granja' in unit['kind']:
        programs = [dict(name=n, weight=w) for n,w in [('Bovinos',40),('Avícola',25),('Porcinos',20),('Agrícola',15)]]
    elif unit['kind'] == 'Criadero':
        programs = [dict(name=n,weight=w) for n,w in [('Bovinos',35),('Productos cárnicos',25),('Huevo',20),('Agrícola',20)]]
    # Personnel is entirely fictional. Rental revenue is a demo share of existing revenue, not extra profit.
    staff = dict(manager=['Andrea Solís Vega', 'Daniel Rivas Montes', 'Lucía Torres Prado'][i % 3],
                 alias=f'Responsable {i+1:03}', appointed=f'2025-{i%9+1:02}-01', officers=1+i%2, troops=5+i%8, civilians=4+i%6)
    premises = dict(count=2+i%7, revenueShare=8+i%10) if unit['kind'].startswith('Tienda') else None
    profiles.append(dict(staff=staff, premises=premises, unitId=unit['id'], months=months, targets=targets, programs=programs,
                         workingCapital=round(unit['monthly'][0]['revenue']*100*1.8), revolvingFund=(15000+i%4*5000)*100))
(root/'public/demo/management-report.json').write_text(json.dumps(dict(source='Simulación propia inspirada en UTILIDADES SEPTIEMBRE bis.pptx.pdf y ejemplo tienda detalle.pdf. Importes en centavos MXN. Enero–junio 2026 conserva ingresos y costos del portafolio demo; gastos e históricos son simulados. Personal y fechas son ficticios. En tiendas, las rentas son una participación simulada de los ingresos; ventas excluye rentas y no se agregan nuevamente a utilidades. Mantenimiento es un subconjunto simulado de gastos operativos; inversión es simulada y se registra por separado del resultado de gestión.', cutoff='2026-09', profiles=profiles),ensure_ascii=False,separators=(',',':'))+'\n')
