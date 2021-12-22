import { Home } from "./pages/home";
import { BaseData } from "./pages/base-data";

export const routes = [
  {
    path: "/",
    component: Home,
    exact:true
  },
  {
    path: "/base-data",
    component: BaseData,
    // routes: [
    //   {
    //     path: "/tacos/bus",
    //     component: Bus
    //   }
    // ]
  }
];
