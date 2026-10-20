import {parsePortfolio,type Portfolio} from '@/features/intelligence/model';
export interface PortfolioRepository{load(signal?:AbortSignal):Promise<Portfolio>}
export const demoPortfolioRepository:PortfolioRepository={async load(signal){const response=await fetch('/demo/portfolio.json',{signal,cache:'no-store'});if(!response.ok)throw new Error('No pudimos cargar la información. Intenta nuevamente.');return parsePortfolio(await response.json());}};
