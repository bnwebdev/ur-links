import { I18n } from "i18n-js/typings";
import { FC } from "react";
import { Container, Form, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap'
import { useLocale, useSupportedLocales, useTranslate } from "../module-core/i18n-js";

import { NavItem } from "../types";

type Props = {
    navItems: NavItem[]
}

const renderNavItem = (i18n: I18n, navItem: NavItem) => {
    if ('children' in navItem) {
        const { label, children } = navItem

        return (
            <NavDropdown menuVariant="dark" title={i18n.t(label)}>
                {children.map(({ to, label}) => (
                    <LinkContainer to={to} key={to}>
                        <NavDropdown.Item>{i18n.t(label)}</NavDropdown.Item>
                    </LinkContainer>
                ))}
            </NavDropdown>
        )
    }

    const { to, label } = navItem

    return (
        <LinkContainer to={to} key={to}>
            <Nav.Link>{i18n.t(label)}</Nav.Link>
        </LinkContainer>
    )
}

const CustomNavbar: FC<Props> = ({ navItems }) => {
    const [locale, setLocale] = useLocale()
    const locales = useSupportedLocales()
    const i18n = useTranslate()

    return (
        <Navbar bg="dark" variant="dark" className="mb-2">
            <Container>
                <Nav>
                    {navItems.map(navItem => renderNavItem(i18n, navItem))}
                </Nav>

                <Form.Select style={{ width: 100 }} value={locale} onChange={e => setLocale(e.currentTarget.value)}>
                    {locales.map(locale => <option key={locale} value={locale}>{locale}</option>)}
                </Form.Select>
            </Container>
        </Navbar>
    )
};

export default CustomNavbar;