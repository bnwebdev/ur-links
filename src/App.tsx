import { FC, ReactElement } from "react";
import { HashRouter, Route, RouteProps, Routes } from "react-router-dom";

import { Layout } from "./components";
import { NavItem } from "./types";

type Props = {
  navItems: NavItem[]
  routes: ReactElement<RouteProps>[]
}

const App: FC<Props> = ({ navItems, routes }) => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout navItems={navItems} />}>
          {routes}
        </Route>
      </Routes>
    </HashRouter>
  ) 
}

export default App;
