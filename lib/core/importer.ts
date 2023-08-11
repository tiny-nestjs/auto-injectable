import { glob } from 'glob';
import { resolve } from 'path';
import { AUTO_CONTROLLER_WATERMARK, AUTO_INJECTABLE_WATERMARK } from '../interfaces';

type ClassType = new (...args: any[]) => any;

interface AutoClasses {
  providers: ClassType[];
  controllers: ClassType[];
}

export class Importer {
  constructor(private readonly patterns: string[]) {}

  static async load(patterns: string[]): Promise<AutoClasses> {
    const importer = new Importer(patterns);
    const pathNames = await importer.matchGlob();
    const results = await Promise.all(pathNames.map((pathName) => importer.import(pathName)));
    return results.reduce(
      (merged, result) => ({
        providers: [...merged.providers, ...result.providers],
        controllers: [...merged.controllers, ...result.controllers],
      }),
      { providers: [], controllers: [] } as AutoClasses,
    );
  }

  private async import(pathName: string): Promise<AutoClasses> {
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

  private async matchGlob() {
    const globs = this.patterns.map((pattern) => glob(resolve(process.cwd(), pattern)));
    return (await Promise.all(globs)).flat();
  }
}
