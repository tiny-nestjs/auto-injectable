/* eslint-disable @typescript-eslint/no-var-requires */
import { globSync } from 'glob';
import { resolve } from 'path';
import { AUTO_CONTROLLER_WATERMARK, AUTO_INJECTABLE_WATERMARK } from '../interfaces';
import 'reflect-metadata';

type ClassType = new (...args: any[]) => any;

interface AutoClasses {
  providers: ClassType[];
  controllers: ClassType[];
}

export class ImporterSync {
  private static instance: ImporterSync | null = null;

  static getInstance(): ImporterSync {
    if (!ImporterSync.instance) {
      ImporterSync.instance = new ImporterSync();
    }
    return ImporterSync.instance;
  }

  static load(patterns: string[]): AutoClasses {
    const importer = ImporterSync.getInstance();
    const pathNames = importer.matchGlob(patterns);
    const foundClasses = pathNames.map((pathName) => importer.scan(pathName));
    return foundClasses.reduce(
      (merged, found) => ({
        providers: [...merged.providers, ...found.providers],
        controllers: [...merged.controllers, ...found.controllers],
      }),
      { providers: [], controllers: [] } as AutoClasses,
    );
  }

  private scan(pathName: string): AutoClasses {
    const exports: Record<string, unknown> = require(pathName);
    const autoClasses = Object.values(exports).filter((value) => typeof value === 'function') as ClassType[];

    return autoClasses.reduce(
      (result: AutoClasses, value: ClassType) => {
        Reflect.hasMetadata(AUTO_INJECTABLE_WATERMARK, value) && result.providers.push(value);
        Reflect.hasMetadata(AUTO_CONTROLLER_WATERMARK, value) && result.controllers.push(value);
        return result;
      },
      { providers: [], controllers: [] },
    );
  }

  private matchGlob(patterns: string[]) {
    const globs = patterns.map((pattern) =>
      globSync(resolve(process.cwd(), pattern), {
        ignore: ['**/node_modules/**'],
      }),
    );
    return globs.flat();
  }
}
