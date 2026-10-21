import { configureStore } from "@reduxjs/toolkit";
import appearance from "@/features/appearance/appearance-slice";
import portfolio from "@/features/intelligence/portfolio-slice";
import { demoPortfolioRepository } from "@/services/portfolio-repository";
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
    reducer: { appearance, overview, auth, portfolio },
    middleware: (getDefault) =>
      getDefault({
        thunk: {
          extraArgument: {
            overview: repository,
            portfolio: demoPortfolioRepository,
          },
        },
      }),
  });
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
