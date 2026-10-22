"""Standalone synthetic scenario. No client document is read or used as a dataset."""
import json
from pathlib import Path
root = Path(__file__).resolve().parents[1]
def save(path, data):
    (root / path).write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':'))+'\n')
geometry=json.loads((root/'src/components/maps/mexico-paths.json').read_text())['states']
states=geometry[::3]
tax=dict(regions={f'R{i}':f'Región {i}' for i in range(1,5)}, states={s['id']:dict(name=s['name'],region=f'R{i%4+1}',mapId=s['id']) for i,s in enumerate(states)},divisions={f'D{i}':f'División {i}' for i in range(1,5)},segments={f'S{i}':f'Segmento {i}' for i in range(1,7)})
masters=[]; units=[]; profiles=[]; performance=[]
for i in range(1,37):
    state=states[(i*7)%len(states)]
    unit=dict(id=f'unit-{i:03}',code=f'EST-{i:03}',name=f'Establecimiento {i}',location=f'Ubicación de ejemplo {i}',stateCode=state['id'],region=f'Región {i%4+1}',division=f'División {i%4+1}',segment=f'Segmento {i%6+1}',segmentCode=f'S{i%6+1}',kind=f'Giro {i%6+1}',sourcePage=0)
    masters.append(unit.copy())
    history=[]
    for year in range(2023,2027):
        for m in range(1,10 if year==2026 else 13):
            revenue=round((900+i*37+((m*19+i*13)%180))*(1+(year-2023)*.06)*100)
            cost=round(revenue*(.46+(i%5)*.035))
            expenses=round(revenue*(.12+(i%3)*.015))
            history.append(dict(period=f'{year}-{m:02}',revenue=revenue,cost=cost,expenses=expenses,maintenance=round(expenses*.2),investment=0))
    monthly=[dict(month=['Ene','Feb','Mar','Abr','May','Jun'][j],revenue=h['revenue']/100,cost=h['cost']/100) for j,h in enumerate([h for h in history if h['period'].startswith('2026')][:6])]
    centers=[dict(id=f'center-{i}',code=f'CN-{i:03}',name=f'Centro de negocio {i}',segment=unit['segment'],costCenterCode=f'CC-{i:03}',costCenter=f'Centro de costo {i}',sublineCode=f'SUB-{i:03}',subline=f'Sublínea {i}',monthly=monthly)]
    units.append(dict(**unit,alias=unit['name'],status='Por conciliar' if i%5==0 else 'Al día',monthly=monthly,centers=centers,operations=[dict(label='Disponibilidad',value=str(90+i%10),unit='%'),dict(label='Atención dentro de plazo',value=str(82+i%17),unit='%')]))
    targets={str(y):round(sum(h['revenue']-h['cost']-h['expenses'] for h in history if h['period'].startswith(str(y-1)))*(1.05+(i%6)*.035)) for y in range(2024,2027)}
    profiles.append(dict(unitId=unit['id'],months=history,targets=targets,programs=[dict(name=f'Programa {i%4+1}',weight=60),dict(name=f'Programa {(i+1)%4+1}',weight=40)],workingCapital=(300+i*11)*100,revolvingFund=(100+i*3)*100,staff=dict(manager=f'Responsable {i}',alias=f'Responsable {i}',appointed=f'2025-{i%9+1:02}-01',officers=1, troops=2+i%4,civilians=2+i%5),premises=dict(count=1+i%4,revenueShare=10)))
    periods=[]
    for y in range(2024,2027):
        for m in range(1,10 if y==2026 else 13):
            current=[h for h in history if h['period'].startswith(str(y)) and int(h['period'][5:])<=m]
            prior=[h for h in history if h['period'].startswith(str(y-1)) and int(h['period'][5:])<=m]
            net=sum(h['revenue']-h['cost']-h['expenses'] for h in current)
            prev=sum(h['revenue']-h['cost']-h['expenses'] for h in prior)
            periods.append(dict(year=y,month=m,achievement=round(net/targets[str(y)]*100,1),change=round((net/prev-1)*100,1),availability=90+i%10,service=82+i%17,status=unit.get('status','Al día') if i%5 else 'Por conciliar'))
    performance.append(dict(id=unit['id'],name=unit['name'],segment=unit['segment'],line=unit['kind'],periods=periods))
save('src/data/master-taxonomy.json',tax)
save('src/data/master-units.json',dict(source='Escenario genérico independiente',status='Datos ficticios',units=masters))
refs=[]
for category,prefix,label in [('Giros','GI','Giro'),('Centros de negocio','CN','Centro de negocio'),('Centros de costo','CC','Centro de costo'),('Sublíneas','SUB','Sublínea')]:
    for i in range(1,7 if prefix=='GI' else 37):
        refs.append(dict(category=category,code=f'{prefix}-{i:03}',name=f'{label} {i}',relation=f'SEG-S{i%6+1}',description='Registro ficticio de demostración',page=0))
save('src/data/reference-catalogs.json',refs)
save('public/demo/portfolio.json',dict(updatedAt='2026-09-30T12:00:00Z',units=units))
save('public/demo/management-report.json',dict(source='Escenario ficticio independiente. Importes en centavos MXN; las rentas son parte de los ingresos, no importes adicionales.',cutoff='2026-09',profiles=profiles))
save('public/demo/performance.json',dict(source='Indicadores sintéticos sin importes',units=performance))
save('public/demo/overview.json',dict(period='Enero – junio 2026',source='Escenario genérico',monthly=[dict(month=m,revenue=sum(u['monthly'][j]['revenue'] for u in units),cost=sum(u['monthly'][j]['cost'] for u in units)) for j,m in enumerate(['Ene','Feb','Mar','Abr','May','Jun'])],activities=[dict(name=f'Segmento {i}',value=6) for i in range(1,7)]))
