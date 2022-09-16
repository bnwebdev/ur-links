import Dexie from 'dexie';
import { APP_NAME } from '../../constants';
import { AppDatabase, StoresDescription } from './types';
import {
  getDexieStores,
  getDexieUpgrade,
  getStoresMakerForVersion,
  getUniqVersions,
  normalizeStores
} from './utils';

export interface AppDexie extends AppDatabase {};

export class AppDexie extends Dexie {
  constructor(_stores: StoresDescription) {
    super(`${APP_NAME}-db`);
    const stores = normalizeStores(_stores)
    const versions = getUniqVersions(stores)
    

    versions.forEach(v => {
      const storesMaker = getStoresMakerForVersion(stores, v)
      const dexieStores = getDexieStores(storesMaker)
      const upgrade = getDexieUpgrade(storesMaker)
      

      this.version(v).stores(dexieStores).upgrade(upgrade)
    })
  }
}

