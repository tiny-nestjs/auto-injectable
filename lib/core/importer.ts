import { glob } from 'glob';
import { resolve } from 'path';
import {
  AUTO_CONTROLLER_WATERMARK,
  AUTO_INJECTABLE_WATERMARK,
} from '../interfaces';

type ClassType = new (...args: any[]) => any;

export interface AutoProviders {
  providers: ClassType[];
}

export interface AutoControllers {
  controllers: ClassType[];
}

// TODO: refactoring duplicate code
export class Importer {
  constructor(private readonly patterns: string[]) {}

  static async loadProviders(patterns: string[]): Promise<AutoProviders> {
    const importer = new Importer(patterns);
    const pathNames = await importer.matchGlob();
    const results = await Promise.all(
      pathNames.map((pathName) => importer.importProvider(pathName)),
    );
    return {
      providers: results.flatMap((result) => result.providers),
    };
  }

  static async loadControllers(patterns: string[]): Promise<AutoControllers> {
    const importer = new Importer(patterns);
    const pathNames = await importer.matchGlob();
    const results = await Promise.all(
      pathNames.map((pathName) => importer.importController(pathName)),
    );
    return {
      controllers: results.flatMap((result) => result.controllers),
    };
  }

  public async importProvider(pathName: string): Promise<AutoProviders> {
    const exports: Record<string, unknown> = await import(pathName);
    const providers = Object.values(exports)
      .filter((value) => typeof value === 'function')
      .filter((value) =>
        Reflect.hasMetadata(AUTO_INJECTABLE_WATERMARK, value as ClassType),
      ) as ClassType[];
    return {
      providers,
    };
  }

  public async importController(pathName: string): Promise<AutoControllers> {
    const exports: Record<string, unknown> = await import(pathName);
    const controllers = Object.values(exports)
      .filter((value) => typeof value === 'function')
      .filter((value) =>
        Reflect.hasMetadata(AUTO_CONTROLLER_WATERMARK, value as ClassType),
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
