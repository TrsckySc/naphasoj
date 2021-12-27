import { Home } from "./pages/home";
import { BaseData } from "./pages/base-data";

export const routes = [
  {
    path: "/",
    component: Home,
    exact: true,
    title: "接口列表"
  },
  {
    path: "/base-data",
    component: BaseData,
    title: "响应数据维护"
    // routes: [
    //   {
    //     path: "/tacos/bus",
    //     component: Bus
    //   }
    // ]
  }
];
