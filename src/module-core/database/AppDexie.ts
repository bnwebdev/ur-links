import Dexie from 'dexie';
import { APP_NAME } from '../../constants';
import { AppDatabase } from './types';

export interface AppDexie extends AppDatabase {};

export class AppDexie extends Dexie {
  constructor(stores: Record<keyof AppDatabase, string>) {
    super(`${APP_NAME}-db`);
    this.version(1).stores(stores);
  }
}

