import { FC } from "react";
import { Container, Dropdown, DropdownButton, Form, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap'
import { useLocale, useSupportedLocales, useTranslate } from "../modules/i18n-js";

import { NavItem } from "../types";

type Props = {
    navItems: NavItem[]
}

const CustomNavbar: FC<Props> = ({ navItems }) => {
    const [locale, setLocale] = useLocale()
    const locales = useSupportedLocales()
    const i18n = useTranslate()

    return (
        <Navbar bg="dark" variant="dark" className="mb-2">
            <Container>
                <Nav>
                    {navItems.map(
                        ({ to, label}) =>
                        <LinkContainer to={to} key={to}>
                            <Nav.Link>{i18n.t(label)}</Nav.Link>
                        </LinkContainer>
                    )}
                </Nav>

                <Form.Select style={{ width: 100 }} value={locale} onChange={e => setLocale(e.currentTarget.value)}>
                    {locales.map(locale => <option key={locale} value={locale}>{locale}</option>)}
                </Form.Select>
            </Container>
        </Navbar>
    )
};

export default CustomNavbar;