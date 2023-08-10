import { glob } from 'glob';
import { resolve } from 'path';

type ClassType = new (...args: any[]) => any;

export interface AutoProviders {
  providers: ClassType[];
}

export interface AutoControllers {
  controllers: ClassType[];
}

export class Importer {
  constructor(private readonly patterns: string[]) {}

  static async loadProviders(
    patterns: string[],
    waterMark: symbol,
  ): Promise<AutoProviders> {
    const importer = new Importer(patterns);
    const pathNames = await importer.matchGlob();
    const results = await Promise.all(
      pathNames.map((pathName) => importer.importProvider(pathName, waterMark)),
    );
    return {
      providers: results.flatMap((result) => result.providers),
    };
  }

  static async loadControllers(
    patterns: string[],
    waterMark: symbol,
  ): Promise<AutoControllers> {
    const importer = new Importer(patterns);
    const pathNames = await importer.matchGlob();
    const results = await Promise.all(
      pathNames.map((pathName) =>
        importer.importController(pathName, waterMark),
      ),
    );
    return {
      controllers: results.flatMap((result) => result.controllers),
    };
  }

  public async importProvider(
    pathName: string,
    waterMark: symbol,
  ): Promise<AutoProviders> {
    const exports: Record<string, unknown> = await import(pathName);
    const providers = Object.values(exports)
      .filter((value) => typeof value === 'function')
      .filter((value) =>
        Reflect.hasMetadata(waterMark, value as ClassType),
      ) as ClassType[];
    return {
      providers,
    };
  }

  public async importController(
    pathName: string,
    waterMark: symbol,
  ): Promise<AutoControllers> {
    const exports: Record<string, unknown> = await import(pathName);
    const controllers = Object.values(exports)
      .filter((value) => typeof value === 'function')
      .filter((value) =>
        Reflect.hasMetadata(waterMark, value as ClassType),
      ) as ClassType[];
    return {
      controllers,
    };
  }

  public async matchGlob() {
    const globs = this.patterns.map((pattern) =>
      glob(resolve(process.cwd(), pattern)),
    );
    return (await Promise.all(globs)).flat();
  }
}
