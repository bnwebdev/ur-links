import { FC } from "react";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { NavItem } from "../module-core";
import CustomNavbar from "./Navbar";

const Layout: FC<{ navItems: NavItem[] }> = (props) => (
  <>
    <CustomNavbar {...props} />
    <Container>
        <Outlet />
    </Container>
  </>
)

export default Layout;