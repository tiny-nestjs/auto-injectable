import { glob } from 'glob';
import { resolve } from 'path';
import { AUTO_CONTROLLER_WATERMARK, AUTO_INJECTABLE_WATERMARK } from '../interfaces';

type ClassType = new (...args: any[]) => any;

interface AutoClasses {
  providers: ClassType[];
  controllers: ClassType[];
}

export class Importer {
  private static instance: Importer | null = null;

  constructor() {}

  static getInstance(): Importer {
    if (!Importer.instance) {
      Importer.instance = new Importer();
    }
    return Importer.instance;
  }

  static async load(patterns: string[]): Promise<AutoClasses> {
    const importer = Importer.getInstance();
    const pathNames = await importer.matchGlob(patterns);
    const foundClasses = await Promise.all(pathNames.map((pathName) => importer.scan(pathName)));
    return foundClasses.reduce(
      (merged, found) => ({
        providers: [...merged.providers, ...found.providers],
        controllers: [...merged.controllers, ...found.controllers],
      }),
      { providers: [], controllers: [] } as AutoClasses,
    );
  }

  private async scan(pathName: string): Promise<AutoClasses> {
    const exports: Record<string, unknown> = await import(pathName);
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

  private async matchGlob(patterns: string[]) {
    const globs = patterns.map((pattern) => glob(resolve(process.cwd(), pattern)));
    return (await Promise.all(globs)).flat();
  }
}
