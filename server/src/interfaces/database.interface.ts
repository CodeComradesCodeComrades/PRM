import { Version } from 'src/utils/version';

export enum DatabaseLock {
  GeodataImport = 100,
  Migrations = 200,
  StorageTemplateMigration = 420,
  CLIPDimSize = 512,
  LibraryWatch = 1337,
}
export interface VectorUpdateResult {
  restartRequired: boolean;
}

export const IDatabaseRepository = 'IDatabaseRepository';

export interface IDatabaseRepository {
  getPostgresVersion(): Promise<Version>;
  runMigrations(options?: { transaction?: 'all' | 'none' | 'each' }): Promise<void>;
  withLock<R>(lock: DatabaseLock, callback: () => Promise<R>): Promise<R>;
  tryLock(lock: DatabaseLock): Promise<boolean>;
  isBusy(lock: DatabaseLock): boolean;
  wait(lock: DatabaseLock): Promise<void>;
}