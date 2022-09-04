import { FC } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";

import { Error404, Layout } from "./components";
import RootModule from "./modules";

const App: FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout navItems={RootModule.navItems} />}>
          {RootModule.routes}
        </Route>
        <Route path="*" element={<Error404 />} />
      </Routes>
    </HashRouter>
  ) 
}

export default App;
