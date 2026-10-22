import privacy from "@/features/privacy/privacy-slice";
import performance from "@/features/performance/performance-slice";
import { configureStore } from "@reduxjs/toolkit";
import appearance from "@/features/appearance/appearance-slice";
import portfolio from "@/features/intelligence/portfolio-slice";
import { demoPortfolioRepository } from "@/services/portfolio-repository";
import chartPreferences from "@/features/reporting/chart-preferences";
import report from "@/features/reporting/report-slice";
import { demoManagementReportRepository } from "@/services/management-report-repository";
import auth from "@/features/auth/auth-slice";
import overview from "@/features/overview/overview-slice";
import {
  demoOverviewRepository,
  type OverviewRepository,
} from "@/services/overview-repository";
export const makeStore = (
  repository: OverviewRepository = demoOverviewRepository,
) =>
  configureStore({
    reducer: {
      privacy,
      performance,
      appearance,
      overview,
      auth,
      portfolio,
      report,
      chartPreferences,
    },
    middleware: (getDefault) =>
      getDefault({
        thunk: {
          extraArgument: {
            overview: repository,
            portfolio: demoPortfolioRepository,
            managementReport: demoManagementReportRepository,
          },
        },
      }),
  });
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
