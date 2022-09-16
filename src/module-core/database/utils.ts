import { Transaction } from "dexie"
import { ObjectStoreMaker, StoreMaker, StoresDescription } from "./types"

export const noop = () => {}
type NormalizedStoresDescription = Record<string, Required<ObjectStoreMaker>[]>

export const normalizeStoreMakers = (storeMaker: StoreMaker): Required<ObjectStoreMaker>[] => {
  if (typeof storeMaker === "string") {
    return [{ store: storeMaker, version: 1, upgrade: noop }]
  } else if (storeMaker instanceof Array) {
    return storeMaker.map(normalizeStoreMakers)
      .reduce((acc, cur) => [...acc, ...cur])
      .map((storeMaker, idx) => storeMaker.version === 1 ? {...storeMaker, version: idx + 1 }: storeMaker)
      .sort((lhs, rhs) => lhs.version - rhs.version)
  }
  
  return [{ version: 1, upgrade: noop, ...storeMaker }]
}

export const getStoresMakerForVersion = (stores: NormalizedStoresDescription, version: number): Record<string, Required<ObjectStoreMaker>> => {
  return Object.fromEntries(
    Object.entries(stores)
      .map(([name, storeMaker]) => {

        const vstoreMaker = storeMaker.find((item) => item.version === version)
        return vstoreMaker ? [name, vstoreMaker]: null
      })
      .filter(item => item !== null) as any
  )
}

export const normalizeStores = (stores: StoresDescription): NormalizedStoresDescription => Object.fromEntries(
  Object.entries(stores).map(([name, storeMaker]) => [name, normalizeStoreMakers(storeMaker)])
)

export const getUniqVersions = (stores: NormalizedStoresDescription): number[] => {
  const allVersions = Object.values(stores)
    .map(storeMaker => storeMaker.map(({ version }) => version))
    .reduce((acc, cur) => [...acc, ...cur])

  return Array.from(new Set(allVersions)).sort((lhs, rhs) => lhs - rhs)
}

export const getDexieStores = (storesForVersion: Record<string, Required<ObjectStoreMaker>>) =>
  Object.fromEntries(
    Object.entries(storesForVersion)
      .map(([name, { store }]) => [name, store])
  )

export const getDexieUpgrade = (storesForVersion: Record<string, Required<ObjectStoreMaker>>) => {
  const dexieUpgrades = Object.values(storesForVersion).map(({ upgrade }) => upgrade)

  return dexieUpgrades.reduce((total, current) => async (trans: Transaction) => {
    const result = current(trans)
    if (result instanceof Promise) {
      await result
    }

    return total(trans)
  }, noop)
}