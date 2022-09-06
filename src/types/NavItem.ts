export type PlainNavItem = {
  to: string
  label: string
}

export type ComplexNavItem = {
  label: string
  children: PlainNavItem[]
}

export type NavItem = PlainNavItem | ComplexNavItem