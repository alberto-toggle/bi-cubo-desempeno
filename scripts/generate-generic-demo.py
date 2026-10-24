"""Original catalog identities with independently generated financial figures. Never imports original amounts."""
import json
from pathlib import Path
root = Path(__file__).resolve().parents[1]
def save(path, data):
    (root / path).write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':'))+'\n')
catalog=json.loads((root/'src/data/master-units.json').read_text())
relations=json.loads((root/'src/data/unit-catalog-relations.json').read_text())
units=[]; profiles=[]; performance=[]
for master in catalog['units']:
    # Stable seed preserves a unit's fictitious figures when the roster is reordered.
    i = int(master['id'].split('-')[-1])
    unit=master.copy()
    history=[]
    # Prehistory supports 24-month trends even at the earliest selectable calendar window.
    for year in range(2020,2027):
        for m in range(1,10 if year==2026 else 13):
            revenue=round((900+i*37+((m*19+i*13)%180))*(1+(year-2023)*.06)*100)
            cost=round(revenue*(.46+(i%5)*.035))
            expenses=round(revenue*(.12+(i%3)*.015))
            history.append(dict(period=f'{year}-{m:02}',revenue=revenue,cost=cost,expenses=expenses,maintenance=round(expenses*.2),investment=0))
    monthly=[dict(month=['Ene','Feb','Mar','Abr','May','Jun'][j],revenue=h['revenue']/100,cost=h['cost']/100) for j,h in enumerate([h for h in history if h['period'].startswith('2026')][:6])]
    catalog_centers=relations[unit['id']]['centers']
    # Allocate synthetic cents equally; the final center receives the remainder.
    centers=[]
    for j, center in enumerate(catalog_centers):
        center_months=[]
        for month in monthly:
            row={'month':month['month']}
            for field in ['revenue','cost']:
                cents=round(month[field]*100)
                share=cents//len(catalog_centers)
                row[field]=(share if j<len(catalog_centers)-1 else cents-share*(len(catalog_centers)-1))/100
            center_months.append(row)
        centers.append(dict(**center, monthly=center_months))
    names=relations[unit['id']]['programs']
    programs=[dict(name=name,weight=100//len(names) if j<len(names)-1 else 100-(100//len(names))*(len(names)-1)) for j,name in enumerate(names)]
    units.append(dict(**unit,alias=unit['name'],status='Por conciliar' if i%5==0 else 'Al día',monthly=monthly,centers=centers,operations=[dict(label='Disponibilidad',value=str(90+i%10),unit='%'),dict(label='Atención dentro de plazo',value=str(82+i%17),unit='%')]))
    targets={str(y):round(sum(h['revenue']-h['cost']-h['expenses'] for h in history if h['period'].startswith(str(y-1)))*(1.05+(i%6)*.035)) for y in range(2024,2027)}
    profiles.append(dict(unitId=unit['id'],months=history,targets=targets,programs=programs,workingCapital=(300+i*11)*100,revolvingFund=(100+i*3)*100,staff=dict(manager=f'Responsable {i}',alias=f'Responsable {i}',appointed=f'2025-{i%9+1:02}-01',rank='Oficial · demostración',registration=f'DEMO-{i:03}',joined='2015-01-01',operationsStarted='2023-01-01',officers=1, troops=2+i%4,civilians=2+i%5),premises=dict(count=1+i%4,revenueShare=10) if unit['kind'].startswith(('Tienda','Centro comercial')) else None))
    periods=[]
    for y in range(2024,2027):
        for m in range(1,10 if y==2026 else 13):
            current=[h for h in history if h['period'].startswith(str(y)) and int(h['period'][5:])<=m]
            prior=[h for h in history if h['period'].startswith(str(y-1)) and int(h['period'][5:])<=m]
            net=sum(h['revenue']-h['cost']-h['expenses'] for h in current)
            prev=sum(h['revenue']-h['cost']-h['expenses'] for h in prior)
            periods.append(dict(year=y,month=m,achievement=round(net/targets[str(y)]*100,1),change=round((net/prev-1)*100,1),availability=90+i%10,service=82+i%17,status=unit.get('status','Al día') if i%5 else 'Por conciliar'))
    performance.append(dict(id=unit['id'],name=unit['name'],segment=unit['segment'],line=unit['kind'],periods=periods))
save('public/demo/portfolio.json',dict(updatedAt='2026-09-30T12:00:00Z',units=units))
save('public/demo/management-report.json',dict(source='Escenario ficticio independiente. Importes en centavos MXN; las rentas son parte de los ingresos, no importes adicionales.',cutoff='2026-09',profiles=profiles))
save('public/demo/performance.json',dict(source='Indicadores sintéticos sin importes',units=performance))
save('public/demo/overview.json',dict(period='Enero – junio 2026',source='Catálogos originales autorizados; cifras simuladas',monthly=[dict(month=m,revenue=sum(u['monthly'][j]['revenue'] for u in units),cost=sum(u['monthly'][j]['cost'] for u in units)) for j,m in enumerate(['Ene','Feb','Mar','Abr','May','Jun'])],activities=[dict(name=segment,value=sum(u['segment']==segment for u in units)) for segment in sorted({u['segment'] for u in units})]))
