import { Route } from "react-router-dom"
import { Module } from "../../module-core/module"
import { Formatters } from "./components"
import create from "./create"
import resources from "./locale"

export default new Module(
    create,
    {
        route: [<Route path="/formatters" element={<Formatters />}/>],
        navItem: [
            {
                label: "formatters.dropdownTitle",
                children: [
                    { to: '/formatters', label: 'formatters.navLink' },
                    { to: '/formatters/create', label: "formatters.submodules.create.navLink" },
                ]
            }
        ],
        localization: [{ namespace: 'formatters', resources }],
        storeDescription: { 
            formatters: [
                '++id, type, rules',
                '++id, type, code',
                '++id, type, code, name',
            ] 
        }
    }, 
)