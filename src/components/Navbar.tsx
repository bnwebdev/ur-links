import { FC } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap'

import { NavItem } from "../types";

type Props = {
    navItems: NavItem[]
}

const CustomNavbar: FC<Props> = ({ navItems }) => (
    <Navbar bg="dark" variant="dark" className="mb-2">
        <Nav>
            {navItems.map(
                ({ to, label}) =>
                <LinkContainer to={to} key={to}>
                    <Nav.Link>{label}</Nav.Link>
                </LinkContainer>
            )}
        </Nav>
    </Navbar>
);

export default CustomNavbar;